'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Reservation {
  id: string;
  reservationNumber: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
  specialRequests: string | null;
  internalNotes: string | null;
  createdAt: string;
}

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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedDate) params.set('date', selectedDate);
      if (filter !== 'all') params.set('status', filter);

      const response = await fetch(`/api/admin/reservations?${params.toString()}`);
      if (!response.ok) throw new Error('Fehler beim Laden');
      const data = await response.json();
      setReservations(data.reservations || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [selectedDate, filter]);

  // Get all reservations for the week view (without date filter)
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const response = await fetch('/api/admin/reservations');
        if (response.ok) {
          const data = await response.json();
          setAllReservations(data.reservations || []);
        }
      } catch {
        // Silently fail for background fetch
      }
    }
    fetchAll();
  }, []);

  // Get filtered reservations
  const filteredReservations = reservations.filter((res) => {
    if (searchQuery === '') return true;
    const query = searchQuery.toLowerCase();
    return (
      res.guestFirstName.toLowerCase().includes(query) ||
      res.guestLastName.toLowerCase().includes(query) ||
      res.guestPhone.includes(query) ||
      res.reservationNumber.toLowerCase().includes(query)
    );
  });

  // Get counts for the week
  const getDateReservationCount = (date: string) => {
    return allReservations.filter((r) => r.date === date).length;
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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Fehler beim Aktualisieren');

      // Update local state
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: newStatus } : res
        )
      );
      setAllReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: newStatus } : res
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Stats for selected date
  const todayReservations = reservations;
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
        <Button variant="outline" onClick={fetchReservations} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Aktualisieren
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-red-800">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-brand-red-100">
              <Calendar className="h-6 w-6 text-brand-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayReservations.length}</p>
              <p className="text-sm text-muted-foreground">Reservierungen</p>
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
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {reservations.length === 0
                    ? 'Keine Reservierungen für diesen Tag.'
                    : 'Keine Reservierungen gefunden.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReservations
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((reservation) => {
                const config = statusConfig[reservation.status] || statusConfig.PENDING;
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
                              {reservation.specialRequests}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {reservation.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                disabled={isUpdating}
                                onClick={() => updateStatus(reservation.id, 'CONFIRMED')}
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Bestätigen
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUpdating}
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
                                disabled={isUpdating}
                                onClick={() => updateStatus(reservation.id, 'COMPLETED')}
                              >
                                Abschließen
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUpdating}
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
      )}
    </div>
  );
}
