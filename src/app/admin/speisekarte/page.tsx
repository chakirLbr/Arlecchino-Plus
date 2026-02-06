'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChefHat,
  GripVertical,
  Eye,
  EyeOff,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

interface MenuItemSize {
  id: string;
  name: string;
  price: number;
  sortOrder: number;
  isDefault: boolean;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: number | null;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  sizes: MenuItemSize[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  items: MenuItem[];
}

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    basePrice: '',
    isVegetarian: false,
    isVegan: false,
  });

  // Fetch menu data from database
  useEffect(() => {
    async function fetchMenu() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Speisekarte');
        }
        const data = await response.json();
        setCategories(data.categories || []);
        // Select first category by default
        if (data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Get all menu items from all categories
  const allMenuItems = categories.flatMap((cat) => cat.items || []);

  // Get items for the selected category
  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);
  const categoryItems = selectedCategoryData?.items || [];

  const filteredItems = categoryItems.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const [isSaving, setIsSaving] = useState(false);

  // Refetch menu data
  const refetchMenu = async () => {
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Fehler beim Laden');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error refetching menu:', err);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.basePrice || !selectedCategory) return;

    try {
      setIsSaving(true);
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategory,
          name: newItem.name,
          description: newItem.description || null,
          basePrice: parseFloat(newItem.basePrice),
          isVegetarian: newItem.isVegetarian,
          isVegan: newItem.isVegan,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Erstellen');
      }

      const createdItem = await response.json();

      // Add to local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory
            ? { ...cat, items: [...cat.items, createdItem] }
            : cat
        )
      );

      setNewItem({ name: '', description: '', basePrice: '', isVegetarian: false, isVegan: false });
      setIsAddingItem(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Aktualisieren');
      }

      // Update local state
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.map((item) =>
            item.id === id ? { ...item, isAvailable: !currentStatus } : item
          ),
        }))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Möchten Sie diesen Artikel wirklich löschen?')) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Löschen');
      }

      // Update local state
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => item.id !== id),
        }))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/menu/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingItem.name,
          description: editingItem.description,
          isVegetarian: editingItem.isVegetarian,
          isVegan: editingItem.isVegan,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Speichern');
      }

      // Update local state
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.map((item) =>
            item.id === editingItem.id ? editingItem : item
          ),
        }))
      );
      setEditingItem(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSaving(false);
    }
  };

  // Get the price to display (either basePrice or first size price)
  const getItemPrice = (item: MenuItem): number => {
    if (item.basePrice !== null) {
      return item.basePrice;
    }
    if (item.sizes && item.sizes.length > 0) {
      return item.sizes[0].price;
    }
    return 0;
  };

  // Check if item has multiple sizes
  const hasSizes = (item: MenuItem): boolean => {
    return item.sizes && item.sizes.length > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-red-600" />
          <p className="text-muted-foreground">Speisekarte wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Erneut versuchen</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Speisekarte verwalten</h1>
          <p className="text-muted-foreground">
            {allMenuItems.length} Artikel in {categories.length} Kategorien
          </p>
        </div>
        <Button onClick={() => setIsAddingItem(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Neuer Artikel
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Artikel suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kategorien</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 p-2">
              {categories.map((category) => {
                const itemCount = category.items?.length || 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-brand-red-600 text-white'
                        : 'hover:bg-brand-cream-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <Badge
                      variant={
                        selectedCategory === category.id ? 'secondary' : 'outline'
                      }
                      className="ml-2"
                    >
                      {itemCount}
                    </Badge>
                  </button>
                );
              })}
            </div>
            <Separator className="my-2" />
            <div className="p-2">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Neue Kategorie
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="lg:col-span-3 space-y-4">
          {/* Add New Item Form */}
          {isAddingItem && (
            <Card className="border-brand-red-200 bg-brand-red-50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">
                  Neuen Artikel hinzufügen zu: {selectedCategoryData?.name}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="z.B. Pizza Margherita"
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preis (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.50"
                      value={newItem.basePrice}
                      onChange={(e) =>
                        setNewItem({ ...newItem, basePrice: e.target.value })
                      }
                      placeholder="8.50"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      placeholder="Zutaten und Beschreibung..."
                      rows={2}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="vegetarian"
                        checked={newItem.isVegetarian}
                        onChange={(e) =>
                          setNewItem({ ...newItem, isVegetarian: e.target.checked })
                        }
                        disabled={isSaving}
                      />
                      <Label htmlFor="vegetarian">Vegetarisch</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="vegan"
                        checked={newItem.isVegan}
                        onChange={(e) =>
                          setNewItem({ ...newItem, isVegan: e.target.checked })
                        }
                        disabled={isSaving}
                      />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddItem} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      'Hinzufügen'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingItem(false)}
                    disabled={isSaving}
                  >
                    Abbrechen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items List */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Keine Artikel in dieser Kategorie.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddingItem(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ersten Artikel hinzufügen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={`${!item.isAvailable ? 'opacity-60' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-move text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{item.name}</h3>
                          {item.isVegetarian && (
                            <Badge variant="outline" className="text-green-600">
                              Vegetarisch
                            </Badge>
                          )}
                          {item.isVegan && (
                            <Badge variant="outline" className="text-green-700">
                              Vegan
                            </Badge>
                          )}
                          {item.isSpicy && (
                            <Badge variant="outline" className="text-red-600">
                              Scharf
                            </Badge>
                          )}
                          {!item.isAvailable && (
                            <Badge variant="secondary">Nicht verfügbar</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description || 'Keine Beschreibung'}
                        </p>
                        {hasSizes(item) && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {item.sizes.map((size) => (
                              <Badge key={size.id} variant="outline" className="text-xs">
                                {size.name}: {formatPrice(size.price)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {hasSizes(item) ? (
                            <span className="text-sm text-muted-foreground">ab </span>
                          ) : null}
                          {formatPrice(getItemPrice(item))}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                          disabled={isSaving}
                          title={
                            item.isAvailable
                              ? 'Als nicht verfügbar markieren'
                              : 'Als verfügbar markieren'
                          }
                        >
                          {item.isAvailable ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingItem({ ...item })}
                          disabled={isSaving}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={isSaving}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Artikel bearbeiten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Beschreibung</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value || null })
                  }
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-vegetarian"
                    checked={editingItem.isVegetarian}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isVegetarian: e.target.checked })
                    }
                  />
                  <Label htmlFor="edit-vegetarian">Vegetarisch</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-vegan"
                    checked={editingItem.isVegan}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isVegan: e.target.checked })
                    }
                  />
                  <Label htmlFor="edit-vegan">Vegan</Label>
                </div>
              </div>
              {hasSizes(editingItem) && (
                <div>
                  <Label>Größen</Label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {editingItem.sizes.map((size) => (
                      <Badge key={size.id} variant="outline">
                        {size.name}: {formatPrice(size.price)}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Preise können über das Seed-Skript geändert werden.
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  disabled={isSaving}
                >
                  Abbrechen
                </Button>
                <Button onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Speichern...
                    </>
                  ) : (
                    'Speichern'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-green-900 mb-2">✓ Datenbank verbunden</h3>
          <p className="text-sm text-green-800">
            Die Speisekarte wird aus der Datenbank geladen.
            Sie können Artikel bearbeiten, löschen und die Verfügbarkeit ändern.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
