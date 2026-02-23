import Layout from "@/components/layout/Layout";

const Privacy = () => (
  <Layout>
    <section className="hero-gradient py-16">
      <div className="container text-primary-foreground">
        <h1 className="text-4xl font-extrabold mb-4">Privacy Policy & Terms</h1>
      </div>
    </section>

    <section className="container py-16 max-w-3xl prose prose-sm">
      <h2 className="text-xl font-bold text-foreground mb-3">Privacy Policy</h2>
      <p className="text-muted-foreground mb-4">
        Mr.Pitani is committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data when you use our website and services.
      </p>
      <h3 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h3>
      <ul className="list-disc pl-5 text-muted-foreground mb-4 space-y-1">
        <li>Name, phone number, email address when you fill contact or order forms</li>
        <li>Business details for B2B enquiries</li>
        <li>Delivery address for order fulfillment</li>
        <li>Website usage data via cookies</li>
      </ul>
      <h3 className="text-lg font-semibold text-foreground mb-2">How We Use Your Data</h3>
      <p className="text-muted-foreground mb-4">
        Your data is used solely for processing orders, communicating about enquiries, and improving our services. We do not sell your data to third parties.
      </p>

      <hr className="my-8 border-border" />

      <h2 className="text-xl font-bold text-foreground mb-3">Terms of Service</h2>
      <p className="text-muted-foreground mb-4">
        By using Mr.Pitani's website and services, you agree to the following terms:
      </p>
      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
        <li>Product availability and prices are subject to change without notice</li>
        <li>All orders are subject to confirmation and availability</li>
        <li>Bulk orders require advance payment or credit arrangement</li>
        <li>Product images are representative; actual products may vary</li>
        <li>Delivery timelines are estimates and may vary based on location</li>
        <li>Returns and replacements are subject to our quality guarantee policy</li>
      </ul>
      <p className="text-muted-foreground mt-4">
        For questions about our privacy policy or terms, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
      </p>
    </section>
  </Layout>
);

export default Privacy;
