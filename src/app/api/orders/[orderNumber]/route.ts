import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Fetch order by order number (public endpoint for tracking)
export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }

    // Don't expose orders that are still pending payment
    if (order.paymentStatus === 'PENDING') {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }

    // Return sanitized order data (no sensitive info)
    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      orderType: order.orderType,
      createdAt: order.createdAt.toISOString(),
      estimatedReadyAt: order.estimatedReadyAt?.toISOString() || null,
      customerFirstName: order.customerFirstName,
      customerLastName: order.customerLastName,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryPostalCode: order.deliveryPostalCode,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        unitPrice: item.unitPrice,
        addOns: item.addOns,
        totalPrice: item.totalPrice,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tip: order.tip,
      discount: order.discount,
      total: order.total,
      statusHistory: order.statusHistory.map((h) => ({
        status: h.status,
        createdAt: h.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Bestellung' },
      { status: 500 }
    );
  }
}
