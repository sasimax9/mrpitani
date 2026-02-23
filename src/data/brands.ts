import mccain from "@/assets/brands/mccain.svg";
import foodCoast from "@/assets/brands/foodcoast.jpeg";
import vkl from "@/assets/brands/vkl.png";
import morton from "@/assets/brands/morton-india.png";
import goldenCrown from "@/assets/brands/golden-crown.png";
import signature from "@/assets/brands/signature-india.png";
import empire from "@/assets/brands/empire-foods.png";
import snacker from "@/assets/brands/snacker-street.png";
import falcon from "@/assets/brands/falcon-foods.png";
import milkMisty from "@/assets/brands/milk-misty.png";
import hyfun from "@/assets/brands/hyfun-foods.png";
import richs from "@/assets/brands/richs.png";
import meatzz from "@/assets/brands/meatzz.png";
import wow from "@/assets/brands/wow.png";
import tanvi from "@/assets/brands/tanvi-foods.png";
import nutrilight from "@/assets/brands/nutrilight-butter.png";
import goCheese from "@/assets/brands/go-cheese.png";
import cpFoods from "@/assets/brands/cp-foods.png";
import itc from "@/assets/brands/itc-master-chef.png";
import cornHub from "@/assets/brands/corn-hub.png";
import saivai from "@/assets/brands/saivai.png";
import yummis from "@/assets/brands/yummis.png";
import heritage from "@/assets/brands/heritage.png";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo:string;
  products: string[];
}

const brands: Brand[] = [
  { id: "b-1", name: "McCain", slug: "mccain", logo: mccain, products: ["French Fries (6mm, 9mm, 11mm)", "Smiles", "Cheese Shots", "Aloo Tikki", "Potato Cheese Shots"] },
  { id: "b-2", name: "Food Coast", slug: "food-coast", logo: foodCoast, products: ["Frozen Parotas", "Ready-to-Cook Snacks", "Frozen Vegetables"] },
  { id: "b-3", name: "VKL (Food Services India)", slug: "vkl", products: ["Frozen Seafood Range", "Prawns", "Fish Fillets"] },
  { id: "b-4", name: "Morton India", slug: "morton-india", products: ["Frozen Chicken Products", "Chicken Nuggets", "Chicken Popcorn"] },
  { id: "b-5", name: "Golden Crown", slug: "golden-crown", products: ["Canned Vegetables", "Sweet Corn", "Baby Corn", "Mushrooms", "Green Peas"] },
  { id: "b-6", name: "Signature India", slug: "signature-india", products: ["Frozen Snacks", "Samosa Range", "Spring Rolls"] },
  { id: "b-7", name: "Empire Foods", slug: "empire-foods", products: ["Chicken Sausages", "Chicken Salami", "Ready-to-Eat Chicken"] },
  { id: "b-8", name: "Snacker Street", slug: "snacker-street", products: ["Veg Fingers", "Nuggets", "Burger Patty", "Corn Rolls"] },
  { id: "b-9", name: "Falcon Foods", slug: "falcon-foods", products: ["Frozen Chicken", "Chicken Wings", "Drumsticks", "Breast Strips"] },
  { id: "b-10", name: "Milk Misty", slug: "milk-misty", products: ["Paneer", "Fresh Milk", "Curd", "Buttermilk"] },
  { id: "b-11", name: "Hyfun Foods", slug: "hyfun-foods", products: ["Veg Nuggets", "Onion Rings", "Veg Cutlets", "Aloo Tikki", "Hara Bhara Kebab"] },
  { id: "b-12", name: "Rich's (General Bakery)", slug: "richs", products: ["Whipping Cream", "Cake Mixes", "Frozen Doughs", "Bakery Ingredients"] },
  { id: "b-13", name: "Meatzz", slug: "meatzz", products: ["Chicken Seekh Kebab", "Chicken Tikka", "Chicken Sausage", "Chicken Salami"] },
  { id: "b-14", name: "WOW", slug: "wow", products: ["Momos", "Veg Momos", "Chicken Momos", "Spring Rolls"] },
  { id: "b-15", name: "Tanvi Foods", slug: "tanvi-foods", products: ["Frozen Parotas", "Chapati", "Poori", "Malabar Parota"] },
  { id: "b-16", name: "Nutrilight Butter", slug: "nutrilight-butter", products: ["Salted Butter", "Unsalted Butter", "Cooking Butter", "Table Butter"] },
  { id: "b-17", name: "Go Cheese", slug: "go-cheese", products: ["Cheese Slices", "Cheese Block", "Mozzarella", "Cheese Spread"] },
  { id: "b-18", name: "CP Foods", slug: "cp-foods", products: ["Chicken Sausages", "Chicken Nuggets", "Chicken Franks", "Ready-to-Eat Chicken"] },
  { id: "b-19", name: "ITC Master Chef", slug: "itc-master-chef", products: ["Frozen Parotas", "Aloo Paratha", "Chicken Nuggets", "Prawns"] },
  { id: "b-20", name: "Corn Hub", slug: "corn-hub", products: ["Sweet Corn Kernels", "Baby Corn", "Corn on the Cob", "Corn Flour"] },
  { id: "b-21", name: "SAIVAI Veg Chickens", slug: "saivai", products: ["Veg Chicken", "Veg Mutton", "Veg Prawn", "Veg Fish", "Veg Keema"] },
  { id: "b-22", name: "Yummis", slug: "yummis", products: ["Frozen Snacks", "Samosa", "Spring Rolls", "Veg Rolls", "Cutlets"] },
  { id: "b-23", name: "Heritage Milk Products", slug: "heritage", products: ["Full Cream Milk", "Toned Milk", "Curd", "Paneer", "Buttermilk", "Ghee"] },
];

export default brands;
