import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateReservationSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW', 'COMPLETED']).optional(),
  internalNotes: z.string().nullable().optional(),
});

// PATCH - Update reservation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateReservationSchema.parse(body);

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(validatedData.status === 'CANCELLED' && { cancelledAt: new Date() }),
        ...(validatedData.internalNotes !== undefined && {
          internalNotes: validatedData.internalNotes,
        }),
      },
    });

    return NextResponse.json({
      id: reservation.id,
      reservationNumber: reservation.reservationNumber,
      status: reservation.status,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Reservierung' },
      { status: 500 }
    );
  }
}
