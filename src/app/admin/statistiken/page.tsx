'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Calendar,
  Users,
  ChefHat,
  Clock,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface Statistics {
  orders: {
    today: { count: number; revenue: number };
    week: { count: number; revenue: number };
    month: { count: number; revenue: number };
    lastMonth: { count: number; revenue: number };
    total: { count: number; revenue: number };
    pending: number;
    byStatus: Array<{ status: string; count: number }>;
    recent: Array<{
      id: string;
      orderNumber: string;
      total: number;
      status: string;
      createdAt: string;
      customerFirstName: string;
      customerLastName: string;
    }>;
  };
  reservations: {
    today: number;
    week: number;
    month: number;
    pending: number;
    upcoming: Array<{
      id: string;
      reservationNumber: string;
      guestFirstName: string;
      guestLastName: string;
      date: string;
      time: string;
      partySize: number;
      status: string;
    }>;
  };
  menu: {
    totalItems: number;
    availableItems: number;
    categories: number;
  };
  charts: {
    last7Days: Array<{
      date: string;
      dayName: string;
      revenue: number;
      orders: number;
    }>;
    popularItems: Array<{ name: string; count: number }>;
  };
}

const statusLabels: Record<string, string> = {
  PENDING: 'Ausstehend',
  CONFIRMED: 'Bestätigt',
  PREPARING: 'In Zubereitung',
  IN_OVEN: 'Im Ofen',
  READY: 'Fertig',
  OUT_FOR_DELIVERY: 'Unterwegs',
  DELIVERED: 'Geliefert',
  CANCELLED: 'Storniert',
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/statistics');
      if (!response.ok) throw new Error('Fehler beim Laden');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-red-600" />
          <p className="text-muted-foreground">Statistiken werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Fehler beim Laden'}</p>
        <Button onClick={fetchStats}>Erneut versuchen</Button>
      </div>
    );
  }

  // Calculate month-over-month change
  const revenueChange = stats.orders.lastMonth.revenue > 0
    ? ((stats.orders.month.revenue - stats.orders.lastMonth.revenue) / stats.orders.lastMonth.revenue) * 100
    : 0;

  const maxRevenue = Math.max(...stats.charts.last7Days.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Statistiken</h1>
          <p className="text-muted-foreground">
            Übersicht über Bestellungen, Umsatz und Reservierungen
          </p>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Aktualisieren
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Heute Umsatz</p>
                <p className="text-2xl font-bold">{formatPrice(stats.orders.today.revenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.orders.today.count} Bestellungen
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Month Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monat Umsatz</p>
                <p className="text-2xl font-bold">{formatPrice(stats.orders.month.revenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {revenueChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueChange).toFixed(1)}% vs. Vormonat
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Bestellungen</p>
                <p className="text-2xl font-bold">{stats.orders.pending}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Warten auf Bearbeitung
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reservations */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offene Reservierungen</p>
                <p className="text-2xl font-bold">{stats.reservations.pending}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Zu bestätigen
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart (Simple Bar) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Umsatz letzte 7 Tage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.charts.last7Days.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-muted-foreground">{day.dayName}</span>
                  <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-red-500 rounded-full transition-all"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-sm text-right font-medium">
                    {formatPrice(day.revenue)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between text-sm">
              <span className="text-muted-foreground">Gesamt (7 Tage)</span>
              <span className="font-bold">
                {formatPrice(stats.charts.last7Days.reduce((sum, d) => sum + d.revenue, 0))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Beliebteste Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.charts.popularItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Noch keine Bestelldaten vorhanden
              </p>
            ) : (
              <div className="space-y-4">
                {stats.charts.popularItems.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red-100 text-brand-red-600 font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-medium">{item.name}</span>
                    <Badge variant="secondary">{item.count}x bestellt</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Letzte Bestellungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.orders.recent.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Noch keine Bestellungen
              </p>
            ) : (
              <div className="space-y-3">
                {stats.orders.recent.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.orderNumber} • {new Date(order.createdAt).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.total)}</p>
                      <Badge variant="outline" className="text-xs">
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Kommende Reservierungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.reservations.upcoming.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Keine kommenden Reservierungen
              </p>
            ) : (
              <div className="space-y-3">
                {stats.reservations.upcoming.slice(0, 5).map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {res.guestFirstName} {res.guestLastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(res.date).toLocaleDateString('de-DE', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit',
                        })} • {res.time} Uhr
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {res.partySize}
                      </p>
                      <Badge
                        variant="outline"
                        className={res.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}
                      >
                        {res.status === 'CONFIRMED' ? 'Bestätigt' : 'Ausstehend'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-brand-red-100 dark:bg-brand-red-900">
              <ShoppingBag className="h-5 w-5 text-brand-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bestellungen gesamt</p>
              <p className="text-xl font-bold">{stats.orders.total.count}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Umsatz gesamt</p>
              <p className="text-xl font-bold">{formatPrice(stats.orders.total.revenue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <ChefHat className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speisekarte</p>
              <p className="text-xl font-bold">
                {stats.menu.availableItems}/{stats.menu.totalItems} Artikel
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reservierungen (Monat)</p>
              <p className="text-xl font-bold">{stats.reservations.month}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
