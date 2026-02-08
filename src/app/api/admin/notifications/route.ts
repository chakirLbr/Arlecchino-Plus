import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper to format time ago
function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Gerade eben';
  if (minutes < 60) return `Vor ${minutes} Min`;
  if (hours < 24) return `Vor ${hours} Std`;
  if (days === 1) return 'Gestern';
  return `Vor ${days} Tagen`;
}

// GET - Fetch notifications (recent orders and reservations)
export async function GET() {
  try {
    // Get recent orders (last 24 hours, only PAID orders with status CONFIRMED)
    const recentOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        // Only show orders that have completed payment
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        customerFirstName: true,
        customerLastName: true,
        total: true,
        status: true,
        orderType: true,
        createdAt: true,
      },
    });

    // Get recent reservations (last 24 hours, status PENDING)
    const recentReservations = await db.reservation.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        reservationNumber: true,
        guestFirstName: true,
        guestLastName: true,
        date: true,
        time: true,
        partySize: true,
        status: true,
        createdAt: true,
      },
    });

    // Transform to notification format
    const orderNotifications = recentOrders.map((order) => ({
      id: `order-${order.id}`,
      type: 'order' as const,
      title: `Neue Bestellung ${order.orderNumber}`,
      message: `${order.customerFirstName} ${order.customerLastName} - ${Number(order.total).toFixed(2)} € (${order.orderType === 'DELIVERY' ? 'Lieferung' : 'Abholung'})`,
      time: timeAgo(order.createdAt),
      read: order.status !== 'PENDING',
      link: `/admin/bestellungen?order=${order.id}`,
    }));

    const reservationNotifications = recentReservations.map((res) => ({
      id: `reservation-${res.id}`,
      type: 'reservation' as const,
      title: `Neue Reservierung ${res.reservationNumber}`,
      message: `${res.guestFirstName} ${res.guestLastName} - ${res.partySize} Personen, ${res.time} Uhr`,
      time: timeAgo(res.createdAt),
      read: false,
      link: `/admin/reservierungen?reservation=${res.id}`,
    }));

    // Combine and sort by time (most recent first)
    const allNotifications = [...orderNotifications, ...reservationNotifications].sort(
      (a, b) => {
        // Simple comparison - notifications with "Gerade eben" come first
        if (a.time === 'Gerade eben') return -1;
        if (b.time === 'Gerade eben') return 1;
        return 0;
      }
    );

    return NextResponse.json({
      notifications: allNotifications.slice(0, 15),
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ notifications: [] });
  }
}

// PATCH - Mark notification as read (updates order status or reservation)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      // Mark all confirmed paid orders as acknowledged (don't affect unpaid orders)
      // Note: We don't change order status here anymore since CONFIRMED orders are already confirmed
      // This is mainly for reservations now

      // Mark all pending reservations as confirmed
      await db.reservation.updateMany({
        where: { status: 'PENDING' },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true });
    }

    if (id) {
      const [type, entityId] = id.split('-');

      if (type === 'order') {
        await db.order.update({
          where: { id: entityId },
          data: { status: 'CONFIRMED' },
        });
      } else if (type === 'reservation') {
        await db.reservation.update({
          where: { id: entityId },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
