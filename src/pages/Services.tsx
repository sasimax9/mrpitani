import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Truck, Building2, ShoppingBag, Snowflake, Package, CalendarClock } from "lucide-react";

const services = [
  { icon: Snowflake, title: "Frozen Food Distribution", desc: "We distribute a wide range of frozen food products including vegetables, seafood, chicken, mutton, and ready-to-cook items. All products are stored and transported at -18°C.", link: "/products" },
  { icon: Building2, title: "B2B Supply (Hotels/Restaurants)", desc: "Dedicated supply chain for hotels, restaurants, caterers, and cloud kitchens. Scheduled deliveries, bulk pricing, and dedicated account manager.", link: "/bulk-orders" },
  { icon: ShoppingBag, title: "Retail Supply", desc: "Quality frozen and raw food for retail stores, supermarkets, and kirana shops. Flexible pack sizes and competitive pricing.", link: "/retail-orders" },
  { icon: Truck, title: "Cold Storage & Logistics", desc: "State-of-the-art cold storage facilities with temperature monitoring. Refrigerated transport fleet ensures quality from warehouse to doorstep.", link: "/cold-storage" },
  { icon: Package, title: "Custom Packaging", desc: "White-label and custom packaging solutions for your brand. Private label partnerships available for restaurants and retailers." },
  { icon: CalendarClock, title: "Scheduled Delivery", desc: "Regular scheduled deliveries for businesses. Set your delivery frequency – daily, weekly, or custom schedules." },
];

const Services = () => (
  <Layout>
    <section className="hero-gradient py-16">
      <div className="container text-primary-foreground">
        <h1 className="text-4xl font-extrabold mb-4">Our Services</h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl">
          End-to-end frozen and raw food distribution services for businesses and retail customers across India.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-6 card-shadow flex flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl hero-gradient">
              <s.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground flex-1">{s.desc}</p>
            {s.link && (
              <Link to={s.link} className="mt-4 text-sm font-semibold text-primary hover:underline">
                Learn more →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Services;
