import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/918977775878?text=Hi%20Mr.Pitani,%20I%20want%20to%20enquire%20about%20your%20products"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition-transform hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="h-7 w-7 text-primary-foreground" />
  </a>
);

export default WhatsAppButton;
