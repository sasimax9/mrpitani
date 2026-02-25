export type ProductCategory =
  | "veg"
  | "non-veg"
  | "general"
  | "veg-snacks"
  | "non-veg-snacks";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  type: "veg" | "non-veg";
  storage: "frozen" | "non-frozen";
  prep: "raw" | "ready-to-cook";
  order: "bulk" | "retail" | "both";
  packSizes: string[];
  bulkAvailable: boolean;
  brand?: string;
  price: number; // price per pack in INR
  image?: string;
}

export const categoryLabels: Record<ProductCategory, string> = {
  veg: "Veg",
  "non-veg": "Non-Veg",
  general: "General Items",
  "veg-snacks": "Veg Snacks",
  "non-veg-snacks": "Non-Veg Snacks",
};

export const getCategoryColor = (cat: ProductCategory): string => {
  const vegCats: ProductCategory[] = ["veg", "general", "veg-snacks"];
  return vegCats.includes(cat)
    ? "bg-secondary text-secondary-foreground"
    : "bg-accent text-accent-foreground";
};



const products: Product[] = [];

export default products;
