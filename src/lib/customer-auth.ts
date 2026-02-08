import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'customer-secret-key-change-in-production'
);

const COOKIE_NAME = 'customer_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
};

export interface CustomerSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Create JWT token for customer
export async function createCustomerToken(customer: CustomerSession): Promise<string> {
  return new SignJWT({
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as CustomerSession;
  } catch {
    return null;
  }
}

// Get current customer from cookies
export async function getCurrentCustomer(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyCustomerToken(token);
}

// Get full customer data from database
export async function getCustomerWithDetails(customerId: string) {
  return prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      defaultAddress: true,
      defaultCity: true,
      defaultPostalCode: true,
      hasUsedWelcomeOffer: true,
      createdAt: true,
    },
  });
}

// Set customer cookie
export async function setCustomerCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

// Remove customer cookie
export async function removeCustomerCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Check if email/phone/name has been used for welcome offer
export async function checkWelcomeOfferEligibility(
  email: string,
  phone: string | null,
  firstName: string,
  lastName: string
): Promise<{ eligible: boolean; reason?: string }> {
  // Check by email
  const emailUsage = await prisma.welcomeOfferUsage.findFirst({
    where: { email: email.toLowerCase() },
  });
  if (emailUsage) {
    return { eligible: false, reason: 'Diese E-Mail hat bereits den Willkommensrabatt genutzt.' };
  }

  // Check by phone if provided
  if (phone) {
    const phoneUsage = await prisma.welcomeOfferUsage.findFirst({
      where: { phone },
    });
    if (phoneUsage) {
      return { eligible: false, reason: 'Diese Telefonnummer hat bereits den Willkommensrabatt genutzt.' };
    }
  }

  // Check by name combination (to prevent obvious duplicates)
  const nameUsage = await prisma.welcomeOfferUsage.findFirst({
    where: {
      firstName: { equals: firstName, mode: 'insensitive' },
      lastName: { equals: lastName, mode: 'insensitive' },
    },
  });
  if (nameUsage) {
    return { eligible: false, reason: 'Ein Kunde mit diesem Namen hat bereits den Willkommensrabatt genutzt.' };
  }

  // Check if customer account exists and has used offer
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      OR: [
        { email: email.toLowerCase() },
        phone ? { phone } : {},
      ],
    },
  });
  if (existingCustomer?.hasUsedWelcomeOffer) {
    return { eligible: false, reason: 'Willkommensrabatt bereits genutzt.' };
  }

  return { eligible: true };
}

// Record welcome offer usage
export async function recordWelcomeOfferUsage(
  email: string,
  phone: string | null,
  firstName: string,
  lastName: string,
  orderId: string,
  customerId: string | null,
  discount: number
) {
  await prisma.welcomeOfferUsage.create({
    data: {
      email: email.toLowerCase(),
      phone,
      firstName,
      lastName,
      orderId,
      customerId,
      discount,
    },
  });

  // Update customer if logged in
  if (customerId) {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        hasUsedWelcomeOffer: true,
        welcomeOfferUsedAt: new Date(),
      },
    });
  }
}
