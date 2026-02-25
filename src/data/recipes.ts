// Recipe data for all products
export interface Recipe {
  title: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  steps: string[];
  tip?: string;
}

const recipes: Record<string, Recipe> = {
  // ── Veg ──
  "v-1": {
    title: "Crispy Veg Chicken Stir Fry",
    prepTime: "10 min", cookTime: "15 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["250g Veg Chicken", "1 tbsp oil", "1 onion, sliced", "1 capsicum, diced", "2 tbsp soy sauce", "1 tsp chilli flakes", "Salt to taste"],
    steps: ["Thaw the veg chicken pieces for 10 minutes.", "Heat oil in a pan on medium-high heat.", "Add onions and capsicum, sauté for 3 minutes.", "Add veg chicken and cook until golden (5-7 min).", "Add soy sauce and chilli flakes, toss well.", "Serve hot with steamed rice or noodles."],
    tip: "For extra crispiness, shallow fry the veg chicken before adding to the stir fry."
  },
  "v-2": {
    title: "Veg Mutton Curry",
    prepTime: "15 min", cookTime: "25 min", servings: "4", difficulty: "Medium",
    ingredients: ["500g Veg Mutton", "2 onions, pureed", "2 tomatoes, pureed", "1 tbsp ginger-garlic paste", "2 tbsp oil", "1 tsp cumin", "1 tsp garam masala", "Salt & turmeric"],
    steps: ["Heat oil, add cumin seeds until they splutter.", "Add onion puree, cook until golden brown.", "Add ginger-garlic paste, sauté 2 min.", "Add tomato puree, cook until oil separates.", "Add spices and veg mutton pieces.", "Add ½ cup water, simmer for 15 min.", "Garnish with coriander and serve."],
    tip: "Marinate veg mutton in yogurt and spices for 30 min for deeper flavor."
  },
  "v-3": {
    title: "Veg Prawn Manchurian",
    prepTime: "15 min", cookTime: "20 min", servings: "3-4", difficulty: "Medium",
    ingredients: ["250g Veg Prawn", "2 tbsp cornflour", "1 tbsp soy sauce", "1 tbsp chilli sauce", "1 onion, diced", "3 garlic cloves", "Spring onions"],
    steps: ["Coat veg prawns in cornflour, deep fry until crisp.", "Heat oil, sauté garlic and onions.", "Add soy sauce, chilli sauce, and a splash of water.", "Toss in fried veg prawns.", "Garnish with spring onions and serve."],
    tip: "Serve as dry or gravy – add ½ cup water and cornflour slurry for gravy version."
  },
  "v-4": {
    title: "Veg Fish Fry",
    prepTime: "10 min", cookTime: "10 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Veg Fish", "1 tsp red chilli powder", "½ tsp turmeric", "Salt to taste", "Rice flour for coating", "Oil for frying", "Lemon wedges"],
    steps: ["Mix chilli powder, turmeric and salt.", "Coat veg fish pieces with the spice mix.", "Roll in rice flour for extra crunch.", "Shallow fry on medium heat until golden on both sides.", "Serve hot with lemon wedges and mint chutney."],
  },
  "v-5": {
    title: "Spicy Veg Keema Masala",
    prepTime: "10 min", cookTime: "20 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Veg Keema", "2 onions, chopped", "2 tomatoes, chopped", "1 tbsp ginger-garlic paste", "Green peas ½ cup", "Garam masala, cumin, coriander powder"],
    steps: ["Heat oil, sauté onions until golden.", "Add ginger-garlic paste, cook 2 min.", "Add tomatoes, cook until soft.", "Add veg keema and peas, mix well.", "Add spices and ½ cup water.", "Cook on low heat for 15 min.", "Serve with roti or pav."],
  },
  "v-6": {
    title: "Mixed Vegetable Pulao",
    prepTime: "10 min", cookTime: "20 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Mixed Vegetables", "2 cups basmati rice", "Whole spices (bay leaf, cinnamon, cloves)", "1 onion, sliced", "Ghee, salt to taste"],
    steps: ["Wash and soak rice for 20 min.", "Heat ghee, add whole spices and onion.", "Add thawed mixed vegetables, sauté 3 min.", "Add rice, salt, and 4 cups water.", "Cook on low heat until done.", "Fluff with fork and serve with raita."],
  },
  "v-7": {
    title: "Garlic Butter Broccoli",
    prepTime: "5 min", cookTime: "8 min", servings: "2", difficulty: "Easy",
    ingredients: ["500g Broccoli", "2 tbsp butter", "4 garlic cloves, minced", "Salt, pepper", "Lemon juice"],
    steps: ["Thaw broccoli florets.", "Melt butter in a pan, add garlic.", "Add broccoli, toss on high heat for 5 min.", "Season with salt, pepper and lemon.", "Serve as a side dish."],
  },
  "v-8": {
    title: "Stuffed Red Capsicum",
    prepTime: "15 min", cookTime: "20 min", servings: "2", difficulty: "Medium",
    ingredients: ["4 Red Capsicums", "1 cup paneer, crumbled", "½ cup corn", "Spices, cheese for topping"],
    steps: ["Cut tops off capsicums, remove seeds.", "Mix paneer, corn, and spices for filling.", "Stuff the capsicums.", "Top with cheese and bake at 180°C for 20 min.", "Serve hot."],
  },
  "v-9": {
    title: "Yellow Capsicum Pasta",
    prepTime: "10 min", cookTime: "15 min", servings: "3", difficulty: "Easy",
    ingredients: ["500g Yellow Capsicum, sliced", "250g pasta", "Olive oil, garlic", "Cream, cheese, herbs"],
    steps: ["Boil pasta al dente.", "Sauté garlic and capsicum in olive oil.", "Add cream and cheese, stir.", "Toss in pasta, season with herbs.", "Serve warm."],
  },
  "v-10": {
    title: "Green Capsicum Bhaji",
    prepTime: "5 min", cookTime: "10 min", servings: "2", difficulty: "Easy",
    ingredients: ["500g Green Capsicum, chopped", "1 onion", "Mustard seeds, turmeric, chilli powder", "Oil, salt"],
    steps: ["Heat oil, add mustard seeds.", "Add onions, sauté until soft.", "Add capsicum and spices.", "Cook covered for 8 min.", "Serve with chapati."],
  },

  // ── Non-Veg ──
  "nv-1": {
    title: "Butter Garlic Prawns",
    prepTime: "10 min", cookTime: "10 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Prawns", "3 tbsp butter", "6 garlic cloves", "Red chilli flakes", "Parsley, lemon"],
    steps: ["Clean and devein prawns.", "Melt butter, sauté garlic until fragrant.", "Add prawns, cook 2-3 min per side.", "Add chilli flakes and lemon juice.", "Garnish with parsley and serve."],
  },
  "nv-2": {
    title: "Medium Prawn Curry",
    prepTime: "15 min", cookTime: "20 min", servings: "3-4", difficulty: "Medium",
    ingredients: ["500g Medium Prawns", "Coconut milk 1 cup", "2 onions, 2 tomatoes", "Curry leaves, mustard seeds", "Turmeric, chilli powder"],
    steps: ["Sauté mustard seeds and curry leaves.", "Add onion paste, cook until brown.", "Add tomatoes and spices, cook 5 min.", "Pour in coconut milk, simmer.", "Add prawns, cook 8-10 min.", "Serve with steamed rice."],
  },
  "nv-3": {
    title: "Tandoori Jumbo Prawns",
    prepTime: "30 min", cookTime: "15 min", servings: "2-3", difficulty: "Medium",
    ingredients: ["500g Large Prawns", "Yogurt ½ cup", "Tandoori masala", "Lemon, ginger-garlic paste", "Oil for basting"],
    steps: ["Marinate prawns in yogurt, tandoori masala, and lemon for 30 min.", "Preheat oven to 220°C or use a grill.", "Skewer prawns, brush with oil.", "Grill for 12-15 min, turning once.", "Serve with mint chutney and onion rings."],
  },
  "nv-4": {
    title: "Apollo Fish Fry",
    prepTime: "10 min", cookTime: "15 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["500g Apollo Fish", "Egg 1", "Cornflour, rice flour", "Red chilli, garlic paste", "Curry leaves, oil"],
    steps: ["Marinate fish with chilli-garlic paste and egg.", "Coat in cornflour and rice flour mix.", "Deep fry until golden and crispy.", "Toss with curry leaves and green chillies.", "Serve hot as a starter."],
    tip: "Double frying makes it extra crunchy!"
  },
  "nv-5": {
    title: "Apollo Fish 65",
    prepTime: "15 min", cookTime: "15 min", servings: "3-4", difficulty: "Medium",
    ingredients: ["500g Apollo Fish Medium", "Yogurt, egg", "Ginger-garlic paste", "Red food color (optional)", "Cornflour, spices"],
    steps: ["Marinate fish in yogurt, egg, spices for 20 min.", "Coat in cornflour.", "Deep fry until crispy.", "Toss with sautéed onions, peppers, curry leaves.", "Serve with lemon wedges."],
  },
  "nv-6": {
    title: "Grilled Apollo Fish Steak",
    prepTime: "15 min", cookTime: "20 min", servings: "2", difficulty: "Medium",
    ingredients: ["500g Apollo Fish Large", "Olive oil", "Herbs, lemon", "Garlic, salt, pepper"],
    steps: ["Marinate fish with olive oil, herbs, garlic.", "Preheat grill to medium-high.", "Grill 8-10 min per side.", "Squeeze lemon and serve with salad."],
  },
  "nv-7": {
    title: "Indian Barha Fish Curry",
    prepTime: "15 min", cookTime: "25 min", servings: "4", difficulty: "Medium",
    ingredients: ["500g Barha Fish Indian", "Tamarind paste", "Onion, tomato", "Mustard, fenugreek seeds", "Red chilli, turmeric"],
    steps: ["Prepare tamarind water.", "Sauté mustard and fenugreek seeds.", "Add onion-tomato masala, cook well.", "Add tamarind water and spices.", "Gently add fish pieces, simmer 15 min.", "Serve with hot rice."],
  },
  "nv-8": {
    title: "Vietnamese Barha Fish Stir Fry",
    prepTime: "10 min", cookTime: "12 min", servings: "3", difficulty: "Easy",
    ingredients: ["500g Barha Fish Vietnam", "Fish sauce, soy sauce", "Lemongrass, garlic", "Sugar, lime, chillies"],
    steps: ["Cut fish into chunks.", "Mix fish sauce, soy, sugar, lime for sauce.", "Stir fry garlic and lemongrass in oil.", "Add fish, cook 3-4 min per side.", "Pour sauce, toss gently.", "Serve with jasmine rice."],
  },
  "nv-9": {
    title: "Nettalu (Sardine) Fry",
    prepTime: "10 min", cookTime: "10 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["500g Nettalu", "Red chilli powder", "Turmeric, salt", "Rice flour", "Oil, curry leaves"],
    steps: ["Clean sardines, apply turmeric and salt.", "Coat in chilli powder and rice flour.", "Shallow fry until crispy on both sides.", "Garnish with fried curry leaves.", "Serve with onion rings."],
  },
  "nv-10": {
    title: "Bommidaylu Deep Fry",
    prepTime: "10 min", cookTime: "10 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["500g Bommidaylu", "Semolina / rava", "Red chilli, turmeric", "Salt, oil"],
    steps: ["Clean and pat dry fish.", "Mix semolina with spices.", "Coat fish evenly.", "Deep fry in hot oil until golden.", "Drain and serve with chutney."],
  },
  "nv-11": {
    title: "Vanjaram Fish Fry (Seer Fish)",
    prepTime: "15 min", cookTime: "12 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Vanjaram steaks", "Red chilli paste", "Turmeric, salt, lemon", "Oil for shallow fry"],
    steps: ["Marinate steaks with chilli paste, turmeric, salt, lemon for 15 min.", "Heat oil in a flat pan.", "Fry steaks 4-5 min per side on medium heat.", "Serve hot with rice and rasam."],
    tip: "Vanjaram is best when fried simply – don't over-season!"
  },
  "nv-12": {
    title: "Black Pomfret Masala",
    prepTime: "15 min", cookTime: "20 min", servings: "2-3", difficulty: "Medium",
    ingredients: ["500g Black Pomfret", "Green masala paste", "Banana leaf (optional)", "Lemon, salt"],
    steps: ["Make slits on the fish, apply salt and lemon.", "Prepare green masala (coriander, mint, green chilli, garlic).", "Stuff masala into slits.", "Wrap in banana leaf (optional) and pan fry or grill.", "Cook 8-10 min per side.", "Serve with naan."],
  },
  "nv-13": {
    title: "White Pomfret Tawa Fry",
    prepTime: "10 min", cookTime: "15 min", servings: "2", difficulty: "Easy",
    ingredients: ["500g White Pomfret", "Rava / semolina", "Red chilli, turmeric, salt", "Oil, lemon"],
    steps: ["Clean fish, apply turmeric, salt and chilli.", "Coat in rava for crunch.", "Heat oil on tawa (flat griddle).", "Fry fish 5-6 min per side.", "Serve with lemon and salad."],
  },
  "nv-14": {
    title: "Classic Whole Chicken Roast",
    prepTime: "20 min", cookTime: "60 min", servings: "4-6", difficulty: "Medium",
    ingredients: ["1 Whole Chicken (1-2kg)", "Butter, garlic, herbs", "Lemon, salt, pepper", "Vegetables for roasting"],
    steps: ["Pat chicken dry, rub with butter and spices.", "Stuff with lemon and garlic.", "Place on a bed of vegetables.", "Roast at 200°C for 50-60 min.", "Rest for 10 min before carving.", "Serve with gravy."],
  },
  "nv-15": {
    title: "Spicy Chicken Lollipop",
    prepTime: "20 min", cookTime: "15 min", servings: "3-4", difficulty: "Medium",
    ingredients: ["500g Raw Chicken Lollipops", "Egg, cornflour, maida", "Soy sauce, chilli sauce", "Ginger-garlic paste", "Spring onions"],
    steps: ["Marinate lollipops with sauces, ginger-garlic, egg for 30 min.", "Coat in cornflour-maida mix.", "Deep fry until golden and cooked through.", "Toss in sautéed garlic and sauces for wet version.", "Garnish with spring onions."],
  },
  "nv-16": {
    title: "Tandoori Drumsticks",
    prepTime: "30 min", cookTime: "25 min", servings: "3-4", difficulty: "Medium",
    ingredients: ["500g Raw Drumsticks", "Yogurt ½ cup", "Tandoori masala, lemon", "Ginger-garlic paste, oil", "Kasuri methi"],
    steps: ["Make deep slits in drumsticks.", "Mix yogurt, masala, lemon, ginger-garlic.", "Marinate drumsticks for 30 min (or overnight).", "Grill or bake at 200°C for 25 min.", "Baste with oil halfway.", "Serve with mint chutney."],
  },
  "nv-17": {
    title: "Quail Pepper Fry",
    prepTime: "15 min", cookTime: "20 min", servings: "2-3", difficulty: "Medium",
    ingredients: ["500g Quail Birds", "Crushed pepper", "Fennel, curry leaves", "Onions, ginger-garlic paste", "Coconut oil"],
    steps: ["Clean quails, marinate with turmeric and salt.", "Heat coconut oil, sauté curry leaves and fennel.", "Add onions, cook until brown.", "Add ginger-garlic paste and quails.", "Cook covered for 15 min.", "Add crushed pepper, toss on high heat.", "Serve dry with parotta."],
  },

  // ── General Items ──
  "g-1": {
    title: "Sweet Corn Soup",
    prepTime: "5 min", cookTime: "15 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Sweet Corn", "Cornflour 2 tbsp", "Soy sauce, pepper", "Spring onions, salt"],
    steps: ["Blend half the corn, keep rest whole.", "Boil 3 cups water, add both corn portions.", "Mix cornflour in cold water, add to soup.", "Season with soy sauce, salt, pepper.", "Garnish with spring onions."],
  },
  "g-2": {
    title: "Matar Paneer",
    prepTime: "10 min", cookTime: "20 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Green Peas", "200g Paneer", "Onion-tomato gravy", "Cream, garam masala"],
    steps: ["Prepare onion-tomato gravy.", "Add thawed peas, cook 5 min.", "Add paneer cubes.", "Add cream and garam masala.", "Simmer 5 min, serve with naan."],
  },
  "g-3": {
    title: "Mushroom Pepper Fry",
    prepTime: "5 min", cookTime: "10 min", servings: "2", difficulty: "Easy",
    ingredients: ["500g Mushrooms", "Butter, garlic", "Crushed pepper, salt", "Soy sauce"],
    steps: ["Slice mushrooms.", "Melt butter, sauté garlic.", "Add mushrooms, cook on high heat.", "Season with pepper, salt, soy sauce.", "Serve as a side or starter."],
  },
  "g-4": {
    title: "Baby Corn Manchurian",
    prepTime: "10 min", cookTime: "15 min", servings: "3", difficulty: "Easy",
    ingredients: ["500g Baby Corn", "Cornflour, maida", "Soy sauce, chilli sauce, vinegar", "Garlic, spring onions"],
    steps: ["Cut baby corn into pieces, coat in batter.", "Deep fry until golden.", "Sauté garlic, add sauces.", "Toss fried baby corn in sauce.", "Garnish with spring onions."],
  },
  "g-5": {
    title: "Paneer Butter Masala",
    prepTime: "10 min", cookTime: "20 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Paneer", "Cashew-tomato gravy", "Butter, cream", "Kasuri methi, garam masala"],
    steps: ["Prepare cashew-tomato gravy.", "Add butter and cream.", "Add paneer cubes.", "Season with kasuri methi and garam masala.", "Simmer 5 min, serve with naan."],
    tip: "Soak paneer in warm water for 10 min to make it soft."
  },
  "g-6": {
    title: "Khoya Gulab Jamun",
    prepTime: "20 min", cookTime: "30 min", servings: "15 pcs", difficulty: "Medium",
    ingredients: ["250g Khoya", "Maida 2 tbsp", "Cardamom", "Sugar syrup", "Oil for frying"],
    steps: ["Knead khoya and maida into smooth dough.", "Make small balls.", "Deep fry on low heat until dark brown.", "Soak in warm sugar syrup for 30 min.", "Serve warm or cold."],
  },
  "g-7": {
    title: "Butter Spread Toast",
    prepTime: "2 min", cookTime: "3 min", servings: "2", difficulty: "Easy",
    ingredients: ["Butter", "Bread slices", "Garlic (optional)", "Herbs"],
    steps: ["Toast bread slices.", "Spread butter generously.", "Add garlic and herbs if desired.", "Serve warm."],
  },
  "g-8": {
    title: "Ghee Rice",
    prepTime: "10 min", cookTime: "20 min", servings: "4", difficulty: "Easy",
    ingredients: ["2 cups Basmati rice", "3 tbsp Ghee", "Whole spices", "Fried onions, cashews, raisins"],
    steps: ["Wash and soak rice 20 min.", "Heat ghee, add whole spices.", "Add rice and 4 cups water, salt.", "Cook until done.", "Top with fried onions, cashews, raisins."],
  },
  "g-9": {
    title: "Garlic Chutney",
    prepTime: "5 min", cookTime: "0 min", servings: "1 cup", difficulty: "Easy",
    ingredients: ["Peeled Garlic 100g", "Red chillies", "Salt, oil", "Tamarind (optional)"],
    steps: ["Dry roast garlic and red chillies lightly.", "Grind to a coarse paste.", "Add salt and a little oil.", "Store in airtight container."],
  },
  "g-10": {
    title: "Egg Malabar Parota",
    prepTime: "5 min", cookTime: "10 min", servings: "2", difficulty: "Easy",
    ingredients: ["4 Malabar Parotas", "2 eggs", "Onion, green chilli", "Salt, oil"],
    steps: ["Beat eggs with onion, chilli, salt.", "Heat pan, place parota.", "Pour egg mix on top.", "Flip and cook until egg is done.", "Serve with curry or chutney."],
  },
  "g-11": {
    title: "Poori with Aloo Curry",
    prepTime: "10 min", cookTime: "15 min", servings: "4", difficulty: "Easy",
    ingredients: ["Pooris (10 pcs)", "3 potatoes", "Onion, mustard seeds, turmeric", "Green chilli, curry leaves"],
    steps: ["Boil and mash potatoes.", "Temper mustard seeds, curry leaves.", "Add onion, sauté.", "Add mashed potato, turmeric, salt.", "Deep fry pooris until puffed.", "Serve with aloo curry."],
  },
  "g-12": {
    title: "Chapati Wraps",
    prepTime: "10 min", cookTime: "5 min", servings: "2", difficulty: "Easy",
    ingredients: ["4 Chapatis", "Paneer or veggies", "Mint chutney", "Onion, lettuce"],
    steps: ["Warm chapatis on tawa.", "Spread mint chutney.", "Add filling of your choice.", "Roll tightly.", "Slice and serve."],
  },
  "g-13": {
    title: "Cheese Grilled Sandwich",
    prepTime: "5 min", cookTime: "5 min", servings: "2", difficulty: "Easy",
    ingredients: ["Cheese slices/block", "Bread", "Butter", "Vegetables (optional)"],
    steps: ["Butter bread slices.", "Add cheese and veggies.", "Grill until golden and cheese melts.", "Cut diagonally and serve."],
  },

  // ── Veg Snacks ──
  "vs-1": {
    title: "Crispy Corn Samosa",
    prepTime: "5 min", cookTime: "8 min", servings: "4-6", difficulty: "Easy",
    ingredients: ["500g Corn Samosa (frozen)", "Oil for deep frying", "Mint chutney", "Tamarind chutney"],
    steps: ["Heat oil to 180°C.", "Add frozen samosas directly (no thawing needed).", "Fry for 6-8 min until golden and crispy.", "Drain on paper towel.", "Serve hot with chutneys."],
  },
  "vs-2": {
    title: "Corn Rolls with Dip",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Corn Rolls", "Oil for frying", "Mayo-ketchup dip"],
    steps: ["Deep fry frozen corn rolls at 180°C for 6-8 min.", "Drain excess oil.", "Mix mayo and ketchup for quick dip.", "Serve hot."],
  },
  "vs-3": {
    title: "Schezwan Rolls Platter",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Schezwan Rolls", "Oil", "Schezwan sauce for extra kick"],
    steps: ["Deep fry from frozen for 7-8 min.", "Serve with extra schezwan sauce on the side."],
  },
  "vs-4": {
    title: "Shanghai Rolls Appetizer",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Shanghai Rolls", "Oil for frying", "Sweet chilli sauce"],
    steps: ["Fry frozen rolls until golden (7-8 min).", "Drain and arrange on platter.", "Serve with sweet chilli sauce."],
  },
  "vs-5": {
    title: "Veg Fingers with Garlic Mayo",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["250g Veg Fingers", "Oil", "Garlic mayo dip"],
    steps: ["Deep fry or air fry until golden.", "Mix mayo with minced garlic.", "Serve as party snack."],
  },
  "vs-6": {
    title: "Crispy Veg Nuggets",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["250g Veg Nuggets", "Oil", "Tomato ketchup"],
    steps: ["Fry nuggets from frozen until golden.", "Serve with ketchup."],
  },
  "vs-7": {
    title: "Onion Nuggets Chaat",
    prepTime: "10 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["250g Onion Nuggets", "Chaat masala", "Onion, coriander", "Lemon, green chutney"],
    steps: ["Fry nuggets until crispy.", "Chop onion and coriander.", "Toss nuggets with chaat masala and onion.", "Squeeze lemon, drizzle green chutney.", "Serve immediately."],
  },
  "vs-8": {
    title: "Onion Rings Tower",
    prepTime: "5 min", cookTime: "6 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Onion Rings", "Oil", "BBQ sauce or ranch dip"],
    steps: ["Deep fry from frozen until crispy.", "Stack on a plate.", "Serve with your favorite dip."],
  },
  "vs-9": {
    title: "Aloo Tikki Chaat",
    prepTime: "10 min", cookTime: "10 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Aloo Tikki", "Yogurt, chutneys", "Chaat masala, sev", "Onion, coriander"],
    steps: ["Shallow fry tikkis until golden on both sides.", "Place on plate, top with yogurt.", "Drizzle tamarind and green chutneys.", "Sprinkle chaat masala, sev, onion.", "Serve immediately."],
    tip: "This makes an amazing street-food style chaat!"
  },
  "vs-10": {
    title: "Veg Lollipop Indo-Chinese",
    prepTime: "5 min", cookTime: "10 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["250g Veg Lollipops", "Soy sauce, chilli sauce", "Garlic, spring onions"],
    steps: ["Deep fry lollipops until crispy.", "Sauté garlic, add sauces.", "Toss lollipops in sauce.", "Garnish with spring onions."],
  },
  "vs-11": {
    title: "Veg Cutlet Sliders",
    prepTime: "10 min", cookTime: "10 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Veg Cutlets", "Mini burger buns", "Lettuce, tomato, cheese", "Mayo, ketchup"],
    steps: ["Shallow fry cutlets until golden.", "Toast mini buns.", "Assemble with lettuce, cutlet, tomato, cheese.", "Add sauces and serve."],
  },
  "vs-12": {
    title: "Chilli Garlic Potato Pops",
    prepTime: "5 min", cookTime: "8 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Potato Pops", "Oil for frying"],
    steps: ["Deep fry from frozen until golden crispy.", "Sprinkle with extra chilli flakes if desired.", "Serve hot as a snack."],
  },
  "vs-13": {
    title: "Paneer Rolls Party Platter",
    prepTime: "5 min", cookTime: "10 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Paneer Rolls", "Oil", "Mint chutney, ketchup"],
    steps: ["Deep fry until golden and filling is hot.", "Arrange on platter.", "Serve with dipping sauces."],
  },
  "vs-14": {
    title: "Mini Samosa Chaat",
    prepTime: "10 min", cookTime: "8 min", servings: "4-6", difficulty: "Easy",
    ingredients: ["500g Mini Samosa", "Chickpea curry", "Yogurt, chutneys, sev"],
    steps: ["Fry mini samosas until crispy.", "Arrange on plate.", "Top with chickpea curry, yogurt, chutneys.", "Sprinkle sev and chaat masala."],
  },
  "vs-15": {
    title: "Punjab Samosa with Chole",
    prepTime: "10 min", cookTime: "10 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Punjab Samosa", "Chole (chickpea curry)", "Onion rings, green chutney"],
    steps: ["Deep fry samosas until golden.", "Heat chole curry.", "Serve samosas with chole on the side.", "Accompany with onion rings and chutney."],
  },
  "vs-16": {
    title: "Tandoori Paneer Tikka",
    prepTime: "20 min", cookTime: "15 min", servings: "3-4", difficulty: "Medium",
    ingredients: ["250g Tandoori Paneer", "Bell peppers, onion", "Skewers", "Lemon, chaat masala"],
    steps: ["Thread paneer and veggies on skewers.", "Grill or bake at 200°C for 12-15 min.", "Squeeze lemon and sprinkle chaat masala.", "Serve with green chutney."],
  },
  "vs-17": {
    title: "Hara Bhara Kebab",
    prepTime: "5 min", cookTime: "10 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["250g Hara Bhara Kebab", "Oil for shallow fry", "Green chutney"],
    steps: ["Thaw kebabs slightly (5 min).", "Shallow fry on medium heat until golden on both sides.", "Serve with green chutney and onion rings."],
    tip: "These taste amazing in a burger bun too!"
  },
  "vs-18": {
    title: "Spinach Cheese Rolls",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Spinach Cheese Rolls", "Oil for frying"],
    steps: ["Deep fry from frozen until golden.", "The cheese filling will be perfectly melty.", "Serve immediately."],
  },
  "vs-19": {
    title: "Corn Cheese Bites",
    prepTime: "5 min", cookTime: "8 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Corn Cheese", "Oil for frying", "Salsa or ketchup"],
    steps: ["Deep fry until golden and cheese is melty.", "Serve hot with salsa."],
  },
  "vs-20": {
    title: "Makai Palak Tikki",
    prepTime: "5 min", cookTime: "10 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Makai Palak Tikki", "Oil for shallow fry", "Yogurt dip"],
    steps: ["Shallow fry on medium heat until golden on each side.", "Serve with yogurt dip and salad."],
  },
  "vs-21": {
    title: "Steamed Veg Momos",
    prepTime: "5 min", cookTime: "15 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Veg Momos", "Water for steaming", "Spicy red chutney"],
    steps: ["Boil water in steamer.", "Place momos on greased tray.", "Steam for 12-15 min.", "Serve with spicy chutney."],
    tip: "Pan fry steamed momos for a crispy bottom!"
  },
  "vs-22": {
    title: "Veg Burger",
    prepTime: "10 min", cookTime: "10 min", servings: "2", difficulty: "Easy",
    ingredients: ["2 Veg Burger Patties", "Burger buns", "Lettuce, tomato, cheese", "Mayo, ketchup, mustard"],
    steps: ["Pan fry or grill patties until golden.", "Toast buns.", "Assemble with lettuce, patty, cheese, tomato.", "Add sauces and serve."],
  },
  "vs-23": {
    title: "McCain Cheese Shots",
    prepTime: "5 min", cookTime: "6 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g McCain Cheese Shots", "Oil for frying"],
    steps: ["Deep fry from frozen at 180°C for 5-6 min.", "The cheese inside will be perfectly gooey.", "Serve immediately – they're best hot!"],
  },
  "vs-24": {
    title: "Smiles Smiley Fries",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Smiles", "Oil for frying", "Ketchup"],
    steps: ["Deep fry or bake until golden.", "Kids love the smiley shapes!", "Serve with ketchup."],
  },
  "vs-25": {
    title: "Classic French Fries (Thin Cut)",
    prepTime: "5 min", cookTime: "6 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["1kg French Fries 6mm", "Oil", "Salt, seasoning"],
    steps: ["Fry from frozen at 180°C for 5-6 min.", "Shake off excess oil.", "Season with salt (or peri-peri, cheese).", "Serve immediately."],
  },
  "vs-26": {
    title: "Classic French Fries (Regular)",
    prepTime: "5 min", cookTime: "7 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["1kg French Fries 9mm", "Oil", "Salt, seasoning"],
    steps: ["Fry from frozen at 175°C for 6-7 min.", "Season to taste.", "Serve hot."],
  },
  "vs-27": {
    title: "Thick Cut French Fries",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["1kg French Fries 11mm", "Oil", "Salt, pepper"],
    steps: ["Fry at 175°C for 7-8 min until golden.", "These thick cuts stay fluffy inside.", "Perfect with burgers and steaks."],
  },
  "vs-28": {
    title: "Potato Cheese Shots",
    prepTime: "5 min", cookTime: "6 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Potato Cheese Shots", "Oil for frying"],
    steps: ["Deep fry from frozen until golden.", "Cheese filling will be melty.", "Serve as a party starter."],
  },

  // ── Non-Veg Snacks ──
  "nvs-1": {
    title: "Crispy Chicken Nuggets",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["250g Chicken Nuggets", "Oil for frying", "Honey mustard dip"],
    steps: ["Deep fry from frozen at 180°C for 6-8 min.", "Or air fry at 200°C for 10 min.", "Serve with honey mustard or BBQ sauce."],
  },
  "nvs-2": {
    title: "Chicken Popcorn Bowl",
    prepTime: "5 min", cookTime: "8 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Chicken Popcorn", "Oil", "Peri-peri seasoning"],
    steps: ["Deep fry until golden and crispy.", "Toss with peri-peri seasoning.", "Serve in a bowl with dips."],
  },
  "nvs-3": {
    title: "Chicken Fingers with Ranch",
    prepTime: "5 min", cookTime: "8 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Chicken Fingers", "Oil", "Ranch dip"],
    steps: ["Fry from frozen until golden.", "Serve with ranch dip and coleslaw."],
  },
  "nvs-4": {
    title: "Chicken Breast Strip Wrap",
    prepTime: "10 min", cookTime: "10 min", servings: "2", difficulty: "Easy",
    ingredients: ["500g Chicken Breast Strips", "Tortilla wraps", "Lettuce, cheese, sauce"],
    steps: ["Fry or grill strips until cooked.", "Warm tortillas.", "Layer lettuce, strips, cheese.", "Drizzle with sauce, roll up.", "Serve."],
  },
  "nvs-5": {
    title: "BBQ Chicken Wings",
    prepTime: "5 min", cookTime: "20 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Chicken Wings", "BBQ sauce", "Honey, garlic"],
    steps: ["Bake wings at 200°C for 20 min or deep fry.", "Mix BBQ sauce with honey and garlic.", "Toss cooked wings in sauce.", "Serve with celery sticks."],
  },
  "nvs-6": {
    title: "Fried Chicken Drumsticks",
    prepTime: "10 min", cookTime: "15 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Chicken Drumsticks", "Buttermilk, flour", "Spices, oil for frying"],
    steps: ["Marinate in buttermilk and spices.", "Coat in seasoned flour.", "Deep fry until golden and cooked through.", "Serve with coleslaw."],
  },
  "nvs-7": {
    title: "Chinese Chicken Lollipop",
    prepTime: "5 min", cookTime: "12 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Chicken Lollipops", "Oil for frying", "Chilli-garlic sauce"],
    steps: ["Deep fry from frozen until golden.", "Toss in chilli-garlic sauce.", "Garnish with spring onions.", "Serve as a starter."],
  },
  "nvs-8": {
    title: "Simple Chicken Fry",
    prepTime: "10 min", cookTime: "15 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["500g Raw Chicken", "Turmeric, chilli powder", "Ginger-garlic paste", "Oil, salt"],
    steps: ["Marinate chicken with spices.", "Heat oil in pan.", "Fry until golden and cooked.", "Serve with rice."],
  },
  "nvs-9": {
    title: "Chicken Kiwi Balls",
    prepTime: "5 min", cookTime: "8 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Chicken Kiwi Balls", "Oil for frying", "Sweet chilli dip"],
    steps: ["Deep fry from frozen until golden.", "Serve with sweet chilli sauce."],
  },
  "nvs-10": {
    title: "Chicken Sauce Pasta",
    prepTime: "10 min", cookTime: "15 min", servings: "2-3", difficulty: "Easy",
    ingredients: ["250g Chicken Sauce", "Pasta", "Cream, cheese", "Herbs"],
    steps: ["Boil pasta.", "Heat chicken sauce in pan.", "Add cream and herbs.", "Toss pasta in sauce.", "Top with cheese and serve."],
  },
  "nvs-11": {
    title: "Chicken Samosa",
    prepTime: "5 min", cookTime: "8 min", servings: "4", difficulty: "Easy",
    ingredients: ["500g Chicken Samosa", "Oil for frying", "Mint chutney"],
    steps: ["Deep fry from frozen until golden.", "Serve with mint chutney."],
  },
  "nvs-12": {
    title: "Chicken Roll Snack",
    prepTime: "5 min", cookTime: "8 min", servings: "3-4", difficulty: "Easy",
    ingredients: ["500g Chicken Rolls", "Oil for frying", "Ketchup"],
    steps: ["Deep fry from frozen at 180°C for 7-8 min.", "Drain and serve with ketchup."],
  },
};

export default recipes;
