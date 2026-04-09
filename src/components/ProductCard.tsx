import { useState, useRef, useCallback } from "react";
import { type Product, categoryLabels, getCategoryColor, getProductPrice } from "@/data/products";
import { Eye, ChevronLeft, ChevronRight, Store, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import RecipeDialog from "./RecipeDialog";
import QuantityStepper from "./QuantityStepper";
import { getProductImageUrl, getCategoryImageUrl } from "@/lib/imageUrl";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, updateQuantity, items } = useCart();
  const [selectedPack, setSelectedPack] = useState(product.packSizes[0]);
  const brands = product.brandVariants && product.brandVariants.length > 0
    ? product.brandVariants
    : [{ brand: product.brand || "Standard", price: product.price }];
  const [brandIndex, setBrandIndex] = useState(0);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const touchStartX = useRef(0);

  const currentBrand = brands[brandIndex];
  const hasBrands = brands.length > 1;
  const cartItem = items.find(
    (i) => i.product.id === product.id && i.selectedPack === selectedPack && i.selectedBrand === currentBrand.brand
  );
  const cartQty = cartItem?.quantity ?? 0;
  const inCart = items.some((i) => i.product.id === product.id);

  const productImage = getProductImageUrl(product.imagePath) || getCategoryImageUrl(product.category);

  const goToBrand = useCallback((dir: "left" | "right", e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setBrandIndex((prev) =>
      dir === "right"
        ? (prev + 1) % brands.length
        : (prev - 1 + brands.length) % brands.length
    );
  }, [brands.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasBrands) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goToBrand(diff > 0 ? "right" : "left");
    }
  };

  const handleAdd = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(product, selectedPack, currentBrand.brand);
  }, [addToCart, product, selectedPack, currentBrand.brand]);

  const handleIncrement = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(product, selectedPack, currentBrand.brand);
  }, [addToCart, product, selectedPack, currentBrand.brand]);

  const handleDecrement = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    updateQuantity(product.id, selectedPack, cartQty - 1, currentBrand.brand);
  }, [updateQuantity, product.id, selectedPack, cartQty, currentBrand.brand]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Only open recipe if click target is the card itself, not interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    setRecipeOpen(true);
  }, []);

  return (
    <>
      <div
        className="group cursor-pointer rounded-2xl overflow-hidden glass-card transition-colors duration-200 hover:bg-muted/30"
        onClick={handleCardClick}
      >
        {/* Image area */}
        <div
          className="aspect-[4/3] relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0">
            {!imgError ? (
              <img
                src={productImage}
                alt={product.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <ImageOff className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Brand name */}
            <div className="absolute inset-0 flex flex-col items-end justify-end p-3">
              {hasBrands && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Store className="h-3 w-3 text-white/90" />
                  <span className="text-xs font-bold text-white/90 drop-shadow-sm">{currentBrand.brand}</span>
                </div>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-1.5 text-[11px] text-white font-bold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Eye className="h-3.5 w-3.5" /> View Recipe
              </div>
            </div>
          </div>

          {/* Brand navigation arrows */}
          {hasBrands && (
            <>
              <button
                onClick={(e) => goToBrand("left", e)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full glass-strong border border-border/50 flex items-center justify-center text-foreground/70 hover:text-foreground hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => goToBrand("right", e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full glass-strong border border-border/50 flex items-center justify-center text-foreground/70 hover:text-foreground hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {/* Top-left: Category badge */}
          <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm ${getCategoryColor(product.category)}`}>
            {categoryLabels[product.category]}
          </span>

          {/* Top-right: Brand count */}
          {hasBrands && (
            <div className="absolute top-3 right-3 z-10 glass-strong rounded-full px-2.5 py-1 border border-border/50 shadow-sm flex items-center gap-1">
              <span className="text-[9px] font-bold text-foreground/70">{brandIndex + 1}/{brands.length}</span>
            </div>
          )}

          {product.bulkAvailable && !hasBrands && (
            <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-sm">
              Bulk
            </span>
          )}

          {/* Bottom: Price tag */}
          <div className="absolute bottom-3 right-3 z-10 glass-strong rounded-xl px-3 py-1.5 shadow-sm border border-border/50">
            <p className="text-sm font-extrabold text-primary">
              ₹{currentBrand.price}
            </p>
          </div>

          {/* Bottom-left: Brand dots */}
          {hasBrands && (
            <div className="absolute bottom-3 left-3 z-10 flex gap-1">
              {brands.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBrandIndex(i);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === brandIndex
                      ? "w-4 h-1.5 bg-primary"
                      : "w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            {hasBrands && (
              <span className="ml-2 shrink-0 text-[9px] font-bold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
                {brands.length} brands
              </span>
            )}
          </div>

          {/* Pack size selector */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.packSizes.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedPack(s);
                }}
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

          <div className="flex gap-2">
            <QuantityStepper
              quantity={cartQty}
              onAdd={handleAdd}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
            {inCart && (
              <Link
                to="/cart"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-primary px-3 py-2 text-xs font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
              >
                Cart
              </Link>
            )}
          </div>
        </div>
      </div>

      <RecipeDialog product={product} open={recipeOpen} onOpenChange={setRecipeOpen} />
    </>
  );
};

export default ProductCard;
