'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

// Default restaurant info
const defaultRestaurantInfo = {
  restaurantName: 'Arlecchino Plus',
  restaurantStreet: 'Kölner Str. 1',
  restaurantPostalCode: '42781',
  restaurantCity: 'Haan',
  restaurantPhone: '02129 6663',
  restaurantEmail: 'info@arlecchino-plus.de',
  openingHours: 'Mo: 17:00-22:00, Di-Fr: 11:00-14:30, 17:00-22:00, Sa-So: 12:00-22:00',
};

// Parse opening hours string into structured format
function parseOpeningHours(hoursString: string) {
  // Default fallback
  const defaultHours = [
    { day: 'Montag', hours: '17:00 - 22:00' },
    { day: 'Dienstag', hours: '11:00 - 14:30, 17:00 - 22:00' },
    { day: 'Mittwoch', hours: '11:00 - 14:30, 17:00 - 22:00' },
    { day: 'Donnerstag', hours: '11:00 - 14:30, 17:00 - 22:00' },
    { day: 'Freitag', hours: '11:00 - 14:30, 17:00 - 22:00' },
    { day: 'Samstag', hours: '12:00 - 22:00' },
    { day: 'Sonntag', hours: '12:00 - 22:00' },
  ];

  if (!hoursString || hoursString === defaultRestaurantInfo.openingHours) {
    return defaultHours;
  }

  // Try to parse custom format or return as single entry
  return [{ day: 'Öffnungszeiten', hours: hoursString }];
}

const quickLinks = [
  { name: 'Speisekarte', href: '/speisekarte' },
  { name: 'Tisch reservieren', href: '/reservierung' },
  { name: 'Bestellung verfolgen', href: '/bestellung' },
  { name: 'Über uns', href: '/ueber-uns' },
  { name: 'Kontakt', href: '/kontakt' },
];

const legalLinks = [
  { name: 'Impressum', href: '/impressum' },
  { name: 'Datenschutz', href: '/datenschutz' },
  { name: 'AGB', href: '/agb' },
];

export function Footer() {
  const [restaurantInfo, setRestaurantInfo] = useState(defaultRestaurantInfo);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    async function fetchRestaurantInfo() {
      try {
        const response = await fetch('/api/settings/public');
        if (response.ok) {
          const data = await response.json();
          setRestaurantInfo((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        // Use defaults on error
      }
    }

    fetchRestaurantInfo();
  }, []);

  const openingHours = parseOpeningHours(restaurantInfo.openingHours);
  const fullAddress = `${restaurantInfo.restaurantStreet}, ${restaurantInfo.restaurantPostalCode} ${restaurantInfo.restaurantCity}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
  const phoneClean = restaurantInfo.restaurantPhone.replace(/\s/g, '');

  return (
    <footer className="bg-zinc-900 text-white">
      {/* Main Footer */}
      <div className="container-wide py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold text-white">
                {restaurantInfo.restaurantName.includes('Arlecchino') ? (
                  <>Arlecchino<span className="text-brand-olive-400">+</span></>
                ) : (
                  restaurantInfo.restaurantName
                )}
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Authentische Steinofenpizza in {restaurantInfo.restaurantCity}. Frisch zubereitet mit Liebe und Leidenschaft.
            </p>
            <div className="space-y-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{fullAddress}</span>
              </a>
              <a
                href={`tel:${phoneClean}`}
                className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>{restaurantInfo.restaurantPhone}</span>
              </a>
              <a
                href={`mailto:${restaurantInfo.restaurantEmail}`}
                className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>{restaurantInfo.restaurantEmail}</span>
              </a>
            </div>
            {/* Social */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.instagram.com/pizzeria_arlecchino_plus/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="flex items-center space-x-2 text-sm font-semibold uppercase tracking-wider text-white mb-4">
              <Clock className="h-4 w-4" />
              <span>Öffnungszeiten</span>
            </h3>
            <ul className="space-y-1">
              {openingHours.map((item) => (
                <li
                  key={item.day}
                  className="flex justify-between text-sm text-gray-400"
                >
                  <span>{item.day}</span>
                  <span>{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Schnellzugriff
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Jetzt bestellen
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Bestellen Sie online und genießen Sie unsere Pizza zu Hause oder holen Sie sie frisch bei uns ab.
            </p>
            <div className="space-y-2">
              <Link
                href="/speisekarte"
                className="block w-full rounded-md bg-brand-red-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-red-700 transition-colors"
              >
                Online bestellen
              </Link>
              <Link
                href="/reservierung"
                className="block w-full rounded-md border border-gray-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:border-white transition-colors"
              >
                Tisch reservieren
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-wide py-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} {restaurantInfo.restaurantName}. Alle Rechte vorbehalten.
            </p>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
