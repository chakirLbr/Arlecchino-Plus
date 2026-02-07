'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
  Send,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const openingHours = [
  { day: 'Montag', hours: '17:00 - 22:00', isToday: false },
  { day: 'Dienstag', hours: '11:00 - 14:30, 17:00 - 22:00', isToday: false },
  { day: 'Mittwoch', hours: '11:00 - 14:30, 17:00 - 22:00', isToday: false },
  { day: 'Donnerstag', hours: '11:00 - 14:30, 17:00 - 22:00', isToday: false },
  { day: 'Freitag', hours: '11:00 - 14:30, 17:00 - 22:00', isToday: false },
  { day: 'Samstag', hours: '12:00 - 22:00', isToday: false },
  { day: 'Sonntag', hours: '12:00 - 22:00', isToday: false },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Mark today in opening hours
  const today = new Date().getDay();
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // JS Sunday = 0, our Sunday = 6
  const todayIndex = dayMap[today];

  const hoursWithToday = openingHours.map((item, index) => ({
    ...item,
    isToday: index === todayIndex,
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus('success');
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-muted to-background">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl font-bold sm:text-5xl mb-4">
              Kontakt
            </h1>
            <p className="text-xl text-muted-foreground">
              Haben Sie Fragen oder möchten Sie uns besuchen? Wir freuen uns auf
              Sie!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-background">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Quick Contact Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href="tel:021296663"
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-brand-red-200">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-6 w-6 text-brand-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Anrufen</h3>
                        <p className="text-brand-red-600 font-medium">
                          02129 6663
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Direkt bestellen oder reservieren
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <a
                  href="https://wa.me/49212966630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-green-200">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                        <p className="text-green-600 font-medium">
                          Chat starten
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Schnelle Antworten
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <a
                  href="mailto:info@arlecchino-plus.de"
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-blue-200">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">E-Mail</h3>
                        <p className="text-blue-600 font-medium text-sm">
                          info@arlecchino-plus.de
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Für ausführliche Anfragen
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <a
                  href="https://www.instagram.com/pizzeria_arlecchino_plus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-pink-200">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                        <Instagram className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Instagram</h3>
                        <p className="text-pink-600 font-medium text-sm">
                          @pizzeria_arlecchino_plus
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Folgen Sie uns
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </div>

              {/* Address */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-6 w-6 text-brand-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        Kölner Str. 1<br />
                        42781 Haan
                      </p>
                      <a
                        href="https://maps.google.com/?q=Kölner+Str.+1,+42781+Haan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-brand-red-600 hover:underline mt-2"
                      >
                        In Google Maps öffnen →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                      <Car className="h-6 w-6 text-brand-olive-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Parken</h3>
                      <p className="text-sm text-muted-foreground">
                        Kostenlose Parkplätze direkt vor dem Restaurant verfügbar.
                        Weitere Parkplätze in den umliegenden Straßen.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opening Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-5 w-5 text-brand-red-600" />
                    <h3 className="font-semibold">Öffnungszeiten</h3>
                  </div>
                  <div className="space-y-2">
                    {hoursWithToday.map((item) => (
                      <div
                        key={item.day}
                        className={`flex justify-between py-2 ${
                          item.isToday
                            ? 'bg-primary/10 -mx-3 px-3 rounded-md'
                            : ''
                        }`}
                      >
                        <span
                          className={`${
                            item.isToday ? 'font-semibold' : ''
                          }`}
                        >
                          {item.day}
                          {item.isToday && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Heute
                            </Badge>
                          )}
                        </span>
                        <span
                          className={`text-muted-foreground ${
                            item.isToday ? 'font-medium text-foreground' : ''
                          }`}
                        >
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form & Map */}
            <div className="space-y-8">
              {/* Map */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2515.8!2d7.0089!3d51.1939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8c9a0c5b5f5f5%3A0x0!2sK%C3%B6lner%20Str.%201%2C%2042781%20Haan%2C%20Germany!5e0!3m2!1sen!2sde!4v1707300000000!5m2!1sen!2sde"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Arlecchino Plus Standort"
                  />
                </div>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Schreiben Sie uns
                  </h3>

                  {submitStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">
                        Nachricht gesendet!
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        Vielen Dank für Ihre Nachricht. Wir melden uns so schnell
                        wie möglich bei Ihnen.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSubmitStatus('idle')}
                      >
                        Weitere Nachricht senden
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" required>
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Max Mustermann"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" required>
                            E-Mail
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="max@beispiel.de"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Betreff</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Worum geht es?"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" required>
                          Nachricht
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Ihre Nachricht..."
                          rows={5}
                          required
                        />
                      </div>

                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="privacy"
                          name="privacy"
                          required
                          className="mt-1"
                        />
                        <Label htmlFor="privacy" className="text-sm font-normal">
                          Ich habe die{' '}
                          <Link
                            href="/datenschutz"
                            className="text-brand-red-600 hover:underline"
                          >
                            Datenschutzerklärung
                          </Link>{' '}
                          gelesen und akzeptiere sie.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        loading={isSubmitting}
                      >
                        Nachricht senden
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="section-sm bg-muted">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/speisekarte">
              <Button size="lg">Online bestellen</Button>
            </Link>
            <Link href="/reservierung">
              <Button size="lg" variant="outline">
                Tisch reservieren
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
