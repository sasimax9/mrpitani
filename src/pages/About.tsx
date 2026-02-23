import Layout from "@/components/layout/Layout";
import { ShieldCheck, Leaf, Snowflake, Award } from "lucide-react";

const About = () => (
  <Layout>
    <section className="hero-gradient py-16">
      <div className="container text-primary-foreground">
        <h1 className="text-4xl font-extrabold mb-4">About Mr.Pitani</h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl">
          Your trusted partner for premium raw & frozen food distribution across India.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Mr.Pitani was founded with a simple mission: to bring the freshest raw and frozen food to every kitchen in India – whether it's a home, restaurant, hotel, or catering business.
          </p>
          <p className="text-muted-foreground mb-4">
            We source directly from farms, fisheries, and certified producers to ensure consistent quality. Our state-of-the-art cold storage facilities maintain products at optimal temperatures from warehouse to doorstep.
          </p>
          <p className="text-muted-foreground">
            With a growing network of distribution partners and a fleet of temperature-controlled vehicles, we're expanding our reach across major cities and towns in India.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: ShieldCheck, title: "FSSAI Certified", desc: "All products meet food safety standards" },
            { icon: Leaf, title: "Ethically Sourced", desc: "Direct from farms & fisheries" },
            { icon: Snowflake, title: "Cold Chain", desc: "-18°C maintained end to end" },
            { icon: Award, title: "Quality First", desc: "Rigorous quality checks at every step" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5 card-shadow">
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-muted/50 py-16">
      <div className="container">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Certifications</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {["FSSAI License", "ISO 22000", "HACCP Certified", "Cold Chain Compliant"].map((cert) => (
            <div key={cert} className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 card-shadow">
              <Award className="h-6 w-6 text-primary" />
              <span className="font-semibold text-sm text-foreground">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
