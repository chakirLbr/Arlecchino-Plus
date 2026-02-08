'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  Bell,
  Settings,
  LogOut,
  Loader2,
  ChevronRight,
  Gift,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  hasUsedWelcomeOffer: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  total: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  PENDING: 'Ausstehend',
  CONFIRMED: 'Bestätigt',
  PREPARING: 'Wird zubereitet',
  IN_OVEN: 'Im Ofen',
  READY: 'Fertig',
  OUT_FOR_DELIVERY: 'Unterwegs',
  DELIVERED: 'Geliefert',
};

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch customer data
        const meResponse = await fetch('/api/customer/auth/me');
        if (!meResponse.ok) {
          router.push('/konto/login');
          return;
        }
        const meData = await meResponse.json();
        setCustomer(meData.customer);

        // Fetch recent orders
        const ordersResponse = await fetch('/api/customer/orders');
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData.orders.slice(0, 3));
        }

        // Fetch notifications
        const notificationsResponse = await fetch('/api/customer/notifications');
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.notifications.slice(0, 5));
          setUnreadCount(notificationsData.unreadCount);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
        router.push('/konto/login');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/customer/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-red-600" />
          <p className="text-muted-foreground">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Hallo, {customer.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Willkommen zurück bei Arlecchino Plus
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </Button>
        </div>

        {/* Welcome Offer Banner */}
        {!customer.hasUsedWelcomeOffer && (
          <Card className="mb-6 border-brand-red-200 bg-brand-red-50 dark:bg-brand-red-900/20 dark:border-brand-red-800">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-red-600 rounded-full flex items-center justify-center shrink-0">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-brand-red-600">Willkommensrabatt verfügbar!</p>
                  <p className="text-sm text-muted-foreground">
                    10€ Rabatt auf Ihre erste Bestellung ab 25€ mit Code: WILLKOMMEN10
                  </p>
                </div>
              </div>
              <Link href="/speisekarte">
                <Button>Jetzt bestellen</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Mein Konto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/konto/bestellungen" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span>Meine Bestellungen</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link href="/konto/favoriten" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                  <span>Favoriten</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link href="/reservierung" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Reservierungen</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Letzte Bestellungen
                </div>
                <Link href="/konto/bestellungen" className="text-sm text-brand-red-600 hover:underline font-normal">
                  Alle anzeigen
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Noch keine Bestellungen vorhanden.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/bestellung/${order.orderNumber}`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm">{order.orderNumber}</span>
                        <Badge variant="outline">{statusLabels[order.status] || order.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground">
                        <span>{new Date(order.createdAt).toLocaleDateString('de-DE')}</span>
                        <span>{order.total.toFixed(2)} €</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Benachrichtigungen
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Keine Benachrichtigungen vorhanden.
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${notification.isRead ? 'bg-muted/50' : 'bg-brand-red-50 dark:bg-brand-red-900/20'}`}
                    >
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString('de-DE')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Profil-Informationen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{customer.firstName} {customer.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-Mail</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="font-medium">{customer.phone || 'Nicht angegeben'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mitglied seit</p>
                <p className="font-medium">
                  {new Date(customer.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
