import Layout from "@/components/layout/Layout";
import { Snowflake, Thermometer, Truck, BarChart3 } from "lucide-react";

const ColdStorage = () => (
  <Layout>
    <section className="hero-gradient py-16">
      <div className="container text-primary-foreground">
        <h1 className="text-4xl font-extrabold mb-4">Cold Storage & Logistics</h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl">
          State-of-the-art cold chain infrastructure ensuring your products stay fresh from warehouse to doorstep.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {[
          { icon: Snowflake, title: "10,000+ sq.ft", desc: "Cold storage capacity" },
          { icon: Thermometer, title: "-18°C to +4°C", desc: "Temperature range maintained" },
          { icon: Truck, title: "Reefer Fleet", desc: "Refrigerated transport vehicles" },
          { icon: BarChart3, title: "Real-time Monitoring", desc: "IoT-based temperature tracking" },
        ].map((stat) => (
          <div key={stat.title} className="text-center rounded-xl border border-border bg-card p-6 card-shadow">
            <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground">{stat.title}</h3>
            <p className="text-sm text-muted-foreground">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted/50 p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Our Cold Chain Process</h2>
        <div className="space-y-4">
          {[
            "Products sourced from certified farms, fisheries, and producers",
            "Immediate processing and blast freezing at our facility",
            "Stored in temperature-controlled cold rooms with 24/7 monitoring",
            "Packed in insulated packaging with ice packs for transit",
            "Delivered via refrigerated vehicles maintaining -18°C throughout",
            "Last-mile delivery with temperature validation at doorstep",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hero-gradient text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm text-foreground pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default ColdStorage;
