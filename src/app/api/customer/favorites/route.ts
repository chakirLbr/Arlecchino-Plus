import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentCustomer } from '@/lib/customer-auth';

// GET - Get customer's favorites
export async function GET() {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    const favorites = await prisma.customerFavorite.findMany({
      where: { customerId: session.id },
      include: {
        menuItem: {
          include: {
            category: true,
            sizes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedFavorites = favorites.map((fav) => ({
      id: fav.id,
      menuItemId: fav.menuItemId,
      addedAt: fav.createdAt.toISOString(),
      menuItem: {
        id: fav.menuItem.id,
        name: fav.menuItem.name,
        description: fav.menuItem.description,
        basePrice: Number(fav.menuItem.basePrice),
        image: fav.menuItem.image,
        category: fav.menuItem.category.name,
        isAvailable: fav.menuItem.isAvailable,
        sizes: fav.menuItem.sizes.map((s) => ({
          id: s.id,
          name: s.name,
          priceAdjustment: Number(s.priceAdjustment),
          isDefault: s.isDefault,
        })),
      },
    }));

    return NextResponse.json({ favorites: transformedFavorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Favoriten' },
      { status: 500 }
    );
  }
}

const addFavoriteSchema = z.object({
  menuItemId: z.string(),
});

// POST - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { menuItemId } = addFavoriteSchema.parse(body);

    // Check if menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Artikel nicht gefunden' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existing = await prisma.customerFavorite.findUnique({
      where: {
        customerId_menuItemId: {
          customerId: session.id,
          menuItemId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Bereits in Favoriten',
      });
    }

    // Add to favorites
    await prisma.customerFavorite.create({
      data: {
        customerId: session.id,
        menuItemId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Zu Favoriten hinzugefügt',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Hinzufügen zu Favoriten' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const session = await getCurrentCustomer();

    if (!session) {
      return NextResponse.json(
        { error: 'Nicht angemeldet' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get('menuItemId');

    if (!menuItemId) {
      return NextResponse.json(
        { error: 'menuItemId ist erforderlich' },
        { status: 400 }
      );
    }

    await prisma.customerFavorite.deleteMany({
      where: {
        customerId: session.id,
        menuItemId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Von Favoriten entfernt',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Entfernen aus Favoriten' },
      { status: 500 }
    );
  }
}
