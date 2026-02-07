'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const timeSlots = [
  '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

export default function ReservationPage() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [reservationNumber, setReservationNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          partySize: formData.guests,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen der Reservierung');
      }

      setReservationNumber(data.reservationNumber);
      setStep('success');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      guests: Math.max(1, Math.min(20, prev.guests + delta)),
    }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  // Get maximum date (60 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (step === 'success') {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-brand-cream-100 to-white">
        <div className="container-narrow py-16">
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="font-heading text-2xl font-bold mb-2">
                Reservierung eingegangen!
              </h1>

              <p className="text-muted-foreground mb-6">
                Vielen Dank für Ihre Reservierung. Sie erhalten in Kürze eine
                Bestätigung per E-Mail.
              </p>

              <div className="bg-brand-cream-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Reservierungsnummer
                </p>
                <p className="font-mono text-lg font-semibold">
                  {reservationNumber}
                </p>
              </div>

              <div className="text-left bg-white border rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Datum:</span>
                  <span className="font-medium">
                    {new Date(formData.date).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uhrzeit:</span>
                  <span className="font-medium">{formData.time} Uhr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Personen:</span>
                  <span className="font-medium">{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-left bg-blue-50 rounded-lg p-4 mb-6">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Wichtiger Hinweis</p>
                  <p className="text-blue-700">
                    Bitte stornieren Sie Ihre Reservierung mindestens 2 Stunden
                    vorher, falls Sie verhindert sind.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/speisekarte" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Speisekarte ansehen
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button className="w-full">Zur Startseite</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-brand-cream-100 to-white">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl font-bold sm:text-5xl mb-4">
              Tisch reservieren
            </h1>
            <p className="text-xl text-muted-foreground">
              Genießen Sie unsere preisgekrönte Pizza vor Ort. Reservieren Sie
              Ihren Tisch online.
            </p>
          </div>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Date, Time, Guests */}
                    <div className="space-y-6">
                      <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-brand-red-600" />
                        Wann möchten Sie uns besuchen?
                      </h2>

                      <div className="grid gap-6 sm:grid-cols-3">
                        {/* Date */}
                        <div className="space-y-2">
                          <Label htmlFor="date" required>
                            Datum
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                date: e.target.value,
                              }))
                            }
                            min={today}
                            max={maxDateStr}
                            required
                          />
                        </div>

                        {/* Time */}
                        <div className="space-y-2">
                          <Label htmlFor="time" required>
                            Uhrzeit
                          </Label>
                          <select
                            id="time"
                            value={formData.time}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                time: e.target.value,
                              }))
                            }
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Auswählen...</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot} Uhr
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Guests */}
                        <div className="space-y-2">
                          <Label required>Anzahl Personen</Label>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleGuestChange(-1)}
                              disabled={formData.guests <= 1}
                            >
                              -
                            </Button>
                            <span className="w-12 text-center text-lg font-semibold">
                              {formData.guests}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleGuestChange(1)}
                              disabled={formData.guests >= 20}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                      <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5 text-brand-red-600" />
                        Ihre Kontaktdaten
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" required>
                            Vorname
                          </Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            placeholder="Max"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" required>
                            Nachname
                          </Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            placeholder="Mustermann"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" required>
                            E-Mail
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="max@beispiel.de"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" required>
                            Telefon
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="0151 12345678"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">
                          Besondere Wünsche (optional)
                        </Label>
                        <Textarea
                          id="specialRequests"
                          value={formData.specialRequests}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specialRequests: e.target.value,
                            }))
                          }
                          placeholder="z.B. Hochstuhl, Allergien, besonderer Anlass..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm font-normal">
                        Ich akzeptiere die{' '}
                        <Link
                          href="/agb"
                          className="text-brand-red-600 hover:underline"
                        >
                          Reservierungsbedingungen
                        </Link>{' '}
                        und{' '}
                        <Link
                          href="/datenschutz"
                          className="text-brand-red-600 hover:underline"
                        >
                          Datenschutzerklärung
                        </Link>
                        . Stornierung bis 2 Stunden vorher möglich.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      loading={isSubmitting}
                    >
                      Tisch reservieren
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Kontakt</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-brand-red-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefon</p>
                        <a
                          href="tel:021296663"
                          className="font-medium hover:text-brand-red-600"
                        >
                          02129 6663
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-brand-red-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">E-Mail</p>
                        <a
                          href="mailto:info@arlecchino-plus.de"
                          className="font-medium hover:text-brand-red-600 text-sm"
                        >
                          info@arlecchino-plus.de
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Öffnungszeiten</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Montag</span>
                      <span className="text-muted-foreground">17:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Di - Fr</span>
                      <span className="text-muted-foreground">
                        11:00 - 14:30, 17:00 - 22:00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sa - So</span>
                      <span className="text-muted-foreground">12:00 - 22:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-cream-50 border-none">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Größere Gruppen?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Für Gruppen ab 10 Personen oder besondere Anlässe rufen Sie
                    uns bitte direkt an.
                  </p>
                  <a href="tel:021296663">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Anrufen
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
