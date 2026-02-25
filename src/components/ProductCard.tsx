// src/components/ProductCard.tsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Eye,
} from "lucide-react";

import { useCart } from "@/contexts/CartContext";
// ✅ use Product from your API/catalog (Supabase)
import type { Product } from "@/api/catalog";

// these are just label/color helpers (keep your existing file)
import { categoryLabels, getCategoryColor } from "@/data/products";
import RecipeDialog from "./RecipeDialog";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMG = "https://placehold.co/600x450?text=No+Image";

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, updateQuantity, removeFromCart, items } = useCart() as any;

  const [selectedPack, setSelectedPack] = useState(product.packSizes?.[0] ?? "1kg");
  const [added, setAdded] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);

  // ✅ pack-specific cart line
  const cartLine = useMemo(() => {
    return (items ?? []).find(
      (i: any) =>
        i.product?.id === product.id &&
        (i.selectedPack === selectedPack || i.pack === selectedPack || i.packSize === selectedPack)
    );
  }, [items, product.id, selectedPack]);

  const qty: number = cartLine?.quantity ?? cartLine?.qty ?? 0;
  const inCart = qty > 0;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const increment = (e?: React.MouseEvent) => {
    if (e) stop(e);

    // if your addToCart already increments when same line exists, this is enough
    addToCart(product, selectedPack);

    // "Added!" flash (only when it was 0 -> 1)
    if (!inCart) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1200);
    }
  };

  const decrement = (e?: React.MouseEvent) => {
    if (e) stop(e);

    const nextQty = qty - 1;

    if (typeof updateQuantity === "function") {
      if (nextQty <= 0) {
        if (typeof removeFromCart === "function") removeFromCart(product.id, selectedPack);
        else updateQuantity(product.id, selectedPack, 0);
      } else {
        updateQuantity(product.id, selectedPack, nextQty);
      }
      return;
    }

    // fallback
    if (typeof removeFromCart === "function" && qty <= 1) {
      removeFromCart(product.id, selectedPack);
      return;
    }

    console.warn("No updateQuantity/removeFromCart found. Add decrease logic in CartContext.");
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden card-shadow transition-all duration-300 hover:card-shadow-hover"
        onClick={() => setRecipeOpen(true)}
      >
        {/* Image area */}
        <div className="aspect-[4/3] bg-gradient-to-br from-muted/80 to-muted/30 relative overflow-hidden">
          {/* subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* ✅ Image (keeps premium UI; shows icon if no image) */}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="mx-auto mb-3 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/5"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-3xl">{product.type === "veg" ? "🥬" : "🍗"}</span>
                </motion.div>
                <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <Eye className="h-3 w-3" /> View Recipe
                </div>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm ${getCategoryColor(
              product.category as any
            )}`}
          >
            {categoryLabels[product.category as any] ?? product.category}
          </span>

          {product.bulkAvailable && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-sm">
              Bulk
            </span>
          )}

          {/* Price tag */}
          <div className="absolute bottom-3 right-3 glass-strong bg-white rounded-xl px-3 py-1.5 shadow-sm border border-border/50 ">
            <p className="text-sm font-extrabold text-primary">₹{product.price}</p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>

          {/* Pack size selector */}
          <div className="flex flex-wrap gap-1.5 mb-3" onClick={stop}>
            {(product.packSizes ?? []).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedPack(s)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all duration-200 ${
                  selectedPack === s
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* ✅ KEEP NEW STYLES, but use (- qty +) logic */}
          <div className="flex gap-2" onClick={stop}>
            {!inCart ? (
                <button
    onClick={increment}
    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
      added
        ? "bg-secondary text-secondary-foreground"
        : "bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]"
    }`}
  >
    {added ? (
      <>
        <Check className="h-3.5 w-3.5" /> Added!
      </>
    ) : (
      <>
        <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
      </>
    )}
  </button>
) : (
  <div className="flex-1 h-10 flex items-center justify-between rounded-xl px-2 bg-primary text-primary-foreground text-xs font-bold">
    <button
      type="button"
      onClick={decrement}
      className="h-8 w-8 rounded-lg bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center"
      aria-label="Decrease quantity"
    >
      <Minus className="h-4 w-4" />
    </button>

    <div className="min-w-10 text-center font-extrabold leading-none">{qty}</div>

    <button
      type="button"
      onClick={increment}
      className="h-8 w-8 rounded-lg bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center"
      aria-label="Increase quantity"
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
            )}

            {inCart && (
              <Link
                to="/cart"
                onClick={stop}
                className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-primary px-3 py-2.5 text-xs font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
              >
                Go to Cart
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <RecipeDialog product={product as any} open={recipeOpen} onOpenChange={setRecipeOpen} />
    </>
  );
};

export default ProductCard;