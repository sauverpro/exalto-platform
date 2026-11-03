import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../data/product";
import { useUser } from "./UserContext";

interface CartLine {
  product: Product;
  quantity: number;
}

function readCart(key: string): CartLine[] {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(stored) ? (stored as CartLine[]) : [];
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Keyed per user, like favorites, so one account's cart never leaks into
  // another's on a shared device. Read during the first render so a refresh
  // never flashes an empty cart.
  const { user } = useUser();
  const storageKey = `exalto-cart-${user?.id ?? "guest"}`;
  const [items, setItems] = useState<CartLine[]>(() => readCart(storageKey));

  // Signing in or out swaps to that user's saved cart.
  useEffect(() => {
    setItems(readCart(storageKey));
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode); the cart still works in-session.
    }
  }, [items, storageKey]);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (product: Product) => {
      setItems((currentItems) => {
        const existing = currentItems.find((item) => item.product.id === product.id);
        if (existing) {
          return currentItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [...currentItems, { product, quantity: 1 }];
      });
    };

    const updateQuantity = (productId: number, quantity: number) => {
      setItems((currentItems) =>
        quantity > 0
          ? currentItems.map((item) => item.product.id === productId ? { ...item, quantity } : item)
          : currentItems.filter((item) => item.product.id !== productId),
      );
    };

    const removeFromCart = (productId: number) => updateQuantity(productId, 0);
    const clearCart = () => setItems([]);

    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
