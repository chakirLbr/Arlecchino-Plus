import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

interface SizeRecord {
  id: string;
  menuItemId: string;
  name: string;
  nameEn: string | null;
  priceAdjustment: Decimal;
  sortOrder: number;
  isDefault: boolean;
}

// Schema for updating a menu item
const updateMenuItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  basePrice: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  spiceLevel: z.number().min(0).max(3).optional(),
});

// GET - Get a single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        sizes: {
          orderBy: { sortOrder: 'asc' },
        },
        category: true,
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Artikel nicht gefunden' },
        { status: 404 }
      );
    }

    // Transform Decimal to number
    const transformed = {
      ...menuItem,
      basePrice: menuItem.basePrice ? Number(menuItem.basePrice) : null,
      sizes: menuItem.sizes.map((size: SizeRecord) => ({
        ...size,
        price: menuItem.basePrice
          ? Number(menuItem.basePrice) + Number(size.priceAdjustment)
          : Number(size.priceAdjustment),
        priceAdjustment: Number(size.priceAdjustment),
      })),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden des Artikels' },
      { status: 500 }
    );
  }
}

// PATCH - Update a menu item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateMenuItemSchema.parse(body);

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Artikel nicht gefunden' },
        { status: 404 }
      );
    }

    // Update the menu item
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: validatedData,
      include: {
        sizes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // Transform Decimal to number
    const transformed = {
      ...updatedItem,
      basePrice: updatedItem.basePrice ? Number(updatedItem.basePrice) : null,
      sizes: updatedItem.sizes.map((size: SizeRecord) => ({
        ...size,
        price: updatedItem.basePrice
          ? Number(updatedItem.basePrice) + Number(size.priceAdjustment)
          : Number(size.priceAdjustment),
        priceAdjustment: Number(size.priceAdjustment),
      })),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Artikels' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Artikel nicht gefunden' },
        { status: 404 }
      );
    }

    // Delete the menu item (sizes will be cascade deleted due to schema)
    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Artikel gelöscht' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Artikels' },
      { status: 500 }
    );
  }
}
