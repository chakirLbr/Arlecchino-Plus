import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Type definitions for aggregated data
interface OrderStatusGroup {
  status: string;
  _count: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  total: { toNumber(): number } | number;
  status: string;
  createdAt: Date;
  customerFirstName: string;
  customerLastName: string;
}

interface UpcomingReservation {
  id: string;
  reservationNumber: string;
  guestFirstName: string;
  guestLastName: string;
  date: Date;
  time: string;
  partySize: number;
  status: string;
}

interface PopularItem {
  menuItemId: string;
  name: string;
  _count: number;
  _sum: { quantity: number | null };
}

// GET - Fetch statistics for admin dashboard
export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Orders statistics
    const [
      todayOrders,
      weekOrders,
      monthOrders,
      lastMonthOrders,
      totalOrders,
      pendingOrders,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      // Today's orders
      prisma.order.aggregate({
        where: { createdAt: { gte: today } },
        _sum: { total: true },
        _count: true,
      }),
      // This week's orders
      prisma.order.aggregate({
        where: { createdAt: { gte: thisWeekStart } },
        _sum: { total: true },
        _count: true,
      }),
      // This month's orders
      prisma.order.aggregate({
        where: { createdAt: { gte: thisMonthStart } },
        _sum: { total: true },
        _count: true,
      }),
      // Last month's orders (for comparison)
      prisma.order.aggregate({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { total: true },
        _count: true,
      }),
      // Total orders all time
      prisma.order.aggregate({
        _sum: { total: true },
        _count: true,
      }),
      // Pending orders
      prisma.order.count({
        where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'IN_OVEN', 'READY'] } },
      }),
      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          createdAt: true,
          customerFirstName: true,
          customerLastName: true,
        },
      }),
    ]);

    // Reservations statistics
    const [
      todayReservations,
      weekReservations,
      monthReservations,
      pendingReservations,
      upcomingReservations,
    ] = await Promise.all([
      prisma.reservation.count({
        where: { date: today },
      }),
      prisma.reservation.count({
        where: { date: { gte: thisWeekStart } },
      }),
      prisma.reservation.count({
        where: { createdAt: { gte: thisMonthStart } },
      }),
      prisma.reservation.count({
        where: { status: 'PENDING' },
      }),
      prisma.reservation.findMany({
        where: {
          date: { gte: today },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        take: 10,
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
        select: {
          id: true,
          reservationNumber: true,
          guestFirstName: true,
          guestLastName: true,
          date: true,
          time: true,
          partySize: true,
          status: true,
        },
      }),
    ]);

    // Menu statistics
    const [totalMenuItems, availableMenuItems, categories] = await Promise.all([
      prisma.menuItem.count(),
      prisma.menuItem.count({ where: { isAvailable: true } }),
      prisma.category.count({ where: { isActive: true } }),
    ]);

    // Daily revenue for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await prisma.order.aggregate({
        where: {
          createdAt: { gte: date, lt: nextDate },
          status: { notIn: ['CANCELLED', 'REFUNDED'] },
        },
        _sum: { total: true },
        _count: true,
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('de-DE', { weekday: 'short' }),
        revenue: Number(dayOrders._sum.total || 0),
        orders: dayOrders._count,
      });
    }

    // Popular items (top 5 by order count)
    const popularItems = await prisma.orderItem.groupBy({
      by: ['menuItemId', 'name'],
      _count: true,
      _sum: { quantity: true },
      orderBy: { _count: { menuItemId: 'desc' } },
      take: 5,
    });

    return NextResponse.json({
      orders: {
        today: {
          count: todayOrders._count,
          revenue: Number(todayOrders._sum.total || 0),
        },
        week: {
          count: weekOrders._count,
          revenue: Number(weekOrders._sum.total || 0),
        },
        month: {
          count: monthOrders._count,
          revenue: Number(monthOrders._sum.total || 0),
        },
        lastMonth: {
          count: lastMonthOrders._count,
          revenue: Number(lastMonthOrders._sum.total || 0),
        },
        total: {
          count: totalOrders._count,
          revenue: Number(totalOrders._sum.total || 0),
        },
        pending: pendingOrders,
        byStatus: (ordersByStatus as OrderStatusGroup[]).map((s: OrderStatusGroup) => ({
          status: s.status,
          count: s._count,
        })),
        recent: (recentOrders as RecentOrder[]).map((o: RecentOrder) => ({
          ...o,
          total: Number(o.total),
          createdAt: o.createdAt.toISOString(),
        })),
      },
      reservations: {
        today: todayReservations,
        week: weekReservations,
        month: monthReservations,
        pending: pendingReservations,
        upcoming: (upcomingReservations as UpcomingReservation[]).map((r: UpcomingReservation) => ({
          ...r,
          date: r.date.toISOString().split('T')[0],
        })),
      },
      menu: {
        totalItems: totalMenuItems,
        availableItems: availableMenuItems,
        categories,
      },
      charts: {
        last7Days,
        popularItems: (popularItems as PopularItem[]).map((item: PopularItem) => ({
          name: item.name,
          count: item._sum.quantity || 0,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Statistiken' },
      { status: 500 }
    );
  }
}
