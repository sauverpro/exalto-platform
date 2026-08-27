import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../data/product";

interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

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

    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      addToCart,
      updateQuantity,
      removeFromCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
