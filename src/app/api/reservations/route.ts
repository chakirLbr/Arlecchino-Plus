import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for creating a reservation
const createReservationSchema = z.object({
  date: z.string().min(1, 'Datum ist erforderlich'),
  time: z.string().min(1, 'Uhrzeit ist erforderlich'),
  partySize: z.number().min(1).max(20),
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail'),
  phone: z.string().min(1, 'Telefon ist erforderlich'),
  specialRequests: z.string().optional(),
});

// Generate reservation number
function generateReservationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `AR-${year}-${random}`;
}

// POST - Create a new reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createReservationSchema.parse(body);

    // Check for existing reservation number and regenerate if needed
    let reservationNumber = generateReservationNumber();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.reservation.findUnique({
        where: { reservationNumber },
      });
      if (!existing) break;
      reservationNumber = generateReservationNumber();
      attempts++;
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        reservationNumber,
        guestFirstName: validatedData.firstName,
        guestLastName: validatedData.lastName,
        guestEmail: validatedData.email,
        guestPhone: validatedData.phone,
        date: new Date(validatedData.date),
        time: validatedData.time,
        partySize: validatedData.partySize,
        specialRequests: validatedData.specialRequests || null,
        status: 'PENDING',
      },
    });

    // Create admin notification for the new reservation
    await prisma.adminNotification.create({
      data: {
        type: 'RESERVATION',
        referenceId: reservation.id,
        title: `Neue Reservierung ${reservation.reservationNumber}`,
        message: `${validatedData.firstName} ${validatedData.lastName} - ${validatedData.partySize} Personen, ${validatedData.time} Uhr`,
        link: `/admin/reservierungen?reservation=${reservation.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      reservationNumber: reservation.reservationNumber,
      id: reservation.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Reservierung' },
      { status: 500 }
    );
  }
}
