export type ProductCategory =
  | "veg"
  | "non-veg"
  | "general"
  | "veg-snacks"
  | "non-veg-snacks"
  | "dairy"
  | "crushes"
  | "mocktail"
  | "jam"
  | "tin-items"
  | "toppings"
  | "sauces"
  | "mayo"
  | "seasoning";

export interface BrandVariant {
  brand: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  type: "veg" | "non-veg";
  storage: "frozen" | "non-frozen";
  prep: "raw" | "ready-to-cook" | null;
  order: "bulk" | "retail" | "both";
  packSizes: string[];
  bulkAvailable: boolean;
  brand?: string;
  price: number;
  brandVariants?: BrandVariant[];
  imagePath?: string | null;
}

/** Get the effective price for a product given a selected brand */
export const getProductPrice = (product: Product, selectedBrand?: string): number => {
  if (!product.brandVariants || !selectedBrand) return product.price;
  const variant = product.brandVariants.find(v => v.brand === selectedBrand);
  return variant ? variant.price : product.price;
};

export const categoryLabels: Record<ProductCategory, string> = {
  veg: "Veg",
  "non-veg": "Non-Veg",
  general: "General Items",
  "veg-snacks": "Veg Snacks",
  "non-veg-snacks": "Non-Veg Snacks",
  dairy: "Dairy",
  crushes: "Crushes",
  mocktail: "Mocktails",
  jam: "Jams",
  "tin-items": "Tin Items",
  toppings: "Toppings",
  sauces: "Sauces",
  mayo: "Mayo & Dressings",
  seasoning: "Seasoning",
};

export const getCategoryColor = (cat: ProductCategory): string => {
  const vegCats: ProductCategory[] = ["veg", "general", "veg-snacks", "dairy", "crushes", "mocktail", "jam", "tin-items", "toppings", "sauces", "mayo", "seasoning"];
  return vegCats.includes(cat)
    ? "bg-secondary text-secondary-foreground"
    : "bg-accent text-accent-foreground";
};

// Keep empty default export for backward compat during migration
const products: Product[] = [];
export default products;
