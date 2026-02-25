// src/pages/Products.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";

import { useCatalog } from "@/contexts/CatalogContext";

// ✅ IMPORTANT: keep these types/labels in ONE place used by both UI + API
// If you already have them in /api/catalog, import from there instead.
import { categoryLabels, type ProductCategory } from "@/data/products";

// If your ProductCard expects Product from "@/data/products" and API Product differs,
// fix by aligning types (recommended) OR use the adapter below.
import type { Product as UiProduct } from "@/data/products";
import type { Product as ApiProduct } from "@/api/catalog";

const allCategories = Object.keys(categoryLabels) as ProductCategory[];

//Adapter (only needed if API product type is not exactly same as UI Product)
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

const Products = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ use CatalogContext (single source of truth)
  const { products: apiProducts, loading, error } = useCatalog();

  // FILTERS
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [storageFilter, setStorageFilter] = useState<"all" | "frozen" | "non-frozen">("all");
  const [prepFilter, setPrepFilter] = useState<"all" | "raw" | "ready-to-cook">("all");
  const [orderFilter, setOrderFilter] = useState<"all" | "bulk" | "retail">("all");
  const [catFilter, setCatFilter] = useState<ProductCategory | "all">("all");

  // ✅ Sync route -> filters (fix for header navigation)
  useEffect(() => {
    const path = location.pathname;

    // supports /products/veg, /products/non-veg (and subpaths)
    const nextType: "all" | "veg" | "non-veg" =
      path.startsWith("/products/veg") ? "veg" : path.startsWith("/products/non-veg") ? "non-veg" : "all";

    const cat = (searchParams.get("cat") as ProductCategory) || "all";

    setTypeFilter(nextType);
    setCatFilter(cat);
  }, [location.pathname, searchParams]);

  // Normalize API products -> UI products for ProductCard
  const products: UiProduct[] = useMemo(() => {
    return (apiProducts || []).map(toUiProduct);
  }, [apiProducts]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (storageFilter !== "all" && p.storage !== storageFilter) return false;
      if (prepFilter !== "all" && p.prep !== prepFilter) return false;
      if (orderFilter !== "all" && p.order !== orderFilter && p.order !== "both") return false;
      if (catFilter !== "all" && p.category !== catFilter) return false;
      return true;
    });
  }, [products, search, typeFilter, storageFilter, prepFilter, orderFilter, catFilter]);

  const FilterBtn = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );

  const setCategory = (cat: ProductCategory | "all") => {
    setCatFilter(cat);

    // keep URL in sync (so header + back button work)
    const next = new URLSearchParams(searchParams);
    if (cat === "all") next.delete("cat");
    else next.set("cat", cat);
    setSearchParams(next, { replace: true });
  };

  return (
    <Layout>
      <section className="hero-gradient py-12">
        <div className="container">
          <h1 className="text-3xl font-extrabold text-primary-foreground mb-2">All Products</h1>
          <p className="text-primary-foreground/70">Browse our complete range of raw & frozen food products</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <FilterBtn active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
            All
          </FilterBtn>
          <FilterBtn active={typeFilter === "veg"} onClick={() => setTypeFilter("veg")}>
            🟢 Veg
          </FilterBtn>
          <FilterBtn active={typeFilter === "non-veg"} onClick={() => setTypeFilter("non-veg")}>
            🔴 Non-Veg
          </FilterBtn>

          <span className="w-px bg-border mx-1" />

          <FilterBtn active={storageFilter === "all"} onClick={() => setStorageFilter("all")}>
            All Storage
          </FilterBtn>
          <FilterBtn active={storageFilter === "frozen"} onClick={() => setStorageFilter("frozen")}>
            ❄️ Frozen
          </FilterBtn>
          <FilterBtn active={storageFilter === "non-frozen"} onClick={() => setStorageFilter("non-frozen")}>
            🌿 Non-Frozen
          </FilterBtn>

          <span className="w-px bg-border mx-1" />

          <FilterBtn active={prepFilter === "all"} onClick={() => setPrepFilter("all")}>
            All Prep
          </FilterBtn>
          <FilterBtn active={prepFilter === "raw"} onClick={() => setPrepFilter("raw")}>
            Raw
          </FilterBtn>
          <FilterBtn active={prepFilter === "ready-to-cook"} onClick={() => setPrepFilter("ready-to-cook")}>
            Ready-to-Cook
          </FilterBtn>

          <span className="w-px bg-border mx-1" />

          <FilterBtn active={orderFilter === "all"} onClick={() => setOrderFilter("all")}>
            All Orders
          </FilterBtn>
          <FilterBtn active={orderFilter === "bulk"} onClick={() => setOrderFilter("bulk")}>
            Bulk
          </FilterBtn>
          <FilterBtn active={orderFilter === "retail"} onClick={() => setOrderFilter("retail")}>
            Retail
          </FilterBtn>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <FilterBtn active={catFilter === "all"} onClick={() => setCategory("all")}>
            All Categories
          </FilterBtn>
          {allCategories.map((cat) => (
            <FilterBtn key={cat} active={catFilter === cat} onClick={() => setCategory(cat)}>
              {categoryLabels[cat]}
            </FilterBtn>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground mb-4">Loading products…</p>
        ) : error ? (
          <p className="text-sm text-destructive mb-4">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} products found</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={`${p.id}`} product={p} />
          ))}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-semibold text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Products;