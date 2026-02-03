import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  size?: string;
  sizePrice: number;
  unitPrice: number;
  quantity: number;
  addOns: Array<{ name: string; price: number }>;
  notes?: string;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  orderType: 'DELIVERY' | 'PICKUP';
  deliveryPostalCode: string;
  deliveryFee: number;
  tip: number;
  couponCode: string | null;
  couponDiscount: number;
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  setOrderType: (type: 'DELIVERY' | 'PICKUP') => void;
  setDeliveryPostalCode: (postalCode: string) => void;
  setDeliveryFee: (fee: number) => void;
  setTip: (amount: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemTotal: (item: CartItem) => number;
}

type CartStore = CartState & CartActions;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      orderType: 'DELIVERY',
      deliveryPostalCode: '',
      deliveryFee: 0,
      tip: 0,
      couponCode: null,
      couponDiscount: 0,

      // Actions
      addItem: (item) => {
        const items = get().items;

        // Check if same item with same size and addOns exists
        const existingIndex = items.findIndex(
          (i) =>
            i.menuItemId === item.menuItemId &&
            i.size === item.size &&
            JSON.stringify(i.addOns) === JSON.stringify(item.addOns)
        );

        if (existingIndex >= 0) {
          // Update quantity of existing item
          const newItems = [...items];
          newItems[existingIndex].quantity += item.quantity;
          if (item.notes) {
            newItems[existingIndex].notes = item.notes;
          }
          set({ items: newItems });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, id: generateId() }],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      updateItemNotes: (id, notes) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, notes } : item
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
          tip: 0,
          couponCode: null,
          couponDiscount: 0,
        });
      },

      setOrderType: (orderType) => {
        set({
          orderType,
          deliveryFee: orderType === 'PICKUP' ? 0 : get().deliveryFee,
        });
      },

      setDeliveryPostalCode: (postalCode) => {
        set({ deliveryPostalCode: postalCode });
      },

      setDeliveryFee: (fee) => {
        set({ deliveryFee: fee });
      },

      setTip: (amount) => {
        set({ tip: Math.max(0, amount) });
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },

      getItemTotal: (item) => {
        const addOnsTotal = item.addOns.reduce((sum, addon) => sum + addon.price, 0);
        return (item.unitPrice + item.sizePrice + addOnsTotal) * item.quantity;
      },

      getSubtotal: () => {
        const { items, getItemTotal } = get();
        return items.reduce((sum, item) => sum + getItemTotal(item), 0);
      },

      getTotal: () => {
        const { getSubtotal, deliveryFee, tip, couponDiscount, orderType } = get();
        const subtotal = getSubtotal();
        const delivery = orderType === 'DELIVERY' ? deliveryFee : 0;
        return Math.max(0, subtotal + delivery + tip - couponDiscount);
      },
    }),
    {
      name: 'arlecchino-cart',
      partialize: (state) => ({
        items: state.items,
        orderType: state.orderType,
        deliveryPostalCode: state.deliveryPostalCode,
        tip: state.tip,
      }),
    }
  )
);
