import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const productName = searchParams.get("product") || "";
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: productName ? `I'd like a quote for: ${productName}` : "" });

  return (
    <Layout>
      <section className="hero-gradient py-16">
        <div className="container text-primary-foreground">
          <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-lg text-primary-foreground/80">Get in touch for orders, quotes, or any enquiries.</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-8 card-shadow">
            <h2 className="text-xl font-bold text-foreground mb-6">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Your message..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                Send Message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: "Phone", value: "+91 99999 99999" },
                  { icon: Mail, label: "Email", value: "orders@mrpitani.com" },
                  { icon: MapPin, label: "Address", value: "Cold Storage Complex, Industrial Area, City, State, India" },
                  { icon: Clock, label: "Business Hours", value: "Mon – Sat: 7:00 AM – 9:00 PM | Sun: 8:00 AM – 2:00 PM" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hero-gradient">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/919999999999?text=Hi%20Mr.Pitani,%20I%20want%20to%20enquire%20about%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-video flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Google Map Embed</p>
                <p className="text-xs">Map will be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
