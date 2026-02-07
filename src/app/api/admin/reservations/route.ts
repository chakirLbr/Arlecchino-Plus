import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface ReservationData {
  id: string;
  reservationNumber: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  date: Date;
  time: string;
  partySize: number;
  status: string;
  specialRequests: string | null;
  internalNotes: string | null;
  createdAt: Date;
}

// GET - Fetch all reservations for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (date) {
      where.date = new Date(date);
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 200,
    });

    // Transform for frontend
    const transformedReservations = (reservations as ReservationData[]).map((res: ReservationData) => ({
      id: res.id,
      reservationNumber: res.reservationNumber,
      guestFirstName: res.guestFirstName,
      guestLastName: res.guestLastName,
      guestEmail: res.guestEmail,
      guestPhone: res.guestPhone,
      date: res.date.toISOString().split('T')[0],
      time: res.time,
      partySize: res.partySize,
      status: res.status,
      specialRequests: res.specialRequests,
      internalNotes: res.internalNotes,
      createdAt: res.createdAt.toISOString(),
    }));

    return NextResponse.json({ reservations: transformedReservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Reservierungen' },
      { status: 500 }
    );
  }
}
