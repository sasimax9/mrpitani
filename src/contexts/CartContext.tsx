import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPack: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, packSize: string) => void;
  removeFromCart: (productId: string, packSize: string) => void;
  updateQuantity: (productId: string, packSize: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getDiscount: (totalKg: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "mrpitani_cart";

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, packSize: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.selectedPack === packSize);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, quantity: 1, selectedPack: packSize }];
    });
  };

  const removeFromCart = (productId: string, packSize: string) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.selectedPack === packSize)));
  };

  const updateQuantity = (productId: string, packSize: string, qty: number) => {
    if (qty <= 0) return removeFromCart(productId, packSize);
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.selectedPack === packSize ? { ...i, quantity: qty } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + (i.product.price ?? 0) * i.quantity, 0);

  const getDiscount = (totalKg: number) => {
    if (totalKg >= 30) return 15;
    if (totalKg >= 20) return 10;
    if (totalKg >= 10) return 5;
    return 0;
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, getDiscount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
