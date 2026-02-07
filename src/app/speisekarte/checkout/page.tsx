'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
  Store,
  Clock,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Warenkorb', icon: ShoppingBag },
  { id: 2, name: 'Lieferung', icon: Truck },
  { id: 3, name: 'Bezahlung', icon: CreditCard },
  { id: 4, name: 'Bestätigung', icon: Check },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const {
    items,
    orderType,
    setOrderType,
    deliveryFee,
    getSubtotal,
    getTotal,
    getItemTotal,
    removeItem,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: 'Haan',
    deliveryNotes: '',
    deliveryTime: 'asap',
    scheduledTime: '',
    paymentMethod: 'card',
    orderNotes: '',
    tip: 0,
    couponCode: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          orderType,
          street: formData.street,
          postalCode: formData.postalCode,
          city: formData.city,
          deliveryNotes: formData.deliveryNotes,
          deliveryTime: formData.deliveryTime,
          scheduledTime: formData.scheduledTime,
          paymentMethod: formData.paymentMethod,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            size: item.size,
            sizePrice: item.sizePrice,
            unitPrice: item.unitPrice,
            addOns: item.addOns,
            notes: item.notes,
          })),
          subtotal: getSubtotal(),
          deliveryFee: orderType === 'DELIVERY' ? deliveryFee : 0,
          tip: formData.tip,
          discount: 0,
          total: getTotal() + formData.tip,
          orderNotes: formData.orderNotes,
          couponCode: formData.couponCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen der Bestellung');
      }

      setOrderNumber(data.orderNumber);
      setCurrentStep(4);
      clearCart();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty (except on confirmation step)
  if (items.length === 0 && currentStep !== 4) {
    return (
      <div className="pt-20 min-h-screen bg-brand-cream-50">
        <div className="container-narrow py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ihr Warenkorb ist leer</h1>
          <p className="text-muted-foreground mb-6">
            Fügen Sie Artikel aus unserer Speisekarte hinzu, um zu bestellen.
          </p>
          <Link href="/speisekarte">
            <Button>Zur Speisekarte</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-cream-50">
      <div className="container-wide py-8">
        {/* Back Button */}
        {currentStep < 4 && (
          <Link
            href={currentStep === 1 ? '/speisekarte' : '#'}
            onClick={(e) => {
              if (currentStep > 1) {
                e.preventDefault();
                setCurrentStep(currentStep - 1);
              }
            }}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {currentStep === 1 ? 'Zurück zur Speisekarte' : 'Zurück'}
          </Link>
        )}

        {/* Progress Steps */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.id
                        ? 'bg-brand-red-600 border-brand-red-600 text-white'
                        : 'border-gray-300 text-gray-300'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm hidden sm:inline ${
                      currentStep >= step.id
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 ${
                        currentStep > step.id ? 'bg-brand-red-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Warenkorb überprüfen</h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 bg-brand-cream-50 rounded-lg"
                      >
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
                          {item.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(getItemTotal(item))}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-destructive hover:underline"
                          >
                            Entfernen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code */}
                  <div className="mt-6 pt-6 border-t">
                    <Label htmlFor="couponCode">Gutscheincode</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="couponCode"
                        name="couponCode"
                        placeholder="Code eingeben"
                        value={formData.couponCode}
                        onChange={handleInputChange}
                      />
                      <Button variant="outline">Einlösen</Button>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="mt-6">
                    <Label>Trinkgeld (optional)</Label>
                    <div className="flex gap-2 mt-2">
                      {[0, 1, 2, 3, 5].map((amount) => (
                        <Button
                          key={amount}
                          variant={formData.tip === amount ? 'default' : 'outline'}
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, tip: amount }))
                          }
                        >
                          {amount === 0 ? 'Kein' : `${amount} €`}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={() => setCurrentStep(2)}
                  >
                    Weiter zur Lieferung
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Details */}
            {currentStep === 2 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Lieferdetails</h2>

                  {/* Order Type */}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setOrderType('DELIVERY')}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                        orderType === 'DELIVERY'
                          ? 'border-brand-red-600 bg-brand-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Truck className="h-5 w-5" />
                      <span className="font-medium">Lieferung</span>
                    </button>
                    <button
                      onClick={() => setOrderType('PICKUP')}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                        orderType === 'PICKUP'
                          ? 'border-brand-red-600 bg-brand-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Store className="h-5 w-5" />
                      <span className="font-medium">Abholung</span>
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName" required>
                        Vorname
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" required>
                        Nachname
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" required>
                        E-Mail
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" required>
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderType === 'DELIVERY' && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-4">Lieferadresse</h3>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="street" required>
                            Straße & Hausnummer
                          </Label>
                          <Input
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="postalCode" required>
                              PLZ
                            </Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="city" required>
                              Stadt
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="deliveryNotes">
                            Lieferhinweise (optional)
                          </Label>
                          <Textarea
                            id="deliveryNotes"
                            name="deliveryNotes"
                            placeholder="z.B. 2. Stock, Klingel defekt..."
                            value={formData.deliveryNotes}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pickup Info */}
                  {orderType === 'PICKUP' && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-4">Abholadresse</h3>
                      <div className="p-4 bg-brand-cream-50 rounded-lg">
                        <p className="font-medium">Arlecchino Plus</p>
                        <p className="text-muted-foreground">
                          Kölner Str. 1, 42781 Haan
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          <Clock className="inline h-4 w-4 mr-1" />
                          Abholzeit: ca. 20-30 Minuten
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Delivery Time */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-4">
                      {orderType === 'DELIVERY' ? 'Lieferzeit' : 'Abholzeit'}
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-brand-cream-50">
                        <input
                          type="radio"
                          name="deliveryTime"
                          value="asap"
                          checked={formData.deliveryTime === 'asap'}
                          onChange={handleInputChange}
                        />
                        <span>So schnell wie möglich (~30-45 Min)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-brand-cream-50">
                        <input
                          type="radio"
                          name="deliveryTime"
                          value="scheduled"
                          checked={formData.deliveryTime === 'scheduled'}
                          onChange={handleInputChange}
                        />
                        <span>Vorbestellen für später</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      Zurück
                    </Button>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => setCurrentStep(3)}
                    >
                      Weiter zur Bezahlung
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Bezahlung</h2>

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    {[
                      { id: 'card', label: 'Kreditkarte / Debitkarte', icon: '💳' },
                      { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                      { id: 'applepay', label: 'Apple Pay', icon: '🍎' },
                      { id: 'googlepay', label: 'Google Pay', icon: '🔵' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? 'border-brand-red-600 bg-brand-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Card Form Placeholder */}
                  {formData.paymentMethod === 'card' && (
                    <div className="mt-6 p-4 bg-brand-cream-50 rounded-lg">
                      <p className="text-sm text-muted-foreground text-center">
                        [Stripe Card Element wird hier eingefügt]
                      </p>
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label>Kartennummer</Label>
                          <Input placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Ablaufdatum</Label>
                            <Input placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label>CVC</Label>
                            <Input placeholder="123" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="mt-6">
                    <label className="flex items-start gap-2">
                      <input type="checkbox" required className="mt-1" />
                      <span className="text-sm">
                        Ich akzeptiere die{' '}
                        <Link
                          href="/agb"
                          className="text-brand-red-600 hover:underline"
                        >
                          AGB
                        </Link>{' '}
                        und{' '}
                        <Link
                          href="/datenschutz"
                          className="text-brand-red-600 hover:underline"
                        >
                          Datenschutzerklärung
                        </Link>
                        .
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      Zurück
                    </Button>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Wird verarbeitet...
                        </>
                      ) : (
                        `Jetzt bezahlen (${formatPrice(getTotal() + formData.tip)})`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>

                  <h1 className="text-2xl font-bold mb-2">
                    Vielen Dank für Ihre Bestellung!
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Ihre Bestellung wurde erfolgreich aufgegeben.
                  </p>

                  <div className="bg-brand-cream-50 rounded-lg p-4 mb-6 inline-block">
                    <p className="text-sm text-muted-foreground">Bestellnummer</p>
                    <p className="font-mono text-xl font-bold">{orderNumber}</p>
                  </div>

                  <p className="text-muted-foreground mb-8">
                    Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.
                    <br />
                    Voraussichtliche{' '}
                    {orderType === 'DELIVERY' ? 'Lieferung' : 'Abholung'}:{' '}
                    <strong>30-45 Minuten</strong>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={`/bestellung/${orderNumber}`}>
                      <Button size="lg">Bestellung verfolgen</Button>
                    </Link>
                    <Link href="/">
                      <Button size="lg" variant="outline">
                        Zur Startseite
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep < 4 && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Zusammenfassung</h3>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>{formatPrice(getItemTotal(item))}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Zwischensumme</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    {orderType === 'DELIVERY' && (
                      <div className="flex justify-between">
                        <span>Liefergebühr</span>
                        <span>{formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                    {formData.tip > 0 && (
                      <div className="flex justify-between">
                        <span>Trinkgeld</span>
                        <span>{formatPrice(formData.tip)}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Gesamt</span>
                    <span>{formatPrice(getTotal() + formData.tip)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
