import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Snowflake, Clock, ChevronRight, Star, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import products from "@/data/products";
import brands from "@/data/brands";
import heroBg from "@/assets/hero-bg.jpg";

const categories = [
  { label: "Veg", emoji: "🥬", path: "/products/veg", desc: "Veg chicken, mutton & more" },
  { label: "Non-Veg", emoji: "🍗", path: "/products/non-veg", desc: "Prawns, fish, chicken" },
  { label: "General", emoji: "🧀", path: "/products/veg?cat=general", desc: "Paneer, ghee, corn & more" },
  { label: "Veg Snacks", emoji: "🥟", path: "/products/veg?cat=veg-snacks", desc: "Samosa, nuggets, fries" },
  { label: "Non-Veg Snacks", emoji: "🍗", path: "/products/non-veg?cat=non-veg-snacks", desc: "Chicken nuggets & rolls" },
  { label: "All Products", emoji: "📦", path: "/products", desc: "Browse everything" },
];

const topSelling = products.filter((p) =>
  ["v-1", "nv-1", "g-1", "vs-1", "nvs-1", "nv-11", "vs-17", "g-5"].includes(p.id)
);

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

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>
      <div className="container relative py-20 md:py-32">
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-2xl">
          <motion.p variants={fade} className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">
            Raw & Frozen Food Supplier
          </motion.p>
          <motion.h1 variants={fade} className="text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
            Fresh. Frozen.{" "}
            <span className="block">Fast Delivery.</span>
          </motion.h1>
          <motion.p variants={fade} className="mt-4 text-lg text-primary-foreground/80 max-w-lg">
            Mr.Pitani Supplies premium raw & frozen food across India – for homes, restaurants, caterers, and businesses.
          </motion.p>
          <motion.div variants={fade} className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
            >
              Explore Products <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/bulk-orders"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Bulk Enquiry
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Categories */}
    <section className="container py-16">
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((c) => (
          <Link
            key={c.label}
            to={c.path}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center card-shadow transition-all hover:card-shadow-hover hover:-translate-y-1"
          >
            <span className="text-4xl">{c.emoji}</span>
            <span className="font-semibold text-sm text-foreground">{c.label}</span>
            <span className="text-xs text-muted-foreground">{c.desc}</span>
          </Link>
        ))}
      </div>
    </section>

    {/* Top Selling */}
    <section className="bg-muted/50 py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Top Selling Products</h2>
          <Link to="/products" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topSelling.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>

    {/* Authorized Brands */}
    <section className="container py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Authorized Distributor For</h2>
        <Link to="/brands" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {brands.slice(0, 16).map((brand) => (
          <Link
            key={brand.id}
            to="/brands"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center card-shadow transition-all hover:card-shadow-hover hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium text-[11px] text-foreground leading-tight">{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="container py-16">
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Mr.Pitani?</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-6 card-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl hero-gradient">
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Delivery Coverage */}
    <section className="hero-gradient py-16">
      <div className="container text-center text-primary-foreground">
        <h2 className="text-2xl font-bold mb-4">Delivery Across India</h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
          We deliver frozen and raw food within a 500km radius of our cold storage hubs. Scheduled deliveries available for businesses.
        </p>
        <div className="grid gap-6 sm:grid-cols-3 max-w-2xl mx-auto">
          <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-5">
            <p className="text-3xl font-extrabold">500+</p>
            <p className="text-sm text-primary-foreground/70">Pin Codes Served</p>
          </div>
          <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-5">
            <p className="text-3xl font-extrabold">24hrs</p>
            <p className="text-sm text-primary-foreground/70">Bulk Order Fulfillment</p>
          </div>
          <div className="rounded-xl bg-primary-foreground/10 backdrop-blur p-5">
            <p className="text-3xl font-extrabold">-18°C</p>
            <p className="text-sm text-primary-foreground/70">Cold Chain Maintained</p>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="container py-16">
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">What Our Customers Say</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-xl border border-border bg-card p-6 card-shadow">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
            <div>
              <p className="font-semibold text-sm text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Index;
