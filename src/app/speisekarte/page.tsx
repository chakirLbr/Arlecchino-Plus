'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Truck,
  Store,
  Clock,
  ChefHat,
  Flame,
  Leaf,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCartStore, CartItem } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

interface MenuItemSize {
  id: string;
  name: string;
  priceAdjustment: number;
  isDefault: boolean;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: number;
  image: string | null;
  spiceLevel: number;
  isVegetarian: boolean;
  isVegan: boolean;
  allergens: string[];
  sizes: MenuItemSize[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  items: MenuItem[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface SelectedItem {
  item: MenuItem;
  size: string;
  sizePrice: number;
  addOns: Array<{ name: string; price: number }>;
  quantity: number;
  notes: string;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const {
    items: cartItems,
    orderType,
    setOrderType,
    deliveryFee,
    addItem,
    removeItem,
    getSubtotal,
    getTotal,
    getItemTotal,
  } = useCartStore();

  // Fetch menu data
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();

        if (data.categories && data.categories.length > 0) {
          // Convert Decimal to number for basePrice and priceAdjustment
          const processedCategories = data.categories.map((cat: Category & { items: (MenuItem & { basePrice: string | number, sizes: (MenuItemSize & { priceAdjustment: string | number })[] })[] }) => ({
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              basePrice: typeof item.basePrice === 'string' ? parseFloat(item.basePrice) : item.basePrice,
              sizes: item.sizes.map((size) => ({
                ...size,
                priceAdjustment: typeof size.priceAdjustment === 'string' ? parseFloat(size.priceAdjustment) : size.priceAdjustment,
              })),
            })),
          }));

          setCategories(processedCategories);
          setActiveCategory(processedCategories[0].id);
        }

