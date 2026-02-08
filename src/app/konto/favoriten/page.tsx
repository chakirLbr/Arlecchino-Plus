'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ArrowLeft,
  Loader2,
  Trash2,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';

interface Favorite {
  id: string;
  menuItemId: string;
  addedAt: string;
  menuItem: {
    id: string;
    name: string;
    description: string | null;
    basePrice: number;
    image: string | null;
    category: string;
    isAvailable: boolean;
    sizes: Array<{
      id: string;
      name: string;
      priceAdjustment: number;
      isDefault: boolean;
    }>;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const response = await fetch('/api/customer/favorites');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/konto/login');
            return;
          }
          throw new Error('Failed to load favorites');
        }
        const data = await response.json();
        setFavorites(data.favorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [router]);

  const removeFavorite = async (menuItemId: string) => {
    setRemovingId(menuItemId);
    try {
      const response = await fetch(`/api/customer/favorites?menuItemId=${menuItemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.menuItemId !== menuItemId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = (favorite: Favorite) => {
    const defaultSize = favorite.menuItem.sizes.find((s) => s.isDefault) || favorite.menuItem.sizes[0];
    addItem({
      menuItemId: favorite.menuItem.id,
      name: favorite.menuItem.name,
      basePrice: favorite.menuItem.basePrice,
      quantity: 1,
      size: defaultSize ? {
        id: defaultSize.id,
        name: defaultSize.name,
        priceAdjustment: defaultSize.priceAdjustment,
      } : undefined,
      addOns: [],
      notes: '',
    });
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-red-600" />
          <p className="text-muted-foreground">Favoriten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="container-wide py-8">
        <Link
          href="/konto"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zum Konto
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-brand-red-600" />
              Meine Favoriten
            </h1>
            <p className="text-muted-foreground">
              {favorites.length} Lieblingsartikel
            </p>
          </div>
          <Link href="/speisekarte">
            <Button variant="outline">Speisekarte durchsuchen</Button>
          </Link>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-semibold text-lg mb-2">Noch keine Favoriten</h2>
              <p className="text-muted-foreground mb-4">
                Speichern Sie Ihre Lieblingsgerichte, um sie schneller zu finden!
              </p>
              <Link href="/speisekarte">
                <Button>Zur Speisekarte</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden">
                <div className="relative h-40 bg-muted">
                  {favorite.menuItem.image ? (
                    <Image
                      src={favorite.menuItem.image}
                      alt={favorite.menuItem.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  {!favorite.menuItem.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="secondary">Nicht verfügbar</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold">{favorite.menuItem.name}</h3>
                      <p className="text-sm text-muted-foreground">{favorite.menuItem.category}</p>
                    </div>
                    <p className="font-bold text-brand-red-600">
                      {favorite.menuItem.basePrice.toFixed(2)} €
                    </p>
                  </div>
                  {favorite.menuItem.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {favorite.menuItem.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => addToCart(favorite)}
                      disabled={!favorite.menuItem.isAvailable}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      In den Warenkorb
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFavorite(favorite.menuItemId)}
                      disabled={removingId === favorite.menuItemId}
                    >
                      {removingId === favorite.menuItemId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
