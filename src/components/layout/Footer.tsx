import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-2">Mr.Pitani</h3>
          <p className="text-sm text-primary-foreground/70 mb-4">Fresh. Frozen. Fast Delivery.</p>
          <p className="text-sm text-primary-foreground/70">
            India's trusted raw & frozen food Supplier. Quality products for homes, restaurants, and businesses.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link>
            <Link to="/products" className="hover:text-primary-foreground transition-colors">Products</Link>
            <Link to="/services" className="hover:text-primary-foreground transition-colors">Services</Link>
            <Link to="/bulk-orders" className="hover:text-primary-foreground transition-colors">Bulk Orders</Link>
            <Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-semibold mb-3">Products</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            <Link to="/products/veg" className="hover:text-primary-foreground transition-colors">Veg Products</Link>
            <Link to="/products/non-veg" className="hover:text-primary-foreground transition-colors">Non-Veg Products</Link>
            <Link to="/retail-orders" className="hover:text-primary-foreground transition-colors">Retail Orders</Link>
            <Link to="/faq" className="hover:text-primary-foreground transition-colors">FAQ</Link>
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" />
              <span>+91 89777 75878</span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" />
              <span>orders@mrpitani.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Cold Storage Complex, Industrial Area, India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
        <p>© {new Date().getFullYear()} Mr.Pitani. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
          <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
