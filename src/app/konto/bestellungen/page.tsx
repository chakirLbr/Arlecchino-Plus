'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  name: string;
  quantity: number;
  size: string | null;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  orderType: 'DELIVERY' | 'PICKUP';
  createdAt: string;
  total: number;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' },
  CONFIRMED: { label: 'Bestätigt', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' },
  PREPARING: { label: 'Wird zubereitet', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' },
  IN_OVEN: { label: 'Im Ofen', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' },
  READY: { label: 'Fertig', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' },
  OUT_FOR_DELIVERY: { label: 'Unterwegs', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' },
  DELIVERED: { label: 'Geliefert', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200' },
  CANCELLED: { label: 'Storniert', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' },
};

export default function OrdersHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch('/api/customer/orders');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/konto/login');
            return;
          }
          throw new Error('Failed to load orders');
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-red-600" />
          <p className="text-muted-foreground">Bestellungen werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="container-wide py-8">
        <Link
          href="/konto"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zum Konto
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Meine Bestellungen
            </h1>
            <p className="text-muted-foreground">
              {orders.length} Bestellung(en)
            </p>
          </div>
          <Link href="/speisekarte">
            <Button>Neue Bestellung</Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-semibold text-lg mb-2">Noch keine Bestellungen</h2>
              <p className="text-muted-foreground mb-4">
                Entdecken Sie unsere Speisekarte und bestellen Sie Ihre erste Pizza!
              </p>
              <Link href="/speisekarte">
                <Button>Zur Speisekarte</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-semibold">{order.orderNumber}</span>
                          <Badge className={config.color}>{config.label}</Badge>
                          <Badge variant="outline">
                            {order.orderType === 'DELIVERY' ? (
                              <><Truck className="h-3 w-3 mr-1" /> Lieferung</>
                            ) : (
                              <><ShoppingBag className="h-3 w-3 mr-1" /> Abholung</>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(order.createdAt).toLocaleDateString('de-DE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm">
                          {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.total.toFixed(2)} €</p>
                        <Link href={`/bestellung/${order.orderNumber}`}>
                          <Button variant="ghost" size="sm" className="mt-2">
                            Details <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
