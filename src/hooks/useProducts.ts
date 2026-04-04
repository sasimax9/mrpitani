import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductCategory, BrandVariant } from "@/data/products";

interface DbProduct {
  id: string;
  name: string;
  category: string;
  type: string | null;
  storage: string | null;
  prep: string | null;
  order: string;
  pack_sizes: string[] | null;
  bulk_available: boolean;
  price: number;
  brand_id: string | null;
  image_path: string | null;
  brands?: { id: string; name: string } | null;
}

interface DbBrandVariant {
  product_id: string;
  brand_id: string;
  price: number;
  brands: { id: string; name: string };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Fetch products and brand variants in parallel
      const [productsRes, variantsRes] = await Promise.all([
        supabase.from("products").select("*, brands(id, name)").order("name"),
        supabase.from("product_brand_variants").select("product_id, brand_id, price, brands(id, name)"),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (variantsRes.error) throw variantsRes.error;

      // Group variants by product_id
      const variantMap = new Map<string, BrandVariant[]>();
      for (const v of (variantsRes.data as unknown as DbBrandVariant[])) {
        if (!v.brands) continue;
        const list = variantMap.get(v.product_id) || [];
        list.push({ brand: v.brands.name, price: Number(v.price) });
        variantMap.set(v.product_id, list);
      }

      return (productsRes.data as unknown as DbProduct[]).map((p): Product => {
        const variants = variantMap.get(p.id);
        return {
          id: p.id,
          name: p.name,
          category: (p.category || "general") as ProductCategory,
          type: (p.type === "non-veg" ? "non-veg" : "veg") as "veg" | "non-veg",
          storage: (p.storage === "non-frozen" ? "non-frozen" : "frozen") as "frozen" | "non-frozen",
          prep: (p.prep as "raw" | "ready-to-cook") || null,
          order: (p.order || "both") as "bulk" | "retail" | "both",
          packSizes: (p.pack_sizes || []).filter(s => s && s.length > 0),
          bulkAvailable: p.bulk_available,
          price: Number(p.price) || 0,
          brand: p.brands?.name,
          imagePath: p.image_path,
          brandVariants: variants && variants.length > 0 ? variants : undefined,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
