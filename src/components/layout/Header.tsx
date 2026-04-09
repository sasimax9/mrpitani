import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Award, ShoppingCart, Package, User, LogOut, Settings, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import AuthDialog from "@/components/AuthDialog";

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
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const { totalItems, totalPrice } = useCart();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${isActive(path) ? "text-primary" : "text-foreground/80"}`;

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || user?.phone || "User";

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg hero-gradient">
              <span className="text-base sm:text-lg font-extrabold text-primary-foreground">M</span>
            </div>
            <div className="leading-tight">
              <span className="text-base sm:text-lg font-bold text-foreground">Mr.Pitani</span>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-none hidden sm:block">Fresh. Frozen. Fast Delivery.</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            <Link to="/" className={navLinkClass("/")}>Home</Link>
            <Link to="/about" className={navLinkClass("/about")}>About</Link>

            <div className="relative group">
              <button className={`${navLinkClass("/products")} flex items-center gap-1`}>
                Products <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="glass-dropdown rounded-2xl p-5 min-w-[440px] grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-secondary inline-block" /> Veg
                    </p>
                    {vegSubcategories.map((s) => (
                      <Link key={s.path} to={s.path} className="block py-1.5 text-sm text-foreground/80 hover:text-primary transition-colors">{s.label}</Link>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-accent inline-block" /> Non-Veg
                    </p>
                    {nonVegSubcategories.map((s) => (
                      <Link key={s.path} to={s.path} className="block py-1.5 text-sm text-foreground/80 hover:text-primary transition-colors">{s.label}</Link>
                    ))}
                  </div>
                  <div className="col-span-2 border-t border-border pt-3">
                    <Link to="/products" className="text-sm font-semibold text-primary hover:underline">View All Products →</Link>
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

          {/* Cart + Auth */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <div className="h-6 w-6 rounded-full hero-gradient flex items-center justify-center">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-xs max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="glass-dropdown rounded-2xl p-2 min-w-[180px] space-y-0.5">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email || user.phone}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                      <Settings className="h-3.5 w-3.5 text-muted-foreground" /> My Profile
                    </Link>
                    <Link to="/cart" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                      <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" /> My Orders
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4" /> Login
              </button>
            )}

            <Link to="/cart" className="relative flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
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
              className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--whatsapp))] px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Mobile: Auth + Cart + Toggle */}
          <div className="flex lg:hidden items-center gap-0.5">
            {user ? (
              <button onClick={() => setMobileOpen(true)} className="p-2 text-foreground">
                <div className="h-7 w-7 rounded-full hero-gradient flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              </button>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="p-2 text-foreground">
                <User className="h-5 w-5" />
              </button>
            )}
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

      {/* Mobile Full-Screen Overlay - NO framer-motion */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          <nav className="absolute top-0 right-0 h-full w-[80%] max-w-xs glass-strong border-l border-border/30 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-base font-bold text-foreground">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            {user && (
              <div className="px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full hero-gradient flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email || user.phone}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="flex flex-col gap-0.5">
                {mobileLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(link.path) ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setProductsOpen(!productsOpen)}
                >
                  Browse Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                </button>
                {productsOpen && (
                  <div className="pl-3 border-l-2 border-primary/20 ml-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-2 mb-1 px-3">Veg</p>
                    {vegSubcategories.map(s => (
                      <Link key={s.path} to={s.path} className="block px-3 py-1.5 text-sm text-foreground/80 hover:text-primary transition-colors">{s.label}</Link>
                    ))}
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-3 mb-1 px-3">Non-Veg</p>
                    {nonVegSubcategories.map(s => (
                      <Link key={s.path} to={s.path} className="block px-3 py-1.5 text-sm text-foreground/80 hover:text-primary transition-colors">{s.label}</Link>
                    ))}
                  </div>
                )}

                {user && (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors mt-2">
                      <Settings className="h-4 w-4" /> My Profile
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="px-4 py-3 border-t border-border">
              <Link
                to="/bulk-orders"
                className="flex items-center justify-center gap-2 w-full rounded-xl hero-gradient py-3 text-sm font-bold text-primary-foreground shadow-lg"
              >
                <Package className="h-4 w-4" /> Place Bulk Order
              </Link>
            </div>
          </nav>
        </div>
      )}

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Header;
