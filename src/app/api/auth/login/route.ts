import { NextResponse } from 'next/server';
import { verifyCredentials, setSessionCookie } from '@/lib/auth';
import { db } from '@/lib/db';

// Rate limiting: track login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip);
  if (!attempts) return false;

  const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

  // Reset after lockout duration
  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return false;
  }

  return attempts.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string): void {
  const attempts = loginAttempts.get(ip);
  if (attempts) {
    attempts.count++;
    attempts.lastAttempt = Date.now();
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Zu viele Anmeldeversuche. Bitte warten Sie 15 Minuten.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    // Verify credentials
    const session = await verifyCredentials(email, password);

    if (!session) {
      recordAttempt(ip);

      // Log failed attempt
      await db.auditLog.create({
        data: {
          action: 'auth.login.failed',
          entityType: 'AdminUser',
          entityId: 'unknown',
          ipAddress: ip,
          newValue: { email },
        },
      });

      return NextResponse.json(
        { error: 'Ungültige E-Mail oder Passwort' },
        { status: 401 }
      );
    }

    // Clear rate limit on successful login
    clearAttempts(ip);

    // Set session cookie
    await setSessionCookie(session);

    // Log successful login
    await db.auditLog.create({
      data: {
        adminUserId: session.id,
        action: 'auth.login.success',
        entityType: 'AdminUser',
        entityId: session.id,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        role: session.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
