import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/api/catalog";
import type { Brand } from "@/api/catalog";
import { fetchBrands, fetchProducts } from "@/api/catalog";

type CatalogState = {
  products: Product[];
  brands: Brand[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogState | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, b] = await Promise.all([fetchProducts(), fetchBrands()]);
      setProducts(p);
      setBrands(b);
    } catch (e: any) {
      setError(e?.message || "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  //const value = useMemo(() => ({ products, brands, loading, error, refresh }), [products, brands, loading, error]);
  const value = useMemo(
  () => ({ products, brands, loading, error, refresh }),
  [products, brands, loading, error]
);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}