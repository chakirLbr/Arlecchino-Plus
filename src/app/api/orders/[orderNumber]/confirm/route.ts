import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Confirm order payment
export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    const body = await request.json();
    const { paymentIntentId } = body;

    // Find the order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }

    // Check if order is already confirmed
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({
        success: true,
        message: 'Bestellung bereits bestätigt',
        orderNumber: order.orderNumber,
      });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            note: 'Zahlung erfolgreich, Bestellung bestätigt',
          },
        },
      },
    });

    // Create admin notification for the new paid order
    await prisma.adminNotification.create({
      data: {
        type: 'ORDER',
        referenceId: updatedOrder.id,
        title: `Neue Bestellung ${updatedOrder.orderNumber}`,
        message: `${order.customerFirstName} ${order.customerLastName} - ${Number(order.total).toFixed(2)} € (${order.orderType === 'DELIVERY' ? 'Lieferung' : 'Abholung'})`,
        link: `/admin/bestellungen?order=${updatedOrder.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: updatedOrder.orderNumber,
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    return NextResponse.json(
      { error: 'Fehler beim Bestätigen der Bestellung' },
      { status: 500 }
    );
  }
}
