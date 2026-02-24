import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle, FileText } from "lucide-react";
import { useState } from "react";

import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import OrderDetailsModal from "@/components/OrderDetailModal";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, getDiscount } = useCart();
  const [orderOpen, setOrderOpen] = useState(false);

  // Estimate total weight in kg from pack sizes
  const estimateKg = (): number => {
    let totalGrams = 0;

    items.forEach((item) => {
      const pack = item.selectedPack.toLowerCase();
      const num = parseFloat(pack);

      if (pack.includes("kg")) totalGrams += num * 1000 * item.quantity;
      else if (pack.includes("g")) totalGrams += num * item.quantity;
      else if (pack.includes("l")) totalGrams += num * 1000 * item.quantity;
      else if (pack.includes("ml")) totalGrams += num * item.quantity;
      else if (pack.includes("pcs")) totalGrams += 100 * item.quantity; // rough est
    });

    return totalGrams / 1000;
  };

  const totalKg = estimateKg();
  const discountPct = getDiscount(totalKg);
  const discountAmt = (totalPrice * discountPct) / 100;
  const finalPrice = totalPrice - discountAmt;

  const buildOrderText = (customer: { name: string; phone: string; email?: string; address: string }) => {
    let text = `Hi Mr.Pitani, I'd like to order:\n\n`;

    text += `Customer:\n`;
    text += `Name: ${customer.name}\n`;
    text += `Phone: ${customer.phone}\n`;
    if (customer.email?.trim()) text += `Email: ${customer.email}\n`;
    text += `Address: ${customer.address}\n\n`;

    items.forEach((i) => {
      text += `• ${i.product.name} (${i.selectedPack}) x${i.quantity} — ₹${((i.product.price ?? 0) * i.quantity).toFixed(0)}\n`;
    });

    text += `\nSubtotal: ₹${totalPrice.toFixed(0)}`;
    if (discountPct > 0) text += `\nBulk Discount (${discountPct}%): -₹${discountAmt.toFixed(0)}`;
    text += `\nTotal: ₹${finalPrice.toFixed(0)}`;
    text += `\nEst. Weight: ${totalKg.toFixed(1)} kg`;

    return text;
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Browse our products and add items to your cart.</p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:scale-105 transition-transform"
          >
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Your Cart ({items.length} items)</h1>
          <button onClick={clearCart} className="text-sm text-destructive hover:underline">
            Clear All
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedPack}`}
                className="flex gap-4 items-center rounded-xl border border-border bg-card p-4 card-shadow"
              >
                <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-2xl">{item.product.type === "veg" ? "🥬" : "🍗"}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{item.product.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.selectedPack} · ₹{item.product.price ?? 0}/unit
                  </p>
                </div>

              <div className="flex items-center gap-2">
  <button
    disabled={item.quantity <= 1}
    onClick={() => updateQuantity(item.product.id, item.selectedPack, item.quantity - 1)}
    className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-muted
               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
  >
    <Minus className="h-3 w-3" />
  </button>

  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>

  <button
    disabled={item.quantity >= 500}
    onClick={() => updateQuantity(item.product.id, item.selectedPack, item.quantity + 1)}
    className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-muted
               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
  >
    <Plus className="h-3 w-3" />
  </button>
</div>

                <p className="text-sm font-bold text-foreground w-16 text-right">
                  ₹{((item.product.price ?? 0) * item.quantity).toFixed(0)}
                </p>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedPack)}
                  className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-border bg-card p-6 card-shadow h-fit sticky top-20">
            <h2 className="font-bold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Weight</span>
                <span className="font-medium">{totalKg.toFixed(1)} kg</span>
              </div>

              {discountPct > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Bulk Discount ({discountPct}%)</span>
                  <span className="font-medium">-₹{discountAmt.toFixed(0)}</span>
                </div>
              )}

              <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{finalPrice.toFixed(0)}</span>
              </div>
            </div>

            {/* Discount tiers */}
            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-xs font-semibold text-foreground mb-1.5">Bulk Discounts</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className={totalKg >= 10 ? "text-secondary font-semibold" : ""}>10kg+ → 5% off</p>
                <p className={totalKg >= 20 ? "text-secondary font-semibold" : ""}>20kg+ → 10% off</p>
                <p className={totalKg >= 30 ? "text-secondary font-semibold" : ""}>30kg+ → 15% off</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => setOrderOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" /> Order via WhatsApp
              </button>

              <Link
                to="/contact?from=cart"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FileText className="h-4 w-4" /> Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal should be inside Layout */}
      <OrderDetailsModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        items={items}
        totalPrice={totalPrice}
        totalKg={totalKg}
        discountPct={discountPct}
        discountAmt={discountAmt}
        finalPrice={finalPrice}
        buildOrderText={buildOrderText}
      />
    </Layout>
  );
};

export default Cart;