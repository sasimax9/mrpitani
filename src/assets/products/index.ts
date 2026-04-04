import vegImg from "./veg.jpg";
import nonVegImg from "./non-veg.jpg";
import generalImg from "./general.jpg";
import vegSnacksImg from "./veg-snacks.jpg";
import nonVegSnacksImg from "./non-veg-snacks.jpg";
import dairyImg from "./dairy.jpg";
import crushesImg from "./crushes.jpg";
import mocktailImg from "./mocktail.jpg";
import jamImg from "./jam.jpg";
import tinItemsImg from "./tin-items.jpg";
import toppingsImg from "./toppings.jpg";
import saucesImg from "./sauces.jpg";
import mayoImg from "./mayo.jpg";
import seasoningImg from "./seasoning.jpg";

import type { ProductCategory } from "@/data/products";

export const categoryImages: Record<ProductCategory, string> = {
  veg: vegImg,
  "non-veg": nonVegImg,
  general: generalImg,
  "veg-snacks": vegSnacksImg,
  "non-veg-snacks": nonVegSnacksImg,
  dairy: dairyImg,
  crushes: crushesImg,
  mocktail: mocktailImg,
  jam: jamImg,
  "tin-items": tinItemsImg,
  toppings: toppingsImg,
  sauces: saucesImg,
  mayo: mayoImg,
  seasoning: seasoningImg,
};
