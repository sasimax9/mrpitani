import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import VegProducts from "./pages/VegProducts";
import NonVegProducts from "./pages/NonVegProducts";
import Services from "./pages/Services";
import BulkOrders from "./pages/BulkOrders";
import RetailOrders from "./pages/RetailOrders";
import ColdStorage from "./pages/ColdStorage";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Brands from "./pages/Brands";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/veg" element={<VegProducts />} />
          <Route path="/products/non-veg" element={<NonVegProducts />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bulk-orders" element={<BulkOrders />} />
          <Route path="/retail-orders" element={<RetailOrders />} />
          <Route path="/cold-storage" element={<ColdStorage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
