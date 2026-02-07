import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { ThemeProvider } from '@/components/theme/theme-provider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Arlecchino Plus | Steinofenpizza in Haan',
    template: '%s | Arlecchino Plus',
  },
  description:
    'Authentische italienische Steinofenpizza in Haan. Online bestellen, Tisch reservieren oder abholen. Preisgekrönter Pizzaiolo Tonino Pisano.',
  keywords: [
    'Pizza',
    'Pizzeria',
    'Haan',
    'Steinofenpizza',
    'Italienisch',
    'Lieferung',
    'Restaurant',
    'Online bestellen',
  ],
  authors: [{ name: 'Arlecchino Plus' }],
  creator: 'Arlecchino Plus',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'Arlecchino Plus',
    title: 'Arlecchino Plus | Steinofenpizza in Haan',
    description:
      'Authentische italienische Steinofenpizza in Haan. Online bestellen oder Tisch reservieren.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Arlecchino Plus - Steinofenpizza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arlecchino Plus | Steinofenpizza in Haan',
    description:
      'Authentische italienische Steinofenpizza in Haan. Online bestellen oder Tisch reservieren.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'verification_code',
  },
};

// JSON-LD structured data for local business
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Arlecchino Plus',
  image: '/og-image.jpg',
  '@id': 'https://arlecchino-plus.de',
  url: 'https://arlecchino-plus.de',
  telephone: '+49 2129 6663',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kölner Str. 1',
    addressLocality: 'Haan',
    postalCode: '42781',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.1933,
    longitude: 7.0089,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Monday',
      opens: '17:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '11:00',
      closes: '14:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '17:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '12:00',
      closes: '22:00',
    },
  ],
  servesCuisine: ['Italian', 'Pizza'],
  priceRange: '€€',
  acceptsReservations: 'True',
  menu: 'https://arlecchino-plus.de/speisekarte',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body min-h-screen antialiased">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