        if (data.addOns) {
          const processedAddOns = data.addOns.map((addon: AddOn & { price: string | number }) => ({
            ...addon,
            price: typeof addon.price === 'string' ? parseFloat(addon.price) : addon.price,
          }));
          setAddOns(processedAddOns);
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = useMemo(() => {
    const category = categories.find((c) => c.id === activeCategory);
    return category?.items || [];
  }, [categories, activeCategory]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const cartItem: Omit<CartItem, 'id'> = {
      menuItemId: selectedItem.item.id,
      name: selectedItem.item.name,
      size: selectedItem.size,
      sizePrice: selectedItem.sizePrice,
      unitPrice: selectedItem.item.basePrice,
      quantity: selectedItem.quantity,
      addOns: selectedItem.addOns,
      notes: selectedItem.notes,
      image: selectedItem.item.image || undefined,
    };

    addItem(cartItem);
    setSelectedItem(null);
    setCartOpen(true);
  };

  const openItemModal = (item: MenuItem) => {
    const defaultSize = item.sizes.find((s) => s.isDefault) || item.sizes[0];
    setSelectedItem({
      item,
      size: defaultSize?.name || '',
      sizePrice: defaultSize?.priceAdjustment || 0,
      addOns: [],
      quantity: 1,
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-brand-cream-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-red-600" />
          <p className="mt-4 text-muted-foreground">Speisekarte wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-cream-50">
      {/* Order Type Banner */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container-wide py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Order Type Toggle */}
            <div className="flex items-center gap-2 bg-brand-cream-100 rounded-full p-1">
              <button
                onClick={() => setOrderType('DELIVERY')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  orderType === 'DELIVERY'
                    ? 'bg-brand-red-600 text-white'
                    : 'text-foreground hover:bg-white'
                }`}
              >
                <Truck className="h-4 w-4" />
                Lieferung
              </button>
              <button
                onClick={() => setOrderType('PICKUP')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  orderType === 'PICKUP'
                    ? 'bg-brand-red-600 text-white'
                    : 'text-foreground hover:bg-white'
                }`}
              >
                <Store className="h-4 w-4" />
                Abholung
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-4 text-sm">
              {orderType === 'DELIVERY' && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Ca. 30-45 Min</span>
                </div>
              )}
              {orderType === 'PICKUP' && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Ca. 20-30 Min</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b sticky top-[120px] z-30">
        <div className="container-wide">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-brand-red-600 text-white'
                    : 'bg-brand-cream-100 text-foreground hover:bg-brand-cream-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide py-8">
        <div className="flex gap-8">
          {/* Menu Items */}
          <div className="flex-1">
            <h2 className="font-heading text-2xl font-bold mb-6">
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>

            {filteredItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Keine Artikel in dieser Kategorie verfügbar.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden cursor-pointer card-hover"
                    onClick={() => openItemModal(item)}
                  >
                    <div className="flex">
                      {/* Image */}
                      <div className="relative w-32 h-32 bg-gradient-to-br from-brand-cream-100 to-brand-cream-50 shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ChefHat className="h-8 w-8 text-brand-red-200" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            {item.isVegetarian && (
                              <Badge variant="outline" className="text-xs">
                                <Leaf className="h-3 w-3 mr-1 text-green-600" />
                                Vegetarisch
                              </Badge>
                            )}
                            {item.spiceLevel > 0 && (
                              <span className="flex">
                                {[...Array(item.spiceLevel)].map((_, i) => (
                                  <Flame
                                    key={i}
                                    className="h-4 w-4 text-red-500"
                                  />
                                ))}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-brand-red-600">
                            {item.sizes.length > 0
                              ? `ab ${formatPrice(item.basePrice)}`
                              : formatPrice(item.basePrice)
                            }
                          </p>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Cart */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-[180px]">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Warenkorb ({cartItemCount})
                  </h3>

                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      Ihr Warenkorb ist leer
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-2 bg-brand-cream-50 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {item.quantity}x {item.name}
                              </p>
                              {item.size && (
                                <p className="text-xs text-muted-foreground">
                                  {item.size}
                                </p>
                              )}
                              {item.addOns.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  +{' '}
                                  {item.addOns.map((a) => a.name).join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                {formatPrice(getItemTotal(item))}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-xs text-destructive hover:underline"
                              >
                                Entfernen
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Zwischensumme</span>
                          <span>{formatPrice(getSubtotal())}</span>
                        </div>
                        {orderType === 'DELIVERY' && (
                          <div className="flex justify-between">
                            <span>Lieferung</span>
                            <span>{formatPrice(deliveryFee)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-base">
                          <span>Gesamt</span>
                          <span>{formatPrice(getTotal())}</span>
                        </div>
                      </div>

                      <Link href="/speisekarte/checkout">
                        <Button className="w-full mt-4">
                          Zur Kasse ({formatPrice(getTotal())})
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:hidden safe-bottom">
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger asChild>
            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Warenkorb ({cartItemCount}) - {formatPrice(getTotal())}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Warenkorb ({cartItemCount})</SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Ihr Warenkorb ist leer
                </p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-brand-cream-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.quantity}x {item.name}
                        </p>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">
                            {item.size}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(getItemTotal(item))}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-destructive"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t mt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Zwischensumme</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                  {orderType === 'DELIVERY' && (
                    <div className="flex justify-between">
                      <span>Lieferung</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Gesamt</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                </div>
                <Link href="/speisekarte/checkout">
                  <Button className="w-full" size="lg">
                    Zur Kasse
                  </Button>
                </Link>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-brand-cream-100 to-brand-cream-50">
              {selectedItem.item.image ? (
                <Image
                  src={selectedItem.item.image}
                  alt={selectedItem.item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChefHat className="h-16 w-16 text-brand-red-200" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-heading text-2xl font-bold">
                    {selectedItem.item.name}
                  </h2>
                  <p className="text-xl font-bold text-brand-red-600">
                    {formatPrice(
                      selectedItem.item.basePrice + selectedItem.sizePrice
                    )}
                  </p>
                </div>
                {selectedItem.item.description && (
                  <p className="text-muted-foreground mt-2">
                    {selectedItem.item.description}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  {selectedItem.item.isVegetarian && (
                    <Badge variant="outline" className="text-xs">
                      <Leaf className="h-3 w-3 mr-1 text-green-600" />
                      Vegetarisch
                    </Badge>
                  )}
                  {selectedItem.item.spiceLevel > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Flame className="h-3 w-3 mr-1 text-red-500" />
                      Scharf
                    </Badge>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              {selectedItem.item.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Größe wählen</h3>
                  <div className="space-y-2">
                    {selectedItem.item.sizes.map((size) => (
                      <label
                        key={size.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedItem.size === size.name
                            ? 'border-brand-red-600 bg-brand-red-50'
                            : 'hover:bg-brand-cream-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="size"
                            checked={selectedItem.size === size.name}
                            onChange={() =>
                              setSelectedItem((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      size: size.name,
                                      sizePrice: size.priceAdjustment,
                                    }
                                  : null
                              )
                            }
                            className="text-brand-red-600"
                          />
                          <span>{size.name}</span>
                        </div>
                        <span className="font-medium">
                          {size.priceAdjustment > 0
                            ? `+${formatPrice(size.priceAdjustment)}`
                            : size.priceAdjustment < 0
                            ? formatPrice(size.priceAdjustment)
                            : 'inkl.'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {addOns.length > 0 && categories.find(c => c.id === activeCategory)?.slug === 'pizza' && (
                <div>
                  <h3 className="font-semibold mb-3">Extras (optional)</h3>
                  <div className="space-y-2">
                    {addOns.map((addon) => {
                      const isSelected = selectedItem.addOns.some(
                        (a) => a.name === addon.name
                      );
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-brand-red-600 bg-brand-red-50'
                              : 'hover:bg-brand-cream-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedItem((prev) => {
                                  if (!prev) return null;
                                  const newAddOns = isSelected
                                    ? prev.addOns.filter(
                                        (a) => a.name !== addon.name
                                      )
                                    : [
                                        ...prev.addOns,
                                        { name: addon.name, price: addon.price },
                                      ];
                                  return { ...prev, addOns: newAddOns };
                                });
                              }}
                              className="text-brand-red-600"
                            />
                            <span>{addon.name}</span>
                          </div>
                          <span className="font-medium">
                            +{formatPrice(addon.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="font-semibold mb-3">
                  Sonderwünsche (optional)
                </h3>
                <Input
                  placeholder="z.B. ohne Zwiebeln, extra scharf..."
                  value={selectedItem.notes}
                  onChange={(e) =>
                    setSelectedItem((prev) =>
                      prev ? { ...prev, notes: e.target.value } : null
                    )
                  }
                />
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSelectedItem((prev) =>
                        prev
                          ? { ...prev, quantity: Math.max(1, prev.quantity - 1) }
                          : null
                      )
                    }
                    disabled={selectedItem.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {selectedItem.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSelectedItem((prev) =>
                        prev ? { ...prev, quantity: prev.quantity + 1 } : null
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  In den Warenkorb (
                  {formatPrice(
                    (selectedItem.item.basePrice +
                      selectedItem.sizePrice +
                      selectedItem.addOns.reduce((sum, a) => sum + a.price, 0)) *
                      selectedItem.quantity
                  )}
                  )
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
