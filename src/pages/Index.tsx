import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Truck, ShieldCheck, Snowflake, Clock, ChevronRight, Star, Award, ChevronLeft, Sparkles, Leaf, Fish, Package, Cookie, Drumstick, Box } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts, useBrands } from "@/hooks/useProducts";
import heroBg from "@/assets/hero-bg.jpg";

const heroSlides = [
  { tag: "🔥 Limited Time Offer", title: "Flat 15% Off on Bulk Orders 30kg+", desc: "Stock up your kitchen with premium frozen foods. Free delivery on orders above ₹5,000.", cta: { label: "Shop Now", path: "/products" }, cta2: { label: "Bulk Enquiry", path: "/bulk-orders" } },
  { tag: "🧊 New Arrivals", title: "Fresh Seafood Collection", desc: "Prawns, Vanjaram, Pomfret & more – sourced daily and delivered frozen to your door.", cta: { label: "View Seafood", path: "/products/non-veg" }, cta2: { label: "WhatsApp Order", path: "https://wa.me/918977775878" } },
  { tag: "🥟 Snack Season", title: "Party Snacks Starting ₹90", desc: "Samosas, nuggets, rolls, momos – everything you need for the perfect party spread.", cta: { label: "Explore Snacks", path: "/products/veg?cat=veg-snacks" }, cta2: { label: "View All", path: "/products" } },
  { tag: "🏪 For Businesses", title: "B2B Supply for Hotels & Restaurants", desc: "Scheduled deliveries, cold chain logistics, and competitive bulk pricing for your business.", cta: { label: "Partner With Us", path: "/bulk-orders" }, cta2: { label: "Our Brands", path: "/brands" } },
];

const categories = [
  { label: "Veg", icon: Leaf, path: "/products/veg", desc: "Veg chicken, mutton & more", color: "bg-secondary/10 text-secondary" },
  { label: "Non-Veg", icon: Fish, path: "/products/non-veg", desc: "Prawns, fish, chicken", color: "bg-accent/10 text-accent" },
  { label: "General", icon: Package, path: "/products/veg?cat=general", desc: "Paneer, ghee, corn & more", color: "bg-primary/10 text-primary" },
  { label: "Veg Snacks", icon: Cookie, path: "/products/veg?cat=veg-snacks", desc: "Samosa, nuggets, fries", color: "bg-secondary/10 text-secondary" },
  { label: "Non-Veg Snacks", icon: Drumstick, path: "/products/non-veg?cat=non-veg-snacks", desc: "Chicken nuggets & rolls", color: "bg-accent/10 text-accent" },
  { label: "All Products", icon: Box, path: "/products", desc: "Browse everything", color: "bg-primary/10 text-primary" },
];

const TOP_IDS = ["v-1", "nv-1", "g-1", "vs-1", "nvs-1", "nv-11", "vs-17", "g-5"];

const features = [
  { icon: ShieldCheck, title: "Quality Assured", desc: "FSSAI certified, hygienically packed" },
  { icon: Snowflake, title: "Cold Chain Intact", desc: "Temperature-controlled from source to door" },
  { icon: Truck, title: "Fast Delivery", desc: "Same-day & next-day delivery available" },
  { icon: Clock, title: "Bulk Ready", desc: "Large orders fulfilled within 24 hours" },
];

const testimonials = [
  { name: "Chef Rajan", role: "Hotel Spice Garden", text: "Mr.Pitani supplies the freshest seafood and chicken for our kitchen. Reliable and consistent quality." },
  { name: "Priya Sharma", role: "Home Cook", text: "Love their frozen veg range – momos, parathas, everything arrives perfectly frozen." },
  { name: "Arif Khan", role: "Restaurant Owner", text: "Best bulk pricing in the region. Their cold storage logistics is top-notch." },
];

