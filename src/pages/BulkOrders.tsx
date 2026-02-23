import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";

const benefits = [
  "Competitive bulk pricing",
  "Dedicated account manager",
  "Scheduled weekly/daily deliveries",
  "Temperature-controlled logistics",
  "Custom packaging available",
  "Flexible payment terms",
  "Priority order fulfillment",
  "Quality guarantee with every shipment",
];

const BulkOrders = () => (
  <Layout>
    <section className="hero-gradient py-16">
      <div className="container text-primary-foreground">
        <h1 className="text-4xl font-extrabold mb-4">Bulk Orders / B2B</h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl">
          Partner with Mr.Pitani for reliable, large-volume supply of frozen and raw food for your business.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Bulk With Us?</h2>
          <p className="text-muted-foreground mb-6">
            We supply hotels, restaurants, caterers, cloud kitchens, and retail chains with consistent-quality frozen and raw food at wholesale rates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 card-shadow">
          <h3 className="text-xl font-bold text-foreground mb-4">Request Bulk Quote</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Business Name" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="text" placeholder="Contact Person" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="tel" placeholder="Phone Number" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="email" placeholder="Email" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <textarea placeholder="Products & quantities you need..." rows={4} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
              Submit Enquiry
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">Or reach us directly</p>
            <a
              href="https://wa.me/919999999999?text=Hi%20Mr.Pitani,%20I%20need%20a%20bulk%20order%20quote"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp for Bulk Orders
            </a>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default BulkOrders;
