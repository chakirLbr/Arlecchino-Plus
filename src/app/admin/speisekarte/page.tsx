'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChefHat,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

// Sample data - this would come from database
const initialCategories = [
  { id: '1', name: 'Pizza', slug: 'pizza', sortOrder: 1 },
  { id: '2', name: 'Pasta', slug: 'pasta', sortOrder: 2 },
  { id: '3', name: 'Salate', slug: 'salate', sortOrder: 3 },
  { id: '4', name: 'Vorspeisen', slug: 'vorspeisen', sortOrder: 4 },
  { id: '5', name: 'Aufläufe', slug: 'auflaeufe', sortOrder: 5 },
  { id: '6', name: 'Getränke', slug: 'getraenke', sortOrder: 6 },
];

const initialMenuItems = [
  {
    id: '1',
    categoryId: '1',
    name: 'Margherita',
    description: 'Tomatensoße, Mozzarella, frisches Basilikum',
    basePrice: 8.5,
    isAvailable: true,
    isVegetarian: true,
  },
  {
    id: '2',
    categoryId: '1',
    name: 'Diavola',
    description: 'Tomatensoße, Mozzarella, scharfe Salami, Peperoni',
    basePrice: 10.5,
    isAvailable: true,
    isVegetarian: false,
  },
  {
    id: '3',
    categoryId: '1',
    name: 'Quattro Formaggi',
    description: 'Mozzarella, Gorgonzola, Parmesan, Pecorino',
    basePrice: 11.5,
    isAvailable: true,
    isVegetarian: true,
  },
  {
    id: '4',
    categoryId: '2',
    name: 'Spaghetti Bolognese',
    description: 'Klassische Fleischsoße nach Hausrezept',
    basePrice: 9.5,
    isAvailable: true,
    isVegetarian: false,
  },
  {
    id: '5',
    categoryId: '2',
    name: 'Penne Arrabiata',
    description: 'Scharfe Tomatensoße mit Knoblauch und Peperoncino',
    basePrice: 8.5,
    isAvailable: true,
    isVegetarian: true,
  },
];

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  isAvailable: boolean;
  isVegetarian: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    basePrice: '',
    isVegetarian: false,
  });

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = item.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.basePrice) return;

    const item: MenuItem = {
      id: Date.now().toString(),
      categoryId: selectedCategory,
      name: newItem.name,
      description: newItem.description,
      basePrice: parseFloat(newItem.basePrice),
      isAvailable: true,
      isVegetarian: newItem.isVegetarian,
    };

    setMenuItems([...menuItems, item]);
    setNewItem({ name: '', description: '', basePrice: '', isVegetarian: false });
    setIsAddingItem(false);

    // TODO: Save to database
    alert('Artikel hinzugefügt! (In Produktion wird dies in der Datenbank gespeichert)');
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    // TODO: Save to database
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Möchten Sie diesen Artikel wirklich löschen?')) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
      // TODO: Delete from database
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Speisekarte verwalten</h1>
          <p className="text-muted-foreground">
            {menuItems.length} Artikel in {categories.length} Kategorien
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
                const itemCount = menuItems.filter(
                  (i) => i.categoryId === category.id
                ).length;
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
                <h3 className="font-semibold mb-4">Neuen Artikel hinzufügen</h3>
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
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="vegetarian"
                      checked={newItem.isVegetarian}
                      onChange={(e) =>
                        setNewItem({ ...newItem, isVegetarian: e.target.checked })
                      }
                    />
                    <Label htmlFor="vegetarian">Vegetarisch</Label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddItem}>Hinzufügen</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingItem(false)}
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          {item.isVegetarian && (
                            <Badge variant="outline" className="text-green-600">
                              Vegetarisch
                            </Badge>
                          )}
                          {!item.isAvailable && (
                            <Badge variant="secondary">Nicht verfügbar</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {formatPrice(item.basePrice)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleAvailability(item.id)}
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
                          onClick={() => setEditingItem(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
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

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Hinweis</h3>
          <p className="text-sm text-blue-800">
            Änderungen werden derzeit nur lokal gespeichert. Um die Speisekarte
            dauerhaft zu aktualisieren, müssen die Daten in der Datenbank
            gespeichert werden. Die API-Anbindung ist vorbereitet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
