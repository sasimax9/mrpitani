
-- Create brands table
CREATE TABLE public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  products TEXT[] DEFAULT '{}'
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are publicly readable" ON public.brands FOR SELECT USING (true);

-- Create products table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  type TEXT DEFAULT 'veg',
  storage TEXT DEFAULT 'frozen',
  prep TEXT DEFAULT 'raw',
  "order" TEXT NOT NULL DEFAULT 'both',
  pack_sizes TEXT[] DEFAULT '{}',
  bulk_available BOOLEAN NOT NULL DEFAULT false,
  price NUMERIC NOT NULL DEFAULT 0,
  brand_id TEXT REFERENCES public.brands(id),
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_brand ON public.products(brand_id);
