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

const brands: Brand[] = [];

export default brands;
