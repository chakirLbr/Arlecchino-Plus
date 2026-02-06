import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  CreditCard,
  MapPin,
  Clock,
  Award,
  Phone,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const awards = [
  {
    title: '1. Platz',
    event: 'Pizza Experience / InterNorga Hamburg',
    year: '2025',
    category: 'Pizza Classica Gourmet',
    icon: '🥇',
  },
  {
    title: '2. Platz',
    event: '10. Deutsche Meisterschaft der Pizzabäcker',
    year: '2023',
    category: 'Pizza Classica Gourmet',
    icon: '🥈',
  },
  {
    title: 'Teilnahme',
    event: '3rd European Pizza Excellence',
    year: '2025',
    category: 'Pizza Classica Gourmet',
    icon: '🏅',
  },
];

const features = [
  {
    icon: CreditCard,
    title: 'Online bezahlen',
    description: 'Sicher mit Karte, PayPal oder Apple Pay',
  },
  {
    icon: Truck,
    title: 'Lieferung & Abholung',
    description: 'Schnelle Lieferung oder frisch abholen',
  },
  {
    icon: MapPin,
    title: 'Live Bestellstatus',
    description: 'Verfolgen Sie Ihre Bestellung in Echtzeit',
  },
];

const signaturePizzas = [
  {
    name: 'Margherita',
    description: 'Tomatensoße, Mozzarella, frisches Basilikum',
    price: '8,50',
    image: '/images/menu/pizza.jpg',
    tag: 'Klassiker',
  },
  {
    name: 'Diavola',
    description: 'Scharfe Salami, Peperoni, Tomatensoße, Mozzarella',
    price: '10,50',
    image: '/images/menu/pizza.jpg',
    tag: 'Beliebt',
  },
  {
    name: 'Quattro Formaggi',
    description: 'Mozzarella, Gorgonzola, Parmesan, Pecorino',
    price: '11,50',
    image: '/images/menu/pizza.jpg',
    tag: 'Chef\'s Choice',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[calc(100vh-80px)] mt-20 flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Text Content */}
        <div className="container-wide relative z-10 pt-20 pb-12 lg:pt-24">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Award Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/30">
              <Award className="h-4 w-4" />
              <span>Mehrfach ausgezeichnete Pizzeria</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl drop-shadow-lg">
                Steinofenpizza
                <br />
                <span className="text-brand-red-400">in Haan</span>
              </h1>
              <p className="text-xl text-white/90 lg:text-2xl">
                Frisch. Schnell. Ausgezeichnet.
              </p>
            </div>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-white/80 text-lg">
              Erleben Sie authentische italienische Pizza, zubereitet von unserem
              preisgekrönten Pizzaiolo Tonino Pisano. Aus dem Steinofen direkt zu Ihnen.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/speisekarte">
                <Button size="xl" className="w-full sm:w-auto">
                  <span>Jetzt bestellen</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/reservierung">
                <Button size="xl" variant="outline" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-foreground">
                  Tisch reservieren
                </Button>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/30"
                >
                  <feature.icon className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Awards Strip */}
      <section className="bg-foreground text-background py-6">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Award className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="font-semibold">Preisgekrönte Qualität</p>
                <p className="text-sm text-gray-400">
                  Tonino Pisano - Mehrfacher Meisterschaftsgewinner
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {awards.slice(0, 2).map((award) => (
                <div
                  key={award.event}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"
                >
                  <span className="text-xl">{award.icon}</span>
                  <span className="text-sm">
                    {award.title} - {award.event.split('/')[0]}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/ueber-uns#awards"
              className="text-sm font-medium text-brand-red-400 hover:text-brand-red-300 whitespace-nowrap"
            >
              Mehr erfahren →
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Pizzas */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Unsere Klassiker
            </Badge>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Beliebte Pizzen
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Entdecken Sie unsere beliebtesten Kreationen, handgefertigt mit
              48 Stunden gereiftem Teig und frischen Zutaten.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signaturePizzas.map((pizza) => (
              <Card key={pizza.name} className="group overflow-hidden card-hover">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-cream-100 to-brand-cream-50">
                  <Image
                    src={pizza.image}
                    alt={pizza.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {pizza.tag && (
                    <Badge className="absolute top-3 right-3 z-10">
                      {pizza.tag}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold">
                        {pizza.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pizza.description}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-brand-red-600 whitespace-nowrap">
                      {pizza.price} €
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/speisekarte">
              <Button size="lg" variant="outline">
                Zur vollständigen Speisekarte
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-brand-cream-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              So einfach geht's
            </h2>
            <p className="mt-4 text-muted-foreground">
              In nur wenigen Schritten zu Ihrer frischen Steinofenpizza
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Auswählen',
                description:
                  'Wählen Sie aus unserer vielfältigen Speisekarte Ihre Lieblingspizza.',
                icon: '📱',
              },
              {
                step: '2',
                title: 'Bezahlen',
                description:
                  'Bezahlen Sie sicher online mit Karte, PayPal oder Apple Pay.',
                icon: '💳',
              },
              {
                step: '3',
                title: 'Genießen',
                description:
                  'Erhalten Sie Ihre Pizza geliefert oder holen Sie sie frisch ab.',
                icon: '🍕',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mx-auto w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl mb-6">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-red-600 text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Teaser */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Das sagen unsere Gäste
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                text: 'Beste Pizza in der Region! Der Teig ist perfekt und die Zutaten super frisch.',
                author: 'Michael S.',
                rating: 5,
              },
              {
                text: 'Endlich eine Pizzeria mit echtem italienischem Geschmack. Die Online-Bestellung funktioniert einwandfrei.',
                author: 'Sarah K.',
                rating: 5,
              },
              {
                text: 'Top Service und sehr leckere Pizza. Die Lieferung war schnell und die Pizza noch heiß.',
                author: 'Thomas M.',
                rating: 5,
              },
            ].map((review, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{review.text}"</p>
                <p className="font-medium">— {review.author}</p>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Bewertungen von Google Reviews. <a href="#" className="underline">Mehr lesen</a>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-brand-red-600 text-white">
        <div className="container-wide text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl mb-4">
            Hunger bekommen?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bestellen Sie jetzt online und genießen Sie unsere preisgekrönte
            Steinofenpizza in weniger als 45 Minuten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/speisekarte">
              <Button
                size="xl"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-brand-red-600 hover:bg-white/90"
              >
                Jetzt bestellen
              </Button>
            </Link>
            <a href="tel:021296663">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-red-600"
              >
                <Phone className="mr-2 h-5 w-5" />
                02129 6663
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Quick Info */}
      <section className="section-sm bg-brand-cream-50">
        <div className="container-wide">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red-100">
                <MapPin className="h-6 w-6 text-brand-red-600" />
              </div>
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">
                  Kölner Str. 1, 42781 Haan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red-100">
                <Phone className="h-6 w-6 text-brand-red-600" />
              </div>
              <div>
                <p className="font-medium">Telefon</p>
                <a
                  href="tel:021296663"
                  className="text-sm text-muted-foreground hover:text-brand-red-600"
                >
                  02129 6663
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red-100">
                <Clock className="h-6 w-6 text-brand-red-600" />
              </div>
              <div>
                <p className="font-medium">Öffnungszeiten</p>
                <p className="text-sm text-muted-foreground">
                  Di-So ab 11:00/12:00 Uhr
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
