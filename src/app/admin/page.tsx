'use client';

import Link from 'next/link';
import {
  ShoppingBag,
  CalendarDays,
  Euro,
  TrendingUp,
  Clock,
  ChefHat,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

// Mock data - would come from API in production
const stats = {
  todayOrders: 24,
  todayRevenue: 856.5,
  pendingOrders: 3,
  todayReservations: 8,
  avgPrepTime: 22,
};

const recentOrders = [
  {
    id: 'AP-2025-001234',
    customer: 'Max M.',
    total: 27.0,
    status: 'PREPARING',
    time: '2 Min',
    items: ['1x Margherita', '1x Diavola'],
  },
  {
    id: 'AP-2025-001233',
    customer: 'Sarah K.',
    total: 18.5,
    status: 'CONFIRMED',
    time: '5 Min',
    items: ['2x Pasta Bolognese'],
  },
  {
    id: 'AP-2025-001232',
    customer: 'Thomas H.',
    total: 42.0,
    status: 'IN_OVEN',
    time: '8 Min',
    items: ['3x Pizza', '2x Salat'],
  },
];

const upcomingReservations = [
  {
    id: 'AR-2025-000123',
    name: 'Familie Müller',
    time: '18:00',
    guests: 4,
    status: 'CONFIRMED',
  },
  {
    id: 'AR-2025-000124',
    name: 'Schmidt',
    time: '19:00',
    guests: 2,
    status: 'PENDING',
  },
  {
    id: 'AR-2025-000125',
    name: 'Weber',
    time: '19:30',
    guests: 6,
    status: 'CONFIRMED',
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  PREPARING: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  IN_OVEN: 'bg-red-500/20 text-red-700 dark:text-red-400',
  READY: 'bg-green-500/20 text-green-700 dark:text-green-400',
  OUT_FOR_DELIVERY: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  DELIVERED: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Ausstehend',
  CONFIRMED: 'Bestätigt',
  PREPARING: 'In Zubereitung',
  IN_OVEN: 'Im Ofen',
  READY: 'Fertig',
  OUT_FOR_DELIVERY: 'Unterwegs',
  DELIVERED: 'Geliefert',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Guten Tag!</h1>
          <p className="text-muted-foreground">
            Hier ist der Überblick für heute, {new Date().toLocaleDateString('de-DE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}.
          </p>
        </div>

        {stats.pendingOrders > 0 && (
          <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">
              {stats.pendingOrders} neue Bestellung(en) warten auf Bestätigung
            </span>
            <Link href="/admin/bestellungen">
              <Button size="sm" variant="outline" className="ml-2">
                Anzeigen
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Heutige Bestellungen</p>
                <p className="text-3xl font-bold">{stats.todayOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-brand-red-600/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-brand-red-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-600" />
              +12% gegenüber gestern
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Heutiger Umsatz</p>
                <p className="text-3xl font-bold">{formatPrice(stats.todayRevenue)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-600/10 flex items-center justify-center">
                <Euro className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-600" />
              +8% gegenüber gestern
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reservierungen heute</p>
                <p className="text-3xl font-bold">{stats.todayReservations}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Nächste um 18:00 Uhr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ø Zubereitungszeit</p>
                <p className="text-3xl font-bold">{stats.avgPrepTime} Min</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-600/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Im Zielbereich (20-25 Min)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Upcoming Reservations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Aktuelle Bestellungen
            </CardTitle>
            <Link href="/admin/bestellungen">
              <Button variant="ghost" size="sm">
                Alle anzeigen
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{order.id}</p>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.customer} • {order.items.join(', ')}
                    </p>
                  </div>
                  <div className="text-right pl-4">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      vor {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Heutige Reservierungen
            </CardTitle>
            <Link href="/admin/reservierungen">
              <Button variant="ghost" size="sm">
                Alle anzeigen
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReservations.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-red-600/10 flex items-center justify-center text-sm font-semibold text-brand-red-600">
                      {res.time}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{res.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {res.guests} Personen
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      res.status === 'CONFIRMED'
                        ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                    }
                  >
                    {res.status === 'CONFIRMED' ? 'Bestätigt' : 'Ausstehend'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/bestellungen">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <ShoppingBag className="h-6 w-6" />
                <span>Neue Bestellungen</span>
              </Button>
            </Link>
            <Link href="/admin/speisekarte">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <ChefHat className="h-6 w-6" />
                <span>Speisekarte bearbeiten</span>
              </Button>
            </Link>
            <Link href="/admin/reservierungen">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <CalendarDays className="h-6 w-6" />
                <span>Reservierungen</span>
              </Button>
            </Link>
            <Link href="/admin/einstellungen">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span>Öffnungszeiten</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
