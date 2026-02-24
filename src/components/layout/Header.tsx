import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown, Award, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const vegSubcategories = [
  { label: "All Veg Products", path: "/products/veg" },
  { label: "Veg Chicken / Mutton / Fish", path: "/products/veg?cat=veg" },
  { label: "General Items", path: "/products/veg?cat=general" },
  { label: "Veg Snacks", path: "/products/veg?cat=veg-snacks" },
];

const nonVegSubcategories = [
  { label: "All Non-Veg Products", path: "/products/non-veg" },
  { label: "Prawns / Seafood / Fish", path: "/products/non-veg?cat=non-veg" },
  { label: "Non-Veg Snacks", path: "/products/non-veg?cat=non-veg-snacks" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  const { totalItems, totalPrice } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${isActive(path) ? "text-primary" : "text-foreground/80"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
            <span className="text-lg font-extrabold text-primary-foreground">M</span>
          </div>
          <div className="leading-tight">
            <span className="text-lg font-bold text-foreground">Mr.Pitani</span>
            <p className="text-[10px] text-muted-foreground leading-none">Fresh. Frozen. Fast Delivery.</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/about" className={navLinkClass("/about")}>About</Link>

          {/* Products dropdown */}
          <div className="relative group">
            <button className={`${navLinkClass("/products")} flex items-center gap-1`}>
              Products <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-card rounded-xl border border-border card-shadow p-4 min-w-[420px] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-secondary inline-block" /> Veg
                  </p>
                  {vegSubcategories.map((s) => (
                    <Link key={s.path} to={s.path} className="block py-1.5 text-sm text-foreground/80 hover:text-primary transition-colors">
                      {s.label}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent inline-block" /> Non-Veg
                  </p>
                  {nonVegSubcategories.map((s) => (
                    <Link key={s.path} to={s.path} className="block py-1.5 text-sm text-foreground/80 hover:text-primary transition-colors">
                      {s.label}
                    </Link>
                  ))}
                </div>
                <div className="col-span-2 border-t border-border pt-3">
                  <Link to="/products" className="text-sm font-semibold text-primary hover:underline">
                    View All Products →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/brands" className={`${navLinkClass("/brands")} flex items-center gap-1`}>
            <Award className="h-3.5 w-3.5" /> Brands
          </Link>
          <Link to="/services" className={navLinkClass("/services")}>Services</Link>
          <Link to="/bulk-orders" className={navLinkClass("/bulk-orders")}>Bulk Orders</Link>
          <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>
        </nav>

        {/* Cart + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/cart" className="relative flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <>
                <span className="text-xs font-bold">₹{totalPrice.toFixed(0)}</span>
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              </>
            )}
          </Link>
          <a
            href="https://wa.me/918977775878?text=Hi%20Mr.Pitani,%20I%20want%20to%20enquire%20about%20your%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            WhatsApp Us
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 pb-4">
          <nav className="flex flex-col gap-1 py-2">
            <Link to="/" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/about" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>About</Link>
            <button
              className="flex items-center justify-between py-2 text-sm font-medium"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              Products <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
            </button>
            {productsOpen && (
              <div className="pl-4 flex flex-col gap-1 border-l-2 border-primary/20 ml-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase mt-1">Veg</p>
                {vegSubcategories.map((s) => (
                  <Link key={s.path} to={s.path} className="py-1 text-sm text-foreground/80" onClick={() => setMobileOpen(false)}>
                    {s.label}
                  </Link>
                ))}
                <p className="text-xs font-semibold text-muted-foreground uppercase mt-2">Non-Veg</p>
                {nonVegSubcategories.map((s) => (
                  <Link key={s.path} to={s.path} className="py-1 text-sm text-foreground/80" onClick={() => setMobileOpen(false)}>
                    {s.label}
                  </Link>
                ))}
                <Link to="/products" className="py-1 text-sm font-semibold text-primary" onClick={() => setMobileOpen(false)}>
                  View All Products →
                </Link>
              </div>
            )}
            <Link to="/brands" className="py-2 text-sm font-medium flex items-center gap-1" onClick={() => setMobileOpen(false)}>
              <Award className="h-3.5 w-3.5" /> Brands
            </Link>
            <Link to="/services" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link to="/bulk-orders" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Bulk Orders</Link>
            <Link to="/contact" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
