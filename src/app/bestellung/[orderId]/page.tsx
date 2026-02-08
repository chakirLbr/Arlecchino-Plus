'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  ChefHat,
  Flame,
  Package,
  Truck,
  Home,
  Phone,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice, formatDateTime } from '@/lib/utils';

// Order status steps
const statusSteps = [
  {
    id: 'CONFIRMED',
    label: 'Bestellung eingegangen',
    labelActive: 'Bestellung eingegangen',
    icon: CheckCircle,
  },
  {
    id: 'PREPARING',
    label: 'Wird zubereitet',
    labelActive: 'Wird zubereitet',
    description: 'Ihre Bestellung wird frisch zubereitet',
    icon: ChefHat,
  },
  {
    id: 'IN_OVEN',
    label: 'Im Ofen',
    labelActive: 'Im Holzofen',
    description: 'Ihre Pizza backt gerade im Holzofen',
    icon: Flame,
  },
  {
    id: 'READY',
    label: 'Bereit',
    labelActive: 'Fertig',
    description: 'Ihre Bestellung ist bereit',
    icon: Package,
  },
  {
    id: 'OUT_FOR_DELIVERY',
    label: 'Unterwegs',
    labelActive: 'Auf dem Weg zu Ihnen',
    description: 'Ihr Fahrer ist unterwegs',
    icon: Truck,
  },
  {
    id: 'DELIVERED',
    label: 'Geliefert',
    labelActive: 'Geliefert',
    icon: Home,
  },
];

