import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Award, ShoppingCart, Package } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

const mobileLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Bulk Orders / B2B", path: "/bulk-orders" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  const { totalItems, totalPrice } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${isActive(path) ? "text-primary" : "text-foreground/80"}`;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
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
              href="https://wa.me/919999999999?text=Hi%20Mr.Pitani,%20I%20want%20to%20enquire%20about%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--whatsapp))] px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Mobile: Cart + Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 text-foreground">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Full-Screen Overlay ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-card border-l border-border shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="text-lg font-bold text-foreground">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="flex flex-col gap-1">
                  {mobileLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(link.path)
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Expandable product sub-links */}
                  <button
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setProductsOpen(!productsOpen)}
                  >
                    Browse Categories
                    <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {productsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 border-l-2 border-primary/20 ml-4"
                      >
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-2 mb-1 px-3">Veg</p>
                        {vegSubcategories.map(s => (
                          <Link key={s.path} to={s.path} className="block px-3 py-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                            {s.label}
                          </Link>
                        ))}
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-3 mb-1 px-3">Non-Veg</p>
                        {nonVegSubcategories.map(s => (
                          <Link key={s.path} to={s.path} className="block px-3 py-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                            {s.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA at bottom */}
              <div className="px-5 py-4 border-t border-border">
                <Link
                  to="/bulk-orders"
                  className="flex items-center justify-center gap-2 w-full rounded-xl hero-gradient py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02]"
                >
                  <Package className="h-4 w-4" /> Place Bulk Order
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
