'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample reservations data
const initialReservations = [
  {
    id: '1',
    reservationNumber: 'AR-2025-000001',
    guestFirstName: 'Max',
    guestLastName: 'Mustermann',
    guestEmail: 'max@beispiel.de',
    guestPhone: '0151 12345678',
    date: '2025-02-06',
    time: '19:00',
    partySize: 4,
    status: 'CONFIRMED',
    specialRequests: 'Hochstuhl benötigt',
    createdAt: '2025-02-04T10:30:00',
  },
  {
    id: '2',
    reservationNumber: 'AR-2025-000002',
    guestFirstName: 'Sarah',
    guestLastName: 'Klein',
    guestEmail: 'sarah@beispiel.de',
    guestPhone: '0171 9876543',
    date: '2025-02-06',
    time: '20:00',
    partySize: 2,
    status: 'PENDING',
    specialRequests: '',
    createdAt: '2025-02-05T14:15:00',
  },
  {
    id: '3',
    reservationNumber: 'AR-2025-000003',
    guestFirstName: 'Thomas',
    guestLastName: 'Hofmann',
    guestEmail: 'thomas@beispiel.de',
    guestPhone: '0152 11223344',
    date: '2025-02-07',
    time: '18:30',
    partySize: 6,
    status: 'CONFIRMED',
    specialRequests: 'Geburtstagsfeier, Tisch dekorieren wenn möglich',
    createdAt: '2025-02-03T09:00:00',
  },
  {
    id: '4',
    reservationNumber: 'AR-2025-000004',
    guestFirstName: 'Anna',
    guestLastName: 'Weber',
    guestEmail: 'anna@beispiel.de',
    guestPhone: '0163 55667788',
    date: '2025-02-08',
    time: '19:30',
    partySize: 3,
    status: 'PENDING',
    specialRequests: '',
    createdAt: '2025-02-05T16:45:00',
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  PENDING: {
    label: 'Ausstehend',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  CONFIRMED: {
    label: 'Bestätigt',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Storniert',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
  NO_SHOW: {
    label: 'Nicht erschienen',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
  },
  COMPLETED: {
    label: 'Abgeschlossen',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
  },
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(initialReservations);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get reservations for selected date
  const filteredReservations = reservations.filter((res) => {
    const matchesDate = res.date === selectedDate;
    const matchesFilter = filter === 'all' || res.status === filter;
    const matchesSearch =
      searchQuery === '' ||
      res.guestFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guestLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guestPhone.includes(searchQuery) ||
      res.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesFilter && matchesSearch;
  });

  // Get counts for the week
  const getDateReservationCount = (date: string) => {
    return reservations.filter((r) => r.date === date).length;
  };

  // Generate week dates
  const getWeekDates = () => {
    const dates = [];
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay();
    const monday = new Date(current);
    monday.setDate(current.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const updateStatus = (id: string, newStatus: string) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, status: newStatus } : res
      )
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Stats for today
  const todayReservations = reservations.filter((r) => r.date === selectedDate);
  const totalGuests = todayReservations.reduce((sum, r) => sum + r.partySize, 0);
  const pendingCount = todayReservations.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reservierungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Tischreservierungen
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-brand-red-100">
              <Calendar className="h-6 w-6 text-brand-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayReservations.length}</p>
              <p className="text-sm text-muted-foreground">Reservierungen heute</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalGuests}</p>
              <p className="text-sm text-muted-foreground">Gäste erwartet</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Zu bestätigen</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Calendar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold">
              {new Date(weekDates[0]).toLocaleDateString('de-DE', {
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const count = getDateReservationCount(date);
              const isSelected = date === selectedDate;
              const isToday = date === new Date().toISOString().split('T')[0];
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    isSelected
                      ? 'bg-brand-red-600 text-white'
                      : isToday
                      ? 'bg-brand-red-100 hover:bg-brand-red-200'
                      : 'hover:bg-brand-cream-100'
                  }`}
                >
                  <p className="text-xs font-medium">{dayNames[index]}</p>
                  <p className="text-lg font-bold">
                    {new Date(date).getDate()}
                  </p>
                  {count > 0 && (
                    <Badge
                      variant={isSelected ? 'secondary' : 'default'}
                      className="mt-1"
                    >
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Name, Telefon oder Reservierungsnummer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Alle
          </Button>
          <Button
            variant={filter === 'PENDING' ? 'default' : 'outline'}
            onClick={() => setFilter('PENDING')}
            size="sm"
          >
            Ausstehend
          </Button>
          <Button
            variant={filter === 'CONFIRMED' ? 'default' : 'outline'}
            onClick={() => setFilter('CONFIRMED')}
            size="sm"
          >
            Bestätigt
          </Button>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Keine Reservierungen für diesen Tag.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReservations
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((reservation) => {
              const config = statusConfig[reservation.status];
              const StatusIcon = config.icon;
              return (
                <Card key={reservation.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Time */}
                      <div className="flex items-center gap-3 sm:w-24">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xl font-bold">{reservation.time}</span>
                      </div>

                      {/* Guest Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {reservation.guestFirstName} {reservation.guestLastName}
                          </h3>
                          <Badge className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {reservation.partySize} Personen
                          </span>
                          <a
                            href={`tel:${reservation.guestPhone}`}
                            className="flex items-center gap-1 hover:text-brand-red-600"
                          >
                            <Phone className="h-4 w-4" />
                            {reservation.guestPhone}
                          </a>
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {reservation.guestEmail}
                          </span>
                        </div>
                        {reservation.specialRequests && (
                          <p className="text-sm mt-2 p-2 bg-yellow-50 rounded text-yellow-800">
                            💬 {reservation.specialRequests}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {reservation.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateStatus(reservation.id, 'CONFIRMED')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Bestätigen
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(reservation.id, 'CANCELLED')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Absagen
                            </Button>
                          </>
                        )}
                        {reservation.status === 'CONFIRMED' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(reservation.id, 'COMPLETED')}
                            >
                              Abschließen
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(reservation.id, 'NO_SHOW')}
                            >
                              No-Show
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>
    </div>
  );
}
