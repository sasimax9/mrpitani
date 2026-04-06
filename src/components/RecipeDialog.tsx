import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Product, categoryLabels } from "@/data/products";
import recipes from "@/data/recipes";
import { Clock, Users, ChefHat, Lightbulb, Flame, Sparkles, Leaf, Drumstick } from "lucide-react";
import { motion } from "framer-motion";

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

  if (!recipe) return null;

  const diff = difficultyConfig[recipe.difficulty];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl shadow-2xl glass-card w-[calc(100vw-2rem)] sm:w-full">
        {/* Hero header */}
        <div className="relative hero-gradient p-5 sm:p-7 pb-7 sm:pb-9 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-foreground/[0.04] blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-accent/[0.08] blur-2xl" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
              {product.type === "veg" ? (
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground/80" />
              ) : (
                <Drumstick className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground/80" />
              )}
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm border border-primary-foreground/10">
                {categoryLabels[product.category]}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border flex items-center gap-1 ${diff.class}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
                {recipe.difficulty}
              </span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary-foreground leading-tight tracking-tight">
              {recipe.title}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/65 text-xs sm:text-sm mt-2">
              Made with <span className="font-semibold text-primary-foreground/80">{product.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-4 sm:mt-6">
            {[
              { icon: Clock, label: `Prep: ${recipe.prepTime}` },
              { icon: Flame, label: `Cook: ${recipe.cookTime}` },
              { icon: Users, label: `Serves: ${recipe.servings}` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-xl bg-primary-foreground/[0.08] backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-primary-foreground border border-primary-foreground/[0.08]">
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-80" /> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-5 sm:space-y-7">
          {/* Ingredients */}
          <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-secondary/10">
                <ChefHat className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" />
              </div>
              <h3 className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-[0.15em]">Ingredients</h3>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">{recipe.ingredients.length} items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {recipe.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl bg-muted/40 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  {ing}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div initial="hidden" animate="show" custom={1} variants={fadeUp}>
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-accent/10">
                <ChefHat className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
              </div>
              <h3 className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-[0.15em]">How to Make</h3>
            </div>
            <ol className="space-y-2 sm:space-y-2.5">
              {recipe.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 sm:gap-3.5 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm glass-card"
                >
                  <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full hero-gradient text-[10px] sm:text-[11px] font-bold text-primary-foreground shadow-sm">
                    {i + 1}
                  </span>
                  <span className="text-foreground/90 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Tip */}
          {recipe.tip && (
            <motion.div
              initial="hidden" animate="show" custom={2} variants={fadeUp}
              className="flex gap-3 sm:gap-3.5 rounded-2xl border border-accent/15 bg-accent/[0.04] p-4 sm:p-5"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 mt-0.5">
                <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold text-accent uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Pro Tip
                </p>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{recipe.tip}</p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
