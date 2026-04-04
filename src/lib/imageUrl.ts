const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = "product-images";

/** Build a public Supabase storage URL for a product image path */
export function getProductImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  // Already a full URL
  if (imagePath.startsWith("http")) return imagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${imagePath}`;
}

/** Placeholder gradient for products without images */
const PLACEHOLDER_COLORS: Record<string, string> = {
  veg: "from-emerald-200 to-green-300",
  "non-veg": "from-orange-200 to-red-300",
  general: "from-blue-200 to-cyan-300",
  "veg-snacks": "from-lime-200 to-emerald-300",
  "non-veg-snacks": "from-amber-200 to-orange-300",
};

export function getCategoryPlaceholderClass(category: string): string {
  return PLACEHOLDER_COLORS[category] || "from-slate-200 to-slate-300";
}

/** Category fallback mapping to Supabase storage */
export function getCategoryImageUrl(category: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/categories/${category}.jpg`;
}
