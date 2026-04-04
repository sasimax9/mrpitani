import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle, FileText, Store, Mail, CreditCard, Download, Send, X, CheckCircle2, Truck, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { useCart } from "@/contexts/CartContext";
import { getProductPrice } from "@/data/products";
import { getProductImageUrl, getCategoryImageUrl } from "@/lib/imageUrl";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, getDiscount } = useCart();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const estimateKg = (): number => {
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
  };

  const totalKg = estimateKg();
  const discountPct = getDiscount(totalKg);
  const discountAmt = (totalPrice * discountPct) / 100;
  const finalPrice = totalPrice - discountAmt;

  const buildOrderText = () => {
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
  };

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
    <div class="footer"><p>Thank you for choosing Mr.Pitani!</p><p>Contact: WhatsApp +91-9999999999</p></div>
    </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEmailSend = () => {
    if (!email) return;
    const subject = encodeURIComponent("My Mr.Pitani Cart Summary");
    const body = encodeURIComponent(buildOrderText());
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
    setEmailSent(true);
    setTimeout(() => { setEmailSent(false); setEmailDialogOpen(false); setEmail(""); }, 2000);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mx-auto mb-6 h-24 w-24 rounded-full glass-card flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">Browse our products and add items to your cart.</p>
            <Link to="/products" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.03] transition-transform">
              Browse Products
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">Your Cart</h1>
              <p className="text-sm text-muted-foreground mt-1">{items.length} item{items.length > 1 ? "s" : ""} · Est. {totalKg.toFixed(1)} kg</p>
            </div>
            <button onClick={clearCart} className="text-sm text-destructive hover:underline font-medium flex items-center gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Clear All
            </button>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, idx) => {
              const price = getProductPrice(item.product, item.selectedBrand);
              const img = getProductImageUrl(item.product.imagePath) || getCategoryImageUrl(item.product.category);
              return (
                <ScrollReveal key={`${item.product.id}-${item.selectedPack}-${item.selectedBrand}`} direction="left" delay={idx * 0.05}>
                  <motion.div
                    layout
                    className="flex gap-4 items-center rounded-2xl glass-card p-4 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                      <img src={img} alt={item.product.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-sm truncate">{item.product.name}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        {item.selectedBrand && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-foreground bg-accent/20 px-1.5 py-0.5 rounded">
                            <Store className="h-2.5 w-2.5" /> {item.selectedBrand}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">{item.selectedPack} · ₹{price}/unit</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQuantity(item.product.id, item.selectedPack, item.quantity - 1)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:bg-muted transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-bold w-7 text-center tabular-nums">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedPack, item.quantity + 1)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:bg-muted transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-primary w-16 text-right tabular-nums">₹{(price * item.quantity).toFixed(0)}</p>
                    <button onClick={() => removeFromCart(item.product.id, item.selectedPack)} className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <ScrollReveal direction="right">
              <div className="rounded-2xl glass-card p-6 sticky top-20">
                <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Order Summary
                </h2>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{totalPrice.toFixed(0)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Est. Weight</span><span className="font-semibold">{totalKg.toFixed(1)} kg</span></div>
                  {discountPct > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Bulk ({discountPct}%)</span>
                      <span className="font-semibold">-₹{discountAmt.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="border-t border-border/50 pt-3 flex justify-between text-lg font-extrabold">
                    <span>Total</span>
                    <span className="text-primary">₹{finalPrice.toFixed(0)}</span>
                  </div>
                </div>

                {/* Discount tiers */}
                <div className="mt-4 rounded-xl bg-muted/50 p-3">
                  <p className="text-xs font-bold text-foreground mb-2">Bulk Discounts</p>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {[
                      { kg: 10, pct: 5 },
                      { kg: 20, pct: 10 },
                      { kg: 30, pct: 15 },
                    ].map((tier) => (
                      <div key={tier.kg} className={`flex items-center gap-2 ${totalKg >= tier.kg ? "text-secondary font-semibold" : ""}`}>
                        {totalKg >= tier.kg ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                        {tier.kg}kg+ → {tier.pct}% off
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 space-y-2.5">
                  <a
                    href={`https://wa.me/919999999999?text=${encodeURIComponent(buildOrderText())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--whatsapp))] py-3 font-bold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" /> Order via WhatsApp
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={generatePDF}
                      className="flex items-center justify-center gap-1.5 rounded-xl glass-card py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-all"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                    <button
                      onClick={() => setEmailDialogOpen(true)}
                      className="flex items-center justify-center gap-1.5 rounded-xl glass-card py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-all"
                    >
                      <Mail className="h-3.5 w-3.5" /> Email
                    </button>
                  </div>

                  <Link
                    to="/contact?from=cart"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <FileText className="h-4 w-4" /> Request Quote
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Payment Options Skeleton */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="rounded-2xl glass-card p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment Options
                  <span className="ml-auto text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Coming Soon</span>
                </h3>
                <div className="space-y-3 opacity-50">
                  {[
                    { icon: CreditCard, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                    { icon: Shield, label: "UPI Payment", desc: "GPay, PhonePe, Paytm" },
                    { icon: Truck, label: "Cash on Delivery", desc: "Pay when delivered" },
                    { icon: Clock, label: "Net Banking", desc: "All major banks" },
                  ].map((opt) => (
                    <div key={opt.label} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <opt.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{opt.label}</p>
                        <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Email Dialog */}
      <AnimatePresence>
        {emailDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setEmailDialogOpen(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl glass-card p-6 shadow-2xl"
              style={{ backdropFilter: "blur(24px) saturate(2)" }}
            >
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
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-xl glass-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSend()}
                  />
                  <button
                    onClick={handleEmailSend}
                    disabled={!email}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-40 hover:shadow-lg transition-all"
                  >
                    <Send className="h-4 w-4" /> Send Cart Summary
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Cart;
