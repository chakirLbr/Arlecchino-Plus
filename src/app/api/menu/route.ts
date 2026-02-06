import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';

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
