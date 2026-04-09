import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { Product, getProductPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPack: string;
  selectedBrand?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, packSize: string, brand?: string) => void;
  removeFromCart: (productId: string, packSize: string, brand?: string) => void;
  updateQuantity: (productId: string, packSize: string, qty: number, brand?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getDiscount: (totalKg: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "mrpitani_cart";

const matchItem = (i: CartItem, productId: string, packSize: string, brand?: string) =>
  i.product.id === productId && i.selectedPack === packSize && i.selectedBrand === brand;

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => { setInitialized(true); }, []);

  useEffect(() => {
    if (initialized) saveCart(items);
  }, [items, initialized]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setItems([]);
        localStorage.removeItem(CART_KEY);
      }
      if (event === "SIGNED_IN") {
        const saved = loadCart();
        if (saved.length > 0) setItems(saved);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const addToCart = useCallback((product: Product, packSize: string, brand?: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => matchItem(i, product.id, packSize, brand));
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, quantity: 1, selectedPack: packSize, selectedBrand: brand }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, packSize: string, brand?: string) => {
    setItems((prev) => prev.filter((i) => !matchItem(i, productId, packSize, brand)));
  }, []);

  const updateQuantity = useCallback((productId: string, packSize: string, qty: number, brand?: string) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => !matchItem(i, productId, packSize, brand)));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        matchItem(i, productId, packSize, brand) ? { ...i, quantity: qty } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => {
    const price = getProductPrice(i.product, i.selectedBrand);
    return s + price * i.quantity;
  }, 0), [items]);

  const getDiscount = useCallback((totalKg: number) => {
    if (totalKg >= 30) return 15;
    if (totalKg >= 20) return 10;
    if (totalKg >= 10) return 5;
    return 0;
  }, []);

  const value = useMemo(() => ({
    items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, getDiscount
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, getDiscount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
