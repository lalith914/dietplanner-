import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Utensils, Activity, DollarSign } from "lucide-react";

// Diet Planner with 60+ foods & detailed recipes for all meals

interface FormData {
  age: number;
  sex: "male" | "female" | "";
  weight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive" | "";
  goal: "lose" | "maintain" | "gain" | "";
  dietPreference: "veg" | "nonveg" | "both" | "";
  budget: number;
}

// Duplicate interfaces removed



// ...existing code for Index component follows here (starting with: const Index = () => { ... )



const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    age: 0,
    sex: "",
    weight: 0,
    height: 0,
    activityLevel: "",
    goal: "",
    dietPreference: "",
    budget: 0,
  });
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);


  // Helper: Calculate BMI
  function calculateBMI(weight: number, height: number): number {
    if (!weight || !height) return 0;
    return weight / ((height / 100) * (height / 100));
  }

  // Helper: Calculate BMR
  function calculateBMR(weight: number, height: number, age: number, sex: string): number {
    if (!weight || !height || !age || !sex) return 0;
    if (sex === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Goal adjustments for calories (realistic, based on 500 cal deficit/surplus per day)
  // 500 cal deficit = ~0.5kg weight loss per week
  // 500 cal surplus = ~0.5kg weight gain per week
  const GOAL_ADJUSTMENTS: Record<string, number> = {
    lose: -500,      // 500 calorie deficit for ~0.5kg loss/week
    maintain: 0,     // No adjustment
    gain: 500,       // 500 calorie surplus for ~0.5kg gain/week
  };

  // Helper: Update form data
  function updateFormData<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // Helper: Reset form and results
  function handleReset() {
    setFormData({
      age: 0,
      sex: "",
      weight: 0,
      height: 0,
      activityLevel: "",
      goal: "",
      dietPreference: "",
      budget: 0,
    });
    setResults(null);
    setShowResults(false);
  }

  // Helper: Get BMI category and health status
  function getBMICategory(bmi: number): { category: string; color: string; advice: string } {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        color: "text-blue-600",
        advice: "You need to gain weight. Focus on calorie surplus (add 500 cal/day for ~0.5kg gain/week)"
      };
    } else if (bmi < 25) {
      return {
        category: "Normal Weight",
        color: "text-green-600",
        advice: "Great! Maintain your current weight with a balanced diet and regular exercise"
      };
    } else if (bmi < 30) {
      return {
        category: "Overweight",
        color: "text-amber-600",
        advice: "You need to lose weight. Follow the calorie deficit (500 cal/day = ~0.5kg loss/week)"
      };
    } else {
      return {
        category: "Obese",
        color: "text-red-600",
        advice: "Consult a healthcare provider. Start with 500 cal deficit and aim for ~0.5kg loss/week"
      };
    }
  }

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  price: number;
  type: "veg" | "nonveg";
  recipe: string;
}

interface MealPlan {
  breakfast: FoodItem;
  lunch: FoodItem;
  dinner: FoodItem;
  snack: FoodItem;
  drink: FoodItem;
}

interface Results {
  bmi: number;
  bmr: number;
  targetCalories: number;
  mealPlan: MealPlan;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  totalCost: number;
}

