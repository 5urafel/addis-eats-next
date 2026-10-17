"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Heart, Info } from "lucide-react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "addis_eats_cart_v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync with localStorage on initial client hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read cart from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart changes to localStorage once hydrated
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage", e);
    }
  }, [cart, isHydrated]);

  // Toast trigger helper
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  }, []);

  // Add item with quantity (default 1)
  const addToCart = useCallback(
    (item, quantityToAdd = 1) => {
      const qty = Math.max(1, parseInt(quantityToAdd, 10) || 1);
      const numericPrice = Number(item.price) || 15.0;

      setCart((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === item.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + qty,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: item.id,
              name: item.name || "Ethiopian Dish",
              price: numericPrice,
              image: item.image || "/images/doro-wat.jpg",
              category: item.category || "Habesha Specials",
              quantity: qty,
            },
          ];
        }
      });

      showToast(`Added ${qty}x ${item.name || "item"} to your bag! 🍲`);
    },
    [showToast]
  );

  // Update quantity directly (or remove if <= 0)
  const updateQuantity = useCallback(
    (id, newQuantity) => {
      const targetQty = parseInt(newQuantity, 10);
      setCart((prev) => {
        if (targetQty <= 0) {
          return prev.filter((i) => i.id !== id);
        }
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: targetQty } : item
        );
      });
    },
    []
  );

  // Remove single dish from cart
  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => {
        const itemToRemove = prev.find((i) => i.id === id);
        if (itemToRemove) {
          showToast(`Removed ${itemToRemove.name} from bag`, "info");
        }
        return prev.filter((i) => i.id !== id);
      });
    },
    [showToast]
  );

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Computed monetary & statistical values
  const itemsCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  const freeDeliveryThreshold = 40.0;
  const deliveryFee =
    cart.length === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : 3.5;
  const tax = subtotal * 0.05; // 5% Addis Ababa municipal dining tax
  const total = subtotal + deliveryFee + tax;
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        isHydrated,
        itemsCount,
        subtotal,
        deliveryFee,
        tax,
        total,
        freeDeliveryThreshold,
        freeDeliveryProgress,
        amountForFreeDelivery,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showToast,
      }}
    >
      {children}

      {/* Floating notification toast */}
      {toast && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 animate-fade-in pointer-events-none flex justify-center sm:justify-end">
          <div
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md transition-all max-w-sm sm:max-w-md ${
              toast.type === "info"
                ? "bg-stone-900/95 text-white border-stone-700"
                : "bg-stone-900/95 text-white border-amber-500/40"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E05328] animate-ping" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

const FavoritesContext = createContext(null);
const FAVORITES_STORAGE_KEY = "addis_eats_favorites_v1";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync with localStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read favorites from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn("Failed to persist favorites to localStorage", e);
    }
  }, [favorites, isHydrated]);

  const showToast = useCallback((message, type = "favorite") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  }, []);

  const isFavorite = useCallback(
    (dishId) => favorites.some((item) => item.id === dishId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (dish) => {
      if (!dish || !dish.id) return;
      setFavorites((prev) => {
        const exists = prev.some((item) => item.id === dish.id);
        if (exists) {
          showToast(`Removed "${dish.name || "dish"}" from favorites`, "info");
          return prev.filter((item) => item.id !== dish.id);
        } else {
          showToast(`Saved "${dish.name || "dish"}" to favorites!`, "favorite");
          return [
            ...prev,
            {
              id: dish.id,
              name: dish.name || "Ethiopian Dish",
              price: Number(dish.price) || 15.0,
              image: dish.image || "/images/doro-wat.jpg",
              category: dish.category || "Habesha Specials",
              description: dish.description || "",
            },
          ];
        }
      });
    },
    [showToast]
  );

  const removeFavorite = useCallback(
    (dishId) => {
      setFavorites((prev) => {
        const item = prev.find((i) => i.id === dishId);
        if (item) {
          showToast(`Removed "${item.name}" from favorites`, "info");
        }
        return prev.filter((i) => i.id !== dishId);
      });
    },
    [showToast]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast("Cleared all favorites", "info");
  }, [showToast]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isHydrated,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        showToast,
      }}
    >
      {children}

      {/* Floating notification toast for favorites */}
      {toast && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 animate-fade-in pointer-events-none flex justify-center sm:justify-end">
          <div
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md transition-all max-w-sm sm:max-w-md ${
              toast.type === "info"
                ? "bg-stone-900/95 text-white border-stone-700"
                : "bg-stone-900/95 text-white border-rose-500/50"
            }`}
          >
            {toast.type === "favorite" ? (
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0 animate-bounce" />
            ) : (
              <Info className="w-4 h-4 text-stone-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

export default function Providers({ children }) {
  return (
    <FavoritesProvider>
      <CartProvider>{children}</CartProvider>
    </FavoritesProvider>
  );
}
