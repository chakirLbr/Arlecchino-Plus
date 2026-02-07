import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Count pending/confirmed orders (not yet completed)
    const ordersCount = await db.order.count({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    // Count pending reservations
    const reservationsCount = await db.reservation.count({
      where: {
        status: 'PENDING',
      },
    });

    // Count unread messages
    const messagesCount = await db.contactMessage.count({
      where: {
        isRead: false,
      },
    });

    return NextResponse.json({
      orders: ordersCount,
      reservations: reservationsCount,
      messages: messagesCount,
    });
  } catch (error) {
    console.error('Failed to fetch counts:', error);
    return NextResponse.json({
      orders: 0,
      reservations: 0,
      messages: 0,
    });
  }
}
