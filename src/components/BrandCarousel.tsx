import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Store, Check } from "lucide-react";
import type { BrandVariant } from "@/data/products";

interface BrandCarouselProps {
  brands: BrandVariant[];
  selectedBrand: string;
  onSelect: (brand: string) => void;
  compact?: boolean; // for ProductCard (smaller)
}

const BrandCarousel = ({ brands, selectedBrand, onSelect, compact = false }: BrandCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [brands]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = compact ? 140 : 180;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (brands.length <= 1) return null;

  return (
    <div className="relative group/carousel" onClick={(e) => e.stopPropagation()}>
      {/* Label */}
      <div className="flex items-center gap-1.5 mb-2">
        <Store className={compact ? "h-3 w-3 text-muted-foreground" : "h-3.5 w-3.5 text-primary"} />
        <span className={`font-semibold text-muted-foreground uppercase tracking-wider ${compact ? "text-[9px]" : "text-[10px]"}`}>
          {brands.length} Brands Available
        </span>
      </div>

      {/* Carousel container */}
      <div className="relative">
        {/* Left arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full border border-border bg-card shadow-lg text-foreground transition-all hover:bg-muted hover:scale-110 ${
                compact ? "h-6 w-6 -ml-2" : "h-7 w-7 -ml-3"
              }`}
            >
              <ChevronLeft className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full border border-border bg-card shadow-lg text-foreground transition-all hover:bg-muted hover:scale-110 ${
                compact ? "h-6 w-6 -mr-2" : "h-7 w-7 -mr-3"
              }`}
            >
              <ChevronRight className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {brands.map((v) => {
            const isSelected = selectedBrand === v.brand;
            return (
              <motion.button
                key={v.brand}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(v.brand)}
                className={`relative flex-shrink-0 rounded-xl border transition-all duration-200 ${
                  compact ? "px-3 py-2" : "px-4 py-3"
                } ${
                  isSelected
                    ? "border-primary bg-primary/8 shadow-sm shadow-primary/10"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="brand-indicator"
                    className={`absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 flex items-center justify-center rounded-full hero-gradient text-primary-foreground ${
                      compact ? "h-4 w-4" : "h-5 w-5"
                    }`}
                  >
                    <Check className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
                  </motion.div>
                )}

                <div className="flex flex-col items-start gap-0.5">
                  <span className={`font-bold whitespace-nowrap ${
                    compact ? "text-[10px]" : "text-xs"
                  } ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {v.brand}
                  </span>
                  <span className={`font-extrabold whitespace-nowrap ${
                    compact ? "text-xs" : "text-sm"
                  } ${isSelected ? "text-primary" : "text-foreground"}`}>
                    ₹{v.price}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
