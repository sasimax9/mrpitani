import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ShieldCheck, Snowflake, Clock, ChevronRight, Star, Award, ChevronLeft, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
// import products from "@/data/products";
// import brands from "@/data/brands";
import heroBg from "@/assets/hero-bg.jpg";
import { useCatalog } from "@/contexts/CatalogContext";

const heroSlides = [
  {
    tag: "🔥 Limited Time Offer",
    title: "Flat 15% Off on Bulk Orders 30kg+",
    desc: "Stock up your kitchen with premium frozen foods. Free delivery on orders above ₹5,000.",
    cta: { label: "Shop Now", path: "/products" },
    cta2: { label: "Bulk Enquiry", path: "/bulk-orders" },
  },
  {
    tag: "🧊 New Arrivals",
    title: "Fresh Seafood Collection",
    desc: "Prawns, Vanjaram, Pomfret & more – sourced daily and delivered frozen to your door.",
    cta: { label: "View Seafood", path: "/products/non-veg" },
    cta2: { label: "WhatsApp Order", path: "https://wa.me/919999999999" },
  },
  {
    tag: "🥟 Snack Season",
    title: "Party Snacks Starting ₹90",
    desc: "Samosas, nuggets, rolls, momos – everything you need for the perfect party spread.",
    cta: { label: "Explore Snacks", path: "/products/veg?cat=veg-snacks" },
    cta2: { label: "View All", path: "/products" },
  },
  {
    tag: "🏪 For Businesses",
    title: "B2B Supply for Hotels & Restaurants",
    desc: "Scheduled deliveries, cold chain logistics, and competitive bulk pricing for your business.",
    cta: { label: "Partner With Us", path: "/bulk-orders" },
    cta2: { label: "Our Brands", path: "/brands" },
  },
];

const categories = [
  { label: "Veg", emoji: "🥬", path: "/products/veg", desc: "Veg chicken, mutton & more" },
  { label: "Non-Veg", emoji: "🍗", path: "/products/non-veg", desc: "Prawns, fish, chicken" },
  { label: "General", emoji: "🧀", path: "/products/veg?cat=general", desc: "Paneer, ghee, corn & more" },
  { label: "Veg Snacks", emoji: "🥟", path: "/products/veg?cat=veg-snacks", desc: "Samosa, nuggets, fries" },
  { label: "Non-Veg Snacks", emoji: "🍗", path: "/products/non-veg?cat=non-veg-snacks", desc: "Chicken nuggets & rolls" },
  { label: "All Products", emoji: "📦", path: "/products", desc: "Browse everything" },
];



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

const itemVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, brands, loading, error } = useCatalog();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

    const topSelling = useMemo(
    () => products.filter((p) => ["v-1", "nv-1", "g-1", "vs-1", "nvs-1", "nv-11", "vs-17", "g-5"].includes(p.id)),
    [products]
  );
   

  const slide = heroSlides[currentSlide];

  return (
  <Layout>
    {/* Hero Carousel */}
    <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover scale-105" />
        <div className="absolute inset-0 hero-gradient opacity-[0.92]" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse at 30% 0%, hsl(192 80% 40% / 0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, hsl(160 45% 30% / 0.15) 0%, transparent 50%)"
        }} />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-primary-foreground/[0.03] blur-3xl" />
      <div className="absolute bottom-10 left-[10%] w-48 h-48 rounded-full bg-accent/[0.06] blur-2xl" />

      <div className="container relative py-20 md:py-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary-foreground/90 border border-primary-foreground/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {slide.tag}
            </motion.p>
            <h1 className="text-4xl font-extrabold leading-[1.1] text-primary-foreground md:text-6xl tracking-tight">
              {slide.title}
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/75 max-w-lg leading-relaxed">
              {slide.desc}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={slide.cta.path}
                className="group inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-3.5 font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-accent/30"
              >
                {slide.cta.label}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {slide.cta2.path.startsWith("http") ? (
                <a
                  href={slide.cta2.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary-foreground/20 px-7 py-3.5 font-bold text-primary-foreground transition-all hover:bg-primary-foreground/10 hover:border-primary-foreground/30 backdrop-blur-sm"
                >
                  {slide.cta2.label}
                </a>
              ) : (
                <Link
                  to={slide.cta2.path}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary-foreground/20 px-7 py-3.5 font-bold text-primary-foreground transition-all hover:bg-primary-foreground/10 hover:border-primary-foreground/30 backdrop-blur-sm"
                >
                  {slide.cta2.label}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="mt-12 flex items-center gap-3">
          <button onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)} className="h-9 w-9 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all border border-primary-foreground/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide ? "w-10 bg-accent shadow-sm shadow-accent/30" : "w-2 bg-primary-foreground/25 hover:bg-primary-foreground/40"}`}
              />
            ))}
          </div>
          <button onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)} className="h-9 w-9 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all border border-primary-foreground/10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>

    {/* Categories */}
    <motion.section
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="container py-20"
    >
      <motion.div variants={itemVariant} className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          <span className="h-px w-6 bg-primary/40" /> Categories <span className="h-px w-6 bg-primary/40" />
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Browse by Category</h2>
        <p className="text-muted-foreground mt-2">Find exactly what you're looking for</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((c) => (
          <motion.div key={c.label} variants={itemVariant}>
            <Link
              to={c.path}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1.5 hover:border-primary/20"
            >
              <div className="relative">
                <span className="text-4xl block group-hover:scale-110 transition-transform duration-300">{c.emoji}</span>
                <div className="absolute -inset-2 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <span className="font-bold text-sm text-foreground">{c.label}</span>
              <span className="text-[11px] text-muted-foreground leading-relaxed">{c.desc}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Top Selling */}
    <motion.section
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="relative py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-muted/40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative">
        <motion.div variants={itemVariant} className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              <Star className="h-3.5 w-3.5 fill-primary" /> Best Sellers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Top Selling Products</h2>
            <p className="text-muted-foreground text-sm mt-2">Click any product to discover its recipe</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors group">
            View All <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topSelling.map((p) => (
            <motion.div key={p.id} variants={itemVariant}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
        <Link to="/products" className="flex sm:hidden items-center justify-center gap-1.5 mt-8 text-sm font-bold text-primary">
          View All Products <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.section>

    {/* Authorized Brands */}
    <motion.section
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      className="container py-20"
    >
      <motion.div variants={itemVariant} className="flex items-end justify-between mb-12">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <Award className="h-3.5 w-3.5" /> Trusted Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Authorized Distributor</h2>
        </div>
        <Link to="/brands" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors group">
          View All <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {brands.slice(0, 16).map((brand) => (
          <motion.div key={brand.id} variants={itemVariant}>
            <Link
              to="/brands"
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-center card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-border overflow-hidden">
      {brand.logo ? (
        <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
      ) : (
        <Award className="h-5 w-5 text-primary" />
      )}
    </div>
              <span className="font-semibold text-[11px] text-foreground leading-tight">{brand.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Why Choose Us */}
    <motion.section
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="container py-20"
    >
      <motion.div variants={itemVariant} className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          <span className="h-px w-6 bg-primary/40" /> Why Us <span className="h-px w-6 bg-primary/40" />
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Why Choose Mr.Pitani?</h2>
        <p className="text-muted-foreground mt-2">Quality you can trust, prices you'll love</p>
      </motion.div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={itemVariant}
            className="group flex flex-col items-center text-center rounded-2xl border border-border bg-card p-8 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl hero-gradient shadow-lg shadow-primary/15 group-hover:scale-105 transition-transform">
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-foreground mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Delivery Coverage */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse at 20% 50%, hsl(192 80% 40% / 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, hsl(160 45% 30% / 0.15) 0%, transparent 40%)"
      }} />
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="container relative text-center text-primary-foreground py-20"
      >
        <motion.div variants={itemVariant}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Delivery Across India</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-10 leading-relaxed">
            We deliver frozen and raw food within a 500km radius of our cold storage hubs. Scheduled deliveries available for businesses.
          </p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-3 max-w-2xl mx-auto">
          {[
            { val: "500+", label: "Pin Codes Served" },
            { val: "24hrs", label: "Bulk Order Fulfillment" },
            { val: "-18°C", label: "Cold Chain Maintained" },
          ].map((s) => (
            <motion.div
              key={s.val}
              variants={itemVariant}
              className="rounded-2xl bg-primary-foreground/[0.08] backdrop-blur-sm p-6 border border-primary-foreground/10 hover:bg-primary-foreground/[0.12] transition-colors"
            >
              <p className="text-4xl font-extrabold tracking-tight">{s.val}</p>
              <p className="text-sm text-primary-foreground/60 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>

    {/* Testimonials */}
    <motion.section
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="container py-20"
    >
      <motion.div variants={itemVariant} className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          <span className="h-px w-6 bg-primary/40" /> Testimonials <span className="h-px w-6 bg-primary/40" />
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">What Our Customers Say</h2>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={itemVariant}
            className="rounded-2xl border border-border bg-card p-7 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-foreground/80 mb-5 leading-relaxed italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                {t.name[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  </Layout>
  );
};

export default Index;
