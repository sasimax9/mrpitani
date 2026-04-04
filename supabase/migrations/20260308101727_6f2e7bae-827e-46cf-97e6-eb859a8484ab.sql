
-- Junction table for multi-brand pricing per product
CREATE TABLE public.product_brand_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL DEFAULT 0,
  UNIQUE(product_id, brand_id)
);

ALTER TABLE public.product_brand_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product brand variants are publicly readable" ON public.product_brand_variants FOR SELECT USING (true);

CREATE INDEX idx_pbv_product ON public.product_brand_variants(product_id);
CREATE INDEX idx_pbv_brand ON public.product_brand_variants(brand_id);
