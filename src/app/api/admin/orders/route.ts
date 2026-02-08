import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';

interface OrderItemData {
  name: string;
  size: string | null;
  quantity: number;
  totalPrice: Decimal;
  addOns: unknown;
  notes: string | null;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  createdAt: Date;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string | null;
  deliveryPostalCode: string | null;
  deliveryCity: string | null;
  deliveryInstructions: string | null;
  items: OrderItemData[];
  subtotal: Decimal;
  deliveryFee: Decimal;
  tip: Decimal;
  discount: Decimal;
  total: Decimal;
  orderNotes: string | null;
  paymentStatus: string;
  paymentMethod: string | null;
}

// GET - Fetch all orders for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const filter = searchParams.get('filter'); // 'active', 'completed', 'all', 'pending'

    // Build where clause
    const where: Record<string, unknown> = {};

    // Filter by payment status
    if (filter === 'pending') {
      // Show only orders with pending payment (for analytics)
      where.paymentStatus = 'PENDING';
    } else {
      // By default, only show orders with completed payment
      where.paymentStatus = { not: 'PENDING' };
    }

    if (status) {
      where.status = status;
    } else if (filter === 'active') {
      where.status = {
        notIn: ['DELIVERED', 'CANCELLED', 'REFUNDED'],
      };
    } else if (filter === 'completed') {
      where.status = 'DELIVERED';
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 orders
    });

    // Transform Decimal to number
    const transformedOrders = (orders as OrderData[]).map((order: OrderData) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      orderType: order.orderType,
      createdAt: order.createdAt.toISOString(),
      customerFirstName: order.customerFirstName,
      customerLastName: order.customerLastName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      deliveryAddress: order.deliveryAddress
        ? `${order.deliveryAddress}, ${order.deliveryPostalCode} ${order.deliveryCity}`
        : null,
      deliveryInstructions: order.deliveryInstructions,
      items: order.items.map((item: OrderItemData) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        totalPrice: Number(item.totalPrice),
        addOns: item.addOns,
        notes: item.notes,
      })),
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      tip: Number(order.tip),
      discount: Number(order.discount),
      total: Number(order.total),
      orderNotes: order.orderNotes,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Bestellungen' },
      { status: 500 }
    );
  }
}
