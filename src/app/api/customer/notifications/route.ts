import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCustomer } from '@/lib/customer-auth';

// GET - Get customer's notifications
export async function GET() {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    const notifications = await prisma.customerNotification.findMany({
      where: { customerId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Benachrichtigungen' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      // Mark all as read
      await prisma.customerNotification.updateMany({
        where: {
          customerId: session.id,
          isRead: false,
        },
        data: { isRead: true },
      });
    } else if (notificationId) {
      // Mark single notification as read
      await prisma.customerNotification.updateMany({
        where: {
          id: notificationId,
          customerId: session.id,
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark notification error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Benachrichtigung' },
      { status: 500 }
    );
  }
}
