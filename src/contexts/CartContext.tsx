import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Product, getProductPrice } from "@/data/products";

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
const MAX_QTY_PER_ITEM = 500;

const normalizeBrand = (brand?: string) => brand ?? "";

const isSameCartItem = (
  item: CartItem,
  productId: string,
  packSize: string,
  brand?: string
) => {
  return (
    item.product.id === productId &&
    item.selectedPack === packSize &&
    normalizeBrand(item.selectedBrand) === normalizeBrand(brand)
  );
};

const sanitizeCart = (raw: unknown): CartItem[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is CartItem => {
      return (
        !!item &&
        typeof item === "object" &&
        "product" in item &&
        "quantity" in item &&
        "selectedPack" in item
      );
    })
    .map((item) => ({
      ...item,
      quantity:
        typeof item.quantity === "number" && Number.isFinite(item.quantity)
          ? Math.min(Math.max(1, item.quantity), MAX_QTY_PER_ITEM)
          : 1,
      selectedPack: typeof item.selectedPack === "string" ? item.selectedPack : "",
      selectedBrand:
        typeof item.selectedBrand === "string" ? item.selectedBrand : undefined,
    }))
    .filter((item) => item.product && item.product.id && item.selectedPack);
};

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? sanitizeCart(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, packSize: string, brand?: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) =>
        isSameCartItem(i, product.id, packSize, brand)
      );

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: Math.min(next[idx].quantity + 1, MAX_QTY_PER_ITEM),
        };
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedPack: packSize,
          selectedBrand: brand,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, packSize: string, brand?: string) => {
    setItems((prev) =>
      prev.filter((i) => !isSameCartItem(i, productId, packSize, brand))
    );
  };

  const updateQuantity = (
    productId: string,
    packSize: string,
    qty: number,
    brand?: string
  ) => {
    const safeQty = Math.min(Math.max(0, qty), MAX_QTY_PER_ITEM);

    if (safeQty <= 0) {
      return removeFromCart(productId, packSize, brand);
    }

    setItems((prev) =>
      prev.map((i) =>
        isSameCartItem(i, productId, packSize, brand)
          ? { ...i, quantity: safeQty }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = getProductPrice(item.product, item.selectedBrand);
        return sum + price * item.quantity;
      }, 0),
    [items]
  );

  const getDiscount = (totalKg: number) => {
    if (totalKg >= 30) return 15;
    if (totalKg >= 20) return 10;
    if (totalKg >= 10) return 5;
    return 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};