'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  Phone,
  MapPin,
  ChefHat,
  Flame,
  Truck,
  CheckCircle,
  Printer,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  name: string;
  size: string | null;
  quantity: number;
  totalPrice: number;
  addOns: unknown;
  notes: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  orderType: 'DELIVERY' | 'PICKUP';
  createdAt: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string | null;
  deliveryInstructions: string | null;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  discount: number;
  total: number;
  orderNotes: string | null;
  paymentStatus: string;
  paymentMethod: string | null;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Clock; nextStatus?: string; nextLabel?: string }
> = {
  PENDING: {
    label: 'Neu',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    nextStatus: 'CONFIRMED',
    nextLabel: 'Bestätigen',
  },
  CONFIRMED: {
    label: 'Bestätigt',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    nextStatus: 'PREPARING',
    nextLabel: 'Zubereitung starten',
  },
  PREPARING: {
    label: 'In Zubereitung',
    color: 'bg-orange-100 text-orange-800',
    icon: ChefHat,
    nextStatus: 'IN_OVEN',
    nextLabel: 'In den Ofen',
  },
  IN_OVEN: {
    label: 'Im Ofen',
    color: 'bg-red-100 text-red-800',
    icon: Flame,
    nextStatus: 'READY',
    nextLabel: 'Fertig',
  },
  READY: {
    label: 'Fertig',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    nextStatus: 'OUT_FOR_DELIVERY',
    nextLabel: 'Zur Lieferung',
  },
  OUT_FOR_DELIVERY: {
    label: 'Unterwegs',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
    nextStatus: 'DELIVERED',
    nextLabel: 'Geliefert',
  },
  DELIVERED: {
    label: 'Geliefert',
    color: 'bg-gray-100 text-gray-800',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Storniert',
    color: 'bg-red-100 text-red-800',
    icon: Clock,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/orders?filter=${filter}`);
      if (!response.ok) throw new Error('Fehler beim Laden');
      const data = await response.json();
      setOrders(data.orders || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const filteredOrders = orders.filter((order) => {
    if (searchQuery === '') return true;
    const query = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerFirstName.toLowerCase().includes(query) ||
      order.customerLastName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query)
    );
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Fehler beim Aktualisieren');

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsUpdating(false);
    }
  };

  const selected = orders.find((o) => o.id === selectedOrder);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-red-600" />
          <p className="text-muted-foreground">Bestellungen werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bestellungen</h1>
          <p className="text-muted-foreground">
            {filteredOrders.length} Bestellung(en)
          </p>
        </div>
        <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Bestellnummer, Name oder Telefon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Aktiv
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Abgeschlossen
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Alle
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {orders.length === 0
                  ? 'Noch keine Bestellungen vorhanden.'
                  : 'Keine Bestellungen gefunden.'}
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;

              return (
                <Card
                  key={order.id}
                  className={`cursor-pointer transition-all ${
                    selectedOrder === order.id
                      ? 'ring-2 ring-brand-red-600'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono font-semibold">
                            {order.orderNumber}
                          </span>
                          <Badge className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                          <Badge variant="outline">
                            {order.orderType === 'DELIVERY' ? 'Lieferung' : 'Abholung'}
                          </Badge>
                        </div>

                        {/* Customer */}
                        <p className="text-sm">
                          {order.customerFirstName} {order.customerLastName}
                        </p>

                        {/* Items preview */}
                        <p className="text-sm text-muted-foreground truncate">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </div>

                      {/* Right side */}
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Quick actions */}
                    {config.nextStatus && (
                      <div className="mt-3 pt-3 border-t">
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, config.nextStatus!);
                          }}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          {config.nextLabel}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Order Details */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {selected ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono">{selected.orderNumber}</CardTitle>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-1" />
                    Drucken
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div>
                  <Badge className={statusConfig[selected.status]?.color || 'bg-gray-100'}>
                    {statusConfig[selected.status]?.label || selected.status}
                  </Badge>
                </div>

                {/* Customer */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Kunde</h4>
                  <p>
                    {selected.customerFirstName} {selected.customerLastName}
                  </p>
                  <a
                    href={`tel:${selected.customerPhone}`}
                    className="flex items-center gap-2 text-sm text-brand-red-600 hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {selected.customerPhone}
                  </a>
                </div>

                {/* Address */}
                {selected.orderType === 'DELIVERY' && selected.deliveryAddress && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Lieferadresse</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{selected.deliveryAddress}</span>
                    </div>
                    {selected.deliveryInstructions && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selected.deliveryInstructions}
                      </p>
                    )}
                  </div>
                )}

                <Separator />

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Bestellung</h4>
                  <div className="space-y-2">
                    {selected.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                          {item.size && (
                            <span className="text-muted-foreground">
                              {' '}
                              ({item.size})
                            </span>
                          )}
                        </span>
                        <span>{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selected.orderNotes && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Anmerkung</h4>
                    <p className="text-sm">{selected.orderNotes}</p>
                  </div>
                )}

                <Separator />

                {/* Totals */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Zwischensumme</span>
                    <span>{formatPrice(selected.subtotal)}</span>
                  </div>
                  {selected.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Liefergebühr</span>
                      <span>{formatPrice(selected.deliveryFee)}</span>
                    </div>
                  )}
                  {selected.tip > 0 && (
                    <div className="flex justify-between">
                      <span>Trinkgeld</span>
                      <span>{formatPrice(selected.tip)}</span>
                    </div>
                  )}
                  {selected.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Rabatt</span>
                      <span>-{formatPrice(selected.discount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between font-bold">
                  <span>Gesamt</span>
                  <span>{formatPrice(selected.total)}</span>
                </div>

                {/* Actions */}
                {statusConfig[selected.status]?.nextStatus && (
                  <Button
                    className="w-full"
                    disabled={isUpdating}
                    onClick={() =>
                      updateOrderStatus(
                        selected.id,
                        statusConfig[selected.status].nextStatus!
                      )
                    }
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {statusConfig[selected.status].nextLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Wählen Sie eine Bestellung aus, um Details anzuzeigen.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
