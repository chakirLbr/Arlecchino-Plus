import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for order items
const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  size: z.string().nullable().optional(),
  sizePrice: z.number().default(0),
  unitPrice: z.number(),
  addOns: z.array(z.object({
    name: z.string(),
    price: z.number(),
  })).default([]),
  notes: z.string().nullable().optional(),
});

// Schema for creating an order
const createOrderSchema = z.object({
  // Customer info
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail'),
  phone: z.string().min(1, 'Telefon ist erforderlich'),

  // Order type and delivery
  orderType: z.enum(['DELIVERY', 'PICKUP']),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  deliveryNotes: z.string().optional(),

  // Timing
  deliveryTime: z.enum(['asap', 'scheduled']),
  scheduledTime: z.string().optional(),

  // Payment
  paymentMethod: z.enum(['card', 'paypal', 'applepay', 'googlepay', 'cash']),

  // Items
  items: z.array(orderItemSchema).min(1, 'Mindestens ein Artikel erforderlich'),

  // Pricing
  subtotal: z.number(),
  deliveryFee: z.number().default(0),
  tip: z.number().default(0),
  discount: z.number().default(0),
  total: z.number(),

  // Notes
  orderNotes: z.string().optional(),
  couponCode: z.string().optional(),
});

// Generate order number
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `AP-${year}-${random}`;
}

// Map payment method
function mapPaymentMethod(method: string): 'CARD' | 'PAYPAL' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'CASH' {
  const mapping: Record<string, 'CARD' | 'PAYPAL' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'CASH'> = {
    card: 'CARD',
    paypal: 'PAYPAL',
    applepay: 'APPLE_PAY',
    googlepay: 'GOOGLE_PAY',
    cash: 'CASH',
  };
  return mapping[method] || 'CARD';
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    // Check if orders are being accepted
    const acceptingOrdersSetting = await prisma.settings.findUnique({
      where: { key: 'acceptingOrders' },
    });

    if (acceptingOrdersSetting?.value === false) {
      return NextResponse.json(
        { error: 'Wir nehmen momentan keine Bestellungen an. Bitte versuchen Sie es später erneut.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    // Create the order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerFirstName: validatedData.firstName,
        customerLastName: validatedData.lastName,
        customerEmail: validatedData.email,
        customerPhone: validatedData.phone,
        orderType: validatedData.orderType,
        deliveryAddress: validatedData.orderType === 'DELIVERY' ? validatedData.street : null,
        deliveryPostalCode: validatedData.orderType === 'DELIVERY' ? validatedData.postalCode : null,
        deliveryCity: validatedData.orderType === 'DELIVERY' ? validatedData.city : null,
        deliveryInstructions: validatedData.deliveryNotes || null,
        isScheduled: validatedData.deliveryTime === 'scheduled',
        scheduledFor: validatedData.scheduledTime ? new Date(validatedData.scheduledTime) : null,
        subtotal: validatedData.subtotal,
        deliveryFee: validatedData.deliveryFee,
        tip: validatedData.tip,
        discount: validatedData.discount,
        total: validatedData.total,
        paymentMethod: mapPaymentMethod(validatedData.paymentMethod),
        paymentStatus: 'PAID', // Simulating successful payment
        status: 'CONFIRMED',
        orderNotes: validatedData.orderNotes || null,
        couponCode: validatedData.couponCode || null,
        items: {
          create: validatedData.items.map((item) => {
            const addOnsTotal = item.addOns.reduce((sum, addon) => sum + addon.price, 0);
            const totalPrice = (item.unitPrice + item.sizePrice + addOnsTotal) * item.quantity;
            return {
              menuItemId: item.menuItemId,
              name: item.name,
              quantity: item.quantity,
              size: item.size || null,
              sizePrice: item.sizePrice,
              unitPrice: item.unitPrice,
              addOns: item.addOns,
              addOnsTotal,
              notes: item.notes || null,
              totalPrice,
            };
          }),
        },
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            note: 'Bestellung eingegangen und bezahlt',
          },
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      id: order.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Bestellung' },
      { status: 500 }
    );
  }
}
