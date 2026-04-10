import Layout from "@/components/layout/Layout";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  CalendarCheck,
  Headset,
  CheckCircle2,
  MessageCircle,
  Mail,
  X,
  Building2,
  User,
  MapPin,
  Package,
  StickyNote,
  ShieldCheck,
  Award,
  CreditCard,
  Boxes,
  Snowflake,
  HandCoins,
  ChevronDown,
  Search,
  Plus,
  Minus,
  ArrowRight,
  Leaf,
  Drumstick,
  ShoppingBasket,
  Cookie,
  UtensilsCrossed,
  Info,
  Store,
  Check,
  Download,
  Trash2,
  FileText,
  ListPlus,
  Loader2,
} from "lucide-react";
import { getProductPrice } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  productName: string;
  brand: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  total: number;
}

const BULK_ORDERS_TABLE = "bulk_orders";

const trustCards = [
  { icon: Tag, title: "Bulk Pricing", desc: "Volume-based discounts up to 15% off" },
  { icon: Snowflake, title: "Cold Chain Delivery", desc: "Temperature-controlled from warehouse to door" },
  { icon: CalendarCheck, title: "Weekly / Daily Supply", desc: "Flexible schedules tailored to your needs" },
  { icon: Headset, title: "Dedicated Support", desc: "Personal account manager for every partner" },
];

const benefits = [
  { icon: HandCoins, text: "Competitive bulk pricing" },
  { icon: User, text: "Dedicated account manager" },
  { icon: CalendarCheck, text: "Scheduled weekly/daily deliveries" },
  { icon: Snowflake, text: "Temperature-controlled logistics" },
  { icon: Package, text: "Custom packaging available" },
  { icon: CreditCard, text: "Flexible payment terms" },
  { icon: Award, text: "Priority order fulfillment" },
  { icon: ShieldCheck, text: "Quality guarantee with every shipment" },
];

const productCategories = [
  { label: "All Categories", value: "all", icon: ShoppingBasket },
  { label: "Veg", value: "veg", icon: Leaf },
  { label: "Non-Veg", value: "non-veg", icon: Drumstick },
  { label: "General Items", value: "general", icon: Package },
  { label: "Veg Snacks", value: "veg-snacks", icon: Cookie },
  { label: "Non-Veg Snacks", value: "non-veg-snacks", icon: UtensilsCrossed },
];

function getProductUnits(packSizes: string[]): string[] {
  const units = new Set<string>();
  for (const size of packSizes) {
    const s = size.toLowerCase();
    if (s.includes("kg") || s.includes("g")) units.add("Kg");
    if (s.includes("pcs")) units.add("Pack");
    if (s.includes("l") && !s.includes("kg")) units.add("Box");
  }
  if (units.size === 0) units.add("Pack");
  return Array.from(units);
}

