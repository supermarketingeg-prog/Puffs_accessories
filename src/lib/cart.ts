import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "./types";

type CartState = {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.productId === product.id);
        if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
        else
          items.push({
            productId: product.id,
            slug: product.slug,
            name: product.name_ar,
            price: product.price,
            image: product.image_url,
            qty,
          });
        set({ items });
      },
      setQty: (productId, qty) => {
        if (qty <= 0) set({ items: get().items.filter((x) => x.productId !== productId) });
        else
          set({
            items: get().items.map((x) => (x.productId === productId ? { ...x, qty } : x)),
          });
      },
      remove: (productId) => set({ items: get().items.filter((x) => x.productId !== productId) }),
      clear: () => set({ items: [] }),
    }),
    { name: "puffs-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty * i.price, 0);
}
