'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navigation = [
  { name: 'Speisekarte', href: '/speisekarte' },
  { name: 'Reservieren', href: '/reservierung' },
  { name: 'Über uns', href: '/ueber-uns' },
  { name: 'Kontakt', href: '/kontakt' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm'
          : 'bg-background'
      )}
    >
      <nav className="container-wide">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <span className="font-heading text-xl font-bold text-brand-red-600 lg:text-2xl">
              Arlecchino<span className="text-brand-olive-500">+</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-red-600',
                  pathname === item.href
                    ? 'text-brand-red-600'
                    : 'text-foreground/80'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Phone - Desktop only */}
            <a
              href="tel:021296663"
              className="hidden items-center space-x-2 text-sm font-medium text-foreground/80 hover:text-brand-red-600 lg:flex"
            >
              <Phone className="h-4 w-4" />
              <span>02129 6663</span>
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <CartSidebar />

            {/* Order CTA - Desktop */}
            <Link href="/speisekarte" className="hidden lg:block">
              <Button>Jetzt bestellen</Button>
            </Link>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <div className="flex flex-col space-y-6 pt-6">
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'text-lg font-medium transition-colors',
                          pathname === item.href
                            ? 'text-brand-red-600'
                            : 'text-foreground/80 hover:text-brand-red-600'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Phone */}
                  <a
                    href="tel:021296663"
                    className="flex items-center space-x-2 text-foreground/80"
                  >
                    <Phone className="h-5 w-5" />
                    <span>02129 6663</span>
                  </a>

                  {/* Mobile CTA */}
                  <Link
                    href="/speisekarte"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full" size="lg">
                      Jetzt bestellen
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
