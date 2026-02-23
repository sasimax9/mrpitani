export type ProductCategory =
  | "veg"
  | "non-veg"
  | "general"
  | "veg-snacks"
  | "non-veg-snacks";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  type: "veg" | "non-veg";
  storage: "frozen" | "non-frozen";
  prep: "raw" | "ready-to-cook";
  order: "bulk" | "retail" | "both";
  packSizes: string[];
  bulkAvailable: boolean;
  brand?: string;
}

export const categoryLabels: Record<ProductCategory, string> = {
  veg: "Veg",
  "non-veg": "Non-Veg",
  general: "General Items",
  "veg-snacks": "Veg Snacks",
  "non-veg-snacks": "Non-Veg Snacks",
};

export const getCategoryColor = (cat: ProductCategory): string => {
  const vegCats: ProductCategory[] = ["veg", "general", "veg-snacks"];
  return vegCats.includes(cat)
    ? "bg-secondary text-secondary-foreground"
    : "bg-accent text-accent-foreground";
};

const products: Product[] = [
  // ── Veg ──
  { id: "v-1", name: "Veg Chicken", category: "veg", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "v-2", name: "Veg Mutton", category: "veg", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "v-3", name: "Veg Prawn", category: "veg", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "v-4", name: "Veg Fish", category: "veg", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "v-5", name: "Veg Keema", category: "veg", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "v-6", name: "Mixed Vegetables", category: "veg", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg", "5kg"], bulkAvailable: true },
  { id: "v-7", name: "Broccoli", category: "veg", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "v-8", name: "Red Capsicum", category: "veg", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "v-9", name: "Yellow Capsicum", category: "veg", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "v-10", name: "Green Capsicum", category: "veg", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },

  // ── Non-Veg ──
  { id: "nv-1", name: "Prawns – Small", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "nv-2", name: "Prawns – Medium", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "nv-3", name: "Prawns – Large", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "nv-4", name: "Apollo Fish – Small", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-5", name: "Apollo Fish – Medium", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-6", name: "Apollo Fish – Large", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-7", name: "Barha Fish – Indian", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-8", name: "Barha Fish – Vietnam", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-9", name: "Nettalu (Sardines)", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-10", name: "Bommidaylu (Bombay Duck)", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-11", name: "Vanjaram (Seer Fish)", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg", "2kg"], bulkAvailable: true },
  { id: "nv-12", name: "Black Pomfret", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-13", name: "White Pomfret", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-14", name: "Raw Chicken (Whole)", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["1kg", "2kg"], bulkAvailable: true },
  { id: "nv-15", name: "Raw Chicken Lollipops", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-16", name: "Raw Chicken Drumsticks", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nv-17", name: "Quail Birds", category: "non-veg", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },

  // ── General Items ──
  { id: "g-1", name: "Sweet Corn", category: "general", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg", "5kg"], bulkAvailable: true },
  { id: "g-2", name: "Green Peas", category: "general", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg", "5kg"], bulkAvailable: true },
  { id: "g-3", name: "Mushrooms", category: "general", type: "veg", storage: "non-frozen", prep: "raw", order: "both", packSizes: ["200g", "500g", "1kg"], bulkAvailable: true },
  { id: "g-4", name: "Baby Corn", category: "general", type: "veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "g-5", name: "Paneer (Fresh Block)", category: "general", type: "veg", storage: "non-frozen", prep: "raw", order: "both", packSizes: ["200g", "500g", "1kg"], bulkAvailable: true },
  { id: "g-6", name: "Khoya (Mawa)", category: "general", type: "veg", storage: "non-frozen", prep: "raw", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "g-7", name: "Butter", category: "general", type: "veg", storage: "non-frozen", prep: "raw", order: "both", packSizes: ["100g", "500g", "1kg"], bulkAvailable: true },
  { id: "g-8", name: "Ghee (Pure Cow)", category: "general", type: "veg", storage: "non-frozen", prep: "raw", order: "both", packSizes: ["500ml", "1L", "5L"], bulkAvailable: true },
  { id: "g-9", name: "Peeled Garlic", category: "general", type: "veg", storage: "non-frozen", prep: "raw", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "g-10", name: "Malabar Parota", category: "general", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["5pcs", "10pcs", "25pcs"], bulkAvailable: true },
  { id: "g-11", name: "Poori", category: "general", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["10pcs", "25pcs"], bulkAvailable: true },
  { id: "g-12", name: "Chapati", category: "general", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["10pcs", "25pcs"], bulkAvailable: true },
  { id: "g-13", name: "Cheese (Block / Slices)", category: "general", type: "veg", storage: "non-frozen", prep: "raw", order: "both", packSizes: ["200g", "500g", "1kg"], bulkAvailable: true },

  // ── Veg Snacks ──
  { id: "vs-1", name: "Corn Samosa", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-2", name: "Corn Rolls", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-3", name: "Schezwan Rolls", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-4", name: "Shanghai Rolls", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-5", name: "Veg Fingers", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "vs-6", name: "Veg Nuggets", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "vs-7", name: "Onion Nuggets", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "vs-8", name: "Onion Rings", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "vs-9", name: "Aloo Tikki", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-10", name: "Veg Lollipops", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "vs-11", name: "Veg Cutlets", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-12", name: "Chilli Garlic Potato Pops", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "vs-13", name: "Paneer Rolls", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-14", name: "Mini Samosa", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-15", name: "Punjab Samosa", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-16", name: "Tandoori Paneer", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "vs-17", name: "Hara Bhara Kebab", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "vs-18", name: "Spinach Cheese Rolls", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-19", name: "Corn Cheese", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "vs-20", name: "Makai Palak Tikki", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-21", name: "Veg Momos", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-22", name: "Veg Burger Patty", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "vs-23", name: "McCain Cheese Shots", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true, brand: "McCain" },
  { id: "vs-24", name: "Smiles (Potato)", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true, brand: "McCain" },
  { id: "vs-25", name: "French Fries – 6mm", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["1kg", "2.5kg"], bulkAvailable: true },
  { id: "vs-26", name: "French Fries – 9mm", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["1kg", "2.5kg"], bulkAvailable: true },
  { id: "vs-27", name: "French Fries – 11mm", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["1kg", "2.5kg"], bulkAvailable: true },
  { id: "vs-28", name: "Potato Cheese Shots", category: "veg-snacks", type: "veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },

  // ── Non-Veg Snacks ──
  { id: "nvs-1", name: "Chicken Nuggets", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "nvs-2", name: "Chicken Popcorn", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g", "1kg"], bulkAvailable: true },
  { id: "nvs-3", name: "Chicken Fingers", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "nvs-4", name: "Chicken Breast Strips", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nvs-5", name: "Chicken Wings", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nvs-6", name: "Chicken Drumsticks (Frozen)", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nvs-7", name: "Chicken Lollipops (Frozen)", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nvs-8", name: "Raw Chicken (Snack Pack)", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "raw", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nvs-9", name: "Chicken Kiwi Balls", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "nvs-10", name: "Chicken Sauce", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["250g", "500g"], bulkAvailable: true },
  { id: "nvs-11", name: "Chicken Samosa", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
  { id: "nvs-12", name: "Chicken Rolls", category: "non-veg-snacks", type: "non-veg", storage: "frozen", prep: "ready-to-cook", order: "both", packSizes: ["500g", "1kg"], bulkAvailable: true },
];

export default products;
