import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkWelcomeOfferEligibility, getCurrentCustomer } from '@/lib/customer-auth';

const checkEligibilitySchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
});

// Welcome offer: 10€ discount for new customers
// Minimum order: 25€
export const WELCOME_OFFER = {
  discount: 10,
  minimumOrder: 25,
  code: 'WILLKOMMEN10',
};

// GET - Check if current logged-in customer is eligible
export async function GET() {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      // Not logged in - they need to provide details to check
      return NextResponse.json({
        loggedIn: false,
        eligible: null,
        message: 'Bitte geben Sie Ihre Daten an, um die Berechtigung zu prüfen.',
        offer: WELCOME_OFFER,
      });
    }

    // Check from database
    const { eligible, reason } = await checkWelcomeOfferEligibility(
      session.email,
      null,
      session.firstName,
      session.lastName
    );

    return NextResponse.json({
      loggedIn: true,
      eligible,
      reason,
      offer: eligible ? WELCOME_OFFER : null,
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Berechtigungsprüfung' },
      { status: 500 }
    );
  }
}

// POST - Check eligibility for guest (not logged in)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkEligibilitySchema.parse(body);

    const { eligible, reason } = await checkWelcomeOfferEligibility(
      data.email,
      data.phone || null,
      data.firstName,
      data.lastName
    );

    return NextResponse.json({
      eligible,
      reason,
      offer: eligible ? WELCOME_OFFER : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Check eligibility error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Berechtigungsprüfung' },
      { status: 500 }
    );
  }
}
