import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type {Product} from '../types/product';
import type {CartItem} from '../types/cart';

interface CartState {
  items: CartItem[];

  addProduct: (product: Product) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;

  removeProduct: (id: number) => void;
  removeProducts: (ids: number[]) => void;

  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addProduct: (product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
              },
            ],
          };
        });
      },

      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      removeProduct: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        }));
      },

      removeProducts: (ids) => {
        set((state) => ({
          items: state.items.filter((item) => !ids.includes(item.product.id)),
        }));
      },

      clearCart: () => {
        set({items: []});
      },
    }),
    {
      name: 'gadget-hub-cart',

      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);

export function useCartQuantity() {
  return useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
}

export function useCartTotal() {
  return useCartStore((state) =>
    state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ),
  );
}

export function useProductQuantity(id: number) {
  return useCartStore(
    (state) =>
      state.items.find((item) => item.product.id === id)?.quantity ?? 0,
  );
}
