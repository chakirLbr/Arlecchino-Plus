import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default settings
const defaultSettings = {
  acceptingOrders: true,
  ordersPausedMessage: 'Wir nehmen momentan keine Bestellungen an. Bitte versuchen Sie es später erneut.',
  notificationVolume: 100,
  notificationSound: 'default',
};

// GET - Fetch all settings
export async function GET() {
  try {
    const settings = await db.settings.findMany();

    // Convert to object
    const settingsObj: Record<string, any> = { ...defaultSettings };
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(defaultSettings);
  }
}

// PATCH - Update settings
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      );
    }

    // Upsert the setting
    await db.settings.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update setting:', error);
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}
