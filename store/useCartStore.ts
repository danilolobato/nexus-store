import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  badge?: string | null;
  image: string;
  description?: string | null;
}

export interface CartItem extends ProductItem {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: ProductItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isCartOpen: true,
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }], isCartOpen: true };
        }),
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
      updateQuantity: (id, delta) =>
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        })),
      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    { name: 'nexus-cart-storage' }
  )
);