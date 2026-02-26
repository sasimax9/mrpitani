import Layout from "@/components/layout/Layout";
import React, { useMemo, useState } from "react";
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
  MapPin,
  Package,
  StickyNote,
  ShieldCheck,
  Award,
  CreditCard,
  Boxes,
  Snowflake,
  HandCoins,
  BadgeCheck,
  ChevronDown,
  Search,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Leaf,
  Drumstick,
  ShoppingBasket,
  Cookie,
  UtensilsCrossed,
  Info,
  Trash2,
} from "lucide-react";
import { useCatalog } from "@/contexts/CatalogContext";
import { supabase } from "@/lib/supabase";

const trustCards = [
  { icon: Tag, title: "Bulk Pricing", desc: "Volume-based discounts up to 15% off" },
  { icon: Snowflake, title: "Cold Chain Delivery", desc: "Temperature-controlled from warehouse to door" },
  { icon: CalendarCheck, title: "Weekly / Daily Supply", desc: "Flexible schedules tailored to your needs" },
  { icon: Headset, title: "Dedicated Support", desc: "Personal account manager for every partner" },
];

const benefits = [
  { icon: HandCoins, text: "Competitive bulk pricing" },
  { icon: Building2, text: "Dedicated account manager" },
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

function getProductUnits(packSizes: string[] = []): string[] {
  const units = new Set<string>();
  for (const size of packSizes) {
    const s = String(size).toLowerCase();
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
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

type FormState = {
  business: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  category: string;

  productId: string; // store id
  quantity: number;
  unit: string;

  date: string;
  notes: string;
};

type OrderItem = {
  key: string; // productId + unit
  productId: string;
  name: string;
  type?: string;
  category?: string;

  unit: string;
  quantity: number;

  unitPrice: number;
  discountPercent: number;
  baseTotal: number;
  finalTotal: number;
};

type SuccessSnapshot = {
  form: FormState;
  items: OrderItem[];
  grandTotal: number;
};

const initialForm: FormState = {
  business: "",
  contact: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  category: "all",

  productId: "",
  quantity: 1,
  unit: "",

  date: "",
  notes: "",
};

const BulkOrders = () => {
  const { products, loading, error } = useCatalog();

  const [form, setForm] = useState<FormState>(initialForm);
  const [items, setItems] = useState<OrderItem[]>([]);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessSnapshot | null>(null);

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    return (products || []).find((p: any) => String(p.id) === String(form.productId));
  }, [products, form.productId]);

  const availableUnits = useMemo(() => {
    return selectedProduct ? getProductUnits(selectedProduct.packSizes || []) : [];
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    let list = products || [];
    if (form.category !== "all") list = list.filter((p: any) => p.category === form.category);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((p: any) => String(p.name).toLowerCase().includes(s));
    }
    return list;
  }, [products, form.category, search]);

  // current selection estimate (not the list)
  const selectionUnitPrice = selectedProduct?.price ? Number(selectedProduct.price) : 0;
  const selectionDiscount = getDiscount(Number(form.quantity) || 0);
  const selectionBaseTotal = (Number(form.quantity) || 0) * selectionUnitPrice;
  const selectionFinalTotal = selectionBaseTotal - (selectionBaseTotal * selectionDiscount) / 100;
  const selectionHasEstimate = !!selectedProduct && (Number(form.quantity) || 0) > 0;

  // cart totals
  const grandTotal = useMemo(() => items.reduce((sum, it) => sum + (Number(it.finalTotal) || 0), 0), [items]);

  const inputClass = (field: keyof FormState | string) =>
    `w-full rounded-xl border bg-background px-4 py-3 text-sm transition-all duration-200
     focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
     placeholder:text-muted-foreground
     ${errors[String(field)] ? "border-destructive ring-1 ring-destructive" : "border-input hover:border-primary/40"}`;

  const handleChange = (field: keyof FormState, value: string | number) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value } as FormState;

      // when product changes, set default unit
      if (field === "productId") {
        const prod = (products || []).find((p: any) => String(p.id) === String(value));
        const units = prod ? getProductUnits(prod.packSizes || []) : [];
        next.unit = units[0] || "";
      }
      return next;
    });

    if (errors[String(field)]) setErrors((p) => ({ ...p, [String(field)]: false }));
  };

  // reset only current selection (dropdown choice), NOT the items list
  const resetSelection = () => {
    setForm((prev) => ({
      ...prev,
      productId: "",
      unit: "",
      quantity: 1,
    }));
    setDropdownOpen(false);
    setSearch("");
  };

  // add selection into list (inventory/cart behavior)
  const addToList = () => {
    if (!selectedProduct) {
      setErrors((p) => ({ ...p, productId: true }));
      return;
    }
    if (!form.unit) {
      setErrors((p) => ({ ...p, unit: true }));
      return;
    }

    const qty = Math.max(1, Number(form.quantity) || 1);
    const unitPrice = selectionUnitPrice;
    const discountPercent = getDiscount(qty);
    const baseTotal = qty * unitPrice;
    const finalTotal = baseTotal - (baseTotal * discountPercent) / 100;

    const key = `${selectedProduct.id}__${form.unit}`;

    setItems((prev) => {
      const existing = prev.find((x) => x.key === key);
      if (!existing) {
        return [
          ...prev,
          {
            key,
            productId: String(selectedProduct.id),
            name: String(selectedProduct.name),
            type: selectedProduct.type,
            category: selectedProduct.category,
            unit: form.unit,
            quantity: qty,
            unitPrice,
            discountPercent,
            baseTotal,
            finalTotal,
          },
        ];
      }

      // merge quantities if same product+unit already exists
      const mergedQty = existing.quantity + qty;
      const mergedDiscount = getDiscount(mergedQty);
      const mergedBase = mergedQty * unitPrice;
      const mergedFinal = mergedBase - (mergedBase * mergedDiscount) / 100;

      return prev.map((x) =>
        x.key === key
          ? {
              ...x,
              quantity: mergedQty,
              discountPercent: mergedDiscount,
              baseTotal: mergedBase,
              finalTotal: mergedFinal,
            }
          : x
      );
    });

    // reset only selection qty
    setForm((p) => ({ ...p, quantity: 1 }));
  };

  const removeItem = (key: string) => setItems((prev) => prev.filter((x) => x.key !== key));
  const clearItems = () => setItems([]);

  const validate = () => {
    const required: (keyof FormState)[] = ["business", "contact", "phone", "email", "city"];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!String(form[f] || "").trim()) errs[String(f)] = true;
    });

    // must have at least 1 item
    if (items.length === 0) errs["items"] = true;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Reset ONLY AFTER closing modal (your requirement)
  const closeSuccess = () => {
    setShowSuccess(false);
    setSuccessData(null);

    // reset after close
    setForm(initialForm);
    setItems([]);
    setSearch("");
    setDropdownOpen(false);
    setSubmitError(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);

      // generate order id on client (avoid RETURNING select with RLS)
      const orderId = crypto.randomUUID();

      // 1) Insert header
      const { error: orderErr } = await supabase.from("bulk_orders").insert([
        {
          id: orderId,
          business: form.business.trim(),
          contact: form.contact.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          city: form.city.trim(),
          address: form.address?.trim() || null,
          expected_date: form.date ? form.date : null,
          notes: form.notes?.trim() || null,
          total_amount: Number(grandTotal || 0),
          status: "new",
        },
      ]);

      if (orderErr) throw orderErr;

      // 2) Insert items
      const itemsPayload = items.map((it) => ({
        order_id: orderId,
        product_id: it.productId || null,
        name: it.name,
        unit: it.unit,
        quantity: Number(it.quantity),
        unit_price: Number(it.unitPrice || 0),
        discount_percent: Number(it.discountPercent || 0),
        base_total: Number(it.baseTotal || 0),
        final_total: Number(it.finalTotal || 0),
      }));

      const { error: itemsErr } = await supabase.from("bulk_order_items").insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      // ✅ SNAPSHOT so modal shows correct values even if user changes form while modal is open
      setSuccessData({
        form: { ...form },
        items: items.map((x) => ({ ...x })),
        grandTotal: Number(grandTotal || 0),
      });

      setShowSuccess(true);
      // ❌ DO NOT reset form/items here (reset only after closing modal)
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // WhatsApp & Email based on snapshot (preferred), fallback to current state
  const whatsappMsg = encodeURIComponent(
    `Hi Mr.Pitani, I'd like to place a bulk order:\n` +
      `Business: ${successData?.form.business || form.business}\n` +
      `City: ${successData?.form.city || form.city}\n` +
      `Items:\n` +
      (successData?.items || items)
        .map((it) => `- ${it.name} | ${it.quantity} ${it.unit} | ₹${Math.round(it.finalTotal)}`)
        .join("\n") +
      `\nTotal: ₹${Math.round(successData?.grandTotal ?? grandTotal)}`
  );

  const emailSubject = encodeURIComponent(`Bulk Order – ${successData?.form.business || form.business}`);
  const emailBody = encodeURIComponent(
    `Business: ${successData?.form.business || form.business}\n` +
      `Contact: ${successData?.form.contact || form.contact}\n` +
      `Phone: ${successData?.form.phone || form.phone}\n` +
      `Email: ${successData?.form.email || form.email}\n` +
      `City: ${successData?.form.city || form.city}\n\n` +
      `Items:\n` +
      (successData?.items || items)
        .map(
          (it) =>
            `- ${it.name} | ${it.quantity} ${it.unit} | Unit ₹${it.unitPrice} | ${it.discountPercent}% | ₹${Math.round(it.finalTotal)}`
        )
        .join("\n") +
      `\n\nTotal: ₹${Math.round(successData?.grandTotal ?? grandTotal)}\n\n` +
      `Notes: ${successData?.form.notes || form.notes}`
  );

  return (
    <Layout>
      {/* HERO */}
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

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4 tracking-tight"
          >
            Bulk Orders / B2B
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-8 leading-relaxed">
            Add items to the list and submit once — category changes won’t reset your estimate list.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <a
              href="#order-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Package className="h-4 w-4" /> Place Bulk Order
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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

      {/* TRUST */}
      <section className="container -mt-10 relative z-10 mb-16">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {trustCards.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group rounded-2xl border border-border bg-card p-6 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl hero-gradient text-primary-foreground transition-transform group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* BENEFITS */}
      <section className="container pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Why Bulk With <span className="text-gradient">Mr.Pitani</span>?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
            Hotels, restaurants, caterers, cloud kitchens, and retail chains trust our supply.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {benefits.map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              variants={fadeUp}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:card-shadow"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground">{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ORDER FORM */}
      <section id="order-form" className="bg-muted/50 py-16">
        <div className="container">
          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-10 card-shadow"
          >
            {/* Business */}
            <motion.div variants={fadeUp} className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Business Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Business Name *</label>
                  <input
                    value={form.business}
                    onChange={(e) => handleChange("business", e.target.value)}
                    className={inputClass("business")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Contact Person *</label>
                  <input
                    value={form.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    className={inputClass("contact")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone *</label>
                  <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inputClass("email")}
                  />
                </div>
              </div>
            </motion.div>

            {/* Delivery */}
            <motion.div variants={fadeUp} className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Info
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">City / Area *</label>
                  <input value={form.city} onChange={(e) => handleChange("city", e.target.value)} className={inputClass("city")} />
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
                    rows={2}
                    className={`${inputClass("address")} resize-none`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Product Selection */}
            <motion.div variants={fadeUp} className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Add Items
              </h3>

              {/* Categories (ONLY affects dropdown filter; does NOT touch estimate list) */}
              <div className="flex flex-wrap gap-2 mb-4">
                {productCategories.map(({ label, value, icon: CatIcon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      handleChange("category", value);
                      resetSelection(); // ✅ dropdown resets on category change
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      form.category === value
                        ? "hero-gradient text-primary-foreground shadow-md"
                        : "border border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    <CatIcon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Product dropdown */}
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Select Product *</label>

                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`${inputClass("productId")} flex items-center justify-between text-left`}
                >
                  <span className={selectedProduct ? "text-foreground" : "text-muted-foreground"}>
                    {selectedProduct?.name || (loading ? "Loading products..." : "Choose a product...")}
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

                      <div className="max-h-56 overflow-y-auto p-1">
                        {error ? (
                          <p className="p-3 text-sm text-destructive text-center">Failed to load products</p>
                        ) : filteredProducts.length === 0 ? (
                          <p className="p-3 text-sm text-muted-foreground text-center">No products found</p>
                        ) : (
                          filteredProducts.map((p: any) => {
                            const units = getProductUnits(p.packSizes || []);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  handleChange("productId", String(p.id));
                                  setDropdownOpen(false);
                                  setSearch("");
                                }}
                                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between ${
                                  String(form.productId) === String(p.id)
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-foreground hover:bg-muted"
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
                                  <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                                    {units.join(" / ")}
                                  </span>
                                  <span className="text-xs text-muted-foreground font-medium">₹{Number(p.price || 0)}</span>
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Qty + Unit + Add button */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Quantity</label>
                  <div className="flex items-center rounded-xl border border-input bg-background overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleChange("quantity", Math.max(1, Number(form.quantity) - 1))}
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
                      onClick={() => handleChange("quantity", Number(form.quantity) + 1)}
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

                <div className="sm:col-span-2 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={addToList}
                    disabled={!selectedProduct || !form.unit}
                    className="w-full rounded-xl border border-border bg-background py-3 text-sm font-bold text-foreground transition-all
                               hover:bg-muted hover:scale-[1.01]
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                               flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add to List
                  </button>
                </div>
              </div>

              {/* Current selection estimate (optional preview) */}
              {selectionHasEstimate && (
                <div className="mt-6 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">Selected Item Estimate</div>
                    {selectionDiscount > 0 && (
                      <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> {selectionDiscount}% discount
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {selectedProduct?.name} • {form.quantity} {form.unit} • ₹{Math.round(selectionFinalTotal)}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Inventory-style Estimate List */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-primary" /> Estimated Price List
                </h4>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearItems}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Clear
                  </button>
                )}
              </div>

              {errors["items"] && (
                <div className="mb-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  Please add at least one item to the list.
                </div>
              )}

              {items.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Add items using “Add to List” to build your estimate.
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="divide-y divide-border">
                    {items.map((it) => (
                      <div key={it.key} className="p-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate">{it.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {it.quantity} {it.unit} • Unit ₹{it.unitPrice} • Discount {it.discountPercent}%
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground line-through">
                              ₹{Math.round(it.baseTotal).toLocaleString()}
                            </div>
                            <div className="text-sm font-extrabold text-primary">₹{Math.round(it.finalTotal).toLocaleString()}</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(it.key)}
                            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-muted/20 flex items-center justify-between">
                    <div className="text-sm font-bold text-foreground">Grand Total</div>
                    <div className="text-xl font-extrabold text-primary">₹{Math.round(grandTotal).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Notes */}
            <motion.div variants={fadeUp} className="mb-8">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <StickyNote className="h-3.5 w-3.5" /> Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any special requirements, preferred brands, etc."
                rows={3}
                className={`${inputClass("notes")} resize-none`}
              />
            </motion.div>

            {submitError && (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            {/* Submit */}
            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl hero-gradient py-4 text-base font-bold text-primary-foreground shadow-lg transition-all
                           hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]
                           flex items-center justify-center gap-2
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Package className="h-5 w-5" />
                {submitting ? "Submitting..." : "Submit Order"}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={closeSuccess}
          >
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
            >
              <button
                onClick={closeSuccess}
                className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-1">Order Placed Successfully</h3>
                <p className="text-sm text-muted-foreground">We’ll contact you shortly with a confirmed quote.</p>
              </div>

              <div className="rounded-xl bg-muted/50 p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-semibold text-foreground">{successData?.items.length ?? 0}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-bold text-foreground">Estimated Total</span>
                  <span className="font-extrabold text-primary">
                    ₹{Math.round(successData?.grandTotal ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`https://wa.me/918977775878?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--whatsapp))] py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-[1.02]"
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
                  onClick={closeSuccess}
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