import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Fetch all active categories with their menu items
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            sizes: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    // Fetch add-ons separately
    const addOns = await prisma.addOn.findMany({
      where: { isAvailable: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      categories,
      addOns,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