// Mock order data - in production this would come from the API
const mockOrder = {
  id: 'clx123',
  orderNumber: 'AP-2025-001234',
  status: 'PREPARING',
  orderType: 'DELIVERY',
  createdAt: new Date().toISOString(),
  estimatedReadyAt: new Date(Date.now() + 30 * 60000).toISOString(),
  customerFirstName: 'Max',
  customerLastName: 'Mustermann',
  customerEmail: 'max@beispiel.de',
  customerPhone: '0151 12345678',
  deliveryAddress: 'Musterstraße 1',
  deliveryCity: 'Haan',
  deliveryPostalCode: '42781',
  items: [
    {
      id: '1',
      name: 'Pizza Margherita',
      quantity: 1,
      size: 'Normal (32cm)',
      unitPrice: 8.5,
      addOns: [{ name: 'Extra Käse', price: 1.5 }],
      totalPrice: 10.0,
    },
    {
      id: '2',
      name: 'Pizza Diavola',
      quantity: 1,
      size: 'Groß (40cm)',
      unitPrice: 10.5,
      addOns: [],
      totalPrice: 14.5,
    },
  ],
  subtotal: 24.5,
  deliveryFee: 2.5,
  tip: 0,
  discount: 0,
  total: 27.0,
  statusHistory: [
    { status: 'PENDING', createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
    { status: 'CONFIRMED', createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
    { status: 'PREPARING', createdAt: new Date(Date.now() - 3 * 60000).toISOString() },
  ],
};

export default function OrderTrackingPage() {
  const params = useParams();
  const [order, setOrder] = useState(mockOrder);
  const [isLoading, setIsLoading] = useState(false);

  // Get current status index
  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.id === order.status
  );

  // Filter status steps based on order type
  const relevantSteps = order.orderType === 'PICKUP'
    ? statusSteps.filter((s) => !['OUT_FOR_DELIVERY'].includes(s.id))
    : statusSteps;

  // Calculate estimated time
  const estimatedTime = order.estimatedReadyAt
    ? new Date(order.estimatedReadyAt)
    : null;

  return (
    <div className="pt-20 min-h-screen bg-brand-cream-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-wide py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Zur Startseite
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold">
                Bestellung {order.orderNumber}
              </h1>
              <p className="text-muted-foreground mt-1">
                Aufgegeben am{' '}
                {formatDateTime(order.createdAt)}
              </p>
            </div>

            {estimatedTime && currentStatusIndex < statusSteps.length - 1 && (
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground">
                  Voraussichtliche {order.orderType === 'DELIVERY' ? 'Lieferung' : 'Abholung'}
                </p>
                <p className="text-2xl font-bold text-brand-red-600">
                  {estimatedTime.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  Uhr
                </p>
              </div>
            )}

            {order.status === 'DELIVERED' && (
              <Badge variant="success" className="w-fit">
                <CheckCircle className="h-4 w-4 mr-1" />
                Geliefert
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-6">Bestellstatus</h2>

                <div className="relative">
                  {relevantSteps.map((step, index) => {
                    const stepIndex = statusSteps.findIndex(
                      (s) => s.id === step.id
                    );
                    const isCompleted = stepIndex < currentStatusIndex;
                    const isCurrent = step.id === order.status;
                    const isPending = stepIndex > currentStatusIndex;

                    const StatusIcon = step.icon;

                    return (
                      <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Line */}
                        {index < relevantSteps.length - 1 && (
                          <div
                            className={`absolute left-4 top-8 w-0.5 h-full -ml-px ${
                              isCompleted || isCurrent
                                ? 'bg-brand-red-600'
                                : 'bg-border'
                            }`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            isCompleted
                              ? 'bg-brand-red-600 text-white'
                              : isCurrent
                              ? 'bg-brand-red-600 text-white ring-4 ring-brand-red-100'
                              : 'bg-white border-2 border-border text-muted-foreground'
                          }`}
                        >
                          <StatusIcon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                          <p
                            className={`font-medium ${
                              isCurrent
                                ? 'text-brand-red-600'
                                : isPending
                                ? 'text-muted-foreground'
                                : ''
                            }`}
                          >
                            {isCurrent ? step.labelActive : step.label}
                          </p>
                          {isCurrent && step.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.description}
                            </p>
                          )}
                          {isCompleted && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {order.statusHistory.find((h) => h.status === step.id)
                                ? formatDateTime(
                                    order.statusHistory.find(
                                      (h) => h.status === step.id
                                    )!.createdAt
                                  )
                                : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Bestelldetails</h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.quantity}x {item.name}
                        </p>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">
                            {item.size}
                          </p>
                        )}
                        {item.addOns.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            + {item.addOns.map((a) => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Zwischensumme</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.orderType === 'DELIVERY' && (
                    <div className="flex justify-between">
                      <span>Liefergebühr</span>
                      <span>{formatPrice(order.deliveryFee)}</span>
                    </div>
                  )}
                  {order.tip > 0 && (
                    <div className="flex justify-between">
                      <span>Trinkgeld</span>
                      <span>{formatPrice(order.tip)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Rabatt</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Gesamt</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            {order.orderType === 'DELIVERY' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-red-600" />
                    Lieferadresse
                  </h3>
                  <p>
                    {order.customerFirstName} {order.customerLastName}
                  </p>
                  <p className="text-muted-foreground">
                    {order.deliveryAddress}
                    <br />
                    {order.deliveryPostalCode} {order.deliveryCity}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pickup Info */}
            {order.orderType === 'PICKUP' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-red-600" />
                    Abholadresse
                  </h3>
                  <p className="font-medium">Arlecchino Plus</p>
                  <p className="text-muted-foreground">
                    Kölner Str. 1
                    <br />
                    42781 Haan
                  </p>
                  <a
                    href="https://maps.google.com/?q=Kölner+Str.+1,+42781+Haan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-red-600 hover:underline mt-2 inline-block"
                  >
                    In Google Maps öffnen →
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Fragen zur Bestellung?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bei Fragen zu Ihrer Bestellung können Sie uns jederzeit
                  erreichen.
                </p>
                <a href="tel:021296663">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    02129 6663
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Order Again */}
            <Card className="bg-brand-cream-50 border-none">
              <CardContent className="p-6 text-center">
                <p className="font-medium mb-2">Hat es geschmeckt?</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Bestellen Sie wieder und genießen Sie unsere Pizza!
                </p>
                <Link href="/speisekarte">
                  <Button className="w-full">Erneut bestellen</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
