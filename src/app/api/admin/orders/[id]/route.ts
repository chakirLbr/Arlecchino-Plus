import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateOrderSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'IN_OVEN',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]).optional(),
});

// PATCH - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(validatedData.status === 'READY' && { actualReadyAt: new Date() }),
      },
      include: {
        items: true,
      },
    });

    // Create status history entry
    if (validatedData.status) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status: validatedData.status,
        },
      });

      // Create customer notification if order belongs to a logged-in customer
      if (order.customerId) {
        const statusMessages: Record<string, { title: string; message: string }> = {
          CONFIRMED: {
            title: 'Bestellung bestätigt',
            message: `Ihre Bestellung ${order.orderNumber} wurde bestätigt und wird nun zubereitet.`,
          },
          PREPARING: {
            title: 'Wird zubereitet',
            message: `Ihre Bestellung ${order.orderNumber} wird gerade frisch zubereitet.`,
          },
          IN_OVEN: {
            title: 'Im Holzofen',
            message: `Ihre Pizza aus Bestellung ${order.orderNumber} backt gerade im Holzofen.`,
          },
          READY: {
            title: 'Bestellung fertig',
            message: `Ihre Bestellung ${order.orderNumber} ist fertig und wartet auf Sie!`,
          },
          OUT_FOR_DELIVERY: {
            title: 'Unterwegs zu Ihnen',
            message: `Ihre Bestellung ${order.orderNumber} ist auf dem Weg zu Ihnen.`,
          },
          DELIVERED: {
            title: 'Bestellung geliefert',
            message: `Ihre Bestellung ${order.orderNumber} wurde geliefert. Guten Appetit!`,
          },
        };

        const notification = statusMessages[validatedData.status];
        if (notification) {
          await prisma.customerNotification.create({
            data: {
              customerId: order.customerId,
              type: 'order_status',
              title: notification.title,
              message: notification.message,
              link: `/bestellung/${order.orderNumber}`,
            },
          });
        }
      }
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Bestellung' },
      { status: 500 }
    );
  }
}
