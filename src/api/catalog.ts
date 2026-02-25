import { supabase } from "@/lib/supabase";

export type ProductCategory =
  | "veg"
  | "non-veg"
  | "general"
  | "veg-snacks"
  | "non-veg-snacks";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;         // final public url
  products: string[];   // optional
}

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
  brand?: string;       // brand name
  price: number;
  image?: string;       // final public url
}

// helper: convert storage path -> public URL
const publicUrl = (path?: string | null) => {
  if (!path) return "";
  return supabase.storage.from("catalog").getPublicUrl(path).data.publicUrl;
};

export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("id,name,slug,logo_path,products")
    .order("name");

  if (error) throw error;

  return (data ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: publicUrl(b.logo_path),
    products: b.products ?? [],
  }));
}

export async function fetchProducts(): Promise<Product[]> {
  // join brand name
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,name,category,type,storage,prep,order,
      pack_sizes,bulk_available,price,image_path,
      brands:brand_id ( name )
    `)
    .order("name");

  if (error) throw error;

  return (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    type: p.type,
    storage: p.storage,
    prep: p.prep,
    order: p.order,
    packSizes: p.pack_sizes ?? [],
    bulkAvailable: !!p.bulk_available,
    price: Number(p.price ?? 0),
    brand: p.brands?.name ?? undefined,
    image: publicUrl(p.image_path),
  }));
}