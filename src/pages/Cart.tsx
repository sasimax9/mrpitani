import { useState, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle, FileText, Store, Mail, CreditCard, Download, Send, X, CheckCircle2, Truck, Shield, Clock, MapPin, Phone, User, Loader2, Building2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart, CartItem } from "@/contexts/CartContext";
import { getProductPrice } from "@/data/products";
import { getProductImageUrl, getCategoryImageUrl } from "@/lib/imageUrl";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ── Memoized single cart line ── */
const CartLine = memo(({ item, onUpdate, onRemove }: {
  item: CartItem;
  onUpdate: (id: string, pack: string, qty: number, brand?: string) => void;
  onRemove: (id: string, pack: string, brand?: string) => void;
}) => {
  const price = getProductPrice(item.product, item.selectedBrand);
  const img = getProductImageUrl(item.product.imagePath) || getCategoryImageUrl(item.product.category);
  const key = `${item.product.id}-${item.selectedPack}-${item.selectedBrand}`;

  return (
    <div key={key} className="flex gap-3 sm:gap-4 items-center rounded-2xl glass-card p-3 sm:p-4">
      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl overflow-hidden shrink-0 bg-muted">
        <img src={img} alt={item.product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground text-xs sm:text-sm truncate">{item.product.name}</h3>
        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          {item.selectedBrand && (
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-accent-foreground bg-accent/20 px-1.5 py-0.5 rounded">
              <Store className="h-2.5 w-2.5" /> {item.selectedBrand}
            </span>
          )}
          <span className="text-[10px] sm:text-xs text-muted-foreground">{item.selectedPack} · ₹{price}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onUpdate(item.product.id, item.selectedPack, item.quantity - 1, item.selectedBrand)} className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg glass-card flex items-center justify-center hover:bg-muted transition-colors">
          <Minus className="h-3 w-3" />
        </button>
        <span className="text-xs sm:text-sm font-bold w-6 sm:w-7 text-center tabular-nums">{item.quantity}</span>
        <button onClick={() => onUpdate(item.product.id, item.selectedPack, item.quantity + 1, item.selectedBrand)} className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg glass-card flex items-center justify-center hover:bg-muted transition-colors">
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <p className="text-xs sm:text-sm font-bold text-primary w-12 sm:w-16 text-right tabular-nums">₹{(price * item.quantity).toFixed(0)}</p>
      <button onClick={() => onRemove(item.product.id, item.selectedPack, item.selectedBrand)} className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 p-1.5 sm:p-2 rounded-lg transition-colors">
        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
});
CartLine.displayName = "CartLine";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, getDiscount } = useCart();
  const { user } = useAuth();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [codDialogOpen, setCodDialogOpen] = useState(false);
  const [pickupDialogOpen, setPickupDialogOpen] = useState(false);
  const [codForm, setCodForm] = useState({ name: "", phone: "", address: "" });
  const [pickupForm, setPickupForm] = useState({ name: "", phone: "" });
  const [codLoading, setCodLoading] = useState(false);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [codSuccess, setCodSuccess] = useState(false);
  const [pickupSuccess, setPickupSuccess] = useState(false);

  const totalKg = useMemo(() => {
    let totalGrams = 0;
    items.forEach((item) => {
      const pack = item.selectedPack.toLowerCase();
      const num = parseFloat(pack);
      if (pack.includes("kg")) totalGrams += num * 1000 * item.quantity;
      else if (pack.includes("g")) totalGrams += num * item.quantity;
      else if (pack.includes("l")) totalGrams += num * 1000 * item.quantity;
      else if (pack.includes("ml")) totalGrams += num * item.quantity;
      else if (pack.includes("pcs")) totalGrams += 100 * item.quantity;
    });
    return totalGrams / 1000;
  }, [items]);

  const discountPct = getDiscount(totalKg);
  const discountAmt = (totalPrice * discountPct) / 100;
  const finalPrice = totalPrice - discountAmt;

  const orderText = useMemo(() => {
    let text = "Hi Mr.Pitani, I'd like to order:\n\n";
    items.forEach((i) => {
      const price = getProductPrice(i.product, i.selectedBrand);
      text += `• ${i.product.name}${i.selectedBrand ? ` (${i.selectedBrand})` : ""} (${i.selectedPack}) x${i.quantity} — ₹${(price * i.quantity).toFixed(0)}\n`;
    });
    text += `\nSubtotal: ₹${totalPrice.toFixed(0)}`;
    if (discountPct > 0) text += `\nBulk Discount (${discountPct}%): -₹${discountAmt.toFixed(0)}`;
    text += `\nTotal: ₹${finalPrice.toFixed(0)}`;
    text += `\nEst. Weight: ${totalKg.toFixed(1)} kg`;
    return text;
  }, [items, totalPrice, discountPct, discountAmt, finalPrice, totalKg]);

  const handleUpdate = useCallback((id: string, pack: string, qty: number, brand?: string) => {
    updateQuantity(id, pack, qty, brand);
  }, [updateQuantity]);

  const handleRemove = useCallback((id: string, pack: string, brand?: string) => {
    removeFromCart(id, pack, brand);
  }, [removeFromCart]);

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const rows = items.map((i) => {
      const price = getProductPrice(i.product, i.selectedBrand);
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:13px">${i.product.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:13px">${i.selectedBrand || "-"}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:13px">${i.selectedPack}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center">${i.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:right">₹${price.toFixed(0)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:right;font-weight:600">₹${(price * i.quantity).toFixed(0)}</td>
      </tr>`;
    }).join("");
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Mr.Pitani - Cart Summary</title>
    <style>
      body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1a1a1a;max-width:800px;margin:0 auto}
      h1{color:#0e7490;margin-bottom:4px}
      table{width:100%;border-collapse:collapse;margin:24px 0}
      th{background:#f0f9ff;padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#0e7490;border-bottom:2px solid #0e7490}
      .summary{background:#f8fafc;border-radius:12px;padding:20px;margin-top:20px}
      .summary-row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
      .total-row{font-size:18px;font-weight:700;color:#0e7490;border-top:2px solid #0e7490;padding-top:12px;margin-top:8px}
      .footer{margin-top:32px;font-size:12px;color:#999;text-align:center}
    </style></head><body>
    <h1>Mr.Pitani</h1>
    <p style="color:#666;margin-bottom:24px">Fresh. Frozen. Fast Delivery. | Cart Summary</p>
    <p style="font-size:13px;color:#666">Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
    <table>
      <thead><tr><th>Product</th><th>Brand</th><th>Pack</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="summary">
      <div class="summary-row"><span>Subtotal</span><span>₹${totalPrice.toFixed(0)}</span></div>
      <div class="summary-row"><span>Est. Weight</span><span>${totalKg.toFixed(1)} kg</span></div>
      ${discountPct > 0 ? `<div class="summary-row" style="color:#059669"><span>Bulk Discount (${discountPct}%)</span><span>-₹${discountAmt.toFixed(0)}</span></div>` : ""}
      <div class="summary-row total-row"><span>Grand Total</span><span>₹${finalPrice.toFixed(0)}</span></div>
    </div>
    <div class="footer"><p>Thank you for choosing Mr.Pitani!</p><p>Contact: WhatsApp +91-8977775878</p></div>
    </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEmailSend = () => {
    if (!email) return;
    const subject = encodeURIComponent("My Mr.Pitani Cart Summary");
    const body = encodeURIComponent(orderText);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
    setEmailSent(true);
    setTimeout(() => { setEmailSent(false); setEmailDialogOpen(false); setEmail(""); }, 2000);
  };

  const handlePlaceCOD = async () => {
    if (!codForm.name || !codForm.phone || !codForm.address) {
      toast.error("Please fill all delivery details");
      return;
    }
    setCodLoading(true);
    try {
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        user_id: user!.id,
        payment_method: "cod",
        payment_status: "pending",
        delivery_name: codForm.name,
        delivery_phone: codForm.phone,
        delivery_address: codForm.address,
        subtotal: totalPrice,
        discount_percent: discountPct,
        total: finalPrice,
      }).select("id").single();
      if (orderErr) throw orderErr;

      const orderItems = items.map((i) => {
        const price = getProductPrice(i.product, i.selectedBrand);
        return {
          order_id: order.id,
          product_id: i.product.id,
          product_name: i.product.name,
          brand_name: i.selectedBrand || null,
          pack_size: i.selectedPack,
          quantity: i.quantity,
          unit_price: price,
          total_price: price * i.quantity,
        };
      });
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      setCodSuccess(true);
      clearCart();
      setTimeout(() => {
        setCodSuccess(false);
        setCodDialogOpen(false);
        setCodForm({ name: "", phone: "", address: "" });
      }, 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      toast.error(message);
    } finally {
      setCodLoading(false);
    }
  };

  const handlePlacePickup = async () => {
    if (!pickupForm.name || !pickupForm.phone) {
      toast.error("Please fill your name and phone number");
      return;
    }
    setPickupLoading(true);
    try {
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        user_id: user!.id,
        payment_method: "pickup",
        payment_status: "pending",
        delivery_name: pickupForm.name,
        delivery_phone: pickupForm.phone,
        delivery_address: "Store Pickup",
        subtotal: totalPrice,
        discount_percent: discountPct,
        total: finalPrice,
      }).select("id").single();
      if (orderErr) throw orderErr;

      const orderItems = items.map((i) => {
        const price = getProductPrice(i.product, i.selectedBrand);
        return {
          order_id: order.id,
          product_id: i.product.id,
          product_name: i.product.name,
          brand_name: i.selectedBrand || null,
          pack_size: i.selectedPack,
          quantity: i.quantity,
          unit_price: price,
          total_price: price * i.quantity,
        };
      });
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      setPickupSuccess(true);
      clearCart();
      setTimeout(() => {
        setPickupSuccess(false);
        setPickupDialogOpen(false);
        setPickupForm({ name: "", phone: "" });
      }, 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      toast.error(message);
    } finally {
      setPickupLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full glass-card flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Browse our products and add items to your cart.</p>
          <Link to="/products" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-lg shadow-primary/20">
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground">Your Cart</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{items.length} item{items.length > 1 ? "s" : ""} · Est. {totalKg.toFixed(1)} kg</p>
          </div>
          <button onClick={clearCart} className="text-xs sm:text-sm text-destructive hover:underline font-medium flex items-center gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-3 max-h-[65vh] lg:max-h-[72vh] overflow-y-auto pr-1 overscroll-contain">
            {items.map((item) => (
              <CartLine
                key={`${item.product.id}-${item.selectedPack}-${item.selectedBrand}`}
                item={item}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="rounded-2xl glass-card p-5 sm:p-6 sticky top-20">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm sm:text-base">
                <FileText className="h-4 w-4 text-primary" /> Order Summary
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{totalPrice.toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Est. Weight</span><span className="font-semibold">{totalKg.toFixed(1)} kg</span></div>
                {discountPct > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Bulk ({discountPct}%)</span>
                    <span className="font-semibold">-₹{discountAmt.toFixed(0)}</span>
                  </div>
                )}
                <div className="border-t border-border/50 pt-3 flex justify-between text-base sm:text-lg font-extrabold">
                  <span>Total</span>
                  <span className="text-primary">₹{finalPrice.toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-muted/50 p-3">
                <p className="text-[10px] sm:text-xs font-bold text-foreground mb-2">Bulk Discounts</p>
                <div className="space-y-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  {[{ kg: 10, pct: 5 }, { kg: 20, pct: 10 }, { kg: 30, pct: 15 }].map((tier) => (
                    <div key={tier.kg} className={`flex items-center gap-2 ${totalKg >= tier.kg ? "text-secondary font-semibold" : ""}`}>
                      {totalKg >= tier.kg ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                      {tier.kg}kg+ → {tier.pct}% off
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <a
                  href={`https://wa.me/918977775878?text=${encodeURIComponent(orderText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--whatsapp))] py-3 text-xs sm:text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" /> Order via WhatsApp
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={generatePDF} className="flex items-center justify-center gap-1.5 rounded-xl glass-card py-2.5 text-[10px] sm:text-xs font-bold text-foreground hover:bg-muted transition-colors">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                  <button onClick={() => setEmailDialogOpen(true)} className="flex items-center justify-center gap-1.5 rounded-xl glass-card py-2.5 text-[10px] sm:text-xs font-bold text-foreground hover:bg-muted transition-colors">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </button>
                </div>
                <Link
                  to="/contact?from=cart"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 text-xs sm:text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <FileText className="h-4 w-4" /> Request Quote
                </Link>
              </div>
            </div>

            {/* Payment Options */}
            <div className="rounded-2xl glass-card p-4 sm:p-5">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 text-xs sm:text-sm">
                <CreditCard className="h-4 w-4 text-primary" /> Payment Options
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {/* Cash on Delivery */}
                <button
                  onClick={() => {
                    if (!user) { toast.error("Please sign in to place a COD order"); return; }
                    setCodDialogOpen(true);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl bg-secondary/10 border border-secondary/20 p-3 hover:bg-secondary/20 transition-colors text-left"
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                    <Truck className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-foreground">Cash on Delivery</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground">Pay when delivered</p>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full shrink-0">Available</span>
                </button>

                {/* Pay & Take (Store Pickup) */}
                <button
                  onClick={() => {
                    if (!user) { toast.error("Please sign in to place a pickup order"); return; }
                    setPickupDialogOpen(true);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 p-3 hover:bg-primary/20 transition-colors text-left"
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-foreground">Pay & Take at Store</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground">Pick up & pay at our store</p>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full shrink-0">Available</span>
                </button>

                <div className="opacity-50 space-y-2">
                  {[
                    { icon: CreditCard, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                    { icon: Shield, label: "UPI Payment", desc: "GPay, PhonePe, Paytm" },
                    { icon: Clock, label: "Net Banking", desc: "All major banks" },
                  ].map((opt) => (
                    <div key={opt.label} className="flex items-center gap-3 rounded-xl bg-muted/30 p-2.5 sm:p-3">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <opt.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-bold text-foreground">{opt.label}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground">{opt.desc}</p>
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">Soon</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COD Dialog */}
      {codDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => !codLoading && setCodDialogOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl glass-card p-5 sm:p-6 shadow-2xl" style={{ backdropFilter: "blur(24px) saturate(2)" }}>
            <button onClick={() => !codLoading && setCodDialogOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
            {codSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto h-12 w-12 text-secondary mb-3" />
                <p className="font-bold text-foreground text-lg">Order Placed!</p>
                <p className="text-sm text-muted-foreground mt-1">Your COD order has been confirmed.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-secondary" /> Cash on Delivery
                </h3>
                <p className="text-xs text-muted-foreground mb-4">Fill in delivery details to place your order</p>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input value={codForm.name} onChange={(e) => setCodForm({ ...codForm, name: e.target.value })} placeholder="Full Name" className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input value={codForm.phone} onChange={(e) => setCodForm({ ...codForm, phone: e.target.value })} placeholder="Phone Number" className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea value={codForm.address} onChange={(e) => setCodForm({ ...codForm, address: e.target.value })} placeholder="Delivery Address" rows={3} className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-primary">₹{finalPrice.toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{items.length} items · {totalKg.toFixed(1)} kg{discountPct > 0 ? ` · ${discountPct}% bulk discount` : ""}</p>
                  </div>
                  <button onClick={handlePlaceCOD} disabled={codLoading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 font-bold text-secondary-foreground disabled:opacity-50 hover:brightness-110 transition-all">
                    {codLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                    {codLoading ? "Placing Order..." : `Place COD Order · ₹${finalPrice.toFixed(0)}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pay & Take Pickup Dialog */}
      {pickupDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => !pickupLoading && setPickupDialogOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl glass-card p-5 sm:p-6 shadow-2xl" style={{ backdropFilter: "blur(24px) saturate(2)" }}>
            <button onClick={() => !pickupLoading && setPickupDialogOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
            {pickupSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto h-12 w-12 text-secondary mb-3" />
                <p className="font-bold text-foreground text-lg">Order Confirmed!</p>
                <p className="text-sm text-muted-foreground mt-1">Your order is ready for pickup. Pay at the store.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Pay & Take at Store
                </h3>
                <p className="text-xs text-muted-foreground mb-4">We'll prepare your order for pickup</p>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input value={pickupForm.name} onChange={(e) => setPickupForm({ ...pickupForm, name: e.target.value })} placeholder="Full Name" className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input value={pickupForm.phone} onChange={(e) => setPickupForm({ ...pickupForm, phone: e.target.value })} placeholder="Phone Number" className="w-full rounded-xl glass-input pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div className="rounded-xl bg-primary/5 border border-primary/10 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="text-xs font-bold text-foreground">Store Location</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Mr.Pitani Store, Main Road, Near Market Junction</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Open: 9 AM – 9 PM, Mon – Sat</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-primary">₹{finalPrice.toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{items.length} items · {totalKg.toFixed(1)} kg{discountPct > 0 ? ` · ${discountPct}% bulk discount` : ""}</p>
                  </div>
                  <button onClick={handlePlacePickup} disabled={pickupLoading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-50 hover:brightness-110 transition-all">
                    {pickupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
                    {pickupLoading ? "Placing Order..." : `Confirm Pickup · ₹${finalPrice.toFixed(0)}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email Dialog */}
      {emailDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setEmailDialogOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl glass-card p-5 sm:p-6 shadow-2xl" style={{ backdropFilter: "blur(24px) saturate(2)" }}>
            <button onClick={() => setEmailDialogOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
            {emailSent ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto h-12 w-12 text-secondary mb-3" />
                <p className="font-bold text-foreground">Email client opened!</p>
                <p className="text-sm text-muted-foreground mt-1">Your cart summary is ready to send.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> Email Cart Summary
                </h3>
                <p className="text-xs text-muted-foreground mb-4">Send your cart details to any email address</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" className="w-full rounded-xl glass-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" onKeyDown={(e) => e.key === "Enter" && handleEmailSend()} />
                <button onClick={handleEmailSend} disabled={!email} className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-40 hover:brightness-110 transition-all">
                  <Send className="h-4 w-4" /> Send Cart Summary
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
