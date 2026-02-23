import Layout from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What areas do you deliver to?", a: "We deliver across major cities and towns within a 500km radius of our cold storage hubs. Contact us for specific pin code availability." },
  { q: "What is the minimum order quantity?", a: "For retail orders, there's no minimum. For bulk/B2B orders, minimum quantities vary by product. Contact us for details." },
  { q: "How do you maintain the cold chain?", a: "All our products are stored at -18°C in certified cold storage facilities and transported in refrigerated vehicles. Temperature is monitored throughout." },
  { q: "Do you offer custom packaging?", a: "Yes, we offer white-label and custom packaging solutions for businesses. Contact us for private label partnerships." },
  { q: "What payment methods do you accept?", a: "We accept UPI, bank transfers, cheques, and cash on delivery for retail orders. B2B clients can avail credit terms." },
  { q: "Are your products FSSAI certified?", a: "Yes, all our products are FSSAI certified and undergo rigorous quality checks at every stage." },
  { q: "Can I schedule regular deliveries?", a: "Absolutely! We offer daily, weekly, and custom delivery schedules for businesses. Contact us to set up a schedule." },
  { q: "How do I place a bulk order?", a: "You can submit a bulk enquiry via our Bulk Orders page, WhatsApp us, or call directly. Our team will get back to you within 2 hours." },
  { q: "Do you supply to restaurants and hotels?", a: "Yes, we are a preferred supplier to hotels, restaurants, caterers, and cloud kitchens across the region." },
  { q: "What if I receive a damaged product?", a: "We have a 100% replacement guarantee for damaged or temperature-compromised products. Contact us within 24 hours of delivery." },
];

const FAQ = () => (
  <Layout>
    <section className="hero-gradient py-16">
      <div className="container text-primary-foreground">
        <h1 className="text-4xl font-extrabold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-primary-foreground/80">Everything you need to know about ordering from Mr.Pitani.</p>
      </div>
    </section>

    <section className="container py-16 max-w-3xl">
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-6 card-shadow">
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  </Layout>
);

export default FAQ;
