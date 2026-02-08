import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Public restaurant settings (no auth required)
export async function GET() {
  try {
    const settings = await db.settings.findMany({
      where: {
        key: {
          in: [
            'restaurantName',
            'restaurantStreet',
            'restaurantPostalCode',
            'restaurantCity',
            'restaurantPhone',
            'restaurantEmail',
            'openingHours',
          ],
        },
      },
    });

    const result: Record<string, string> = {};
    settings.forEach((s) => {
      result[s.key] = s.value as string;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch public settings:', error);
    return NextResponse.json({});
  }
}
