import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import products, { categoryLabels, type ProductCategory } from "@/data/products";

const allCategories = Object.keys(categoryLabels) as ProductCategory[];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [storageFilter, setStorageFilter] = useState<"all" | "frozen" | "non-frozen">("all");
  const [prepFilter, setPrepFilter] = useState<"all" | "raw" | "ready-to-cook">("all");
  const [orderFilter, setOrderFilter] = useState<"all" | "bulk" | "retail">("all");
  const [catFilter, setCatFilter] = useState<ProductCategory | "all">(
    (searchParams.get("cat") as ProductCategory) || "all"
  );

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
  }, [search, typeFilter, storageFilter, prepFilter, orderFilter, catFilter]);

  const FilterBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );

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
          <FilterBtn active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>All</FilterBtn>
          <FilterBtn active={typeFilter === "veg"} onClick={() => setTypeFilter("veg")}>🟢 Veg</FilterBtn>
          <FilterBtn active={typeFilter === "non-veg"} onClick={() => setTypeFilter("non-veg")}>🔴 Non-Veg</FilterBtn>
          <span className="w-px bg-border mx-1" />
          <FilterBtn active={storageFilter === "all"} onClick={() => setStorageFilter("all")}>All Storage</FilterBtn>
          <FilterBtn active={storageFilter === "frozen"} onClick={() => setStorageFilter("frozen")}>❄️ Frozen</FilterBtn>
          <FilterBtn active={storageFilter === "non-frozen"} onClick={() => setStorageFilter("non-frozen")}>🌿 Non-Frozen</FilterBtn>
          <span className="w-px bg-border mx-1" />
          <FilterBtn active={prepFilter === "all"} onClick={() => setPrepFilter("all")}>All Prep</FilterBtn>
          <FilterBtn active={prepFilter === "raw"} onClick={() => setPrepFilter("raw")}>Raw</FilterBtn>
          <FilterBtn active={prepFilter === "ready-to-cook"} onClick={() => setPrepFilter("ready-to-cook")}>Ready-to-Cook</FilterBtn>
          <span className="w-px bg-border mx-1" />
          <FilterBtn active={orderFilter === "all"} onClick={() => setOrderFilter("all")}>All Orders</FilterBtn>
          <FilterBtn active={orderFilter === "bulk"} onClick={() => setOrderFilter("bulk")}>Bulk</FilterBtn>
          <FilterBtn active={orderFilter === "retail"} onClick={() => setOrderFilter("retail")}>Retail</FilterBtn>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <FilterBtn active={catFilter === "all"} onClick={() => setCatFilter("all")}>All Categories</FilterBtn>
          {allCategories.map((cat) => (
            <FilterBtn key={cat} active={catFilter === cat} onClick={() => setCatFilter(cat)}>
              {categoryLabels[cat]}
            </FilterBtn>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} products found</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
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
