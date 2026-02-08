import { NextResponse } from 'next/server';
import { getCurrentCustomer, getCustomerWithDetails } from '@/lib/customer-auth';

export async function GET() {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    // Get full customer details
    const customer = await getCustomerWithDetails(session.id);

    if (!customer) {
      return NextResponse.json(
        { error: 'Kunde nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Kundendaten' },
      { status: 500 }
    );
  }
}
