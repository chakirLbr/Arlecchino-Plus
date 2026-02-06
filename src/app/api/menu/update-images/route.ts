import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Image mapping based on category slug
const categoryImageMap: Record<string, string> = {
  'pizza': '/images/menu/pizza.jpg',
  'pizzabroetchen': '/images/menu/pizza.jpg',
  'pasta': '/images/menu/pasta.jpg',
  'antipasti': '/images/menu/antipasti.jpg',
  'baguettes': '/images/menu/baguette.jpg',
  'auflaeufe': '/images/menu/auflaufe.jpg',
  'vegetarische-auflaeufe': '/images/menu/auflaufe.jpg',
  'salate': '/images/menu/salate.jpg',
};

// POST - Update all menu item images based on category
export async function POST() {
  try {
    // Get all categories with their slugs
    const categories = await prisma.category.findMany({
      select: { id: true, slug: true },
    });

    let updatedCount = 0;

    for (const category of categories) {
      const image = categoryImageMap[category.slug];

      if (image) {
        const result = await prisma.menuItem.updateMany({
          where: { categoryId: category.id },
          data: { image },
        });
        updatedCount += result.count;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount} Artikel-Bilder aktualisiert`,
      updatedCount,
    });
  } catch (error) {
    console.error('Error updating menu images:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Bilder' },
      { status: 500 }
    );
  }
}
