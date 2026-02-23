import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import brands, { type Brand } from "@/data/brands";

const Brands = () => {
  const [selected, setSelected] = useState<Brand | null>(null);

  return (
    <Layout>
      <section className="hero-gradient py-12">
        <div className="container">
          <h1 className="text-3xl font-extrabold text-primary-foreground mb-2">
            Authorized Distributors
          </h1>
          <p className="text-primary-foreground/70">
            We are proud authorized distributors of India's leading food brands
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelected(brand)}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
            >
              {/* Logo */}
              <div className="flex h-14 w-14 items-center justify-center bg-white border border-border overflow-hidden">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-[1.8rem] w-auto object-contain"
                  loading="lazy"
                />
              </div>

              <h3 className="font-semibold text-foreground text-sm">
                {brand.name}
              </h3>
              <span className="text-xs text-primary font-medium">
                View Products →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 card-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="text-center mb-6">
              {/* Modal Logo */}
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-white border border-border overflow-hidden mb-3">
                <img
                  src={selected.logo}
                  alt={`${selected.name} logo`}
                  className="h-[1.8rem] w-auto object-contain"
                  loading="lazy"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">
                {selected.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Authorized Distributor
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="rounded-xl border border-border bg-white p-4">
                <QRCodeSVG
                  value={`${window.location.origin}/brands?brand=${selected.slug}`}
                  size={160}
                  level="M"
                />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mb-4">
              Scan to view product list
            </p>

            {/* Product List */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Products Available
              </h3>
              <ul className="space-y-1.5">
                {selected.products.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Brands;