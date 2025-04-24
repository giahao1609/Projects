// src/store/cartStore.ts
import { create } from 'zustand';

interface CartState {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
