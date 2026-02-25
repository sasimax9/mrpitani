import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { categoryLabels, type ProductCategory } from "@/data/products";
import type { Product as UiProduct } from "@/data/products";
import type { Product as ApiProduct } from "@/api/catalog";
import { useCatalog } from "@/contexts/CatalogContext";

const nonVegCategories: ProductCategory[] = ["non-veg", "non-veg-snacks"];
const toUiProduct = (p: ApiProduct): UiProduct => {
  return {
    id: p.id,
    name: p.name,
    category: p.category as ProductCategory,
    type: p.type as "veg" | "non-veg",
    storage: p.storage as "frozen" | "non-frozen",
    prep: p.prep as "raw" | "ready-to-cook",
    order: p.order as "bulk" | "retail" | "both",
    packSizes: Array.isArray((p as any).packSizes)
      ? (p as any).packSizes
      : (p as any).pack_sizes ?? [],
    bulkAvailable: (p as any).bulkAvailable ?? (p as any).bulk_available ?? false,
    brand: (p as any).brand ?? undefined,
    price: p.price ?? 0,
    //image must exist for your UI type (set placeholder if missing)
    image: (p as any).image ?? (p as any).image_url ?? "/placeholder.png",
  };
};

const NonVegProducts = () => {
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get("cat") as ProductCategory | null;
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<ProductCategory | "all">(
    initCat && nonVegCategories.includes(initCat) ? initCat : "all"
  );
  const [storageFilter, setStorageFilter] = useState<"all" | "frozen" | "non-frozen">("all");
  const [prepFilter, setPrepFilter] = useState<"all" | "raw" | "ready-to-cook">("all");
  const { products: apiProducts, loading, error } = useCatalog();

    const products: UiProduct[] = useMemo(() => {
      return (apiProducts || []).map(toUiProduct);
    }, [apiProducts]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.type !== "non-veg") return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (storageFilter !== "all" && p.storage !== storageFilter) return false;
      if (prepFilter !== "all" && p.prep !== prepFilter) return false;
      return true;
    });
  }, [search, catFilter, storageFilter, prepFilter]);

  const FilterBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
      {children}
    </button>
  );

  return (
    <Layout>
      <section className="bg-accent py-12">
        <div className="container">
          <h1 className="text-3xl font-extrabold text-accent-foreground mb-2">🔴 Non-Veg Products</h1>
          <p className="text-accent-foreground/80">Premium chicken, seafood, fish & frozen snacks</p>
        </div>
      </section>
      <section className="container py-8">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search non-veg products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterBtn active={catFilter === "all"} onClick={() => setCatFilter("all")}>All Non-Veg</FilterBtn>
          {nonVegCategories.map((cat) => (
            <FilterBtn key={cat} active={catFilter === cat} onClick={() => setCatFilter(cat)}>{categoryLabels[cat]}</FilterBtn>
          ))}
          <span className="w-px bg-border mx-1" />
          <FilterBtn active={storageFilter === "all"} onClick={() => setStorageFilter("all")}>All</FilterBtn>
          <FilterBtn active={storageFilter === "frozen"} onClick={() => setStorageFilter("frozen")}>❄️ Frozen</FilterBtn>
          <FilterBtn active={storageFilter === "non-frozen"} onClick={() => setStorageFilter("non-frozen")}>🌿 Fresh</FilterBtn>
          <span className="w-px bg-border mx-1" />
          <FilterBtn active={prepFilter === "all"} onClick={() => setPrepFilter("all")}>All</FilterBtn>
          <FilterBtn active={prepFilter === "raw"} onClick={() => setPrepFilter("raw")}>Raw</FilterBtn>
          <FilterBtn active={prepFilter === "ready-to-cook"} onClick={() => setPrepFilter("ready-to-cook")}>Ready-to-Cook</FilterBtn>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} products</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16"><p className="text-lg font-semibold text-muted-foreground">No products found</p></div>
        )}
      </section>
    </Layout>
  );
};

export default NonVegProducts;