function getDiscount(qty: number) {
  if (qty >= 30) return 15;
  if (qty >= 20) return 10;
  if (qty >= 10) return 5;
  return 0;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const initialForm = {
  business: "",
  contact: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  product: "",
  category: "all",
  quantity: 1,
  unit: "",
  date: "",
  notes: "",
  brand: "",
};

const BulkOrders = () => {
  const { data: products = [] } = useProducts();

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState("");

  const listRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (form.category !== "all") {
      list = list.filter((p) => p.category === form.category);
    }
    if (search) {
      list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return list;
  }, [form.category, search, products]);

  const selectedProduct = products.find((p) => p.name === form.product);
  const availableUnits = selectedProduct ? getProductUnits(selectedProduct.packSizes) : [];
  const hasBrandVariants = selectedProduct?.brandVariants && selectedProduct.brandVariants.length > 1;

  const productPrice = selectedProduct ? getProductPrice(selectedProduct, form.brand || undefined) : 0;
  const discount = getDiscount(form.quantity);
  const baseTotal = form.quantity * productPrice;
  const finalTotal = baseTotal - (baseTotal * discount) / 100;
  const hasEstimate = !!selectedProduct && form.quantity > 0;

  const orderGrandTotal = orderItems.reduce((sum, item) => sum + item.total, 0);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "product") {
        const prod = products.find((p) => p.name === value);
        if (prod) {
          const units = getProductUnits(prod.packSizes);
          next.unit = units[0] || "";
          next.brand = prod.brandVariants?.[0]?.brand || prod.brand || "";
        }
      }

      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleAddToList = () => {
    if (!selectedProduct) return;

    const newItem: OrderItem = {
      id: `${selectedProduct.id}-${form.brand}-${Date.now()}`,
      productName: selectedProduct.name,
      brand: form.brand || selectedProduct.brand || "Default",
      quantity: form.quantity,
      unit: form.unit || "Kg",
      price: productPrice,
      discount,
      total: finalTotal,
    };

    setOrderItems((prev) => [...prev, newItem]);

    setForm((prev) => ({
      ...prev,
      product: "",
      brand: "",
      quantity: 1,
      unit: "",
    }));

    if (errors.orderItems) {
      setErrors((prev) => ({ ...prev, orderItems: false }));
    }

    setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 200);
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDownloadCSV = () => {
    if (orderItems.length === 0) return;

    const headers = ["#", "Product", "Brand", "Qty", "Unit", "Price/Unit", "Discount %", "Total"];
    const rows = orderItems.map((item, i) => [
      i + 1,
      item.productName,
      item.brand,
      item.quantity,
      item.unit,
      `₹${item.price}`,
      `${item.discount}%`,
      `₹${item.total.toFixed(0)}`,
    ]);

    rows.push(["", "", "", "", "", "", "Grand Total", `₹${orderGrandTotal.toFixed(0)}`]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `MrPitani_BulkOrder_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const validate = () => {
    const required = ["business", "contact", "phone", "email", "city"];
    const errs: Record<string, boolean> = {};

    required.forEach((f) => {
      if (!form[f as keyof typeof form]) errs[f] = true;
    });

    if (orderItems.length === 0) errs.orderItems = true;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetAll = () => {
    setOrderItems([]);
    setForm(initialForm);
    setSearch("");
    setErrors({});
    setSubmitError("");
    setCreatedOrderId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const itemsPayload = orderItems.map((item) => ({
        id: item.id,
        productName: item.productName,
        brand: item.brand,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        discount: item.discount,
        total: item.total,
      }));

      const notesBlock = [
        form.notes?.trim(),
        form.city ? `City/Area: ${form.city}` : "",
        form.address ? `Address: ${form.address}` : "",
        form.date ? `Expected Delivery Date: ${form.date}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const orderPayload = {
        company_name: form.business || null,
        contact_name: form.contact,
        contact_phone: form.phone,
        contact_email: form.email || null,
        items: itemsPayload,
        total_weight_kg: 0,
        discount_percent: 0,
        subtotal: orderGrandTotal,
        total: orderGrandTotal,
        status: "pending",
        notes: notesBlock || null,
      };

      const { error } = await supabase.from(BULK_ORDERS_TABLE).insert([orderPayload]);

      if (error) throw error;

      setCreatedOrderId("");
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Bulk order save failed:", error);
      setSubmitError(error?.message || "Failed to submit bulk order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    resetAll();
  };

  const orderSummaryText = orderItems
    .map(
      (item, i) =>
        `${i + 1}. ${item.productName} (${item.brand}) - ${item.quantity} ${item.unit} @ ₹${item.price} = ₹${item.total.toFixed(0)}`
    )
    .join("\n");

  const whatsappMsg = encodeURIComponent(
    `Hi Mr.Pitani, I'd like to place a bulk order:\n` +
      `Business: ${form.business}\n` +
      `Contact: ${form.contact}\n` +
      `Phone: ${form.phone}\n` +
      `Email: ${form.email || "-"}\n\n` +
      `Items:\n${orderSummaryText}\n\n` +
      `Grand Total: ₹${orderGrandTotal.toFixed(0)}\n` +
      `City: ${form.city}\n` +
      `Address: ${form.address || "-"}\n` +
      `Expected Delivery: ${form.date || "-"}\n` +
      `Notes: ${form.notes || "-"}`
  );

  const emailSubject = encodeURIComponent(`Bulk Order – ${form.business}`);
  const emailBody = encodeURIComponent(
    `Business: ${form.business}\n` +
      `Contact: ${form.contact}\n` +
      `Phone: ${form.phone}\n` +
      `Email: ${form.email || "-"}\n\n` +
      `Order Items:\n${orderSummaryText}\n\n` +
      `Grand Total: ₹${orderGrandTotal.toFixed(0)}\n` +
      `City: ${form.city}\n` +
      `Address: ${form.address || "-"}\n` +
      `Expected Delivery: ${form.date || "-"}\n` +
      `Notes: ${form.notes || "-"}`
  );

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 glass-input
     focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
     placeholder:text-muted-foreground
     ${errors[field] ? "border-destructive ring-1 ring-destructive" : "border-input hover:border-primary/40"}`;

  return (
    <Layout>
      <section className="relative overflow-hidden hero-gradient py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, hsl(var(--primary-foreground) / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.2) 0%, transparent 50%)",
          }}
        />
        <motion.div className="container relative z-10" initial="hidden" animate="visible" variants={stagger}>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur-sm mb-6"
          >
            <Boxes className="h-3.5 w-3.5" /> B2B Supply Partner
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4 tracking-tight">
            Bulk Orders / B2B
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-8 leading-relaxed">
            Partner with us for reliable large-volume supply with consistent quality and scheduled deliveries.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <a href="#order-form" className="group inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:scale-105">
              <Package className="h-4 w-4" /> Place Bulk Order <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://wa.me/918977775878?text=Hi%20Mr.Pitani,%20I%20want%20to%20discuss%20bulk%20supply"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20 hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" /> Talk to Sales
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section className="container -mt-10 relative z-10 mb-16">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
          {trustCards.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="group rounded-2xl p-6 glass-card glass-card-hover transition-all duration-300">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl hero-gradient text-primary-foreground transition-transform group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Why Bulk With <span className="text-gradient">Mr.Pitani</span>?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
            We supply hotels, restaurants, caterers, cloud kitchens, and retail chains with consistent-quality food at wholesale rates.
          </motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {benefits.map(({ icon: Icon, text }) => (
            <motion.div key={text} variants={fadeUp} className="flex items-center gap-3 rounded-xl p-4 glass-card glass-card-hover transition-all">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground">{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="order-form" className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Place Your <span className="text-gradient">Bulk Order</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              Add products to your order list, review pricing, and submit.
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto rounded-2xl p-6 md:p-10 glass-card shadow-2xl"
          >
            <motion.div variants={fadeUp} className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Business Name *</label>
                  <input value={form.business} onChange={(e) => handleChange("business", e.target.value)} placeholder="e.g. Royal Kitchen" className={inputClass("business")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Contact Person *</label>
                  <input value={form.contact} onChange={(e) => handleChange("contact", e.target.value)} placeholder="Full name" className={inputClass("contact")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+91 98765 43210" className={inputClass("phone")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@business.com" className={inputClass("email")} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">City / Area *</label>
                  <input value={form.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="e.g. Hyderabad" className={inputClass("city")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Expected Delivery Date</label>
                  <input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} className={inputClass("date")} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Delivery Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Full delivery address..."
                    rows={2}
                    className={`${inputClass("address")} resize-none`}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Add Products
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {productCategories.map(({ label, value, icon: CatIcon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      handleChange("category", value);
                      handleChange("product", "");
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      form.category === value
                        ? "hero-gradient text-primary-foreground shadow-md"
                        : "border border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    <CatIcon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>

              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Product</label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`${inputClass("product")} flex items-center justify-between text-left`}
                >
                  <span className={form.product ? "text-foreground" : "text-muted-foreground"}>
                    {form.product || "Choose a product..."}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute z-30 mt-1 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                      </div>

                      <div className="max-h-48 overflow-y-auto p-1">
                        {filteredProducts.length === 0 ? (
                          <p className="p-3 text-sm text-muted-foreground text-center">No products found</p>
                        ) : (
                          filteredProducts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                handleChange("product", p.name);
                                setDropdownOpen(false);
                                setSearch("");
                              }}
                              className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between ${
                                form.product === p.name ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {p.type === "veg" ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-secondary text-secondary">
                                    <Leaf className="h-2.5 w-2.5" />
                                  </span>
                                ) : (
                                  <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-accent text-accent">
                                    <Drumstick className="h-2.5 w-2.5" />
                                  </span>
                                )}
                                {p.name}
                              </span>
                              <span className="flex items-center gap-2">
                                {p.brandVariants && p.brandVariants.length > 1 && (
                                  <span className="text-[10px] text-primary font-medium px-1.5 py-0.5 rounded bg-primary/10">
                                    {p.brandVariants.length} brands
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground font-medium">₹{p.price}</span>
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {hasBrandVariants && selectedProduct && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Store className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {selectedProduct.brandVariants!.length} Brands Available
                      </span>
                    </div>

                    <div
                      className={`grid gap-2 ${
                        selectedProduct.brandVariants!.length <= 3
                          ? "grid-cols-3"
                          : selectedProduct.brandVariants!.length <= 4
                          ? "grid-cols-2 sm:grid-cols-4"
                          : "grid-cols-2 sm:grid-cols-3"
                      }`}
                    >
                      {selectedProduct.brandVariants!.map((v) => {
                        const isSelected = form.brand === v.brand;
                        return (
                          <button
                            key={v.brand}
                            type="button"
                            onClick={() => handleChange("brand", v.brand)}
                            className={`relative rounded-xl border p-3 text-left transition-all duration-200 ${
                              isSelected
                                ? "border-primary bg-primary/8 shadow-sm ring-1 ring-primary/20"
                                : "border-border bg-background hover:border-primary/30 hover:shadow-sm"
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="bulk-brand-check"
                                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full hero-gradient flex items-center justify-center shadow-sm"
                              >
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </motion.div>
                            )}
                            <span className={`text-xs font-bold truncate block ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {v.brand}
                            </span>
                            <span className={`text-sm font-extrabold ${isSelected ? "text-primary" : "text-foreground"}`}>
                              ₹{v.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Quantity</label>
                  <div className="flex items-center rounded-xl border border-input bg-background overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleChange("quantity", Math.max(1, form.quantity - 1))}
                      className="px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => handleChange("quantity", Math.max(1, Number(e.target.value)))}
                      className="w-full text-center bg-transparent py-3 text-sm font-semibold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange("quantity", form.quantity + 1)}
                      className="px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Unit</label>
                  <div className="flex rounded-xl border border-input bg-background overflow-hidden">
                    {(availableUnits.length > 0 ? availableUnits : ["Kg"]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => handleChange("unit", u)}
                        className={`flex-1 py-3 text-sm font-semibold transition-all ${
                          form.unit === u ? "hero-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  {hasEstimate && (
                    <div className="text-xs text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground">₹{finalTotal.toFixed(0)}</span>
                      {discount > 0 && <span className="text-secondary ml-1">(-{discount}%)</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleAddToList}
                    disabled={!selectedProduct}
                    className="w-full rounded-xl hero-gradient py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <ListPlus className="h-4 w-4" /> Add to List
                  </button>
                </div>
              </div>
            </motion.div>

            <div ref={listRef}>
              <AnimatePresence>
                {orderItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    variants={fadeUp}
                    className="mb-8"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" /> Order List
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {orderItems.length} items
                        </span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleDownloadCSV}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" /> Download CSV
                      </button>
                    </div>

                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
                        <table className="min-w-[720px] w-full text-sm">
                          <thead>
                            <tr className="bg-muted/60">
                              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">#</th>
                              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Product</th>
                              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Brand</th>
                              <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Qty</th>
                              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                              <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Disc.</th>
                              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                              <th className="px-3 py-3"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems.map((item, i) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="border-t border-border hover:bg-muted/30 transition-colors"
                              >
                                <td className="px-4 py-3 text-muted-foreground font-medium">{i + 1}</td>
                                <td className="px-4 py-3 font-semibold text-foreground">
                                  {item.productName}
                                  <span className="sm:hidden block text-[10px] text-muted-foreground">{item.brand}</span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.brand}</td>
                                <td className="px-4 py-3 text-center font-medium text-foreground">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="px-4 py-3 text-right text-muted-foreground">₹{item.price}</td>
                                <td className="px-4 py-3 text-center hidden sm:table-cell">
                                  {item.discount > 0 ? (
                                    <span className="text-secondary font-semibold">{item.discount}%</span>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-foreground whitespace-nowrap">₹{item.total.toFixed(0)}</td>
                                <td className="px-3 py-3">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-primary/20 bg-primary/5">
                              <td colSpan={6} className="px-3 sm:px-4 py-3 text-right text-sm sm:text-base font-bold text-foreground">
                                Grand Total
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-right text-base sm:text-lg font-extrabold text-primary whitespace-nowrap">
                                ₹{orderGrandTotal.toFixed(0)}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {errors.orderItems && (
                      <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                        <Info className="h-3 w-3" /> Please add at least one product to your order list.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {orderItems.length === 0 && (
                <motion.div variants={fadeUp} className="mb-8 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                  <ListPlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Your order list is empty</p>
                  <p className="text-xs text-muted-foreground mt-1">Select products above and click "Add to List"</p>
                  {errors.orderItems && <p className="text-xs text-destructive mt-2 font-medium">Please add at least one product</p>}
                </motion.div>
              )}
            </div>

            <motion.div variants={fadeUp} className="mb-8">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <StickyNote className="h-3.5 w-3.5" /> Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any special requirements."
                rows={3}
                className={`${inputClass("notes")} resize-none`}
              />
            </motion.div>

            {submitError && (
              <motion.div variants={fadeUp} className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {submitError}
              </motion.div>
            )}

            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={orderItems.length === 0 || isSubmitting}
                className="w-full rounded-xl hero-gradient py-4 text-sm sm:text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5" /> Submit Order ({orderItems.length} items)
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={handleCloseSuccess}
          >
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl glass-card"
            >
              <button
                onClick={handleCloseSuccess}
                className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">Order Placed Successfully</h3>
                <p className="text-sm text-muted-foreground">We'll contact you shortly with a confirmed quote.</p>
                {createdOrderId && (
                  <p className="mt-3 text-xs text-muted-foreground break-all rounded-lg bg-muted/40 px-3 py-2">
                    Order ID: <span className="font-semibold text-foreground">{createdOrderId}</span>
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-muted/50 p-4 mb-6 space-y-1.5 text-sm max-h-40 overflow-y-auto">
                {orderItems.map((item, i) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {i + 1}. {item.productName} ({item.brand})
                    </span>
                    <span className="font-semibold text-foreground whitespace-nowrap">₹{item.total.toFixed(0)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between gap-3">
                  <span className="font-bold text-foreground">Grand Total</span>
                  <span className="font-extrabold text-primary whitespace-nowrap">₹{orderGrandTotal.toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary/10 py-3 text-sm font-bold text-primary transition-all hover:scale-[1.02]"
                >
                  <Download className="h-4 w-4" /> Download Order List
                </button>

                <a
                  href={`https://wa.me/918977775878?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-bold text-foreground transition-all hover:bg-muted hover:scale-[1.02]"
                >
                  <MessageCircle className="h-4 w-4" /> Send to WhatsApp
                </a>

                <a
                  href={`mailto:orders@mrpitani.com?subject=${emailSubject}&body=${emailBody}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-bold text-foreground transition-all hover:bg-muted hover:scale-[1.02]"
                >
                  <Mail className="h-4 w-4" /> Send to Email
                </a>

                <button
                  onClick={handleCloseSuccess}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default BulkOrders;