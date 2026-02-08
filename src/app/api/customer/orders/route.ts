import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCustomer } from '@/lib/customer-auth';

export async function GET() {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    // Get customer's orders
    const orders = await prisma.order.findMany({
      where: {
        customerId: session.id,
        paymentStatus: 'PAID', // Only show paid orders
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Transform orders
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      orderType: order.orderType,
      createdAt: order.createdAt.toISOString(),
      total: Number(order.total),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        totalPrice: Number(item.totalPrice),
      })),
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Get customer orders error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Bestellungen' },
      { status: 500 }
    );
  }
}
