import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (session) {
      // Log logout
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

      await db.auditLog.create({
        data: {
          adminUserId: session.id,
          action: 'auth.logout',
          entityType: 'AdminUser',
          entityId: session.id,
          ipAddress: ip,
        },
      });
    }

    // Clear the session cookie
    await clearSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear the cookie even if logging fails
    await clearSession();
    return NextResponse.json({ success: true });
  }
}
