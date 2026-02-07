import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Save to database
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
    });

    return NextResponse.json({
      success: true,
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Failed to save contact message:', error);
    return NextResponse.json(
      { error: 'Nachricht konnte nicht gesendet werden' },
      { status: 500 }
    );
  }
}
