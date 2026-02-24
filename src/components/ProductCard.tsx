import { useMemo, useState } from "react";
import { type Product, categoryLabels, getCategoryColor } from "@/data/products";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // 🔥 Update these based on your CartContext functions
  const {
    addToCart,
    // OPTIONAL common functions (use whichever exists in your context)
    updateQuantity,
    removeFromCart,
    items,
  }: any = useCart();

  const [selectedPack, setSelectedPack] = useState(product.packSizes[0]);

  // Find cart line for this product + selected pack
  const cartLine = useMemo(() => {
    return items.find(
      (i: any) =>
        i.product?.id === product.id &&
        (i.packSize === selectedPack ||
          i.pack === selectedPack ||
          i.selectedPack === selectedPack)
    );
  }, [items, product.id, selectedPack]);

  const qty = cartLine?.quantity ?? cartLine?.qty ?? (cartLine ? 1 : 0);

  const increment = () => {
    // If you store pack-based cart lines, addToCart should add for that pack
    addToCart(product, selectedPack);
  };

  const decrement = () => {
    const nextQty = qty - 1;

    // Prefer updateQuantity if you have it
    if (typeof updateQuantity === "function") {
      if (nextQty <= 0) {
        // remove line if qty becomes 0
        if (typeof removeFromCart === "function") {
          removeFromCart(product.id, selectedPack);
        } else {
          updateQuantity(product.id, selectedPack, 0);
        }
      } else {
        updateQuantity(product.id, selectedPack, nextQty);
      }
      return;
    }

    // If you don't have updateQuantity, but have removeFromCart:
    // - when qty is 1, remove line
    // - otherwise you'll need a "decrease" function in your context
    if (typeof removeFromCart === "function" && qty <= 1) {
      removeFromCart(product.id, selectedPack);
      return;
    }

    // Fallback: if your context has decreaseQuantity, map it here
    console.warn(
      "No updateQuantity/removeFromCart found. Add decrease logic in CartContext."
    );
  };

  const inCart = qty > 0;

  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">{product.type === "veg" ? "🥬" : "🍗"}</span>
            </div>
            <p className="text-xs text-muted-foreground">Product Image</p>
          </div>
        </div>

        <span
          className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryColor(
            product.category
          )}`}
        >
          {categoryLabels[product.category]}
        </span>

        {product.bulkAvailable && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
            Bulk Available
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-primary mb-2">₹{product.price}</p>

        {/* Pack size selector */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.packSizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedPack(s)}
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                selectedPack === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Main button area */}
          {!inCart ? (
            <button
              onClick={increment}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all bg-primary text-primary-foreground hover:scale-[1.02]"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between rounded-lg py-2 px-2 bg-primary text-primary-foreground text-xs font-semibold">
              <button
                type="button"
                onClick={decrement}
                className="h-7 w-7 rounded-md bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="min-w-10 text-center font-bold">{qty}</div>

              <button
                type="button"
                onClick={increment}
                className="h-7 w-7 rounded-md bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}

          {inCart && (
            <Link
              to="/cart"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Go to Cart
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;