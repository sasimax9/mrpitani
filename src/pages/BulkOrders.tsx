import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useCatalog } from "@/contexts/CatalogContext";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Trash2,
  Send,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Truck,
  CheckCircle2,
  MessageCircle,
  X,
} from "lucide-react";

type ProductCategory = "veg" | "non-veg" | "general" | "veg-snacks" | "non-veg-snacks";

type LineItem = {
  productId: string;
  productName: string;
  category: ProductCategory;
  qtyKg: number;
  pricePerKg: number; // ✅ for estimate
};

const categoryLabels: Record<ProductCategory, string> = {
  veg: "🥬 Veg",
  "non-veg": "🍗 Non-Veg",
  general: "🧀 General",
  "veg-snacks": "🥟 Veg Snacks",
  "non-veg-snacks": "🍗 Non-Veg Snacks",
};

const benefits = [
  "Wholesale / bulk pricing",
  "Scheduled deliveries",
  "Cold chain maintained (-18°C)",
  "Hotels • Restaurants • Caterers",
  "Priority fulfillment for repeat buyers",
  "Dedicated support on WhatsApp",
];

const clampKg = (n: number) => {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 5000) return 5000;
  return n;
};

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n || 0));

function SuccessModal({
  open,
  onClose,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 card-shadow">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-secondary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <a
            href="https://wa.me/918977775878?text=Hi%20Mr.Pitani,%20I%20just%20submitted%20a%20bulk%20order%20request.%20Please%20confirm."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-sm font-extrabold text-primary-foreground hover:shadow-md"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp to confirm
          </a>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-extrabold text-foreground hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BulkOrders() {
  const { products, loading, error, refresh } = useCatalog();

  // form
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // selection
  const [category, setCategory] = useState<ProductCategory>("veg");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [qtyKg, setQtyKg] = useState<number>(5);

  // list
  const [items, setItems] = useState<LineItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // popup
  const [successOpen, setSuccessOpen] = useState(false);

  const productsByCategory = useMemo(() => {
    return (products as any[]).filter((p) => p.category === category);
  }, [products, category]);

  const selectedProduct = useMemo(() => {
    return (products as any[]).find((p) => p.id === selectedProductId);
  }, [products, selectedProductId]);

  const totalKg = useMemo(() => items.reduce((sum, it) => sum + (Number(it.qtyKg) || 0), 0), [items]);

  // ✅ estimated price (assumes product.price is per kg)
  const estimatedTotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.qtyKg) || 0) * (Number(it.pricePerKg) || 0), 0);
  }, [items]);

  const addItem = () => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedProduct) {
      setErrorMsg("Please select a product.");
      return;
    }
    const kg = clampKg(Number(qtyKg));
    if (kg <= 0) {
      setErrorMsg("Quantity must be greater than 0 kg.");
      return;
    }

    const pricePerKg = Number(selectedProduct.price ?? 0);

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.productId === selectedProduct.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          qtyKg: clampKg(copy[idx].qtyKg + kg),
          pricePerKg, // keep latest price
        };
        return copy;
      }
      return [
        ...prev,
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          category: selectedProduct.category,
          qtyKg: kg,
          pricePerKg,
        },
      ];
    });

    setQtyKg(5);
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((x) => x.productId !== productId));

  const updateItemKg = (productId: string, nextKg: number) => {
    setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, qtyKg: clampKg(nextKg) } : x)));
  };

  const validate = () => {
    if (!customerName.trim()) return "Enter your name.";
    if (!phone.trim()) return "Enter phone number.";
    if (!location.trim()) return "Enter location.";
    if (items.length === 0) return "Add at least 1 item.";
    return "";
  };

  const submit = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setSubmitting(true);
    try {
      const orderId = crypto.randomUUID();

      const { error: orderErr } = await supabase.from("bulk_orders").insert({
        id: orderId,
        customer_name: customerName.trim(),
        phone: phone.trim(),
        location: location.trim(),
        email: email.trim() || null,
        notes: notes.trim() || null,
        total_kg: totalKg,
        // If you later add a column like estimated_total, you can store it too:
        // estimated_total: estimatedTotal,
      });

      if (orderErr) throw orderErr;

      const payload = items.map((it) => ({
        bulk_order_id: orderId,
        product_id: it.productId,
        product_name: it.productName,
        category: it.category,
        qty_kg: it.qtyKg,
        // If you later add unit price columns, store:
        // price_per_kg: it.pricePerKg,
        // est_total: it.qtyKg * it.pricePerKg,
      }));

      const { error: itemsErr } = await supabase.from("bulk_order_items").insert(payload);
      if (itemsErr) throw itemsErr;

      const msg = "✅ Bulk order submitted successfully! We’ll contact you soon.";
      setSuccessMsg(msg);

      // ✅ popup
      setSuccessOpen(true);

      // reset
      setItems([]);
      setSelectedProductId("");
      setQtyKg(5);
      setNotes("");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Failed to submit bulk order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="container py-14 md:py-16 text-primary-foreground">
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                B2B / Bulk Supply
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                Hotels • Restaurants • Caterers
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                Cold-chain ready
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Bulk Orders made simple</h1>

            <p className="text-primary-foreground/80 text-base md:text-lg">
              Select products by category, add required kilograms, and submit. We’ll confirm pricing and delivery schedule quickly.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {/* <a
                href="https://wa.me/918977775878?text=Hi%20Mr.Pitani,%20I%20need%20a%20bulk%20order%20quote"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp for Bulk Quote
              </a> */}

              <button
                type="button"
                onClick={() => document.getElementById("bulk-form")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-foreground/30 px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10"
              >
                Start Bulk Request
              </button>
            </div>
          </div>

          {/* quick stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/15 p-4">
              <div className="flex items-center gap-2 font-bold">
                <Truck className="h-5 w-5" /> Fast Delivery
              </div>
              <p className="text-sm text-primary-foreground/75 mt-1">Scheduled routes for bulk buyers</p>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/15 p-4">
              <div className="flex items-center gap-2 font-bold">
                <Snowflake className="h-5 w-5" /> Cold Chain
              </div>
              <p className="text-sm text-primary-foreground/75 mt-1">Temperature controlled handling</p>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/15 p-4">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="h-5 w-5" /> Quality Assured
              </div>
              <p className="text-sm text-primary-foreground/75 mt-1">Consistent supply for kitchens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-2">How it works</h2>
            <p className="text-sm text-muted-foreground mb-5">3 quick steps, and your request is saved to our system.</p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-bold text-muted-foreground">STEP 1</p>
                <p className="font-bold text-foreground mt-1">Choose Category</p>
                <p className="text-sm text-muted-foreground mt-1">Veg / Non-veg / Snacks / General</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-bold text-muted-foreground">STEP 2</p>
                <p className="font-bold text-foreground mt-1">Add Kg List</p>
                <p className="text-sm text-muted-foreground mt-1">Select items + required kilos</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-bold text-muted-foreground">STEP 3</p>
                <p className="font-bold text-foreground mt-1">Submit Details</p>
                <p className="text-sm text-muted-foreground mt-1">We contact you with quote & schedule</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <h3 className="text-lg font-extrabold text-foreground mb-4">Why bulk with us?</h3>
            <div className="space-y-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground">Tip</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add multiple items in one request. Use notes for preferred delivery time & brand preference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FORM */}
      <section id="bulk-form" className="container pb-14">
        {/* Top status */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {loading && <span className="text-sm text-muted-foreground">Loading catalog…</span>}
          {error && <span className="text-sm text-destructive">Catalog error: {error}</span>}

          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" /> Refresh Products
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 rounded-2xl border border-secondary/30 bg-secondary/10 p-4 text-sm text-secondary">
            {successMsg}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT */}
          <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-foreground">1) Select Items</h2>
                <p className="text-sm text-muted-foreground">Pick category, choose product, add kg.</p>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-right">
                <p className="text-[10px] text-muted-foreground font-bold">TOTAL</p>
                <p className="text-base font-extrabold text-foreground">{totalKg.toFixed(1)} kg</p>
                <p className="text-xs font-bold text-primary mt-0.5">~ ₹{money(estimatedTotal)}</p>
              </div>
            </div>

            {/* Category */}
            <label className="text-sm font-semibold text-foreground">Category</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(categoryLabels) as ProductCategory[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    setSelectedProductId("");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors border ${
                    category === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {categoryLabels[c]}
                </button>
              ))}
            </div>

            {/* Product */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-foreground">Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-11"
              >
                <option value="">Select a product…</option>
                {productsByCategory.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Showing {productsByCategory.length} products in {categoryLabels[category]}.
              </p>
            </div>

            {/* ✅ Qty + Add aligned */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-sm font-semibold text-foreground">Quantity (kg)</label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={qtyKg}
                  onChange={(e) => setQtyKg(clampKg(Number(e.target.value)))}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-11"
                />
                {/* <p className="mt-1 text-xs text-muted-foreground">You can use 0.5 increments.</p> */}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-primary-foreground hover:shadow-md hover:shadow-primary/20 active:scale-[0.99] h-11"
              >
                <Plus className="h-4 w-4" /> Add to List
              </button>
            </div>

            {/* Items list */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-extrabold text-foreground">Selected Items</h3>
                <span className="text-xs text-muted-foreground">{items.length} item(s)</span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  No items added yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((it) => {
                    const est = (Number(it.qtyKg) || 0) * (Number(it.pricePerKg) || 0);
                    return (
                      <div
                        key={it.productId}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{it.productName}</p>
                          <p className="text-xs text-muted-foreground">{categoryLabels[it.category]}</p>
                          <p className="text-xs font-bold text-primary mt-0.5">~ ₹{money(est)}</p>
                        </div>

                        <div className="w-28">
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={it.qtyKg}
                            onChange={(e) => updateItemKg(it.productId, Number(e.target.value))}
                            className="w-full rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-right h-10"
                          />
                          <p className="text-[10px] text-muted-foreground text-right mt-1">kg</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(it.productId)}
                          className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-3 rounded-xl border border-border bg-muted/30 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">ESTIMATED TOTAL</p>
                    <p className="text-lg font-extrabold text-foreground">₹{money(estimatedTotal)}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Estimate only — final quote may vary by brand/availability.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-muted-foreground">TOTAL KG</p>
                    <p className="text-lg font-extrabold text-foreground">{totalKg.toFixed(1)} kg</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <h2 className="text-lg font-extrabold text-foreground mb-1">2) Your Details</h2>
            <p className="text-sm text-muted-foreground mb-4">We’ll use these details to confirm quote & schedule.</p>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Name</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm h-11"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm h-11"
                  placeholder="10-digit number"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm h-11"
                  placeholder="City / Area"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Email (optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm h-11"
                  placeholder="name@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  placeholder="Delivery time, brand preference, etc."
                />
              </div>

              <button
                type="button"
                disabled={submitting || loading}
                onClick={submit}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-sm font-extrabold text-primary-foreground hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Submitting…" : "Submit Bulk Order"}
              </button>

              <p className="text-xs text-muted-foreground">
                By submitting, your request will be saved in our system and we’ll contact you soon.
              </p>

              {/* <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs font-extrabold text-foreground mb-1">Need faster response?</p>
                <a
                  href="https://wa.me/918977775878?text=Hi%20Mr.Pitani,%20I%20need%20a%20bulk%20order%20quote"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <MessageCircle className="h-4 w-4" /> Message on WhatsApp
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Success Popup */}
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Bulk order placed!"
        message="Your request was saved successfully. We’ll contact you soon with quote & delivery schedule."
      />
    </Layout>
  );
}