import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { X } from "lucide-react";

type CartItem = {
  product: { id: string; name: string; price?: number; type?: string };
  selectedPack: string;
  quantity: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  totalKg: number;
  discountPct: number;
  discountAmt: number;
  finalPrice: number;
  buildOrderText: (customer: { name: string; phone: string; email?: string; address: string }) => string;
};

const formatINR = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-IN")}`;

export default function OrderDetailsModal({
  open,
  onClose,
  items,
  totalPrice,
  totalKg,
  discountPct,
  discountAmt,
  finalPrice,
  buildOrderText,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const canSubmit = useMemo(() => {
    const validPhone = phone.trim().replace(/\D/g, "").length >= 10;
    return name.trim().length > 1 && validPhone && address.trim().length > 5;
  }, [name, phone, address]);

  if (!open) return null;

  const generatePdfBlob = (customer: { name: string; phone: string; email?: string; address: string }) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    let y = 48;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Order Summary", 40, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleString()}`, 40, y + 18);

    y += 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Customer Details", 40, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const detailsLines = [
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      customer.email?.trim() ? `Email: ${customer.email}` : "",
    ].filter(Boolean);

    detailsLines.forEach((line) => {
      doc.text(line, 40, y);
      y += 14;
    });

    const addressLines = doc.splitTextToSize(`Address: ${customer.address}`, pageWidth - 80);
    doc.text(addressLines, 40, y);
    y += addressLines.length * 14 + 12;

    // Table with aligned prices
    const rows = items.map((i) => {
      const unit = i.product.price ?? 0;
      const amount = unit * i.quantity;
      return [i.product.name, i.selectedPack, String(i.quantity), formatINR(unit), formatINR(amount)];
    });

    autoTable(doc, {
      startY: y,
      head: [["Product", "Pack", "Qty", "Unit Price", "Amount"]],
      body: rows,
      styles: { font: "helvetica", fontSize: 9, cellPadding: 6, overflow: "linebreak" },
      headStyles: { fillColor: [30, 30, 30] },
      columnStyles: {
        0: { cellWidth: 220 },              // Product
        1: { cellWidth: 80 },               // Pack
        2: { cellWidth: 40, halign: "right" }, // Qty
        3: { cellWidth: 80, halign: "right" }, // Unit
        4: { cellWidth: 80, halign: "right" }, // Amount
      },
      margin: { left: 40, right: 40 },
    });

    const endY = (doc as any).lastAutoTable.finalY + 16;

    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal: ${formatINR(totalPrice)}`, 40, endY);

    doc.setFont("helvetica", "normal");
    doc.text(`Estimated Weight: ${totalKg.toFixed(1)} kg`, 40, endY + 14);

    if (discountPct > 0) {
  doc.text(
    `Bulk Discount (${discountPct}%): -Rs. ${Math.round(discountAmt).toLocaleString("en-IN")}`,
    40,
    endY + 28
  );
}

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total: ${formatINR(finalPrice)}`, 40, endY + (discountPct > 0 ? 50 : 42));

    // output as blob
    const blob = doc.output("blob");
    return blob;
  };

  const sendToWhatsApp = async () => {
    const customer = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    };

    const text = buildOrderText(customer);
    const waUrl = `https://wa.me/918977775878?text=${encodeURIComponent(text)}`;

    // 1) Generate PDF blob
    const blob = generatePdfBlob(customer);
    const fileName = `order_${customer.name.replace(/\s+/g, "_")}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    // 2) Try native share (works best on mobile)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Order PDF",
          text: "Please find the order PDF attached.",
          files: [file],
        });
        // After sharing file, open whatsapp message as well (optional)
        window.open(waUrl, "_blank", "noopener,noreferrer");
        onClose();
        return;
      } catch {
        // user cancelled share → continue fallback
      }
    }

    // 3) Fallback: download PDF + open WhatsApp (user attaches manually)
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    window.open(waUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[92%] max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Customer Details</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Phone *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="10-digit mobile"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="name@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Delivery Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm min-h-[90px]"
              placeholder="House no, street, area, city, pincode"
            />
          </div>

          <button
            onClick={sendToWhatsApp}
            disabled={!canSubmit}
            className={`w-full rounded-xl py-3 font-semibold transition-transform ${
              canSubmit ? "bg-whatsapp text-primary-foreground hover:scale-[1.01]" : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Send (PDF + WhatsApp)
          </button>

          <p className="text-[11px] text-muted-foreground">
            If your device supports sharing files, you can directly share the PDF to WhatsApp. Otherwise, the PDF will download and WhatsApp will open — attach the PDF manually.
          </p>
        </div>
      </div>
    </div>
  );
}