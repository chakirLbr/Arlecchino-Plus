'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  CalendarDays,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  Bell,
  ChefHat,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Bestellungen',
    href: '/admin/bestellungen',
    icon: ShoppingBag,
    badge: 3,
  },
  {
    name: 'Speisekarte',
    href: '/admin/speisekarte',
    icon: UtensilsCrossed,
  },
  {
    name: 'Reservierungen',
    href: '/admin/reservierungen',
    icon: CalendarDays,
    badge: 2,
  },
  {
    name: 'Statistiken',
    href: '/admin/statistiken',
    icon: BarChart3,
  },
  {
    name: 'Einstellungen',
    href: '/admin/einstellungen',
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted lg:flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-brand-red-600" />
            <span className="font-heading font-bold text-lg">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-red-50 text-brand-red-600 dark:bg-brand-red-900/20'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className="h-5 min-w-[20px] justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t">
          <Link href="/" target="_blank">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Restaurant anzeigen
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Page title - hidden on mobile */}
          <div className="hidden lg:block">
            <h1 className="font-semibold text-lg">
              {navigation.find((n) => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))
                ?.name || 'Admin'}
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-red-600" />
            </Button>

            {/* User menu */}
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">
                  admin@arlecchino.de
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
