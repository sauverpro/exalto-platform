import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../data/product";

interface FavoritesContextValue {
  favorites: Product[];
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const value = useMemo<FavoritesContextValue>(() => {
    const isFavorite = (productId: number) => {
      return favorites.some((product) => product.id === productId);
    };

    const addFavorite = (product: Product) => {
      setFavorites((currentFavorites) => {
        if (!currentFavorites.find((item) => item.id === product.id)) {
          return [...currentFavorites, product];
        }
        return currentFavorites;
      });
    };

    const removeFavorite = (productId: number) => {
      setFavorites((currentFavorites) =>
        currentFavorites.filter((product) => product.id !== productId),
      );
    };

    const toggleFavorite = (product: Product) => {
      if (isFavorite(product.id)) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
    };

    return {
      favorites,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
    };
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
