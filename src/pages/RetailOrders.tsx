import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ShoppingBag, Package, Truck } from "lucide-react";

const RetailOrders = () => (
  <Layout>
    <section className="hero-gradient py-16">
      <div className="container text-primary-foreground">
        <h1 className="text-4xl font-extrabold mb-4">Retail Orders</h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl">
          Quality frozen and raw food delivered to your home. Browse our catalog and order via WhatsApp.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-8 md:grid-cols-3 mb-12">
        {[
          { icon: ShoppingBag, title: "Browse Products", desc: "Explore our full catalog of veg and non-veg products." },
          { icon: Package, title: "Choose Pack Sizes", desc: "Available in convenient retail sizes – 250g to 1kg." },
          { icon: Truck, title: "Get Delivered", desc: "Fast delivery to your doorstep, temperature maintained." },
        ].map((step, i) => (
          <div key={step.title} className="text-center rounded-xl border border-border bg-card p-6 card-shadow">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full hero-gradient">
              <step.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Step {i + 1}</p>
            <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105">
          Browse Products
        </Link>
      </div>
    </section>
  </Layout>
);

export default RetailOrders;
