import { type Product, categoryLabels, getCategoryColor } from "@/data/products";
import { MessageCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const whatsappMsg = encodeURIComponent(
    `Hi Mr.Pitani, I'd like to enquire about: ${product.name} (Pack sizes: ${product.packSizes.join(", ")})`
  );

  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">{product.type === "veg" ? "🥬" : "🍗"}</span>
            </div>
            <p className="text-xs text-muted-foreground">Product Image</p>
          </div>
        </div>
        {/* Category badge */}
        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryColor(product.category)}`}>
          {categoryLabels[product.category]}
        </span>
        {product.bulkAvailable && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
            Bulk Available
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.packSizes.map((s) => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
              {s}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/919999999999?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-whatsapp py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <Link
            to={`/contact?product=${encodeURIComponent(product.name)}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-primary py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <FileText className="h-3.5 w-3.5" /> Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
