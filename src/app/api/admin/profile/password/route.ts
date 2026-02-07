import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// PATCH - Change admin password
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Bitte geben Sie das aktuelle und neue Passwort ein' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Das neue Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Get current admin (in production, get from session/JWT)
    const currentAdmin = await db.adminUser.findFirst({
      where: { isActive: true },
    });

    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Admin nicht gefunden' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      currentAdmin.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Das aktuelle Passwort ist falsch' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.adminUser.update({
      where: { id: currentAdmin.id },
      data: {
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        adminUserId: currentAdmin.id,
        action: 'admin.password.changed',
        entityType: 'AdminUser',
        entityId: currentAdmin.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to change password:', error);
    return NextResponse.json(
      { error: 'Fehler beim Ändern des Passworts' },
      { status: 500 }
    );
  }
}