const Index = () => {
  const { data: products = [] } = useProducts();
  const { data: brands = [] } = useBrands();
  const topSelling = useMemo(() => products.filter(p => TOP_IDS.includes(p.id)), [products]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover scale-105" />
          <div className="absolute inset-0 hero-gradient opacity-[0.92]" />
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary-foreground/90 border border-primary-foreground/10">
              <Sparkles className="h-3.5 w-3.5" /> {slide.tag}
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] text-primary-foreground md:text-6xl tracking-tight">{slide.title}</h1>
            <p className="mt-5 text-lg text-primary-foreground/75 max-w-lg leading-relaxed">{slide.desc}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to={slide.cta.path} className="group inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-3.5 font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:brightness-110">
                {slide.cta.label} <ChevronRight className="h-4 w-4" />
              </Link>
              {slide.cta2.path.startsWith("http") ? (
                <a href={slide.cta2.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary-foreground/20 px-7 py-3.5 font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 backdrop-blur-sm">{slide.cta2.label}</a>
              ) : (
                <Link to={slide.cta2.path} className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary-foreground/20 px-7 py-3.5 font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 backdrop-blur-sm">{slide.cta2.label}</Link>
              )}
            </div>
          </div>
          <div className="mt-12 flex items-center gap-3">
            <button onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)} className="h-9 w-9 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/10">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-accent" : "w-2 bg-primary-foreground/25 hover:bg-primary-foreground/40"}`} />
              ))}
            </div>
            <button onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)} className="h-9 w-9 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/10">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <span className="h-px w-6 bg-primary/40" /> Categories <span className="h-px w-6 bg-primary/40" />
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground mt-2">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link key={c.label} to={c.path} className="group flex flex-col items-center gap-3 rounded-2xl p-6 text-center glass-card transition-colors duration-200 hover:bg-muted/50">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.color} transition-transform duration-200 group-hover:scale-110`}>
                <c.icon className="h-6 w-6" />
              </div>
              <span className="font-bold text-sm text-foreground">{c.label}</span>
              <span className="text-[11px] text-muted-foreground leading-relaxed">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Selling */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-muted/40" />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
                <Star className="h-3.5 w-3.5 fill-primary" /> Best Sellers
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Top Selling Products</h2>
              <p className="text-muted-foreground text-sm mt-2">Click any product to discover its recipe</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topSelling.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Link to="/products" className="flex sm:hidden items-center justify-center gap-1.5 mt-8 text-sm font-bold text-primary">
            View All Products <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Brands */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              <Award className="h-3.5 w-3.5" /> Trusted Partners
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Authorized Distributor</h2>
          </div>
          <Link to="/brands" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {brands.slice(0, 16).map((brand) => (
            <Link key={brand.id} to="/brands" className="group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center glass-card transition-colors duration-200 hover:bg-muted/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 group-hover:bg-primary/15 transition-colors">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-[11px] text-foreground leading-tight">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <span className="h-px w-6 bg-primary/40" /> Why Us <span className="h-px w-6 bg-primary/40" />
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Why Choose Mr.Pitani?</h2>
          <p className="text-muted-foreground mt-2">Quality you can trust, prices you'll love</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group flex flex-col items-center text-center rounded-2xl p-8 glass-card transition-colors duration-200 hover:bg-muted/50">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl hero-gradient shadow-lg shadow-primary/15">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Coverage */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative text-center text-primary-foreground py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Delivery Across India</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-10 leading-relaxed">
            We deliver frozen and raw food within a 500km radius of our cold storage hubs.
          </p>
          <div className="grid gap-5 sm:grid-cols-3 max-w-2xl mx-auto">
            {[{ val: "500+", label: "Pin Codes Served" }, { val: "24hrs", label: "Bulk Order Fulfillment" }, { val: "-18°C", label: "Cold Chain Maintained" }].map((s) => (
              <div key={s.val} className="rounded-2xl glass-card p-6 hover:bg-primary-foreground/[0.12] transition-colors">
                <p className="text-4xl font-extrabold tracking-tight">{s.val}</p>
                <p className="text-sm text-primary-foreground/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <span className="h-px w-6 bg-primary/40" /> Testimonials <span className="h-px w-6 bg-primary/40" />
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">What Our Customers Say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl glass-card p-6 transition-colors duration-200 hover:bg-muted/50">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="font-bold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl hero-gradient p-8 md:p-14 text-center relative overflow-hidden">
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground mb-4">Ready to Order?</h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">Browse our complete range of products or reach out for bulk pricing.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-3.5 font-bold text-accent-foreground shadow-lg transition-colors hover:brightness-110">
              Browse Products <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary-foreground/20 px-7 py-3.5 font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 backdrop-blur-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