// Old FOOD_DATABASE removed. Only the new FOOD_DATABASE should remain below.

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const FOOD_DATABASE = {
  breakfast: [
    // Vegetarian - South Indian / Healthy
    { name: "Ragi Porridge (Finger Millet)", quantity: "1 cup (200g)", calories: 220, protein: 6, carbs: 42, fats: 3, fiber: 6, price: 30, type: "veg" as const, recipe: "Roast 1/4 cup ragi flour on a pan, boil 1 cup water, add ragi slowly while stirring to avoid lumps, cook for 8-10 min, add salt & ghee. Serve hot with jaggery or fruit." },
    
    { name: "Broken Wheat Upma (Dalia Upma)", quantity: "1 cup (200g)", calories: 210, protein: 7, carbs: 40, fats: 4, fiber: 5, price: 25, type: "veg" as const, recipe: "Roast 1/2 cup broken wheat, temper 1 tbsp oil with mustard seeds & curry leaves, add chopped veggies (peas, carrots), add roasted wheat, cook with 1 cup water till done (8-10 min). Season with salt & lemon." },
    
    { name: "Idli (3 small, ragi + rice blend)", quantity: "3 pieces (130g)", calories: 170, protein: 6, carbs: 36, fats: 1, fiber: 2, price: 28, type: "veg" as const, recipe: "Mix idli batter (1:1 rice & urad dal), add salt & let ferment overnight. Pour into idli molds, steam for 8-10 min in boiling water. Serve with sambar & coconut chutney." },
    
    { name: "Oats Poha with Vegetables", quantity: "1 cup (180g)", calories: 200, protein: 8, carbs: 36, fats: 4, fiber: 6, price: 30, type: "veg" as const, recipe: "Heat 1 tbsp oil, add mustard seeds & curry leaves, sauté chopped onion & veggies (peas, carrots, beans), add 1 cup oats, mix well, cook 5 min. Add salt & lemon juice. Garnish with peanuts." },
    
    { name: "Multigrain Paratha with Curd", quantity: "1 piece (120g) + 100g curd", calories: 260, protein: 10, carbs: 34, fats: 8, fiber: 6, price: 40, type: "veg" as const, recipe: "Knead multigrain flour with water & salt, roll thin, pan-fry with minimal ghee until golden brown. Serve with plain yogurt & pickle." },
    
    { name: "Besan & Oats Chilla (2)", quantity: "2 pieces (160g)", calories: 220, protein: 14, carbs: 28, fats: 6, fiber: 6, price: 28, type: "veg" as const, recipe: "Mix besan + oats flour (equal), add chopped onion, ginger-green chili, salt, water to make thin batter. Heat non-stick pan, pour batter, cook 2-3 min per side. Serve with chutney." },
    
    { name: "Rava Dosa - minimal oil", quantity: "1 piece (140g)", calories: 180, protein: 6, carbs: 34, fats: 3, fiber: 2, price: 30, type: "veg" as const, recipe: "Mix rava + all-purpose flour (1:1), add salt, water to make thin batter, let sit 5 min. Heat dosa pan, pour batter, spread thin, cook with minimal oil. Fold & serve with sambar & chutney." },
    
    { name: "Greek Yogurt Parfait with Berries", quantity: "1 cup (200g)", calories: 220, protein: 14, carbs: 25, fats: 6, fiber: 4, price: 60, type: "veg" as const, recipe: "Layer Greek yogurt (150g) with granola (30g), fresh berries (40g), and honey (1 tsp). Mix well before eating or keep layered for texture. Serve chilled." },
    
    { name: "Moong Dal Cheela with Paneer", quantity: "2 pieces (200g)", calories: 260, protein: 18, carbs: 30, fats: 8, fiber: 5, price: 45, type: "veg" as const, recipe: "Soak moong dal 4 hrs, blend with onion & ginger, add salt & paneer cubes. Heat pan with oil, pour batter, cook 2-3 min per side until golden. Serve with mint chutney." },
    
    { name: "Quinoa Upma with Veggies", quantity: "1 cup (200g)", calories: 240, protein: 9, carbs: 38, fats: 5, fiber: 6, price: 60, type: "veg" as const, recipe: "Cook quinoa (1/2 cup), heat oil, temper with mustard seeds, add chopped veggies & cooked quinoa, stir-fry 3-4 min. Season with salt, turmeric & lemon juice." },
    
    { name: "Fruit & Nut Bowl", quantity: "1 bowl (200g)", calories: 200, protein: 6, carbs: 30, fats: 7, fiber: 5, price: 60, type: "veg" as const, recipe: "Chop seasonal fruits (banana, apple, berries), add almonds (10), walnuts (5), drizzle honey (1 tsp). Mix gently & serve immediately. Add Greek yogurt for protein." },
    
    { name: "Egg White Omelette with Spinach", quantity: "150g (3 egg whites)", calories: 120, protein: 20, carbs: 4, fats: 3, fiber: 2, price: 35, type: "nonveg" as const, recipe: "Beat 3 egg whites, add chopped spinach & tomato, salt & pepper. Heat pan with 1 tsp oil, pour mixture, fold when edges set. Cook 2-3 min total. Serve hot." },
    
    { name: "Masala Omelette with Ragi Toast", quantity: "200g", calories: 260, protein: 20, carbs: 28, fats: 8, fiber: 4, price: 45, type: "nonveg" as const, recipe: "Beat 1 egg + 2 egg whites, add chopped onion, capsicum, green chili, salt. Cook in oil till set. Toast ragi bread lightly. Serve together with ketchup on side." },
    
    { name: "Smoked Salmon on Multigrain Toast", quantity: "80g salmon + 1 slice", calories: 220, protein: 18, carbs: 18, fats: 10, fiber: 2, price: 180, type: "nonveg" as const, recipe: "Toast whole wheat bread slice, spread thin layer of cream cheese, place smoked salmon (80g), add fresh dill & lemon. Serve immediately with green tea." },
    
    { name: "Egg Bhurji with Vegetables", quantity: "1 plate (180g)", calories: 240, protein: 16, carbs: 10, fats: 14, fiber: 3, price: 45, type: "nonveg" as const, recipe: "Heat 1 tbsp oil, add finely chopped onion & green chili, scramble 2 eggs into it, add diced tomato & capsicum, salt. Cook 3-4 min till eggs are set & veggies are soft." },
    
    { name: "Chicken & Vegetable Upma", quantity: "1 cup (200g)", calories: 300, protein: 20, carbs: 30, fats: 8, fiber: 3, price: 70, type: "nonveg" as const, recipe: "Boil 80g minced chicken with turmeric & salt (5 min). Heat oil, temper with mustard seeds, add chopped veggies, add cooked chicken & 1 cup semolina, stir-fry 5-6 min. Season with salt & lemon." },
    
    { name: "Dhokla (Steamed Chickpea Cake)", quantity: "4 pieces (150g)", calories: 200, protein: 10, carbs: 32, fats: 4, fiber: 4, price: 35, type: "veg" as const, recipe: "Soak 1 cup chickpea flour with curds (4 hrs), add baking soda, salt, sugar, pour in greased pan, steam for 20 min. Temper with oil, mustard seeds & curry leaves. Serve with green chutney." },

    { name: "Vegetable Poha", quantity: "1 cup (180g)", calories: 180, protein: 4, carbs: 36, fats: 3, fiber: 5, price: 25, type: "veg" as const, recipe: "Rinse 1 cup poha, heat 1 tbsp oil, add mustard seeds, curry leaves, chopped onion, peas, carrots, add poha, mix well, cook 3-4 min. Season with salt, turmeric & lemon juice." },
  ],

  lunch: [
    // Vegetarian - Dal & Rice / Balanced plates
    { name: "Brown Rice with Toor Dal & Mixed Veg", quantity: "1 plate (300g)", calories: 420, protein: 15, carbs: 68, fats: 7, fiber: 8, price: 70, type: "veg" as const, recipe: "Cook 1 cup brown rice. Cook 1/2 cup toor dal till soft. Sauté chopped mixed veggies (100g) in oil, add dal, mix with rice, season with salt, turmeric & cumin. Serve hot." },
    
    { name: "Quinoa & Mixed Bean Salad", quantity: "1 plate (300g)", calories: 420, protein: 18, carbs: 52, fats: 9, fiber: 10, price: 110, type: "veg" as const, recipe: "Cook quinoa (3/4 cup), boil mixed beans (50g) till soft, chop cucumber, tomato, onion, combine all, dress with olive oil, lemon & salt. Add cumin powder & serve at room temp." },
    
    { name: "Sprouted Moong Salad + Multigrain Roti", quantity: "1 plate + 1 roti", calories: 360, protein: 18, carbs: 40, fats: 6, fiber: 12, price: 65, type: "veg" as const, recipe: "Boil sprouted moong (100g), mix with finely chopped cucumber, tomato, onion, add lemon juice, salt, cumin. Prepare multigrain roti separately. Serve together with mint chutn ey." },
    
    { name: "Chana Masala with Brown Rice", quantity: "1 plate (280g)", calories: 420, protein: 16, carbs: 62, fats: 8, fiber: 10, price: 70, type: "veg" as const, recipe: "Cook canned chickpeas (1 cup), heat oil, add onion, tomato, ginger-garlic paste, add spices (cumin, coriander, turmeric, garam masala), add chickpeas, simmer 15 min. Serve with brown rice." },
    
    { name: "Palak Paneer with 2 Multigrain Rotis", quantity: "1 plate", calories: 440, protein: 26, carbs: 44, fats: 16, fiber: 6, price: 120, type: "veg" as const, recipe: "Blanch 200g spinach, blend smooth, heat 2 tbsp oil, add onion, tomato, add spinach puree, add paneer cubes (80g), simmer 10 min. Make multigrain rotis on the side. Serve together." },
    
    { name: "Vegetable Biryani (Low Oil)", quantity: "1 plate (300g)", calories: 380, protein: 10, carbs: 58, fats: 8, fiber: 6, price: 85, type: "veg" as const, recipe: "Soak 1 cup basmati rice, slice vegetables thinly. Layer rice & veggies alternately in pot with minimal oil, add water (2:1), cover, cook on high heat 2 min then low heat 20 min. Fluff with fork." },
    
    { name: "Millet Pulao with Yogurt", quantity: "1 plate (300g)", calories: 400, protein: 12, carbs: 58, fats: 8, fiber: 8, price: 85, type: "veg" as const, recipe: "Cook 1 cup millet, heat ghee, temper with whole spices (bay leaf, cinnamon), add chopped veggies, mix with cooked millet, season with salt. Serve with plain yogurt on side." },
    
    { name: "Lemon Brown Rice with Roasted Veg", quantity: "1 plate (300g)", calories: 380, protein: 8, carbs: 64, fats: 6, fiber: 6, price: 60, type: "veg" as const, recipe: "Cook brown rice (1 cup), roast veggies (broccoli, carrot, bell pepper) lightly in oil, toss with hot rice, add lemon juice, salt, turmeric. Garnish with cilantro." },
    
    { name: "Vegetable Fried Rice with Egg", quantity: "1 plate (300g)", calories: 380, protein: 14, carbs: 56, fats: 10, fiber: 4, price: 60, type: "nonveg" as const, recipe: "Heat oil in wok, scramble 1 egg, add cooked rice (1.5 cups), chopped veggies, soy sauce, salt. Stir-fry 5-6 min. Garnish with green onion & sesame oil." },
    
    { name: "Grilled Chicken with Brown Rice", quantity: "200g chicken + rice", calories: 420, protein: 40, carbs: 40, fats: 6, fiber: 2, price: 140, type: "nonveg" as const, recipe: "Marinate 200g chicken breast in yogurt, lemon, salt, spices for 30 min. Grill/pan-fry for 8-10 min. Serve with cooked brown rice (1 cup) & grilled vegetables." },
    
    { name: "Tandoori Fish with Millet", quantity: "150g fish + millet", calories: 420, protein: 38, carbs: 48, fats: 8, fiber: 2, price: 180, type: "nonveg" as const, recipe: "Marinate fish (150g) in yogurt, tandoori spices, cook in oven at 200°C for 15 min. Cook millet separately (1 cup with 2 cups water, 25 min). Serve with lemon & salad." },
    
    { name: "Chicken Tikka Masala with Rice", quantity: "180g + 150g rice", calories: 480, protein: 36, carbs: 56, fats: 10, fiber: 2, price: 160, type: "nonveg" as const, recipe: "Marinate chicken (180g) in yogurt & spices, grill/pan-fry. Make tomato-cream sauce (tomato + onion + spices), add chicken, simmer 15 min. Serve with basmati rice." },
    
    { name: "Vegetable Curry with 2 Rotis", quantity: "1 plate", calories: 340, protein: 10, carbs: 50, fats: 8, fiber: 8, price: 55, type: "veg" as const, recipe: "Heat oil, add onion, ginger-garlic paste, cook till golden, add mixed veggies (pumpkin, peas, carrots), add spices & tomato, simmer 20 min. Make 2 wheat rotis on side. Serve hot." },
    
    { name: "Rajma (Kidney Beans) with Brown Rice", quantity: "1 plate (300g)", calories: 420, protein: 16, carbs: 62, fats: 6, fiber: 10, price: 70, type: "veg" as const, recipe: "Soak rajma overnight, pressure cook with salt & turmeric (4 whistles). Make tempering with oil, onion, ginger-garlic, add cooked rajma, simmer with tomato & spices. Serve with brown rice." },
    
    { name: "Chickpea & Vegetable Stew", quantity: "1 plate (280g)", calories: 360, protein: 14, carbs: 54, fats: 8, fiber: 10, price: 65, type: "veg" as const, recipe: "Heat oil, sauté onion & garlic, add chickpeas & chopped veggies (spinach, carrots, beans), add vegetable broth, simmer 25-30 min. Season with salt, pepper & herbs. Serve warm." },
  ],

  dinner: [
    // Vegetarian - Lighter dinners
    { name: "Khichdi with Vegetable Salad", quantity: "1 plate (300g)", calories: 340, protein: 14, carbs: 54, fats: 6, fiber: 6, price: 55, type: "veg" as const, recipe: "Cook 1/2 cup moong dal + 1/2 cup rice in 2 cups water with turmeric & salt till mushy (30 min). Chop cucumber, tomato, onion for salad, dress with lemon & salt. Serve khichdi with salad & ghee." },
    
    { name: "Mixed Dal Soup with Toast", quantity: "1 bowl + 1 slice", calories: 300, protein: 18, carbs: 38, fats: 6, fiber: 8, price: 60, type: "veg" as const, recipe: "Boil mixed dal (moong, masoor, toor - 1/2 cup total) with veggies (100g), blend half-smooth, add salt & turmeric. Toast whole wheat bread slice. Serve soup hot with toast on side." },
    
    { name: "Grilled Vegetable Platter + Roti", quantity: "1 plate", calories: 320, protein: 8, carbs: 48, fats: 8, fiber: 10, price: 75, type: "veg" as const, recipe: "Slice vegetables (zucchini, capsicum, broccoli, mushroom), brush lightly with oil, grill 8-10 min. Make 1 multigrain roti. Serve grilled veggies with roti, salt & lemon on side." },
    
    { name: "Moong Dal Cheela (3) with Chutney", quantity: "3 pieces (240g)", calories: 330, protein: 20, carbs: 42, fats: 8, fiber: 8, price: 60, type: "veg" as const, recipe: "Soak moong dal 4 hrs, blend with onion & ginger, add salt, water for thin batter. Cook 3 cheelas on oil-lightly pan, 2-3 min per side. Serve with mint-coriander chutney." },
    
    { name: "Stir-Fried Tofu with Vegetables + Roti", quantity: "1 plate", calories: 380, protein: 22, carbs: 36, fats: 14, fiber: 6, price: 110, type: "veg" as const, recipe: "Press tofu (150g) to remove water, cube it, stir-fry in oil with garlic, add sliced veggies (bell pepper, broccoli), add soy sauce & salt. Cook 5-6 min. Make 1 wheat roti. Serve together." },
    
    { name: "Bajra Khichdi with Bottle Gourd", quantity: "1 plate (300g)", calories: 360, protein: 12, carbs: 52, fats: 6, fiber: 8, price: 70, type: "veg" as const, recipe: "Cook bajra (1/2 cup) + moong (1/2 cup) with water, add cubed bottle gourd (50g) midway, cook till tender (30 min). Season with salt, turmeric & ghee. Serve hot." },
    
    { name: "Grilled Chicken with Steamed Vegetables", quantity: "200g chicken + veg", calories: 320, protein: 42, carbs: 12, fats: 8, fiber: 4, price: 150, type: "nonveg" as const, recipe: "Marinate chicken (200g) in lemon, salt & herbs, grill 10-12 min. Steam vegetables (100g) separately till tender. Serve hot chicken with steamed veggies & lemon on side." },
    
    { name: "Tandoori Fish with Salad", quantity: "180g fish + salad", calories: 340, protein: 38, carbs: 8, fats: 12, fiber: 3, price: 200, type: "nonveg" as const, recipe: "Coat fish (180g) with tandoori spices & yogurt, grill 15 min. Make fresh salad with cucumber, tomato, onion, dress with lemon & salt. Serve fish hot with salad on side." },
    
    { name: "Egg Curry with Multigrain Roti", quantity: "2 eggs + 1 roti", calories: 320, protein: 20, carbs: 28, fats: 12, fiber: 3, price: 80, type: "nonveg" as const, recipe: "Hard boil 2 eggs, shell them. Make curry: sauté onion, add tomato & spices, add eggs, simmer 10 min. Make 1 multigrain roti. Serve curry with roti." },
    
    { name: "Prawn & Vegetable Stir Fry", quantity: "150g + 100g veg", calories: 380, protein: 32, carbs: 30, fats: 10, fiber: 4, price: 240, type: "nonveg" as const, recipe: "Heat oil, add garlic & ginger, add veggies (broccoli, bell pepper), cook 3 min, add prawns (150g), cook 4-5 min till pink. Add salt, soy sauce. Serve hot over steamed rice (100g)." },
    
    { name: "Vegetable Soup with Whole Wheat Bread", quantity: "1 bowl + 2 slices", calories: 260, protein: 8, carbs: 38, fats: 6, fiber: 8, price: 55, type: "veg" as const, recipe: "Sauté onion & garlic, add mixed chopped veggies (150g), vegetable broth (2 cups), simmer 20 min, blend partially. Season with salt & pepper. Toast 2 bread slices, serve with soup." },
    
    { name: "Methi Thepla with Low-Fat Curd", quantity: "2 pieces + 100g curd", calories: 300, protein: 10, carbs: 40, fats: 8, fiber: 6, price: 50, type: "veg" as const, recipe: "Knead multigrain flour + fenugreek leaves (50g) with salt, water, roll thin, pan-fry with minimal oil. Serve 2 theplas with plain yogurt (100g) & pickle on side." },
    
    { name: "Lean Mutton Stew with Millet Roti", quantity: "150g mutton + roti", calories: 500, protein: 36, carbs: 40, fats: 18, fiber: 2, price: 220, type: "nonveg" as const, recipe: "Cook mutton (150g) with onion, ginger-garlic, tomato & spices in pressure cooker (3 whistles). Make 1 millet roti separately. Serve hot stew with roti & vegetables." },
    
    { name: "Chicken Shorba with Brown Rice", quantity: "1 bowl + 100g rice", calories: 360, protein: 28, carbs: 40, fats: 8, fiber: 1, price: 130, type: "nonveg" as const, recipe: "Boil chicken (150g) with whole spices, onion, ginger, turmeric till tender, strain, add salt & pepper. Cook brown rice separately (1/2 cup). Serve hot shorba with rice bowl on side." },
  ],

  snack: [
    // Vegetarian - Savory healthy
    { name: "Roasted Chana & Peanut Mix", quantity: "50g", calories: 260, protein: 13, carbs: 20, fats: 14, fiber: 7, price: 25, type: "veg" as const, recipe: "Dry roast 25g chana, 15g peanuts, 10g cashews on low heat for 5-7 min, stirring occasionally. Cool completely, add salt & chaat masala. Store in airtight container." },
    
    { name: "Baked Samosa with Salad", quantity: "1 piece (80g)", calories: 160, protein: 4, carbs: 24, fats: 6, fiber: 3, price: 20, type: "veg" as const, recipe: "Prepare samosa filling: boil potato (60g), add peas, cumin, salt, chili powder. Wrap in pastry, brush with oil, bake at 180°C for 20 min. Serve with fresh salad (cucumber, tomato)." },
    
    { name: "Makhana (Fox Nuts) - Roasted", quantity: "50g", calories: 70, protein: 3, carbs: 14, fats: 1, fiber: 2, price: 40, type: "veg" as const, recipe: "Heat 1 tsp oil in pan, add makhana, roast on medium-low heat for 8-10 min, stirring constantly. Add salt & chaat masala while hot. Cool & store in airtight container." },
    
    { name: "Mixed Nuts - Almonds & Walnuts", quantity: "30g", calories: 190, protein: 6, carbs: 4, fats: 16, fiber: 3, price: 45, type: "veg" as const, recipe: "Soak almonds (20) in water for 4 hrs, peel off skin, roast lightly. Mix with walnuts (10 halves). Eat as snack. Can store in refrigerator for 1 week." },
    
    { name: "Apple with Peanut Butter", quantity: "1 apple + 15g PB", calories: 220, protein: 4, carbs: 32, fats: 9, fiber: 5, price: 50, type: "veg" as const, recipe: "Slice 1 medium apple, spread natural peanut butter (1 tbsp) on a plate, dip apple slices & eat. Or spread PB on apple slices & stack them together." },
    
    { name: "Cucumber & Carrot Sticks with Hummus", quantity: "150g veg + 30g hummus", calories: 140, protein: 4, carbs: 14, fats: 8, fiber: 4, price: 45, type: "veg" as const, recipe: "Cut cucumber & carrots into sticks, refrigerate. Make hummus: blend canned chickpeas with tahini, lemon, garlic, salt. Serve sticks with hummus dip." },
    
    { name: "Sprouted Moong Chaat", quantity: "1 cup (150g)", calories: 160, protein: 12, carbs: 22, fats: 2, fiber: 8, price: 40, type: "veg" as const, recipe: "Boil sprouted moong (100g), cool, mix with finely chopped cucumber, tomato, onion, add lemon juice, salt, cumin powder, chaat masala. Serve at room temperature." },
    
    { name: "Dates & Mixed Nuts", quantity: "approx 40g", calories: 150, protein: 3, carbs: 30, fats: 5, fiber: 4, price: 30, type: "veg" as const, recipe: "Pit 3 dates (remove seed), stuff with almond (1) or walnut piece, serve as-is. Can also chop & mix together. Great for energy boost." },
    
    { name: "Boiled Egg & Sprout Salad", quantity: "1 egg + 50g sprouts", calories: 190, protein: 16, carbs: 6, fats: 10, fiber: 2, price: 30, type: "nonveg" as const, recipe: "Boil 1 egg (8-10 min), cool, slice. Mix sprouted mung with cucumber, tomato, dress with lemon & salt. Top with egg slices & serve." },
    
    { name: "Grilled Chicken Strips", quantity: "100g", calories: 150, protein: 28, carbs: 2, fats: 4, fiber: 0, price: 90, type: "nonveg" as const, recipe: "Cut chicken breast (100g) into strips, marinate in lemon, salt & pepper for 15 min, grill on skewers for 8-10 min, turning occasionally. Serve with lemon on side." },
    
    { name: "Home-made Trail Mix", quantity: "30g", calories: 160, protein: 4, carbs: 12, fats: 10, fiber: 3, price: 35, type: "veg" as const, recipe: "Mix roasted peanuts (10g), almonds (8), raisins (8), sunflower seeds (4g), store in airtight container. Eat by handful as needed. Make in batches of 200g." },
    
    { name: "Fresh Whole Fruit", quantity: "1 medium", calories: 80, protein: 2, carbs: 18, fats: 0, fiber: 5, price: 25, type: "veg" as const, recipe: "Choose seasonal fruit: apple (150g), orange (200g), pear (180g), or guava (150g). Wash well, eat fresh or cut into pieces. Avoid canned/processed options." },
    
    { name: "Roasted Chickpea Snack", quantity: "50g", calories: 180, protein: 10, carbs: 24, fats: 5, fiber: 6, price: 20, type: "veg" as const, recipe: "Rinse canned chickpeas, dry well, toss with oil & spices (cumin, chaat masala), roast at 200°C for 25-30 min, shaking halfway. Cool & store in airtight container." },
    
    { name: "Baked Sweet Potato Wedges", quantity: "150g", calories: 140, protein: 2, carbs: 32, fats: 0, fiber: 4, price: 35, type: "veg" as const, recipe: "Cut sweet potato (150g) into wedges, brush with oil, season with salt & paprika, bake at 200°C for 25-30 min till crispy. Serve hot or at room temperature." },
  ],

  drink: [
    // Hot & low-calorie
    { name: "Green Tea - Lemon & Honey", quantity: "1 cup (200ml)", calories: 10, protein: 0, carbs: 2, fats: 0, fiber: 0, price: 15, type: "veg" as const, recipe: "Boil water, add 1 green tea bag, steep for 3-4 min, add lemon slice & 1 tsp raw honey (when cooled slightly). Drink fresh without sugar for best benefits." },
    
    { name: "Herbal Tulsi Tea", quantity: "1 cup (200ml)", calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, price: 12, type: "veg" as const, recipe: "Boil water with 5-6 fresh tulsi leaves, add 1 small piece ginger, lemon slice, steep 5 min. Strain & drink. Avoid sugar, you can add jaggery if needed." },
    
    { name: "Skim Milk", quantity: "200ml", calories: 90, protein: 9, carbs: 12, fats: 0, fiber: 0, price: 20, type: "veg" as const, recipe: "Heat milk till warm, add a pinch of turmeric or cardamom for flavor. Drink warm without sugar for best calcium absorption. Serve in the morning or evening." },
    
    { name: "Buttermilk (Chaas) - Unsweetened", quantity: "1 glass (200ml)", calories: 50, protein: 3, carbs: 4, fats: 1, fiber: 0, price: 12, type: "veg" as const, recipe: "Blend yogurt (150g) with water (50ml), add salt, cumin powder & finely chopped ginger. Churn well. Serve chilled immediately after preparation." },
    
    { name: "Banana Spinach Protein Smoothie", quantity: "1 glass (300ml)", calories: 220, protein: 18, carbs: 30, fats: 4, fiber: 6, price: 80, type: "veg" as const, recipe: "Blend 1 banana, 50g fresh spinach, 1 scoop protein powder, 150ml milk, 1 tbsp nut butter, ice cubes. Blend until smooth. Drink immediately for maximum nutrition." },
    
    { name: "Mango Lassi - Low Sugar", quantity: "1 glass (200ml)", calories: 150, protein: 6, carbs: 24, fats: 3, fiber: 1, price: 50, type: "veg" as const, recipe: "Blend 60g mango (ripe), 150g plain yogurt, 50ml milk, 1/2 tsp cardamom powder, minimal honey (1/2 tsp). Serve chilled. Avoid adding extra sugar." },
    
    { name: "Coconut Water - Fresh", quantity: "1 glass (300ml)", calories: 60, protein: 2, carbs: 12, fats: 0, fiber: 0, price: 35, type: "veg" as const, recipe: "Use fresh young coconut, pierce the top with a sharp object, pour water into glass. Drink fresh immediately. Can be stored in refrigerator for 1-2 days max." },
    
    { name: "Lemon Water - Salted (Nimbu Pani)", quantity: "1 glass (200ml)", calories: 8, protein: 0, carbs: 1, fats: 0, fiber: 0, price: 8, type: "veg" as const, recipe: "Squeeze 1/2 lemon into water, add salt & cumin powder, optionally add ginger slice. Mix well. Drink at room temperature or chilled. Best consumed fresh." },
    
    { name: "Carrot-Apple Juice - Unsweetened", quantity: "1 glass (200ml)", calories: 90, protein: 1, carbs: 22, fats: 0, fiber: 3, price: 45, type: "veg" as const, recipe: "Juice 1 large carrot + 1 apple using a juicer, add water if too concentrated (1:1 ratio), drink immediately. No added sugar. Can add ginger for extra flavor & warmth." },
    
    { name: "Golden Milk (Turmeric Milk)", quantity: "1 cup (200ml)", calories: 120, protein: 6, carbs: 10, fats: 4, fiber: 0, price: 30, type: "veg" as const, recipe: "Heat milk (200ml), add 1/4 tsp turmeric powder, pinch black pepper, cinnamon stick (optional), honey (1/2 tsp). Simmer 2 min, strain. Drink warm before bed." },
    
    { name: "Jeera Water - Warm", quantity: "1 glass (200ml)", calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, price: 5, type: "veg" as const, recipe: "Soak 1 tsp jeera in water overnight (or boil for 5 min), strain into glass. Drink warm on empty stomach in morning. Aids digestion & metabolism. Best for digestive health." },
  ]
};

  const selectBestFood = (
    foods: FoodItem[],
    targetCalories: number,
    maxBudget: number,
    dietPref: string
  ): FoodItem => {
    let filtered = foods;

    // Filter by diet preference
    if (dietPref === "veg") {
      filtered = foods.filter((food) => food.type === "veg");
    } else if (dietPref === "nonveg") {
      filtered = foods.filter((food) => food.type === "nonveg");
    } else if (dietPref === "both") {
      // For "both", randomly choose between veg or nonveg to add variety
      const vegItems = foods.filter((food) => food.type === "veg");
      const nonVegItems = foods.filter((food) => food.type === "nonveg");
      
      // 50-50 chance to pick from veg or nonveg for variety
      filtered = Math.random() > 0.5 ? nonVegItems : vegItems;
      
      // If one category is empty, use the other
      if (filtered.length === 0) {
        filtered = vegItems.length > 0 ? vegItems : nonVegItems;
      }
    }

    // Fallback to all veg if filter is empty
    if (filtered.length === 0) {
      filtered = foods.filter((f) => f.type === "veg");
    }

    // Sort by calorie match and budget fit
    filtered.sort((a, b) => {
      const aDiff = Math.abs(a.calories - targetCalories);
      const bDiff = Math.abs(b.calories - targetCalories);
      const aBudgetFit = a.price <= maxBudget ? 0 : a.price - maxBudget;
      const bBudgetFit = b.price <= maxBudget ? 0 : b.price - maxBudget;
      
      if (aBudgetFit !== bBudgetFit) return aBudgetFit - bBudgetFit;
      return aDiff - bDiff;
    });

    return filtered[0];
  };

  const generateMealPlan = (): Results => {
    const bmi = calculateBMI(formData.weight, formData.height);
    const bmr = calculateBMR(formData.weight, formData.height, formData.age, formData.sex);
    const activityFactor = ACTIVITY_FACTORS[formData.activityLevel as keyof typeof ACTIVITY_FACTORS];
    const goalAdjustment = GOAL_ADJUSTMENTS[formData.goal as keyof typeof GOAL_ADJUSTMENTS];
    const targetCalories = bmr * activityFactor + goalAdjustment;

    const calorieDistribution = {
      breakfast: targetCalories * 0.25,
      lunch: targetCalories * 0.35,
      dinner: targetCalories * 0.3,
      snack: targetCalories * 0.07,
      drink: targetCalories * 0.03,
    };

    const budgetDistribution = {
      breakfast: formData.budget * 0.2,
      lunch: formData.budget * 0.35,
      dinner: formData.budget * 0.3,
      snack: formData.budget * 0.1,
      drink: formData.budget * 0.05,
    };

    const mealPlan: MealPlan = {
      breakfast: selectBestFood(
        FOOD_DATABASE.breakfast,
        calorieDistribution.breakfast,
        budgetDistribution.breakfast,
        formData.dietPreference
      ),
      lunch: selectBestFood(
        FOOD_DATABASE.lunch,
        calorieDistribution.lunch,
        budgetDistribution.lunch,
        formData.dietPreference
      ),
      dinner: selectBestFood(
        FOOD_DATABASE.dinner,
        calorieDistribution.dinner,
        budgetDistribution.dinner,
        formData.dietPreference
      ),
      snack: selectBestFood(
        FOOD_DATABASE.snack,
        calorieDistribution.snack,
        budgetDistribution.snack,
        formData.dietPreference
      ),
      drink: selectBestFood(
        FOOD_DATABASE.drink,
        calorieDistribution.drink,
        budgetDistribution.drink,
        formData.dietPreference
      ),
    };

    const totalCalories =
      mealPlan.breakfast.calories +
      mealPlan.lunch.calories +
      mealPlan.dinner.calories +
      mealPlan.snack.calories +
      mealPlan.drink.calories;

    const totalProtein =
      mealPlan.breakfast.protein +
      mealPlan.lunch.protein +
      mealPlan.dinner.protein +
      mealPlan.snack.protein +
      mealPlan.drink.protein;

    const totalCarbs =
      mealPlan.breakfast.carbs +
      mealPlan.lunch.carbs +
      mealPlan.dinner.carbs +
      mealPlan.snack.carbs +
      mealPlan.drink.carbs;

    const totalFats =
      mealPlan.breakfast.fats +
      mealPlan.lunch.fats +
      mealPlan.dinner.fats +
      mealPlan.snack.fats +
      mealPlan.drink.fats;

    const totalFiber =
      mealPlan.breakfast.fiber +
      mealPlan.lunch.fiber +
      mealPlan.dinner.fiber +
      mealPlan.snack.fiber +
      mealPlan.drink.fiber;

    const totalCost =
      mealPlan.breakfast.price +
      mealPlan.lunch.price +
      mealPlan.dinner.price +
      mealPlan.snack.price +
      mealPlan.drink.price;

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmr: Math.round(bmr),
      targetCalories: Math.round(targetCalories),
      mealPlan,
      totalCalories,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFats: Math.round(totalFats * 10) / 10,
      totalFiber: Math.round(totalFiber * 10) / 10,
      totalCost,
    };
  };

  const handleSubmit = () => {
    if (
      !formData.age ||
      !formData.sex ||
      !formData.weight ||
      !formData.height ||
      !formData.activityLevel ||
      !formData.goal ||
      !formData.dietPreference ||
      !formData.budget
    ) {
      alert("Please fill all fields");
      return;
    }

    const calculatedResults = generateMealPlan();
    setResults(calculatedResults);
    setShowResults(true);
  };
  // Main render
  return (
    <div className="min-h-screen bg-gradient-main px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold text-foreground mb-4">Indian Diet Planner</h1>
        <p className="text-2xl text-muted-foreground">Get your personalized meal plan based on your goals and budget</p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {showResults && results ? (
          <>
            <motion.header
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold text-foreground mb-3">Your Personalized Diet Plan</h1>
              <p className="text-muted-foreground text-lg">Tailored to your goals and budget</p>
            </motion.header>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              {[
                { label: "BMI", value: results.bmi, icon: Calculator, unit: "" },
                { label: "BMR", value: results.bmr, icon: Activity, unit: "cal" },
                { label: "Target Calories", value: results.targetCalories, icon: Utensils, unit: "cal" },
                { label: "Your Budget", value: `₹${formData.budget}`, icon: DollarSign, unit: "" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 border-emerald-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                    <span className="text-lg ml-1">{stat.unit}</span>
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* BMI Category and Health Guidance Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-8 shadow-xl border-2 border-emerald-200 mb-8"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Your Health Status & Realistic Calorie Guide</h3>
              
              {/* BMI Category */}
              <div className="mb-6 pb-6 border-b border-emerald-200">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-2">BMI Category</p>
                  <p className={`text-3xl font-bold ${getBMICategory(results.bmi).color}`}>
                    {getBMICategory(results.bmi).category}
                  </p>
                </div>
                <p className="text-center text-foreground font-semibold text-lg bg-white/60 rounded-lg p-4">
                  {getBMICategory(results.bmi).advice}
                </p>
              </div>

              {/* Realistic Calorie Targets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Maintain Weight */}
                <div className={`p-4 rounded-lg ${formData.goal === "maintain" ? "bg-white shadow-lg border-2 border-green-500" : "bg-white/40"}`}>
                  <p className="text-xs uppercase font-semibold text-muted-foreground mb-2">Maintain Weight</p>
                  <p className="text-lg font-bold text-foreground mb-2">{results.bmr}</p>
                  <p className="text-xs text-muted-foreground">Daily calories needed</p>
                  <p className="text-xs text-green-600 font-semibold mt-2">No adjustment required</p>
                </div>

                {/* Lose Weight */}
                <div className={`p-4 rounded-lg ${formData.goal === "lose" ? "bg-white shadow-lg border-2 border-amber-500" : "bg-white/40"}`}>
                  <p className="text-xs uppercase font-semibold text-muted-foreground mb-2">Lose Weight (500 cal deficit)</p>
                  <p className="text-lg font-bold text-amber-600 mb-2">{results.targetCalories}</p>
                  <p className="text-xs text-muted-foreground mb-2">Daily calorie target</p>
                  <p className="text-xs font-semibold text-amber-600">~0.5kg loss per week</p>
                  <p className="text-xs text-amber-600">~2kg loss per month</p>
                </div>

                {/* Gain Weight */}
                <div className={`p-4 rounded-lg ${formData.goal === "gain" ? "bg-white shadow-lg border-2 border-blue-500" : "bg-white/40"}`}>
                  <p className="text-xs uppercase font-semibold text-muted-foreground mb-2">Gain Weight (500 cal surplus)</p>
                  <p className="text-lg font-bold text-blue-600 mb-2">{results.targetCalories}</p>
                  <p className="text-xs text-muted-foreground mb-2">Daily calorie target</p>
                  <p className="text-xs font-semibold text-blue-600">~0.5kg gain per week</p>
                  <p className="text-xs text-blue-600">~2kg gain per month</p>
                </div>
              </div>

              {/* Important Notes */}
              <div className="mt-6 pt-6 border-t border-emerald-200">
                <p className="text-sm font-semibold text-foreground mb-3">📌 Important Notes:</p>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• <span className="font-semibold">BMR ({results.bmr} cal):</span> Minimum calories your body needs at rest</li>
                  <li>• <span className="font-semibold">Target Calories ({results.targetCalories} cal):</span> Includes your activity level + goal adjustment</li>
                  <li>• <span className="font-semibold">500 calorie rule:</span> 500 cal deficit/surplus = ~0.5kg change per week</li>
                  <li>• <span className="font-semibold">Consistency:</span> Stick to your target calories for accurate results</li>
                  <li>• <span className="font-semibold">Protein target:</span> Aim for 0.8-1g per pound of body weight</li>
                </ul>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(results.mealPlan).map(([mealType, food], index) => {
                const typedFood = food as FoodItem;
                return (
                  <motion.div
                    key={mealType}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border-2 border-emerald-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold capitalize text-foreground">{mealType}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          typedFood.type === "veg"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {typedFood.type === "veg" ? "🌱 Veg" : "🍗 Non-Veg"}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">{typedFood.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-semibold text-foreground">Quantity:</span> {typedFood.quantity}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Protein</span>
                        <span className="text-lg font-bold text-foreground">{typedFood.protein}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Carbs</span>
                        <span className="text-lg font-bold text-foreground">{typedFood.carbs}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Fats</span>
                        <span className="text-lg font-bold text-foreground">{typedFood.fats}g</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Fiber</span>
                        <span className="text-lg font-bold text-foreground">{typedFood.fiber}g</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{typedFood.calories}</span> cal
                        </span>
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">₹{typedFood.price}</span>
                        </span>
                      </div>
                    </div>
                    {typedFood.recipe && (
                      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg">
                        <h5 className="font-semibold text-emerald-900 mb-2 text-sm">📖 Recipe Instructions:</h5>
                        <p className="text-sm text-emerald-800 leading-relaxed">{typedFood.recipe}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 mb-8"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Daily Nutritional Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Total Calories</p>
                  <p className="text-4xl font-bold text-foreground">{results.totalCalories}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Target: {results.targetCalories} cal
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Total Protein</p>
                  <p className="text-4xl font-bold text-blue-600">{results.totalProtein}g</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 50-60g
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Total Carbs</p>
                  <p className="text-4xl font-bold text-amber-600">{results.totalCarbs}g</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 200-300g
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Total Fats</p>
                  <p className="text-4xl font-bold text-orange-600">{results.totalFats}g</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 50-70g
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Total Fiber</p>
                  <p className="text-4xl font-bold text-green-600">{results.totalFiber}g</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 25-35g
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Total Cost</p>
                  <p className="text-4xl font-bold text-foreground">₹{results.totalCost}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Budget: ₹{formData.budget}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-emerald-200">
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold ${
                      results.totalCost <= formData.budget ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {results.totalCost <= formData.budget
                      ? "✓ Budget Status: Within Budget"
                      : `⚠ Budget Status: ₹${results.totalCost - formData.budget} over`}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="bg-gradient-button text-white px-12 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                Create New Plan
              </motion.button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-emerald-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-foreground font-semibold mb-2">Age</label>
                <input
                  type="number"
                  min="15"
                  max="100"
                  value={formData.age || ""}
                  onChange={(e) => updateFormData("age", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                  placeholder="Enter age (15-100)"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Sex</label>
                <div className="grid grid-cols-2 gap-3">
                  {["male", "female"].map((sex) => (
                    <button
                      key={sex}
                      onClick={() => updateFormData("sex", sex as FormData["sex"])}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        formData.sex === sex
                          ? "bg-gradient-button text-white shadow-lg"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {sex === "male" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="200"
                  value={formData.weight || ""}
                  onChange={(e) => updateFormData("weight", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                  placeholder="Enter weight (30-200 kg)"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Height (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="250"
                  value={formData.height || ""}
                  onChange={(e) => updateFormData("height", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                  placeholder="Enter height (120-250 cm)"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => updateFormData("activityLevel", e.target.value as FormData["activityLevel"])}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="veryActive">Very Active</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => updateFormData("goal", e.target.value as FormData["goal"])}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                >
                  <option value="">Select goal</option>
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Diet Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "veg", label: "Veg" },
                    { value: "nonveg", label: "Non-Veg" },
                    { value: "both", label: "Both" },
                  ].map((pref) => (
                    <button
                      key={pref.value}
                      onClick={() => updateFormData("dietPreference", pref.value as FormData["dietPreference"])}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        formData.dietPreference === pref.value
                          ? "bg-gradient-button text-white shadow-lg"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">Daily Budget (₹)</label>
                <input
                  type="number"
                  min="100"
                  max="5000"
                  value={formData.budget || ""}
                  onChange={(e) => updateFormData("budget", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none transition-colors bg-white"
                  placeholder="Enter budget (₹100-5000)"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full bg-gradient-button text-white py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Generate My Diet Plan
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;

