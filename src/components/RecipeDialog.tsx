import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Product, categoryLabels, getProductPrice } from "@/data/products";
import recipes from "@/data/recipes";
import { Clock, Users, ChefHat, Lightbulb, Flame, ShoppingCart, Check, Sparkles, Store, ChevronLeft, ChevronRight, Leaf, Drumstick } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import QuantityStepper from "./QuantityStepper";

interface RecipeDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const difficultyConfig = {
  Easy: { class: "bg-secondary/15 text-secondary border-secondary/20", dot: "bg-secondary" },
  Medium: { class: "bg-accent/15 text-accent border-accent/20", dot: "bg-accent" },
  Hard: { class: "bg-destructive/15 text-destructive border-destructive/20", dot: "bg-destructive" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

const RecipeDialog = ({ product, open, onOpenChange }: RecipeDialogProps) => {
  const recipe = recipes[product.id];
  const { addToCart, updateQuantity, items } = useCart();

  const brands = product.brandVariants && product.brandVariants.length > 0
    ? product.brandVariants
    : [{ brand: product.brand || "Standard", price: product.price }];

  const [brandIndex, setBrandIndex] = useState(0);
  const [selectedPack, setSelectedPack] = useState(product.packSizes[0]);

  const currentBrand = brands[brandIndex];
  const hasBrands = brands.length > 1;

  const cartItem = items.find(
    (i) => i.product.id === product.id && i.selectedPack === selectedPack && i.selectedBrand === currentBrand.brand
  );
  const cartQty = cartItem?.quantity ?? 0;

  const handleAdd = () => addToCart(product, selectedPack, currentBrand.brand);
  const handleIncrement = () => addToCart(product, selectedPack, currentBrand.brand);
  const handleDecrement = () => updateQuantity(product.id, selectedPack, cartQty - 1);

  const goToBrand = (dir: "left" | "right") => {
    setBrandIndex((prev) =>
      dir === "right"
        ? (prev + 1) % brands.length
        : (prev - 1 + brands.length) % brands.length
    );
  };

  if (!recipe) return null;

  const diff = difficultyConfig[recipe.difficulty];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl shadow-2xl glass-card">
        {/* Hero header */}
        <div className="relative hero-gradient p-7 pb-9 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-foreground/[0.04] blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-accent/[0.08] blur-2xl" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              {product.type === "veg" ? (
                <Leaf className="h-5 w-5 text-primary-foreground/80" />
              ) : (
                <Drumstick className="h-5 w-5 text-primary-foreground/80" />
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm border border-primary-foreground/10">
                {categoryLabels[product.category]}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${diff.class}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
                {recipe.difficulty}
              </span>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-extrabold text-primary-foreground leading-tight tracking-tight">
              {recipe.title}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/65 text-sm mt-2">
              Made with <span className="font-semibold text-primary-foreground/80">{product.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2.5 mt-6">
            {[
              { icon: Clock, label: `Prep: ${recipe.prepTime}` },
              { icon: Flame, label: `Cook: ${recipe.cookTime}` },
              { icon: Users, label: `Serves: ${recipe.servings}` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-xl bg-primary-foreground/[0.08] backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-primary-foreground border border-primary-foreground/[0.08]">
                <Icon className="h-3.5 w-3.5 opacity-80" /> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-7 space-y-7">
          {/* Ingredients */}
          <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10">
                <ShoppingCart className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="font-bold text-foreground text-sm uppercase tracking-[0.15em]">Ingredients</h3>
              <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">{recipe.ingredients.length} items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                  className="flex items-start gap-2.5 rounded-xl bg-muted/40 px-3.5 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  {ing}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div initial="hidden" animate="show" custom={1} variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10">
                <ChefHat className="h-4 w-4 text-accent" />
              </div>
              <h3 className="font-bold text-foreground text-sm uppercase tracking-[0.15em]">How to Make</h3>
            </div>
            <ol className="space-y-2.5">
              {recipe.steps.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex gap-3.5 rounded-2xl p-4 text-sm glass-card glass-card-hover transition-colors"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hero-gradient text-[11px] font-bold text-primary-foreground shadow-sm">
                    {i + 1}
                  </span>
                  <span className="text-foreground/90 leading-relaxed pt-0.5">{step}</span>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Tip */}
          {recipe.tip && (
            <motion.div
              initial="hidden" animate="show" custom={2} variants={fadeUp}
              className="flex gap-3.5 rounded-2xl border border-accent/15 bg-accent/[0.04] p-5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 mt-0.5">
                <Lightbulb className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-accent uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Pro Tip
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{recipe.tip}</p>
              </div>
            </motion.div>
          )}

          {/* Add to cart — matching ProductCard behavior */}
          <motion.div
            initial="hidden" animate="show" custom={3} variants={fadeUp}
            className="rounded-2xl p-5 glass-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-foreground">{product.name}</p>
                {hasBrands && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Store className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">{currentBrand.brand}</span>
                  </div>
                )}
              </div>

              {/* Brand navigation */}
              {hasBrands && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToBrand("left")}
                    className="h-7 w-7 rounded-full glass-card flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-muted-foreground">{brandIndex + 1}/{brands.length}</span>
                  <button
                    onClick={() => goToBrand("right")}
                    className="h-7 w-7 rounded-full glass-card flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Brand dots */}
            {hasBrands && (
              <div className="flex gap-1 mb-3">
                {brands.map((b, i) => (
                  <button
                    key={i}
                    onClick={() => setBrandIndex(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === brandIndex
                        ? "w-4 h-1.5 bg-primary"
                        : "w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/40"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Price */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentBrand.price}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xl font-extrabold text-primary mb-3"
              >
                ₹{currentBrand.price}
              </motion.p>
            </AnimatePresence>

            {/* Pack size selector */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.packSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedPack(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all duration-200 ${
                    selectedPack === s
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Quantity stepper — same as ProductCard */}
            <QuantityStepper
              quantity={cartQty}
              onAdd={handleAdd}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
