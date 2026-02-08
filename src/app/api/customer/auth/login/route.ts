import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  verifyPassword,
  createCustomerToken,
  setCustomerCookie,
} from '@/lib/customer-auth';

const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'E-Mail oder Passwort ist falsch.' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(data.password, customer.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'E-Mail oder Passwort ist falsch.' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastLoginAt: new Date() },
    });

    // Create token and set cookie
    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    });

    await setCustomerCookie(token);

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        hasUsedWelcomeOffer: customer.hasUsedWelcomeOffer,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Anmeldung' },
      { status: 500 }
    );
  }
}
