import { NextResponse } from 'next/server';
import { removeCustomerCookie } from '@/lib/customer-auth';

export async function POST() {
  try {
    await removeCustomerCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abmelden' },
      { status: 500 }
    );
  }
}
