'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, X, Plus, Minus, Trash2, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export function CartSidebar() {
  const {
    items,
    orderType,
    deliveryFee,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    getItemTotal,
  } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal();
  const total = getTotal();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red-600 text-xs font-medium text-white">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
          <span className="sr-only">Warenkorb</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Warenkorb
            {cartItemCount > 0 && (
              <Badge variant="secondary">{cartItemCount} Artikel</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Ihr Warenkorb ist leer
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Entdecken Sie unsere leckere Speisekarte und fügen Sie Ihre
              Lieblingsgerichte hinzu.
            </p>
            <SheetTrigger asChild>
              <Link href="/speisekarte">
                <Button>Zur Speisekarte</Button>
              </Link>
            </SheetTrigger>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b last:border-0"
                  >
                    {/* Item Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-cream-100 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ChefHat className="h-6 w-6 text-brand-red-200" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.name}
                      </h4>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">
                          {item.size}
                        </p>
                      )}
                      {item.addOns.length > 0 && (
                        <p className="text-xs text-muted-foreground truncate">
                          + {item.addOns.map((a) => a.name).join(', ')}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive ml-auto"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatPrice(getItemTotal(item))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with totals */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Zwischensumme</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {orderType === 'DELIVERY' && deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Liefergebühr</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Gesamt</span>
                <span className="text-brand-red-600">{formatPrice(total)}</span>
              </div>

              <SheetTrigger asChild>
                <Link href="/speisekarte/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Zur Kasse ({formatPrice(total)})
                  </Button>
                </Link>
              </SheetTrigger>

              <SheetTrigger asChild>
                <Link href="/speisekarte" className="block">
                  <Button variant="outline" className="w-full">
                    Weiter bestellen
                  </Button>
                </Link>
              </SheetTrigger>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
