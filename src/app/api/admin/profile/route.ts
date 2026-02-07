import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch admin profile
// In a real app, this would use session/JWT to get the current user
export async function GET() {
  try {
    // Get the first admin user (or the one from session in production)
    const admin = await db.adminUser.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Failed to fetch admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH - Update admin profile
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    // Get current admin (in production, get from session)
    const currentAdmin = await db.adminUser.findFirst({
      where: { isActive: true },
    });

    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email && email !== currentAdmin.email) {
      const existingUser = await db.adminUser.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Diese E-Mail-Adresse wird bereits verwendet' },
          { status: 400 }
        );
      }
    }

    // Update admin
    const updatedAdmin = await db.adminUser.update({
      where: { id: currentAdmin.id },
      data: {
        firstName: firstName || currentAdmin.firstName,
        lastName: lastName || currentAdmin.lastName,
        email: email || currentAdmin.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Failed to update admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
