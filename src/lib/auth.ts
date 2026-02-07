import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

const COOKIE_NAME = 'admin-session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export interface AdminSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Create a signed JWT token
export async function createToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

// Verify and decode a JWT token
export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminSession;
  } catch (error) {
    return null;
  }
}

// Set session cookie
export async function setSessionCookie(session: AdminSession): Promise<void> {
  const token = await createToken(session);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

// Get current session from cookies
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

// Clear session cookie (logout)
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Verify admin credentials
export async function verifyCredentials(
  email: string,
  password: string
): Promise<AdminSession | null> {
  try {
    const admin = await db.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin || !admin.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      return null;
    }

    // Update last login time
    await db.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
    };
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return null;
  }
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Middleware helper to check auth
export async function withAuth(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

// Check if request is authenticated (for API routes)
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
