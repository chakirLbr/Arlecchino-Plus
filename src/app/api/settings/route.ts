import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch public settings (for clients)
export async function GET() {
  try {
    // Only return settings that clients need to know
    const acceptingOrdersSetting = await db.settings.findUnique({
      where: { key: 'acceptingOrders' },
    });

    const pausedMessageSetting = await db.settings.findUnique({
      where: { key: 'ordersPausedMessage' },
    });

    return NextResponse.json({
      acceptingOrders: acceptingOrdersSetting?.value ?? true,
      ordersPausedMessage: pausedMessageSetting?.value ??
        'Wir nehmen momentan keine Bestellungen an. Bitte versuchen Sie es später erneut.',
    });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    // Default to accepting orders if there's an error
    return NextResponse.json({
      acceptingOrders: true,
      ordersPausedMessage: '',
    });
  }
}
