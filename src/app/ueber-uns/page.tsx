import Image from 'next/image';
import Link from 'next/link';
import { Award, Clock, Flame, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Über uns',
  description:
    'Lernen Sie Arlecchino Plus kennen - unseren preisgekrönten Pizzaiolo Tonino Pisano und unsere Leidenschaft für authentische italienische Steinofenpizza.',
};

const awards = [
  {
    title: '1. Platz',
    event: 'Pizza Experience / InterNorga Hamburg',
    date: '18.03.2025',
    category: 'Pizza Classica Gourmet',
    description:
      'Ausgezeichnet bei einem der wichtigsten Gastronomiemessen Europas für exzellente Pizzaqualität.',
    icon: '🥇',
    highlight: true,
  },
  {
    title: '2. Platz',
    event: '10. Deutsche Meisterschaft der Pizzabäcker',
    date: '13.03.2023',
    category: 'Pizza Classica Gourmet',
    description:
      'Zweiter Platz bei der renommierten Deutschen Meisterschaft der Pizzabäcker.',
    icon: '🥈',
    highlight: false,
  },
  {
    title: 'Zertifizierte Teilnahme',
    event: '3rd European Pizza Excellence',
    date: '2025',
    category: 'Pizza Classica Gourmet',
    description:
      'Teilnahme am europäischen Wettbewerb für herausragende Pizzaqualität.',
    icon: '🏅',
    highlight: false,
  },
];

const values = [
  {
    icon: Flame,
    title: 'Echter Steinofen',
    description:
      'Unsere Pizzen werden bei über 400°C im traditionellen Steinofen gebacken – für den perfekten knusprigen Boden.',
  },
  {
    icon: Clock,
    title: '48h Teigreifung',
    description:
      'Unser Teig reift mindestens 48 Stunden, was ihn besonders leicht verdaulich und aromatisch macht.',
  },
  {
    icon: Leaf,
    title: 'Frische Zutaten',
    description:
      'Wir verwenden nur hochwertige Zutaten – viele davon importieren wir direkt aus Italien.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-brand-cream-100 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container-wide relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Seit 1995 in Haan
            </Badge>
            <h1 className="font-heading text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              Tradition trifft
              <br />
              <span className="text-brand-red-600">Leidenschaft</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Entdecken Sie die Geschichte hinter Arlecchino Plus und unsere
              Hingabe für authentische italienische Steinofenpizza.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-cream-100 to-brand-cream-50 rounded-2xl overflow-hidden">
              <Image
                src="/images/ueber-uns/Unsere_Geschichte.jpg"
                alt="Arlecchino Plus Restaurant"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Unsere Geschichte
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Was 1995 als kleiner Familienbetrieb begann, hat sich zu einer
                  der beliebtesten Pizzerien in Haan entwickelt. Unsere Leidenschaft
                  für authentische italienische Küche ist über die Jahre nie
                  verblasst – im Gegenteil, sie wächst mit jedem Teig, den wir
                  kneten.
                </p>
                <p>
                  Unser Geheimnis? Zeit und Hingabe. Jeder Teig reift mindestens
                  48 Stunden, bevor er bei über 400°C in unserem Steinofen die
                  perfekte Kruste bekommt. Die Zutaten kommen größtenteils direkt
                  aus Italien – von der San-Marzano-Tomate bis zum Büffelmozzarella.
                </p>
                <p>
                  Heute führt unser preisgekrönter Pizzaiolo Tonino Pisano diese
                  Tradition fort und hat Arlecchino Plus zu nationaler Anerkennung
                  geführt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section bg-brand-cream-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Unsere Philosophie
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Drei Säulen, auf denen jede unserer Pizzen aufbaut
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="text-center p-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-brand-red-100 flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-brand-red-600" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <Badge variant="secondary">Unser Pizzaiolo</Badge>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Tonino Pisano
              </h2>
              <p className="text-xl text-brand-red-600 font-medium">
                Mehrfach ausgezeichneter Pizzabäcker
              </p>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Mit über 20 Jahren Erfahrung und einem unermüdlichen Streben nach
                  Perfektion hat Tonino Pisano die Kunst der Pizza zur Meisterschaft
                  gebracht.
                </p>
                <p>
                  Seine Auszeichnungen bei der Deutschen Meisterschaft der Pizzabäcker
                  und der InterNorga in Hamburg bestätigen, was unsere Gäste täglich
                  erleben: Hier wird Pizza auf höchstem Niveau zubereitet.
                </p>
                <p>
                  "Für mich ist jede Pizza ein kleines Kunstwerk. Der Teig erzählt
                  eine Geschichte – von der Zeit, die er hatte zu reifen, von den
                  Händen, die ihn geformt haben, und von der Hitze des Steinofens."
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative aspect-[3/4] bg-gradient-to-br from-brand-cream-100 to-brand-cream-50 rounded-2xl overflow-hidden">
              <Image
                src="/images/ueber-uns/Tonino_Pisano.jpg"
                alt="Tonino Pisano - Pizzaiolo"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="section bg-foreground text-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Award className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
            <h2 className="font-heading text-3xl font-bold sm:text-4xl text-white">
              Auszeichnungen & Erfolge
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Unsere Qualität wurde mehrfach auf nationaler und europäischer
              Ebene ausgezeichnet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {awards.map((award) => (
              <Card
                key={award.event}
                className={`bg-white/5 border-white/10 ${
                  award.highlight ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{award.icon}</span>
                    {award.highlight && (
                      <Badge className="bg-yellow-400 text-yellow-900">
                        Neueste
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mb-2">
                    {award.title}
                  </h3>
                  <p className="text-brand-red-400 font-medium mb-2">
                    {award.event}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">
                    {award.date} • {award.category}
                  </p>
                  <p className="text-sm text-gray-300">{award.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Section */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              In den Medien
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/ueber-uns/Medien.jpg"
                  alt="Arlecchino Plus in den Medien"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="p-8 bg-brand-cream-50 border-none">
                <blockquote className="text-xl italic text-muted-foreground mb-6">
                  "Hier gibt es die zweitbeste Pizza Deutschlands – und das
                  mitten in Haan. Tonino Pisano hat bei der Deutschen Meisterschaft
                  der Pizzabäcker bewiesen, dass wahre Handwerkskunst keine
                  Grenzen kennt."
                </blockquote>
                <p className="text-sm text-muted-foreground">
                  — Presseartikel
                </p>
              </Card>
            </div>
          </div>

          {/* Press Kit */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Für Presseanfragen und hochauflösende Bilder:
            </p>
            <Button variant="outline">
              Pressemappe herunterladen
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-brand-red-600 text-white">
        <div className="container-wide text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl mb-4">
            Überzeugen Sie sich selbst
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Probieren Sie unsere preisgekrönte Pizza und erleben Sie den
            Unterschied, den echte Handwerkskunst macht.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/speisekarte">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-white text-brand-red-600 hover:bg-white/90"
              >
                Jetzt bestellen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reservierung">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                Tisch reservieren
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
