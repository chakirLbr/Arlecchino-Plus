import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

// Schema for creating a new menu item
const createMenuItemSchema = z.object({
  categoryId: z.string().min(1, 'Kategorie ist erforderlich'),
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().nullable().optional(),
  basePrice: z.number().positive('Preis muss positiv sein'),
  isVegetarian: z.boolean().optional().default(false),
  isVegan: z.boolean().optional().default(false),
  spiceLevel: z.number().min(0).max(3).optional().default(0),
});

interface SizeData {
  id: string;
  name: string;
  priceAdjustment: Decimal;
  sortOrder: number;
  isDefault: boolean;
}

interface ItemData {
  id: string;
  name: string;
  description: string | null;
  basePrice: Decimal;
  spiceLevel: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isAvailable: boolean;
  sizes: SizeData[];
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  items: ItemData[];
}

interface AddOnData {
  id: string;
  name: string;
  price: Decimal;
}

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

    // Transform data to convert Decimal to numbers and calculate size prices
    const transformedCategories = (categories as CategoryData[]).map((category: CategoryData) => ({
      ...category,
      items: category.items.map((item: ItemData) => {
        const basePrice = item.basePrice ? Number(item.basePrice) : null;
        return {
          ...item,
          basePrice,
          isSpicy: item.spiceLevel > 0,
          sizes: item.sizes.map((size: SizeData) => ({
            id: size.id,
            name: size.name,
            // Calculate actual price: basePrice + priceAdjustment
            price: basePrice !== null ? basePrice + Number(size.priceAdjustment) : Number(size.priceAdjustment),
            sortOrder: size.sortOrder,
            isDefault: size.isDefault,
          })),
        };
      }),
    }));

    // Transform add-ons to convert Decimal to number
    const transformedAddOns = addOns.map((addOn: AddOnData) => ({
      ...addOn,
      price: Number(addOn.price),
    }));

    return NextResponse.json({
      categories: transformedCategories,
      addOns: transformedAddOns,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

// POST - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createMenuItemSchema.parse(body);

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kategorie nicht gefunden' },
        { status: 404 }
      );
    }

    // Get the highest sortOrder in this category
    const lastItem = await prisma.menuItem.findFirst({
      where: { categoryId: validatedData.categoryId },
      orderBy: { sortOrder: 'desc' },
    });
    const newSortOrder = (lastItem?.sortOrder ?? 0) + 1;

    // Create the menu item
    const newItem = await prisma.menuItem.create({
      data: {
        categoryId: validatedData.categoryId,
        name: validatedData.name,
        description: validatedData.description || null,
        basePrice: validatedData.basePrice,
        isVegetarian: validatedData.isVegetarian,
        isVegan: validatedData.isVegan,
        spiceLevel: validatedData.spiceLevel,
        isAvailable: true,
        sortOrder: newSortOrder,
      },
      include: {
        sizes: true,
      },
    });

    // Transform response
    const transformed = {
      ...newItem,
      basePrice: Number(newItem.basePrice),
      isSpicy: newItem.spiceLevel > 0,
      sizes: [],
    };

    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Artikels' },
      { status: 500 }
    );
  }
}
