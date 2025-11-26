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
    { name: "Ragi Porridge", quantity: "1 plate (300g)", calories: 212, protein: 14, carbs: 45, fats: 10, fiber: 5, price: 134, type: "veg" as const, recipe: "Prepare ragi porridge using fresh vegetables, minimal oil, and serve warm." },
    { name: "Broken Wheat Upma", quantity: "1 plate (300g)", calories: 479, protein: 8, carbs: 67, fats: 16, fiber: 3, price: 43, type: "veg" as const, recipe: "Prepare broken wheat upma using fresh vegetables, minimal oil, and serve warm." },
    { name: "Idli (Ragi+Rice)", quantity: "1 plate (300g)", calories: 311, protein: 13, carbs: 62, fats: 3, fiber: 11, price: 65, type: "veg" as const, recipe: "Prepare idli (ragi+rice) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Oats Poha", quantity: "1 cup (200g)", calories: 312, protein: 20, carbs: 67, fats: 11, fiber: 3, price: 137, type: "veg" as const, recipe: "Prepare oats poha using fresh vegetables, minimal oil, and serve warm." },
    { name: "Multigrain Paratha", quantity: "1 bowl (250g)", calories: 416, protein: 16, carbs: 47, fats: 7, fiber: 6, price: 137, type: "veg" as const, recipe: "Prepare multigrain paratha using fresh vegetables, minimal oil, and serve warm." },
    { name: "Besan Oats Chilla", quantity: "1 serving", calories: 252, protein: 8, carbs: 54, fats: 6, fiber: 8, price: 84, type: "veg" as const, recipe: "Prepare besan oats chilla using fresh vegetables, minimal oil, and serve warm." },
    { name: "Rava Dosa", quantity: "1 serving", calories: 222, protein: 20, carbs: 64, fats: 6, fiber: 9, price: 50, type: "veg" as const, recipe: "Prepare rava dosa using fresh vegetables, minimal oil, and serve warm." },
    { name: "Greek Yogurt Parfait", quantity: "1 serving", calories: 516, protein: 17, carbs: 66, fats: 9, fiber: 4, price: 45, type: "veg" as const, recipe: "Prepare greek yogurt parfait using fresh vegetables, minimal oil, and serve warm." },
    { name: "Moong Dal Cheela", quantity: "1 bowl (250g)", calories: 348, protein: 8, carbs: 44, fats: 6, fiber: 9, price: 75, type: "veg" as const, recipe: "Prepare moong dal cheela using fresh vegetables, minimal oil, and serve warm." },
    { name: "Quinoa Upma", quantity: "1 cup (200g)", calories: 386, protein: 11, carbs: 53, fats: 14, fiber: 6, price: 125, type: "veg" as const, recipe: "Prepare quinoa upma using fresh vegetables, minimal oil, and serve warm." },
    { name: "Fruit & Nut Bowl", quantity: "1 serving", calories: 236, protein: 25, carbs: 70, fats: 8, fiber: 11, price: 133, type: "veg" as const, recipe: "Prepare fruit & nut bowl using fresh vegetables, minimal oil, and serve warm." },
    { name: "Dhokla", quantity: "1 bowl (250g)", calories: 283, protein: 20, carbs: 54, fats: 11, fiber: 11, price: 68, type: "veg" as const, recipe: "Prepare dhokla using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Poha", quantity: "1 serving", calories: 228, protein: 13, carbs: 32, fats: 13, fiber: 9, price: 74, type: "veg" as const, recipe: "Prepare vegetable poha using fresh vegetables, minimal oil, and serve warm." },
    { name: "Idli Sandwich", quantity: "1 plate (300g)", calories: 308, protein: 24, carbs: 75, fats: 13, fiber: 6, price: 123, type: "veg" as const, recipe: "Prepare idli sandwich using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Moong Pancake", quantity: "1 cup (200g)", calories: 402, protein: 26, carbs: 59, fats: 7, fiber: 7, price: 57, type: "veg" as const, recipe: "Prepare sprouted moong pancake using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Thepla", quantity: "1 bowl (250g)", calories: 487, protein: 23, carbs: 46, fats: 16, fiber: 12, price: 91, type: "veg" as const, recipe: "Prepare methi thepla using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Semolina Pancake", quantity: "1 serving", calories: 312, protein: 10, carbs: 62, fats: 18, fiber: 4, price: 136, type: "veg" as const, recipe: "Prepare vegetable semolina pancake using fresh vegetables, minimal oil, and serve warm." },
    { name: "Paneer Paratha (veg)", quantity: "1 plate (300g)", calories: 256, protein: 10, carbs: 70, fats: 8, fiber: 9, price: 116, type: "veg" as const, recipe: "Prepare paneer paratha (veg) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sweet Potato Hash", quantity: "1 plate (300g)", calories: 397, protein: 18, carbs: 68, fats: 17, fiber: 11, price: 72, type: "veg" as const, recipe: "Prepare sweet potato hash using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Omelette (Chickpea Flour)", quantity: "1 plate (300g)", calories: 258, protein: 27, carbs: 64, fats: 11, fiber: 8, price: 54, type: "veg" as const, recipe: "Prepare vegetable omelette (chickpea flour) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sorghum Pancakes", quantity: "1 serving", calories: 422, protein: 11, carbs: 59, fats: 3, fiber: 7, price: 104, type: "veg" as const, recipe: "Prepare sorghum pancakes using fresh vegetables, minimal oil, and serve warm." },
    { name: "Ragi Dosa", quantity: "1 bowl (250g)", calories: 459, protein: 9, carbs: 70, fats: 12, fiber: 11, price: 117, type: "veg" as const, recipe: "Prepare ragi dosa using fresh vegetables, minimal oil, and serve warm." },
    { name: "Oats Idli", quantity: "1 bowl (250g)", calories: 278, protein: 17, carbs: 78, fats: 8, fiber: 11, price: 139, type: "veg" as const, recipe: "Prepare oats idli using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Uttapam", quantity: "1 plate (300g)", calories: 506, protein: 16, carbs: 61, fats: 3, fiber: 4, price: 86, type: "veg" as const, recipe: "Prepare vegetable uttapam using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sattu Pancake", quantity: "1 serving", calories: 322, protein: 7, carbs: 45, fats: 5, fiber: 4, price: 133, type: "veg" as const, recipe: "Prepare sattu pancake using fresh vegetables, minimal oil, and serve warm." },
    { name: "Millet Porridge", quantity: "1 cup (200g)", calories: 235, protein: 23, carbs: 79, fats: 7, fiber: 5, price: 124, type: "veg" as const, recipe: "Prepare millet porridge using fresh vegetables, minimal oil, and serve warm." },
    { name: "Rajgira Chilla", quantity: "1 cup (200g)", calories: 481, protein: 11, carbs: 46, fats: 16, fiber: 6, price: 109, type: "veg" as const, recipe: "Prepare rajgira chilla using fresh vegetables, minimal oil, and serve warm." },
    { name: "Paneer Bhurji (veg)", quantity: "1 bowl (250g)", calories: 359, protein: 18, carbs: 72, fats: 14, fiber: 10, price: 106, type: "veg" as const, recipe: "Prepare paneer bhurji (veg) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Corn & Spinach Pancake", quantity: "1 cup (200g)", calories: 261, protein: 13, carbs: 44, fats: 5, fiber: 8, price: 42, type: "veg" as const, recipe: "Prepare corn & spinach pancake using fresh vegetables, minimal oil, and serve warm." },
    { name: "Pumpkin Oats Porridge", quantity: "1 bowl (250g)", calories: 501, protein: 13, carbs: 30, fats: 5, fiber: 3, price: 69, type: "veg" as const, recipe: "Prepare pumpkin oats porridge using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lentil Pancake", quantity: "1 plate (300g)", calories: 216, protein: 16, carbs: 34, fats: 10, fiber: 7, price: 125, type: "veg" as const, recipe: "Prepare lentil pancake using fresh vegetables, minimal oil, and serve warm." },
    { name: "Apple Cinnamon Oats", quantity: "1 cup (200g)", calories: 309, protein: 23, carbs: 38, fats: 18, fiber: 6, price: 140, type: "veg" as const, recipe: "Prepare apple cinnamon oats using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Frittata (tofu)", quantity: "1 cup (200g)", calories: 408, protein: 12, carbs: 36, fats: 6, fiber: 9, price: 85, type: "veg" as const, recipe: "Prepare vegetable frittata (tofu) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Avocado Toast (multigrain)", quantity: "1 cup (200g)", calories: 410, protein: 20, carbs: 76, fats: 4, fiber: 4, price: 47, type: "veg" as const, recipe: "Prepare avocado toast (multigrain) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Chia Pudding with Fruits", quantity: "1 cup (200g)", calories: 373, protein: 9, carbs: 45, fats: 9, fiber: 6, price: 108, type: "veg" as const, recipe: "Prepare chia pudding with fruits using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Moong Salad Bowl", quantity: "1 cup (200g)", calories: 271, protein: 19, carbs: 41, fats: 11, fiber: 10, price: 71, type: "veg" as const, recipe: "Prepare sprouted moong salad bowl using fresh vegetables, minimal oil, and serve warm." },
    { name: "Buckwheat Pancakes", quantity: "1 plate (300g)", calories: 426, protein: 23, carbs: 36, fats: 4, fiber: 11, price: 41, type: "veg" as const, recipe: "Prepare buckwheat pancakes using fresh vegetables, minimal oil, and serve warm." },
    { name: "Ragi Pancake", quantity: "1 plate (300g)", calories: 321, protein: 11, carbs: 56, fats: 18, fiber: 10, price: 67, type: "veg" as const, recipe: "Prepare ragi pancake using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Sandwich (multigrain)", quantity: "1 cup (200g)", calories: 230, protein: 11, carbs: 54, fats: 3, fiber: 9, price: 73, type: "veg" as const, recipe: "Prepare vegetable sandwich (multigrain) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Tomato Onion Uttapam", quantity: "1 cup (200g)", calories: 346, protein: 19, carbs: 74, fats: 18, fiber: 5, price: 64, type: "veg" as const, recipe: "Prepare tomato onion uttapam using fresh vegetables, minimal oil, and serve warm." },
    { name: "Spinach Paratha", quantity: "1 serving", calories: 311, protein: 7, carbs: 67, fats: 4, fiber: 8, price: 47, type: "veg" as const, recipe: "Prepare spinach paratha using fresh vegetables, minimal oil, and serve warm." },
    { name: "Carrot Rava Upma", quantity: "1 plate (300g)", calories: 499, protein: 21, carbs: 62, fats: 8, fiber: 3, price: 105, type: "veg" as const, recipe: "Prepare carrot rava upma using fresh vegetables, minimal oil, and serve warm." },
    { name: "Muesli with Milk", quantity: "1 plate (300g)", calories: 295, protein: 8, carbs: 68, fats: 5, fiber: 6, price: 91, type: "veg" as const, recipe: "Prepare muesli with milk using fresh vegetables, minimal oil, and serve warm." },
    { name: "Cottage Cheese Toast", quantity: "1 plate (300g)", calories: 491, protein: 13, carbs: 67, fats: 4, fiber: 12, price: 50, type: "veg" as const, recipe: "Prepare cottage cheese toast using fresh vegetables, minimal oil, and serve warm." },
    { name: "Corn Upma", quantity: "1 cup (200g)", calories: 498, protein: 24, carbs: 63, fats: 13, fiber: 7, price: 66, type: "veg" as const, recipe: "Prepare corn upma using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sweet Pongal (low sugar)", quantity: "1 serving", calories: 322, protein: 14, carbs: 55, fats: 7, fiber: 7, price: 98, type: "veg" as const, recipe: "Prepare sweet pongal (low sugar) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Millet Idli", quantity: "1 serving", calories: 237, protein: 6, carbs: 59, fats: 6, fiber: 4, price: 108, type: "veg" as const, recipe: "Prepare mixed millet idli using fresh vegetables, minimal oil, and serve warm." },
    { name: "Beetroot Paratha", quantity: "1 bowl (250g)", calories: 459, protein: 14, carbs: 38, fats: 14, fiber: 4, price: 71, type: "veg" as const, recipe: "Prepare beetroot paratha using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Stuffed Dosa", quantity: "1 serving", calories: 345, protein: 11, carbs: 58, fats: 12, fiber: 12, price: 123, type: "veg" as const, recipe: "Prepare vegetable stuffed dosa using fresh vegetables, minimal oil, and serve warm." },
    { name: "Masala Oats", quantity: "1 plate (300g)", calories: 483, protein: 15, carbs: 72, fats: 6, fiber: 5, price: 73, type: "veg" as const, recipe: "Prepare masala oats using fresh vegetables, minimal oil, and serve warm." },
    { name: "Peanut Butter Banana Toast", quantity: "1 plate (300g)", calories: 254, protein: 23, carbs: 39, fats: 11, fiber: 7, price: 117, type: "veg" as const, recipe: "Prepare peanut butter banana toast using fresh vegetables, minimal oil, and serve warm." },
    { name: "Walnut Banana Oats", quantity: "1 bowl (250g)", calories: 375, protein: 12, carbs: 73, fats: 11, fiber: 11, price: 102, type: "veg" as const, recipe: "Prepare walnut banana oats using fresh vegetables, minimal oil, and serve warm." },
    { name: "Herbed Cottage Cheese Wrap", quantity: "1 serving", calories: 226, protein: 8, carbs: 70, fats: 16, fiber: 7, price: 45, type: "veg" as const, recipe: "Prepare herbed cottage cheese wrap using fresh vegetables, minimal oil, and serve warm." },
    { name: "Pumpkin Thepla", quantity: "1 plate (300g)", calories: 370, protein: 10, carbs: 70, fats: 11, fiber: 5, price: 134, type: "veg" as const, recipe: "Prepare pumpkin thepla using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Kebabs (baked)", quantity: "1 cup (200g)", calories: 482, protein: 28, carbs: 57, fats: 3, fiber: 4, price: 49, type: "veg" as const, recipe: "Prepare vegetable kebabs (baked) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Soya Granola Bowl", quantity: "1 bowl (250g)", calories: 479, protein: 7, carbs: 53, fats: 7, fiber: 9, price: 56, type: "veg" as const, recipe: "Prepare soya granola bowl using fresh vegetables, minimal oil, and serve warm." },
    { name: "Moong Sprout Pancake", quantity: "1 plate (300g)", calories: 357, protein: 17, carbs: 80, fats: 4, fiber: 8, price: 66, type: "veg" as const, recipe: "Prepare moong sprout pancake using fresh vegetables, minimal oil, and serve warm." },
    { name: "Ragi Porridge 58", quantity: "1 bowl (250g)", calories: 252, protein: 17, carbs: 79, fats: 16, fiber: 12, price: 135, type: "veg" as const, recipe: "Prepare ragi porridge 58 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Broken Wheat Upma 59", quantity: "1 bowl (250g)", calories: 321, protein: 11, carbs: 41, fats: 16, fiber: 3, price: 62, type: "veg" as const, recipe: "Prepare broken wheat upma 59 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Idli (Ragi+Rice) 60", quantity: "1 serving", calories: 410, protein: 27, carbs: 77, fats: 10, fiber: 7, price: 60, type: "veg" as const, recipe: "Prepare idli (ragi+rice) 60 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Egg White Omelette with Spinach", quantity: "1 plate (300g)", calories: 455, protein: 20, carbs: 70, fats: 13, fiber: 4, price: 197, type: "nonveg" as const, recipe: "Prepare egg white omelette with spinach using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Masala Omelette with Ragi Toast", quantity: "1 serving", calories: 416, protein: 32, carbs: 38, fats: 6, fiber: 4, price: 182, type: "nonveg" as const, recipe: "Prepare masala omelette with ragi toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Smoked Salmon on Multigrain", quantity: "1 serving", calories: 402, protein: 22, carbs: 45, fats: 17, fiber: 7, price: 253, type: "nonveg" as const, recipe: "Prepare smoked salmon on multigrain using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Bhurji with Vegetables", quantity: "1 serving", calories: 274, protein: 25, carbs: 43, fats: 11, fiber: 5, price: 89, type: "nonveg" as const, recipe: "Prepare egg bhurji with vegetables using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken & Vegetable Upma", quantity: "1 plate (300g)", calories: 565, protein: 45, carbs: 54, fats: 29, fiber: 6, price: 191, type: "nonveg" as const, recipe: "Prepare chicken & vegetable upma using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Sandwich", quantity: "1 plate (300g)", calories: 457, protein: 54, carbs: 34, fats: 14, fiber: 1, price: 191, type: "nonveg" as const, recipe: "Prepare egg sandwich using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Avocado Toast", quantity: "1 plate (300g)", calories: 526, protein: 52, carbs: 35, fats: 17, fiber: 7, price: 97, type: "nonveg" as const, recipe: "Prepare egg & avocado toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Turkish Egg (Menemen) style", quantity: "1 serving", calories: 579, protein: 38, carbs: 25, fats: 29, fiber: 5, price: 209, type: "nonveg" as const, recipe: "Prepare turkish egg (menemen) style using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tuna Breakfast Bowl", quantity: "1 serving", calories: 601, protein: 44, carbs: 51, fats: 18, fiber: 5, price: 221, type: "nonveg" as const, recipe: "Prepare tuna breakfast bowl using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Sausage with Toast", quantity: "1 bowl (250g)", calories: 358, protein: 44, carbs: 58, fats: 27, fiber: 3, price: 237, type: "nonveg" as const, recipe: "Prepare chicken sausage with toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Muffin", quantity: "1 serving", calories: 467, protein: 53, carbs: 10, fats: 15, fiber: 5, price: 133, type: "nonveg" as const, recipe: "Prepare egg muffin using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Salmon Scramble", quantity: "200g serving", calories: 662, protein: 55, carbs: 51, fats: 20, fiber: 8, price: 193, type: "nonveg" as const, recipe: "Prepare salmon scramble using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg and Spinach Wrap", quantity: "1 bowl (250g)", calories: 521, protein: 48, carbs: 31, fats: 27, fiber: 2, price: 152, type: "nonveg" as const, recipe: "Prepare egg and spinach wrap using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Keema Toast", quantity: "1 serving", calories: 307, protein: 33, carbs: 49, fats: 13, fiber: 4, price: 117, type: "nonveg" as const, recipe: "Prepare chicken keema toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Omelette", quantity: "1 plate (300g)", calories: 283, protein: 33, carbs: 70, fats: 25, fiber: 2, price: 196, type: "nonveg" as const, recipe: "Prepare prawn omelette using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Fried Millet", quantity: "200g serving", calories: 582, protein: 54, carbs: 34, fats: 28, fiber: 7, price: 206, type: "nonveg" as const, recipe: "Prepare egg fried millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Turkey Bacon Sandwich", quantity: "200g serving", calories: 384, protein: 27, carbs: 10, fats: 30, fiber: 2, price: 188, type: "nonveg" as const, recipe: "Prepare turkey bacon sandwich using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: " smoked trout on toast", quantity: "1 bowl (250g)", calories: 350, protein: 51, carbs: 69, fats: 7, fiber: 4, price: 111, type: "nonveg" as const, recipe: "Prepare  smoked trout on toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Masala Dosa (egg filling)", quantity: "200g serving", calories: 328, protein: 47, carbs: 77, fats: 23, fiber: 6, price: 193, type: "nonveg" as const, recipe: "Prepare egg masala dosa (egg filling) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Pancake", quantity: "200g serving", calories: 685, protein: 53, carbs: 67, fats: 11, fiber: 8, price: 195, type: "nonveg" as const, recipe: "Prepare chicken pancake using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Keema Upma", quantity: "1 serving", calories: 644, protein: 33, carbs: 45, fats: 30, fiber: 8, price: 240, type: "nonveg" as const, recipe: "Prepare keema upma using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Bhurji Wrap", quantity: "1 bowl (250g)", calories: 400, protein: 46, carbs: 19, fats: 28, fiber: 5, price: 140, type: "nonveg" as const, recipe: "Prepare egg bhurji wrap using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tuna Salad on Toast", quantity: "1 serving", calories: 431, protein: 38, carbs: 79, fats: 8, fiber: 3, price: 118, type: "nonveg" as const, recipe: "Prepare tuna salad on toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Salmon Parfait", quantity: "1 bowl (250g)", calories: 456, protein: 27, carbs: 37, fats: 8, fiber: 7, price: 184, type: "nonveg" as const, recipe: "Prepare salmon parfait using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Shakshuka", quantity: "1 serving", calories: 537, protein: 47, carbs: 63, fats: 7, fiber: 4, price: 187, type: "nonveg" as const, recipe: "Prepare chicken shakshuka using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Chowder (light)", quantity: "200g serving", calories: 654, protein: 55, carbs: 12, fats: 30, fiber: 7, price: 202, type: "nonveg" as const, recipe: "Prepare egg chowder (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Cutlet with Roti", quantity: "1 plate (300g)", calories: 440, protein: 37, carbs: 59, fats: 19, fiber: 4, price: 204, type: "nonveg" as const, recipe: "Prepare fish cutlet with roti using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Cottage Cheese Toast", quantity: "1 bowl (250g)", calories: 399, protein: 45, carbs: 72, fats: 6, fiber: 7, price: 166, type: "nonveg" as const, recipe: "Prepare egg & cottage cheese toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Spiced Egg Salad", quantity: "200g serving", calories: 630, protein: 28, carbs: 69, fats: 10, fiber: 1, price: 180, type: "nonveg" as const, recipe: "Prepare spiced egg salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Omelette Roll", quantity: "1 plate (300g)", calories: 302, protein: 59, carbs: 64, fats: 10, fiber: 8, price: 126, type: "nonveg" as const, recipe: "Prepare chicken omelette roll using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Veg Hash", quantity: "1 plate (300g)", calories: 393, protein: 42, carbs: 51, fats: 12, fiber: 8, price: 163, type: "nonveg" as const, recipe: "Prepare egg & veg hash using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Smoked Mackerel Toast", quantity: "1 serving", calories: 649, protein: 42, carbs: 45, fats: 30, fiber: 7, price: 144, type: "nonveg" as const, recipe: "Prepare smoked mackerel toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Veg Rava Upma", quantity: "1 plate (300g)", calories: 500, protein: 19, carbs: 79, fats: 7, fiber: 6, price: 137, type: "nonveg" as const, recipe: "Prepare prawn & veg rava upma using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Turkey Wrap", quantity: "1 plate (300g)", calories: 659, protein: 59, carbs: 15, fats: 30, fiber: 1, price: 143, type: "nonveg" as const, recipe: "Prepare turkey wrap using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Tikka Omelette", quantity: "1 bowl (250g)", calories: 689, protein: 19, carbs: 29, fats: 13, fiber: 3, price: 201, type: "nonveg" as const, recipe: "Prepare chicken tikka omelette using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Quinoa Bowl", quantity: "1 plate (300g)", calories: 548, protein: 31, carbs: 69, fats: 28, fiber: 5, price: 174, type: "nonveg" as const, recipe: "Prepare egg & quinoa bowl using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Salmon & Quinoa Porridge", quantity: "1 bowl (250g)", calories: 570, protein: 56, carbs: 24, fats: 30, fiber: 3, price: 159, type: "nonveg" as const, recipe: "Prepare salmon & quinoa porridge using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Poha", quantity: "1 plate (300g)", calories: 556, protein: 19, carbs: 49, fats: 24, fiber: 7, price: 181, type: "nonveg" as const, recipe: "Prepare prawn poha using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Spinach Pancake", quantity: "1 bowl (250g)", calories: 298, protein: 55, carbs: 41, fats: 9, fiber: 5, price: 255, type: "nonveg" as const, recipe: "Prepare egg & spinach pancake using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Minced Chicken Dosa", quantity: "1 plate (300g)", calories: 667, protein: 54, carbs: 15, fats: 17, fiber: 7, price: 249, type: "nonveg" as const, recipe: "Prepare minced chicken dosa using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Bhurji with Ragi Roti", quantity: "1 serving", calories: 295, protein: 50, carbs: 53, fats: 6, fiber: 7, price: 205, type: "nonveg" as const, recipe: "Prepare egg bhurji with ragi roti using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Smoked Salmon Bagel (small)", quantity: "1 plate (300g)", calories: 481, protein: 41, carbs: 68, fats: 28, fiber: 3, price: 191, type: "nonveg" as const, recipe: "Prepare smoked salmon bagel (small) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Mushroom Toast", quantity: "1 bowl (250g)", calories: 635, protein: 51, carbs: 44, fats: 25, fiber: 8, price: 199, type: "nonveg" as const, recipe: "Prepare egg & mushroom toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Keema Paratha", quantity: "200g serving", calories: 682, protein: 55, carbs: 44, fats: 16, fiber: 4, price: 102, type: "nonveg" as const, recipe: "Prepare chicken keema paratha using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Bean Toast", quantity: "1 serving", calories: 490, protein: 33, carbs: 69, fats: 24, fiber: 7, price: 166, type: "nonveg" as const, recipe: "Prepare egg & bean toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Sardine Toast", quantity: "1 plate (300g)", calories: 513, protein: 38, carbs: 33, fats: 21, fiber: 4, price: 170, type: "nonveg" as const, recipe: "Prepare fish sardine toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Tomato Uttapam", quantity: "1 serving", calories: 434, protein: 35, carbs: 45, fats: 23, fiber: 1, price: 212, type: "nonveg" as const, recipe: "Prepare egg & tomato uttapam using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Besan Chilla", quantity: "1 bowl (250g)", calories: 303, protein: 33, carbs: 62, fats: 21, fiber: 4, price: 256, type: "nonveg" as const, recipe: "Prepare prawn besan chilla using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Corn Pancake", quantity: "200g serving", calories: 590, protein: 49, carbs: 67, fats: 6, fiber: 2, price: 155, type: "nonveg" as const, recipe: "Prepare egg & corn pancake using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken and Oats Pancake", quantity: "1 bowl (250g)", calories: 467, protein: 33, carbs: 49, fats: 27, fiber: 6, price: 201, type: "nonveg" as const, recipe: "Prepare chicken and oats pancake using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Peanut Butter Toast", quantity: "1 serving", calories: 477, protein: 53, carbs: 52, fats: 17, fiber: 8, price: 149, type: "nonveg" as const, recipe: "Prepare egg & peanut butter toast using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Smoked Salmon Roll", quantity: "1 serving", calories: 388, protein: 32, carbs: 25, fats: 29, fiber: 4, price: 160, type: "nonveg" as const, recipe: "Prepare smoked salmon roll using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Kale Wrap", quantity: "1 plate (300g)", calories: 640, protein: 52, carbs: 33, fats: 12, fiber: 4, price: 203, type: "nonveg" as const, recipe: "Prepare egg & kale wrap using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg White Omelette with Spinach 54", quantity: "1 serving", calories: 630, protein: 55, carbs: 77, fats: 25, fiber: 5, price: 105, type: "nonveg" as const, recipe: "Prepare egg white omelette with spinach 54 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Masala Omelette with Ragi Toast 55", quantity: "1 bowl (250g)", calories: 411, protein: 32, carbs: 56, fats: 11, fiber: 5, price: 83, type: "nonveg" as const, recipe: "Prepare masala omelette with ragi toast 55 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Smoked Salmon on Multigrain 56", quantity: "1 bowl (250g)", calories: 400, protein: 20, carbs: 16, fats: 23, fiber: 5, price: 258, type: "nonveg" as const, recipe: "Prepare smoked salmon on multigrain 56 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Bhurji with Vegetables 57", quantity: "1 bowl (250g)", calories: 586, protein: 49, carbs: 23, fats: 6, fiber: 5, price: 200, type: "nonveg" as const, recipe: "Prepare egg bhurji with vegetables 57 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken & Vegetable Upma 58", quantity: "200g serving", calories: 485, protein: 39, carbs: 33, fats: 7, fiber: 5, price: 202, type: "nonveg" as const, recipe: "Prepare chicken & vegetable upma 58 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Sandwich 59", quantity: "1 plate (300g)", calories: 680, protein: 22, carbs: 61, fats: 21, fiber: 2, price: 227, type: "nonveg" as const, recipe: "Prepare egg sandwich 59 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Avocado Toast 60", quantity: "1 plate (300g)", calories: 337, protein: 27, carbs: 48, fats: 8, fiber: 4, price: 110, type: "nonveg" as const, recipe: "Prepare egg & avocado toast 60 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
  ],

  lunch: [
    { name: "Brown Rice with Toor Dal & Mixed Veg", quantity: "1 cup (200g)", calories: 510, protein: 25, carbs: 80, fats: 10, fiber: 11, price: 88, type: "veg" as const, recipe: "Prepare brown rice with toor dal & mixed veg using fresh vegetables, minimal oil, and serve warm." },
    { name: "Quinoa & Mixed Bean Salad", quantity: "1 cup (200g)", calories: 426, protein: 15, carbs: 67, fats: 16, fiber: 7, price: 112, type: "veg" as const, recipe: "Prepare quinoa & mixed bean salad using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Moong Salad + Multigrain Roti", quantity: "1 plate (300g)", calories: 512, protein: 9, carbs: 78, fats: 9, fiber: 6, price: 73, type: "veg" as const, recipe: "Prepare sprouted moong salad + multigrain roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Chana Masala with Brown Rice", quantity: "1 plate (300g)", calories: 280, protein: 13, carbs: 41, fats: 5, fiber: 5, price: 40, type: "veg" as const, recipe: "Prepare chana masala with brown rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Palak Paneer with 2 Rotis", quantity: "1 cup (200g)", calories: 430, protein: 28, carbs: 68, fats: 18, fiber: 7, price: 44, type: "veg" as const, recipe: "Prepare palak paneer with 2 rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Biryani (Low Oil)", quantity: "1 bowl (250g)", calories: 347, protein: 28, carbs: 48, fats: 17, fiber: 4, price: 127, type: "veg" as const, recipe: "Prepare vegetable biryani (low oil) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Millet Pulao with Yogurt", quantity: "1 bowl (250g)", calories: 335, protein: 26, carbs: 67, fats: 9, fiber: 9, price: 54, type: "veg" as const, recipe: "Prepare millet pulao with yogurt using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lemon Brown Rice with Roasted Veg", quantity: "1 bowl (250g)", calories: 276, protein: 14, carbs: 39, fats: 5, fiber: 3, price: 61, type: "veg" as const, recipe: "Prepare lemon brown rice with roasted veg using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Curry with 2 Rotis", quantity: "1 serving", calories: 504, protein: 24, carbs: 48, fats: 17, fiber: 4, price: 99, type: "veg" as const, recipe: "Prepare vegetable curry with 2 rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Rajma with Brown Rice", quantity: "1 serving", calories: 406, protein: 14, carbs: 62, fats: 18, fiber: 10, price: 50, type: "veg" as const, recipe: "Prepare rajma with brown rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Chickpea & Vegetable Stew", quantity: "1 plate (300g)", calories: 421, protein: 16, carbs: 68, fats: 11, fiber: 3, price: 51, type: "veg" as const, recipe: "Prepare chickpea & vegetable stew using fresh vegetables, minimal oil, and serve warm." },
    { name: "Paneer Tikka Bowl", quantity: "1 bowl (250g)", calories: 494, protein: 24, carbs: 31, fats: 11, fiber: 12, price: 45, type: "veg" as const, recipe: "Prepare paneer tikka bowl using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Lentil Stew", quantity: "1 bowl (250g)", calories: 440, protein: 22, carbs: 71, fats: 17, fiber: 7, price: 63, type: "veg" as const, recipe: "Prepare mixed lentil stew using fresh vegetables, minimal oil, and serve warm." },
    { name: "Soya Chunks Curry with Rice", quantity: "1 cup (200g)", calories: 451, protein: 8, carbs: 60, fats: 14, fiber: 9, price: 82, type: "veg" as const, recipe: "Prepare soya chunks curry with rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Malai Paneer (low oil)", quantity: "1 serving", calories: 253, protein: 11, carbs: 51, fats: 16, fiber: 10, price: 76, type: "veg" as const, recipe: "Prepare methi malai paneer (low oil) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Bhindi Masala with Rotis", quantity: "1 cup (200g)", calories: 481, protein: 7, carbs: 59, fats: 5, fiber: 8, price: 72, type: "veg" as const, recipe: "Prepare bhindi masala with rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Korma with Millet", quantity: "1 serving", calories: 259, protein: 18, carbs: 62, fats: 3, fiber: 11, price: 99, type: "veg" as const, recipe: "Prepare vegetable korma with millet using fresh vegetables, minimal oil, and serve warm." },
    { name: "Baingan Bharta with Bajra Roti", quantity: "1 cup (200g)", calories: 227, protein: 12, carbs: 63, fats: 14, fiber: 12, price: 136, type: "veg" as const, recipe: "Prepare baingan bharta with bajra roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Tofu Stir Fry with Brown Rice", quantity: "1 cup (200g)", calories: 520, protein: 20, carbs: 78, fats: 4, fiber: 6, price: 74, type: "veg" as const, recipe: "Prepare tofu stir fry with brown rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Salad Bowl with Roti", quantity: "1 bowl (250g)", calories: 347, protein: 20, carbs: 74, fats: 18, fiber: 4, price: 43, type: "veg" as const, recipe: "Prepare sprouted salad bowl with roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Bean Chaat with Quinoa", quantity: "1 bowl (250g)", calories: 281, protein: 15, carbs: 65, fats: 3, fiber: 11, price: 92, type: "veg" as const, recipe: "Prepare mixed bean chaat with quinoa using fresh vegetables, minimal oil, and serve warm." },
    { name: "Pumpkin Curry with Rice", quantity: "1 plate (300g)", calories: 315, protein: 9, carbs: 59, fats: 6, fiber: 5, price: 103, type: "veg" as const, recipe: "Prepare pumpkin curry with rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Cabbage Sabzi with Rotis", quantity: "1 serving", calories: 460, protein: 28, carbs: 47, fats: 16, fiber: 10, price: 100, type: "veg" as const, recipe: "Prepare cabbage sabzi with rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Karela Sabzi (light)", quantity: "1 bowl (250g)", calories: 433, protein: 23, carbs: 39, fats: 15, fiber: 6, price: 116, type: "veg" as const, recipe: "Prepare karela sabzi (light) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Corn & Pea Curry", quantity: "1 bowl (250g)", calories: 235, protein: 14, carbs: 79, fats: 16, fiber: 8, price: 140, type: "veg" as const, recipe: "Prepare corn & pea curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lentil Salad with Millet Roti", quantity: "1 serving", calories: 201, protein: 15, carbs: 76, fats: 12, fiber: 12, price: 114, type: "veg" as const, recipe: "Prepare lentil salad with millet roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Palak Chole with Rice", quantity: "1 cup (200g)", calories: 276, protein: 20, carbs: 64, fats: 18, fiber: 8, price: 82, type: "veg" as const, recipe: "Prepare palak chole with rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Paneer Bhurji with Rotis", quantity: "1 cup (200g)", calories: 433, protein: 16, carbs: 42, fats: 10, fiber: 12, price: 89, type: "veg" as const, recipe: "Prepare paneer bhurji with rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Millet Khichdi", quantity: "1 bowl (250g)", calories: 410, protein: 7, carbs: 50, fats: 18, fiber: 9, price: 89, type: "veg" as const, recipe: "Prepare mixed millet khichdi using fresh vegetables, minimal oil, and serve warm." },
    { name: "Bottle Gourd Curry with Rice", quantity: "1 bowl (250g)", calories: 453, protein: 7, carbs: 38, fats: 13, fiber: 4, price: 96, type: "veg" as const, recipe: "Prepare bottle gourd curry with rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sambar with Brown Rice", quantity: "1 plate (300g)", calories: 469, protein: 20, carbs: 30, fats: 7, fiber: 9, price: 123, type: "veg" as const, recipe: "Prepare sambar with brown rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Stew with Millet", quantity: "1 bowl (250g)", calories: 238, protein: 21, carbs: 80, fats: 11, fiber: 8, price: 119, type: "veg" as const, recipe: "Prepare vegetable stew with millet using fresh vegetables, minimal oil, and serve warm." },
    { name: "Cottage Cheese and Spinach Salad", quantity: "1 cup (200g)", calories: 241, protein: 16, carbs: 73, fats: 15, fiber: 8, price: 120, type: "veg" as const, recipe: "Prepare cottage cheese and spinach salad using fresh vegetables, minimal oil, and serve warm." },
    { name: "Masoor Dal with Jeera Rice", quantity: "1 cup (200g)", calories: 477, protein: 7, carbs: 69, fats: 5, fiber: 6, price: 120, type: "veg" as const, recipe: "Prepare masoor dal with jeera rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Jalfrezi with Roti", quantity: "1 serving", calories: 316, protein: 8, carbs: 57, fats: 6, fiber: 4, price: 96, type: "veg" as const, recipe: "Prepare vegetable jalfrezi with roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Matar Paneer with Brown Rice", quantity: "1 bowl (250g)", calories: 353, protein: 6, carbs: 32, fats: 13, fiber: 3, price: 77, type: "veg" as const, recipe: "Prepare matar paneer with brown rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Tomato Rasam with Rice & Veg", quantity: "1 serving", calories: 391, protein: 19, carbs: 39, fats: 10, fiber: 11, price: 92, type: "veg" as const, recipe: "Prepare tomato rasam with rice & veg using fresh vegetables, minimal oil, and serve warm." },
    { name: "Spinach & Potato Curry", quantity: "1 bowl (250g)", calories: 287, protein: 11, carbs: 35, fats: 15, fiber: 12, price: 127, type: "veg" as const, recipe: "Prepare spinach & potato curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Carrot & Pea Pulao", quantity: "1 bowl (250g)", calories: 454, protein: 24, carbs: 39, fats: 10, fiber: 10, price: 121, type: "veg" as const, recipe: "Prepare carrot & pea pulao using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Vegetable Cutlet with Roti", quantity: "1 serving", calories: 435, protein: 14, carbs: 72, fats: 3, fiber: 10, price: 76, type: "veg" as const, recipe: "Prepare mixed vegetable cutlet with roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Moong Curry", quantity: "1 bowl (250g)", calories: 237, protein: 20, carbs: 52, fats: 12, fiber: 9, price: 128, type: "veg" as const, recipe: "Prepare sprouted moong curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lauki Kofta (baked)", quantity: "1 serving", calories: 433, protein: 15, carbs: 42, fats: 15, fiber: 10, price: 53, type: "veg" as const, recipe: "Prepare lauki kofta (baked) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Pulao with Raita", quantity: "1 bowl (250g)", calories: 395, protein: 24, carbs: 52, fats: 12, fiber: 7, price: 42, type: "veg" as const, recipe: "Prepare vegetable pulao with raita using fresh vegetables, minimal oil, and serve warm." },
    { name: "Paneer Lababdar (light)", quantity: "1 cup (200g)", calories: 340, protein: 6, carbs: 66, fats: 4, fiber: 12, price: 135, type: "veg" as const, recipe: "Prepare paneer lababdar (light) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Chole with Millet", quantity: "1 cup (200g)", calories: 346, protein: 13, carbs: 68, fats: 14, fiber: 6, price: 121, type: "veg" as const, recipe: "Prepare chole with millet using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Veg Sambar Bowl", quantity: "1 bowl (250g)", calories: 517, protein: 14, carbs: 73, fats: 7, fiber: 4, price: 120, type: "veg" as const, recipe: "Prepare mixed veg sambar bowl using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Kurma with Millet", quantity: "1 plate (300g)", calories: 358, protein: 20, carbs: 32, fats: 14, fiber: 5, price: 51, type: "veg" as const, recipe: "Prepare vegetable kurma with millet using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sweet Potato & Chickpea Bowl", quantity: "1 serving", calories: 367, protein: 19, carbs: 41, fats: 9, fiber: 5, price: 140, type: "veg" as const, recipe: "Prepare sweet potato & chickpea bowl using fresh vegetables, minimal oil, and serve warm." },
    { name: "Bajra Roti with Vegetable Curry", quantity: "1 serving", calories: 471, protein: 22, carbs: 47, fats: 8, fiber: 7, price: 101, type: "veg" as const, recipe: "Prepare bajra roti with vegetable curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Millet Dosa with Chutney", quantity: "1 serving", calories: 373, protein: 9, carbs: 59, fats: 5, fiber: 5, price: 136, type: "veg" as const, recipe: "Prepare mixed millet dosa with chutney using fresh vegetables, minimal oil, and serve warm." },
    { name: "Veg Kofta Curry (baked)", quantity: "1 bowl (250g)", calories: 403, protein: 23, carbs: 53, fats: 5, fiber: 9, price: 41, type: "veg" as const, recipe: "Prepare veg kofta curry (baked) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Brown Rice with Toor Dal & Mixed Veg 52", quantity: "1 serving", calories: 474, protein: 9, carbs: 59, fats: 14, fiber: 7, price: 114, type: "veg" as const, recipe: "Prepare brown rice with toor dal & mixed veg 52 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Quinoa & Mixed Bean Salad 53", quantity: "1 cup (200g)", calories: 390, protein: 9, carbs: 73, fats: 10, fiber: 10, price: 43, type: "veg" as const, recipe: "Prepare quinoa & mixed bean salad 53 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Moong Salad + Multigrain Roti 54", quantity: "1 serving", calories: 512, protein: 13, carbs: 71, fats: 5, fiber: 10, price: 129, type: "veg" as const, recipe: "Prepare sprouted moong salad + multigrain roti 54 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Chana Masala with Brown Rice 55", quantity: "1 serving", calories: 409, protein: 9, carbs: 38, fats: 4, fiber: 3, price: 78, type: "veg" as const, recipe: "Prepare chana masala with brown rice 55 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Palak Paneer with 2 Rotis 56", quantity: "1 cup (200g)", calories: 259, protein: 9, carbs: 45, fats: 7, fiber: 9, price: 98, type: "veg" as const, recipe: "Prepare palak paneer with 2 rotis 56 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Biryani (Low Oil) 57", quantity: "1 serving", calories: 476, protein: 19, carbs: 67, fats: 7, fiber: 9, price: 123, type: "veg" as const, recipe: "Prepare vegetable biryani (low oil) 57 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Millet Pulao with Yogurt 58", quantity: "1 plate (300g)", calories: 450, protein: 25, carbs: 56, fats: 11, fiber: 3, price: 128, type: "veg" as const, recipe: "Prepare millet pulao with yogurt 58 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lemon Brown Rice with Roasted Veg 59", quantity: "1 serving", calories: 311, protein: 20, carbs: 58, fats: 10, fiber: 8, price: 52, type: "veg" as const, recipe: "Prepare lemon brown rice with roasted veg 59 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Curry with 2 Rotis 60", quantity: "1 serving", calories: 478, protein: 26, carbs: 52, fats: 4, fiber: 9, price: 75, type: "veg" as const, recipe: "Prepare vegetable curry with 2 rotis 60 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Grilled Chicken with Brown Rice", quantity: "1 bowl (250g)", calories: 322, protein: 47, carbs: 21, fats: 27, fiber: 4, price: 244, type: "nonveg" as const, recipe: "Prepare grilled chicken with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tandoori Fish with Millet", quantity: "1 plate (300g)", calories: 285, protein: 39, carbs: 41, fats: 10, fiber: 4, price: 97, type: "nonveg" as const, recipe: "Prepare tandoori fish with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Tikka Masala with Rice", quantity: "1 bowl (250g)", calories: 560, protein: 31, carbs: 39, fats: 16, fiber: 3, price: 232, type: "nonveg" as const, recipe: "Prepare chicken tikka masala with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tuna Steak with Salad", quantity: "1 plate (300g)", calories: 401, protein: 27, carbs: 26, fats: 23, fiber: 5, price: 124, type: "nonveg" as const, recipe: "Prepare tuna steak with salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Curry with Brown Rice", quantity: "1 plate (300g)", calories: 598, protein: 19, carbs: 26, fats: 6, fiber: 6, price: 140, type: "nonveg" as const, recipe: "Prepare prawn curry with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Keema Mutter with Rotis", quantity: "1 serving", calories: 268, protein: 29, carbs: 43, fats: 7, fiber: 3, price: 187, type: "nonveg" as const, recipe: "Prepare keema mutter with rotis using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Caesar Salad (light)", quantity: "1 plate (300g)", calories: 641, protein: 22, carbs: 70, fats: 20, fiber: 6, price: 211, type: "nonveg" as const, recipe: "Prepare chicken caesar salad (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Turkey & Quinoa Bowl", quantity: "1 plate (300g)", calories: 491, protein: 50, carbs: 38, fats: 25, fiber: 1, price: 248, type: "nonveg" as const, recipe: "Prepare turkey & quinoa bowl using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Curry with Millet", quantity: "1 serving", calories: 494, protein: 59, carbs: 13, fats: 7, fiber: 8, price: 182, type: "nonveg" as const, recipe: "Prepare fish curry with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Prawn Salad", quantity: "200g serving", calories: 611, protein: 24, carbs: 72, fats: 28, fiber: 8, price: 98, type: "nonveg" as const, recipe: "Prepare grilled prawn salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Keema with Brown Rice", quantity: "1 plate (300g)", calories: 424, protein: 56, carbs: 28, fats: 8, fiber: 3, price: 150, type: "nonveg" as const, recipe: "Prepare mutton keema with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Biryani (low oil)", quantity: "1 serving", calories: 455, protein: 56, carbs: 77, fats: 15, fiber: 8, price: 209, type: "nonveg" as const, recipe: "Prepare chicken biryani (low oil) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tandoori Prawns with Salad", quantity: "200g serving", calories: 310, protein: 25, carbs: 80, fats: 29, fiber: 4, price: 190, type: "nonveg" as const, recipe: "Prepare tandoori prawns with salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Tikka with Rotis", quantity: "200g serving", calories: 376, protein: 44, carbs: 53, fats: 20, fiber: 7, price: 186, type: "nonveg" as const, recipe: "Prepare fish tikka with rotis using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken & Vegetable Stir Fry with Rice", quantity: "1 plate (300g)", calories: 420, protein: 45, carbs: 50, fats: 27, fiber: 5, price: 175, type: "nonveg" as const, recipe: "Prepare chicken & vegetable stir fry with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Salmon with Millet", quantity: "1 bowl (250g)", calories: 611, protein: 48, carbs: 18, fats: 8, fiber: 2, price: 103, type: "nonveg" as const, recipe: "Prepare salmon with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Fried Rice (with veggies)", quantity: "200g serving", calories: 309, protein: 41, carbs: 26, fats: 23, fiber: 1, price: 230, type: "nonveg" as const, recipe: "Prepare egg fried rice (with veggies) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Quinoa Bowl", quantity: "1 serving", calories: 603, protein: 25, carbs: 62, fats: 17, fiber: 7, price: 93, type: "nonveg" as const, recipe: "Prepare prawn & quinoa bowl using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Korma with Rice", quantity: "1 serving", calories: 567, protein: 37, carbs: 55, fats: 9, fiber: 4, price: 119, type: "nonveg" as const, recipe: "Prepare chicken korma with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Fish with Lemon Rice", quantity: "200g serving", calories: 374, protein: 24, carbs: 54, fats: 23, fiber: 6, price: 109, type: "nonveg" as const, recipe: "Prepare grilled fish with lemon rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Keema Wrap", quantity: "1 serving", calories: 553, protein: 32, carbs: 64, fats: 23, fiber: 1, price: 235, type: "nonveg" as const, recipe: "Prepare chicken keema wrap using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Masala with Brown Rice", quantity: "1 serving", calories: 274, protein: 29, carbs: 44, fats: 28, fiber: 5, price: 166, type: "nonveg" as const, recipe: "Prepare prawn masala with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Salad with Sprouts", quantity: "1 serving", calories: 263, protein: 29, carbs: 28, fats: 24, fiber: 7, price: 97, type: "nonveg" as const, recipe: "Prepare chicken salad with sprouts using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Curry (lean cuts)", quantity: "1 bowl (250g)", calories: 639, protein: 58, carbs: 13, fats: 8, fiber: 4, price: 176, type: "nonveg" as const, recipe: "Prepare mutton curry (lean cuts) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Curry with Brown Rice", quantity: "200g serving", calories: 492, protein: 39, carbs: 30, fats: 17, fiber: 5, price: 163, type: "nonveg" as const, recipe: "Prepare fish curry with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Turkey with Roasted Veg", quantity: "1 plate (300g)", calories: 286, protein: 27, carbs: 30, fats: 30, fiber: 1, price: 252, type: "nonveg" as const, recipe: "Prepare grilled turkey with roasted veg using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Pulao (low oil)", quantity: "1 plate (300g)", calories: 399, protein: 46, carbs: 64, fats: 21, fiber: 8, price: 186, type: "nonveg" as const, recipe: "Prepare chicken pulao (low oil) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tuna Salad with Multigrain Bread", quantity: "1 serving", calories: 370, protein: 50, carbs: 24, fats: 17, fiber: 7, price: 108, type: "nonveg" as const, recipe: "Prepare tuna salad with multigrain bread using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Biriyani (low oil)", quantity: "1 serving", calories: 607, protein: 55, carbs: 72, fats: 22, fiber: 5, price: 91, type: "nonveg" as const, recipe: "Prepare prawn biriyani (low oil) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Shallow Fry with Millet", quantity: "1 bowl (250g)", calories: 462, protein: 56, carbs: 17, fats: 6, fiber: 4, price: 157, type: "nonveg" as const, recipe: "Prepare chicken shallow fry with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Stew with Brown Rice", quantity: "1 bowl (250g)", calories: 652, protein: 26, carbs: 42, fats: 15, fiber: 6, price: 110, type: "nonveg" as const, recipe: "Prepare fish stew with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Curry with Rotis", quantity: "1 plate (300g)", calories: 514, protein: 45, carbs: 32, fats: 10, fiber: 7, price: 216, type: "nonveg" as const, recipe: "Prepare egg curry with rotis using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken & Bean Salad", quantity: "1 bowl (250g)", calories: 516, protein: 53, carbs: 55, fats: 8, fiber: 7, price: 90, type: "nonveg" as const, recipe: "Prepare chicken & bean salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Fish Tacos (whole wheat)", quantity: "200g serving", calories: 269, protein: 47, carbs: 19, fats: 16, fiber: 7, price: 226, type: "nonveg" as const, recipe: "Prepare grilled fish tacos (whole wheat) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Veg Stew", quantity: "200g serving", calories: 623, protein: 58, carbs: 63, fats: 15, fiber: 2, price: 183, type: "nonveg" as const, recipe: "Prepare prawn & veg stew using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Stew with Millet", quantity: "1 plate (300g)", calories: 426, protein: 28, carbs: 68, fats: 28, fiber: 6, price: 102, type: "nonveg" as const, recipe: "Prepare mutton stew with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Smoked Salmon Salad", quantity: "200g serving", calories: 692, protein: 24, carbs: 41, fats: 19, fiber: 7, price: 214, type: "nonveg" as const, recipe: "Prepare smoked salmon salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Kebabs with Roti", quantity: "1 plate (300g)", calories: 462, protein: 37, carbs: 53, fats: 13, fiber: 6, price: 123, type: "nonveg" as const, recipe: "Prepare chicken kebabs with roti using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish and Lentil Salad", quantity: "1 plate (300g)", calories: 521, protein: 58, carbs: 24, fats: 22, fiber: 4, price: 169, type: "nonveg" as const, recipe: "Prepare fish and lentil salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Mulligatawny Soup with Rice", quantity: "1 serving", calories: 632, protein: 59, carbs: 28, fats: 13, fiber: 2, price: 117, type: "nonveg" as const, recipe: "Prepare chicken mulligatawny soup with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Turkey Meatballs with Pasta", quantity: "1 serving", calories: 361, protein: 29, carbs: 29, fats: 30, fiber: 2, price: 125, type: "nonveg" as const, recipe: "Prepare turkey meatballs with pasta using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Salad with Avocado", quantity: "200g serving", calories: 497, protein: 54, carbs: 67, fats: 27, fiber: 6, price: 240, type: "nonveg" as const, recipe: "Prepare prawn salad with avocado using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Mackerel with Rice", quantity: "1 serving", calories: 337, protein: 46, carbs: 18, fats: 21, fiber: 8, price: 241, type: "nonveg" as const, recipe: "Prepare grilled mackerel with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Pepper Fry with Rice", quantity: "1 serving", calories: 667, protein: 35, carbs: 17, fats: 17, fiber: 2, price: 159, type: "nonveg" as const, recipe: "Prepare chicken pepper fry with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Shrimp Rice Bowl", quantity: "200g serving", calories: 491, protein: 20, carbs: 17, fats: 17, fiber: 5, price: 99, type: "nonveg" as const, recipe: "Prepare egg & shrimp rice bowl using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Vindaloo (light)", quantity: "1 plate (300g)", calories: 574, protein: 56, carbs: 74, fats: 18, fiber: 8, price: 228, type: "nonveg" as const, recipe: "Prepare prawn vindaloo (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Sukka with Rotis", quantity: "1 plate (300g)", calories: 490, protein: 54, carbs: 34, fats: 16, fiber: 8, price: 208, type: "nonveg" as const, recipe: "Prepare chicken sukka with rotis using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Molee with Rice", quantity: "1 bowl (250g)", calories: 291, protein: 46, carbs: 23, fats: 16, fiber: 2, price: 209, type: "nonveg" as const, recipe: "Prepare fish molee with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Do Pyaza (light)", quantity: "1 bowl (250g)", calories: 280, protein: 33, carbs: 66, fats: 20, fiber: 3, price: 173, type: "nonveg" as const, recipe: "Prepare chicken do pyaza (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Chicken with Brown Rice 50", quantity: "1 serving", calories: 404, protein: 42, carbs: 62, fats: 30, fiber: 6, price: 253, type: "nonveg" as const, recipe: "Prepare grilled chicken with brown rice 50 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tandoori Fish with Millet 51", quantity: "1 plate (300g)", calories: 664, protein: 58, carbs: 52, fats: 8, fiber: 6, price: 104, type: "nonveg" as const, recipe: "Prepare tandoori fish with millet 51 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Tikka Masala with Rice 52", quantity: "200g serving", calories: 405, protein: 34, carbs: 29, fats: 16, fiber: 2, price: 229, type: "nonveg" as const, recipe: "Prepare chicken tikka masala with rice 52 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tuna Steak with Salad 53", quantity: "1 bowl (250g)", calories: 439, protein: 37, carbs: 60, fats: 10, fiber: 2, price: 159, type: "nonveg" as const, recipe: "Prepare tuna steak with salad 53 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Curry with Brown Rice 54", quantity: "200g serving", calories: 589, protein: 39, carbs: 26, fats: 27, fiber: 2, price: 245, type: "nonveg" as const, recipe: "Prepare prawn curry with brown rice 54 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Keema Mutter with Rotis 55", quantity: "200g serving", calories: 520, protein: 41, carbs: 12, fats: 17, fiber: 5, price: 126, type: "nonveg" as const, recipe: "Prepare keema mutter with rotis 55 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Caesar Salad (light) 56", quantity: "1 bowl (250g)", calories: 434, protein: 49, carbs: 34, fats: 13, fiber: 3, price: 119, type: "nonveg" as const, recipe: "Prepare chicken caesar salad (light) 56 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Turkey & Quinoa Bowl 57", quantity: "1 plate (300g)", calories: 411, protein: 24, carbs: 74, fats: 30, fiber: 1, price: 249, type: "nonveg" as const, recipe: "Prepare turkey & quinoa bowl 57 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Curry with Millet 58", quantity: "1 serving", calories: 652, protein: 57, carbs: 26, fats: 25, fiber: 7, price: 119, type: "nonveg" as const, recipe: "Prepare fish curry with millet 58 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Prawn Salad 59", quantity: "1 bowl (250g)", calories: 352, protein: 57, carbs: 31, fats: 29, fiber: 8, price: 91, type: "nonveg" as const, recipe: "Prepare grilled prawn salad 59 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Keema with Brown Rice 60", quantity: "200g serving", calories: 446, protein: 33, carbs: 66, fats: 25, fiber: 5, price: 194, type: "nonveg" as const, recipe: "Prepare mutton keema with brown rice 60 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
  ],

  dinner: [
    { name: "Khichdi with Vegetable Salad", quantity: "1 bowl (250g)", calories: 473, protein: 13, carbs: 49, fats: 18, fiber: 6, price: 87, type: "veg" as const, recipe: "Prepare khichdi with vegetable salad using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Dal Soup with Toast", quantity: "1 cup (200g)", calories: 436, protein: 15, carbs: 79, fats: 15, fiber: 11, price: 107, type: "veg" as const, recipe: "Prepare mixed dal soup with toast using fresh vegetables, minimal oil, and serve warm." },
    { name: "Grilled Vegetable Platter + Roti", quantity: "1 cup (200g)", calories: 282, protein: 12, carbs: 68, fats: 7, fiber: 7, price: 46, type: "veg" as const, recipe: "Prepare grilled vegetable platter + roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Moong Dal Cheela (3)", quantity: "1 cup (200g)", calories: 390, protein: 23, carbs: 36, fats: 6, fiber: 7, price: 50, type: "veg" as const, recipe: "Prepare moong dal cheela (3) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Stir-Fried Tofu with Vegetables + Roti", quantity: "1 bowl (250g)", calories: 339, protein: 20, carbs: 62, fats: 7, fiber: 9, price: 51, type: "veg" as const, recipe: "Prepare stir-fried tofu with vegetables + roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Bajra Khichdi with Bottle Gourd", quantity: "1 bowl (250g)", calories: 430, protein: 17, carbs: 31, fats: 16, fiber: 3, price: 90, type: "veg" as const, recipe: "Prepare bajra khichdi with bottle gourd using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Thepla with Low-Fat Curd", quantity: "1 serving", calories: 320, protein: 18, carbs: 35, fats: 14, fiber: 6, price: 43, type: "veg" as const, recipe: "Prepare methi thepla with low-fat curd using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Soup with Whole Wheat Bread", quantity: "1 serving", calories: 250, protein: 28, carbs: 71, fats: 13, fiber: 5, price: 57, type: "veg" as const, recipe: "Prepare vegetable soup with whole wheat bread using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Paratha with Curd", quantity: "1 plate (300g)", calories: 346, protein: 21, carbs: 74, fats: 7, fiber: 10, price: 97, type: "veg" as const, recipe: "Prepare methi paratha with curd using fresh vegetables, minimal oil, and serve warm." },
    { name: "Baked Vegetable Casserole", quantity: "1 plate (300g)", calories: 240, protein: 6, carbs: 46, fats: 9, fiber: 5, price: 110, type: "veg" as const, recipe: "Prepare baked vegetable casserole using fresh vegetables, minimal oil, and serve warm." },
    { name: "Tofu & Spinach Curry with Rotis", quantity: "1 cup (200g)", calories: 256, protein: 15, carbs: 45, fats: 12, fiber: 4, price: 46, type: "veg" as const, recipe: "Prepare tofu & spinach curry with rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lentil & Veg Stew", quantity: "1 bowl (250g)", calories: 414, protein: 26, carbs: 80, fats: 17, fiber: 4, price: 54, type: "veg" as const, recipe: "Prepare lentil & veg stew using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Stir Fry with Millet", quantity: "1 cup (200g)", calories: 505, protein: 23, carbs: 31, fats: 10, fiber: 5, price: 77, type: "veg" as const, recipe: "Prepare vegetable stir fry with millet using fresh vegetables, minimal oil, and serve warm." },
    { name: "Cabbage Dal with Rotis", quantity: "1 cup (200g)", calories: 200, protein: 25, carbs: 52, fats: 10, fiber: 12, price: 93, type: "veg" as const, recipe: "Prepare cabbage dal with rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Pumpkin & Lentil Stew", quantity: "1 bowl (250g)", calories: 243, protein: 22, carbs: 53, fats: 5, fiber: 11, price: 109, type: "veg" as const, recipe: "Prepare pumpkin & lentil stew using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Kebabs with Salad", quantity: "1 plate (300g)", calories: 399, protein: 21, carbs: 32, fats: 15, fiber: 8, price: 72, type: "veg" as const, recipe: "Prepare vegetable kebabs with salad using fresh vegetables, minimal oil, and serve warm." },
    { name: "Baked Stuffed Capsicum (paneer)", quantity: "1 plate (300g)", calories: 382, protein: 8, carbs: 52, fats: 10, fiber: 4, price: 138, type: "veg" as const, recipe: "Prepare baked stuffed capsicum (paneer) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Soybean Curry with Rice", quantity: "1 serving", calories: 268, protein: 7, carbs: 52, fats: 13, fiber: 5, price: 139, type: "veg" as const, recipe: "Prepare soybean curry with rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Beetroot & Pea Curry", quantity: "1 cup (200g)", calories: 445, protein: 26, carbs: 41, fats: 7, fiber: 4, price: 131, type: "veg" as const, recipe: "Prepare beetroot & pea curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Millet Khichdi (2)", quantity: "1 cup (200g)", calories: 218, protein: 15, carbs: 42, fats: 4, fiber: 6, price: 45, type: "veg" as const, recipe: "Prepare mixed millet khichdi (2) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Moong Cheela (3)", quantity: "1 serving", calories: 358, protein: 22, carbs: 55, fats: 18, fiber: 7, price: 44, type: "veg" as const, recipe: "Prepare sprouted moong cheela (3) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Grilled Paneer with Salad", quantity: "1 bowl (250g)", calories: 346, protein: 17, carbs: 79, fats: 4, fiber: 8, price: 74, type: "veg" as const, recipe: "Prepare grilled paneer with salad using fresh vegetables, minimal oil, and serve warm." },
    { name: "Bottle Gourd Stew with Rotis", quantity: "1 plate (300g)", calories: 388, protein: 19, carbs: 55, fats: 17, fiber: 9, price: 83, type: "veg" as const, recipe: "Prepare bottle gourd stew with rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mushroom & Spinach Curry", quantity: "1 bowl (250g)", calories: 454, protein: 28, carbs: 61, fats: 14, fiber: 11, price: 74, type: "veg" as const, recipe: "Prepare mushroom & spinach curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Corn & Zucchini Stir Fry", quantity: "1 plate (300g)", calories: 417, protein: 8, carbs: 57, fats: 8, fiber: 11, price: 77, type: "veg" as const, recipe: "Prepare corn & zucchini stir fry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lauki Dal with Millet Roti", quantity: "1 serving", calories: 252, protein: 8, carbs: 50, fats: 12, fiber: 7, price: 97, type: "veg" as const, recipe: "Prepare lauki dal with millet roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Veg Soup with Whole Grain Toast", quantity: "1 cup (200g)", calories: 285, protein: 28, carbs: 58, fats: 14, fiber: 10, price: 45, type: "veg" as const, recipe: "Prepare mixed veg soup with whole grain toast using fresh vegetables, minimal oil, and serve warm." },
    { name: "Palak Chana with Rotis", quantity: "1 serving", calories: 514, protein: 19, carbs: 47, fats: 4, fiber: 4, price: 125, type: "veg" as const, recipe: "Prepare palak chana with rotis using fresh vegetables, minimal oil, and serve warm." },
    { name: "Low-Fat Paneer Curry", quantity: "1 cup (200g)", calories: 386, protein: 22, carbs: 77, fats: 8, fiber: 3, price: 58, type: "veg" as const, recipe: "Prepare low-fat paneer curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Tofu Tikka with Salad", quantity: "1 cup (200g)", calories: 217, protein: 10, carbs: 34, fats: 10, fiber: 8, price: 86, type: "veg" as const, recipe: "Prepare tofu tikka with salad using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Korma (light)", quantity: "1 cup (200g)", calories: 490, protein: 7, carbs: 68, fats: 7, fiber: 10, price: 87, type: "veg" as const, recipe: "Prepare vegetable korma (light) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Masoor Dal & Brown Rice", quantity: "1 serving", calories: 427, protein: 8, carbs: 66, fats: 7, fiber: 11, price: 86, type: "veg" as const, recipe: "Prepare masoor dal & brown rice using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Dal with Millet", quantity: "1 cup (200g)", calories: 360, protein: 26, carbs: 47, fats: 10, fiber: 4, price: 43, type: "veg" as const, recipe: "Prepare methi dal with millet using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Jalfrezi with Bajra Roti", quantity: "1 bowl (250g)", calories: 455, protein: 22, carbs: 54, fats: 6, fiber: 7, price: 139, type: "veg" as const, recipe: "Prepare vegetable jalfrezi with bajra roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Corn & Spinach Khichdi", quantity: "1 serving", calories: 428, protein: 12, carbs: 69, fats: 12, fiber: 10, price: 65, type: "veg" as const, recipe: "Prepare corn & spinach khichdi using fresh vegetables, minimal oil, and serve warm." },
    { name: "Carrot & Pea Stew", quantity: "1 plate (300g)", calories: 269, protein: 8, carbs: 58, fats: 8, fiber: 10, price: 51, type: "veg" as const, recipe: "Prepare carrot & pea stew using fresh vegetables, minimal oil, and serve warm." },
    { name: "Sprouted Lentil Salad with Roti", quantity: "1 serving", calories: 377, protein: 28, carbs: 34, fats: 12, fiber: 7, price: 60, type: "veg" as const, recipe: "Prepare sprouted lentil salad with roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Bajra & Jowar Roti with Veg Curry", quantity: "1 bowl (250g)", calories: 385, protein: 22, carbs: 44, fats: 6, fiber: 6, price: 57, type: "veg" as const, recipe: "Prepare bajra & jowar roti with veg curry using fresh vegetables, minimal oil, and serve warm." },
    { name: "Ridge Gourd Curry with Roti", quantity: "1 bowl (250g)", calories: 452, protein: 6, carbs: 53, fats: 14, fiber: 10, price: 110, type: "veg" as const, recipe: "Prepare ridge gourd curry with roti using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Thepla Variants (2)", quantity: "1 bowl (250g)", calories: 513, protein: 8, carbs: 34, fats: 12, fiber: 9, price: 131, type: "veg" as const, recipe: "Prepare methi thepla variants (2) using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Raita with Millet", quantity: "1 cup (200g)", calories: 469, protein: 19, carbs: 79, fats: 16, fiber: 12, price: 49, type: "veg" as const, recipe: "Prepare vegetable raita with millet using fresh vegetables, minimal oil, and serve warm." },
    { name: "Toor Dal & Greens", quantity: "1 bowl (250g)", calories: 362, protein: 26, carbs: 34, fats: 17, fiber: 10, price: 127, type: "veg" as const, recipe: "Prepare toor dal & greens using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Millet Soup with Toast", quantity: "1 serving", calories: 265, protein: 23, carbs: 70, fats: 8, fiber: 5, price: 95, type: "veg" as const, recipe: "Prepare mixed millet soup with toast using fresh vegetables, minimal oil, and serve warm." },
    { name: "Khichdi with Vegetable Salad 44", quantity: "1 plate (300g)", calories: 263, protein: 22, carbs: 39, fats: 12, fiber: 5, price: 60, type: "veg" as const, recipe: "Prepare khichdi with vegetable salad 44 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Mixed Dal Soup with Toast 45", quantity: "1 serving", calories: 315, protein: 17, carbs: 63, fats: 12, fiber: 4, price: 72, type: "veg" as const, recipe: "Prepare mixed dal soup with toast 45 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Grilled Vegetable Platter + Roti 46", quantity: "1 bowl (250g)", calories: 482, protein: 14, carbs: 38, fats: 12, fiber: 12, price: 108, type: "veg" as const, recipe: "Prepare grilled vegetable platter + roti 46 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Moong Dal Cheela (3) 47", quantity: "1 plate (300g)", calories: 457, protein: 26, carbs: 40, fats: 7, fiber: 5, price: 124, type: "veg" as const, recipe: "Prepare moong dal cheela (3) 47 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Stir-Fried Tofu with Vegetables + Roti 48", quantity: "1 serving", calories: 488, protein: 7, carbs: 31, fats: 5, fiber: 3, price: 122, type: "veg" as const, recipe: "Prepare stir-fried tofu with vegetables + roti 48 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Bajra Khichdi with Bottle Gourd 49", quantity: "1 serving", calories: 307, protein: 24, carbs: 56, fats: 3, fiber: 10, price: 120, type: "veg" as const, recipe: "Prepare bajra khichdi with bottle gourd 49 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Thepla with Low-Fat Curd 50", quantity: "1 serving", calories: 354, protein: 21, carbs: 45, fats: 15, fiber: 7, price: 98, type: "veg" as const, recipe: "Prepare methi thepla with low-fat curd 50 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Soup with Whole Wheat Bread 51", quantity: "1 plate (300g)", calories: 230, protein: 11, carbs: 58, fats: 16, fiber: 10, price: 99, type: "veg" as const, recipe: "Prepare vegetable soup with whole wheat bread 51 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Methi Paratha with Curd 52", quantity: "1 bowl (250g)", calories: 374, protein: 25, carbs: 39, fats: 13, fiber: 8, price: 133, type: "veg" as const, recipe: "Prepare methi paratha with curd 52 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Baked Vegetable Casserole 53", quantity: "1 serving", calories: 404, protein: 10, carbs: 78, fats: 14, fiber: 11, price: 111, type: "veg" as const, recipe: "Prepare baked vegetable casserole 53 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Tofu & Spinach Curry with Rotis 54", quantity: "1 plate (300g)", calories: 363, protein: 13, carbs: 59, fats: 6, fiber: 7, price: 97, type: "veg" as const, recipe: "Prepare tofu & spinach curry with rotis 54 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Lentil & Veg Stew 55", quantity: "1 bowl (250g)", calories: 272, protein: 9, carbs: 33, fats: 12, fiber: 9, price: 118, type: "veg" as const, recipe: "Prepare lentil & veg stew 55 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Stir Fry with Millet 56", quantity: "1 cup (200g)", calories: 327, protein: 11, carbs: 50, fats: 13, fiber: 6, price: 137, type: "veg" as const, recipe: "Prepare vegetable stir fry with millet 56 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Cabbage Dal with Rotis 57", quantity: "1 bowl (250g)", calories: 455, protein: 22, carbs: 59, fats: 18, fiber: 7, price: 103, type: "veg" as const, recipe: "Prepare cabbage dal with rotis 57 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Pumpkin & Lentil Stew 58", quantity: "1 plate (300g)", calories: 246, protein: 18, carbs: 62, fats: 17, fiber: 6, price: 67, type: "veg" as const, recipe: "Prepare pumpkin & lentil stew 58 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Vegetable Kebabs with Salad 59", quantity: "1 serving", calories: 224, protein: 7, carbs: 48, fats: 18, fiber: 12, price: 123, type: "veg" as const, recipe: "Prepare vegetable kebabs with salad 59 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Baked Stuffed Capsicum (paneer) 60", quantity: "1 cup (200g)", calories: 346, protein: 23, carbs: 30, fats: 6, fiber: 9, price: 57, type: "veg" as const, recipe: "Prepare baked stuffed capsicum (paneer) 60 using fresh vegetables, minimal oil, and serve warm." },
    { name: "Grilled Chicken with Steamed Vegetables", quantity: "1 serving", calories: 632, protein: 41, carbs: 61, fats: 17, fiber: 1, price: 182, type: "nonveg" as const, recipe: "Prepare grilled chicken with steamed vegetables using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tandoori Fish with Salad", quantity: "1 plate (300g)", calories: 551, protein: 53, carbs: 34, fats: 17, fiber: 5, price: 98, type: "nonveg" as const, recipe: "Prepare tandoori fish with salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Curry with Multigrain Roti", quantity: "200g serving", calories: 518, protein: 46, carbs: 80, fats: 14, fiber: 2, price: 112, type: "nonveg" as const, recipe: "Prepare egg curry with multigrain roti using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Vegetable Stir Fry", quantity: "1 plate (300g)", calories: 461, protein: 41, carbs: 53, fats: 23, fiber: 6, price: 116, type: "nonveg" as const, recipe: "Prepare prawn & vegetable stir fry using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Lean Mutton Stew with Millet Roti", quantity: "1 bowl (250g)", calories: 568, protein: 50, carbs: 61, fats: 22, fiber: 1, price: 91, type: "nonveg" as const, recipe: "Prepare lean mutton stew with millet roti using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Shorba with Brown Rice", quantity: "1 plate (300g)", calories: 330, protein: 39, carbs: 70, fats: 22, fiber: 8, price: 118, type: "nonveg" as const, recipe: "Prepare chicken shorba with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Tikka with Salad", quantity: "1 bowl (250g)", calories: 427, protein: 57, carbs: 50, fats: 11, fiber: 7, price: 237, type: "nonveg" as const, recipe: "Prepare fish tikka with salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Coconut Curry with Rice", quantity: "1 serving", calories: 563, protein: 39, carbs: 74, fats: 22, fiber: 8, price: 224, type: "nonveg" as const, recipe: "Prepare prawn coconut curry with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Stew (lean)", quantity: "1 serving", calories: 503, protein: 19, carbs: 57, fats: 16, fiber: 2, price: 186, type: "nonveg" as const, recipe: "Prepare chicken stew (lean) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Salmon with Veg", quantity: "1 serving", calories: 667, protein: 58, carbs: 13, fats: 25, fiber: 8, price: 147, type: "nonveg" as const, recipe: "Prepare grilled salmon with veg using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Vegetable Stir Fry", quantity: "1 bowl (250g)", calories: 629, protein: 21, carbs: 71, fats: 11, fiber: 7, price: 117, type: "nonveg" as const, recipe: "Prepare egg & vegetable stir fry using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Broccoli Bowl", quantity: "1 bowl (250g)", calories: 276, protein: 54, carbs: 24, fats: 12, fiber: 1, price: 192, type: "nonveg" as const, recipe: "Prepare prawn & broccoli bowl using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Soup with Millet", quantity: "1 serving", calories: 474, protein: 27, carbs: 62, fats: 28, fiber: 4, price: 185, type: "nonveg" as const, recipe: "Prepare mutton soup with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Keema Khichdi", quantity: "200g serving", calories: 694, protein: 21, carbs: 27, fats: 22, fiber: 4, price: 223, type: "nonveg" as const, recipe: "Prepare chicken keema khichdi using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Curry Light", quantity: "1 serving", calories: 599, protein: 48, carbs: 77, fats: 18, fiber: 6, price: 124, type: "nonveg" as const, recipe: "Prepare fish curry light using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Turkey Stew with Vegetables", quantity: "200g serving", calories: 532, protein: 39, carbs: 79, fats: 17, fiber: 5, price: 236, type: "nonveg" as const, recipe: "Prepare turkey stew with vegetables using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Laksa (light)", quantity: "200g serving", calories: 358, protein: 33, carbs: 45, fats: 23, fiber: 5, price: 137, type: "nonveg" as const, recipe: "Prepare prawn laksa (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken and Bottle Gourd Curry", quantity: "1 serving", calories: 654, protein: 36, carbs: 36, fats: 28, fiber: 8, price: 161, type: "nonveg" as const, recipe: "Prepare chicken and bottle gourd curry using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Moilee with Millet", quantity: "200g serving", calories: 438, protein: 53, carbs: 45, fats: 15, fiber: 2, price: 226, type: "nonveg" as const, recipe: "Prepare fish moilee with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Bhurji with Rotis (nonveg)", quantity: "200g serving", calories: 462, protein: 40, carbs: 28, fats: 15, fiber: 1, price: 153, type: "nonveg" as const, recipe: "Prepare egg bhurji with rotis (nonveg) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Prawns with Salad", quantity: "1 plate (300g)", calories: 437, protein: 46, carbs: 42, fats: 29, fiber: 8, price: 134, type: "nonveg" as const, recipe: "Prepare grilled prawns with salad using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Stew Low-Fat", quantity: "1 bowl (250g)", calories: 683, protein: 52, carbs: 44, fats: 23, fiber: 5, price: 115, type: "nonveg" as const, recipe: "Prepare mutton stew low-fat using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Saag with Rotis", quantity: "1 plate (300g)", calories: 575, protein: 55, carbs: 40, fats: 13, fiber: 1, price: 251, type: "nonveg" as const, recipe: "Prepare chicken saag with rotis using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Kadai with Rice", quantity: "1 bowl (250g)", calories: 586, protein: 32, carbs: 16, fats: 9, fiber: 7, price: 164, type: "nonveg" as const, recipe: "Prepare prawn kadai with rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish & Lentil Stew", quantity: "200g serving", calories: 311, protein: 26, carbs: 10, fats: 23, fiber: 3, price: 184, type: "nonveg" as const, recipe: "Prepare fish & lentil stew using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken & Mushroom Stew", quantity: "200g serving", calories: 504, protein: 59, carbs: 35, fats: 30, fiber: 5, price: 162, type: "nonveg" as const, recipe: "Prepare chicken & mushroom stew using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Drop Soup with Veg", quantity: "1 serving", calories: 590, protein: 21, carbs: 21, fats: 26, fiber: 4, price: 216, type: "nonveg" as const, recipe: "Prepare egg drop soup with veg using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Fish with Stir-Fried Greens", quantity: "1 plate (300g)", calories: 349, protein: 44, carbs: 32, fats: 7, fiber: 7, price: 206, type: "nonveg" as const, recipe: "Prepare grilled fish with stir-fried greens using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken & Quinoa Bowl", quantity: "1 bowl (250g)", calories: 643, protein: 36, carbs: 14, fats: 6, fiber: 5, price: 225, type: "nonveg" as const, recipe: "Prepare chicken & quinoa bowl using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Soup with Brown Rice", quantity: "1 plate (300g)", calories: 431, protein: 36, carbs: 68, fats: 26, fiber: 8, price: 114, type: "nonveg" as const, recipe: "Prepare prawn soup with brown rice using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Keema with Millet", quantity: "200g serving", calories: 399, protein: 30, carbs: 24, fats: 16, fiber: 3, price: 197, type: "nonveg" as const, recipe: "Prepare mutton keema with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Chettinad (light)", quantity: "1 serving", calories: 627, protein: 29, carbs: 11, fats: 29, fiber: 6, price: 155, type: "nonveg" as const, recipe: "Prepare chicken chettinad (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Baked with Herbs", quantity: "1 bowl (250g)", calories: 349, protein: 57, carbs: 61, fats: 19, fiber: 6, price: 102, type: "nonveg" as const, recipe: "Prepare fish baked with herbs using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Tofu Stir Fry", quantity: "200g serving", calories: 602, protein: 24, carbs: 33, fats: 10, fiber: 8, price: 162, type: "nonveg" as const, recipe: "Prepare prawn & tofu stir fry using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Turkey with Mixed Veg", quantity: "1 bowl (250g)", calories: 263, protein: 34, carbs: 59, fats: 13, fiber: 8, price: 148, type: "nonveg" as const, recipe: "Prepare grilled turkey with mixed veg using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Tikka Salad (light)", quantity: "1 serving", calories: 414, protein: 55, carbs: 11, fats: 14, fiber: 6, price: 257, type: "nonveg" as const, recipe: "Prepare chicken tikka salad (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish & Vegetable Curry (low oil)", quantity: "1 bowl (250g)", calories: 291, protein: 60, carbs: 25, fats: 20, fiber: 5, price: 120, type: "nonveg" as const, recipe: "Prepare fish & vegetable curry (low oil) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Mulligatawny (dinner bowl)", quantity: "200g serving", calories: 611, protein: 50, carbs: 49, fats: 28, fiber: 2, price: 243, type: "nonveg" as const, recipe: "Prepare chicken mulligatawny (dinner bowl) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Curry with Spinach", quantity: "1 serving", calories: 448, protein: 57, carbs: 38, fats: 13, fiber: 3, price: 202, type: "nonveg" as const, recipe: "Prepare egg curry with spinach using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Mackerel with Roti", quantity: "1 bowl (250g)", calories: 492, protein: 56, carbs: 57, fats: 19, fiber: 8, price: 217, type: "nonveg" as const, recipe: "Prepare grilled mackerel with roti using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Veg Skewers", quantity: "1 bowl (250g)", calories: 650, protein: 33, carbs: 20, fats: 22, fiber: 8, price: 215, type: "nonveg" as const, recipe: "Prepare prawn & veg skewers using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Lean Lamb Stew with Millet", quantity: "1 serving", calories: 299, protein: 54, carbs: 24, fats: 7, fiber: 4, price: 226, type: "nonveg" as const, recipe: "Prepare lean lamb stew with millet using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Sukka Dinner", quantity: "1 bowl (250g)", calories: 344, protein: 38, carbs: 76, fats: 20, fiber: 2, price: 254, type: "nonveg" as const, recipe: "Prepare chicken sukka dinner using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Stew with Coconut Milk (light)", quantity: "1 bowl (250g)", calories: 627, protein: 55, carbs: 72, fats: 8, fiber: 8, price: 94, type: "nonveg" as const, recipe: "Prepare fish stew with coconut milk (light) using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Mushroom Curry", quantity: "200g serving", calories: 327, protein: 50, carbs: 63, fats: 20, fiber: 1, price: 223, type: "nonveg" as const, recipe: "Prepare egg & mushroom curry using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Chicken with Steamed Vegetables 46", quantity: "200g serving", calories: 604, protein: 37, carbs: 12, fats: 18, fiber: 5, price: 80, type: "nonveg" as const, recipe: "Prepare grilled chicken with steamed vegetables 46 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Tandoori Fish with Salad 47", quantity: "1 bowl (250g)", calories: 556, protein: 22, carbs: 15, fats: 19, fiber: 6, price: 259, type: "nonveg" as const, recipe: "Prepare tandoori fish with salad 47 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg Curry with Multigrain Roti 48", quantity: "1 plate (300g)", calories: 537, protein: 21, carbs: 18, fats: 21, fiber: 1, price: 153, type: "nonveg" as const, recipe: "Prepare egg curry with multigrain roti 48 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Vegetable Stir Fry 49", quantity: "200g serving", calories: 352, protein: 26, carbs: 63, fats: 17, fiber: 7, price: 194, type: "nonveg" as const, recipe: "Prepare prawn & vegetable stir fry 49 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Lean Mutton Stew with Millet Roti 50", quantity: "200g serving", calories: 452, protein: 23, carbs: 79, fats: 10, fiber: 6, price: 110, type: "nonveg" as const, recipe: "Prepare lean mutton stew with millet roti 50 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Shorba with Brown Rice 51", quantity: "1 bowl (250g)", calories: 535, protein: 43, carbs: 77, fats: 10, fiber: 4, price: 80, type: "nonveg" as const, recipe: "Prepare chicken shorba with brown rice 51 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Tikka with Salad 52", quantity: "1 plate (300g)", calories: 412, protein: 47, carbs: 79, fats: 19, fiber: 7, price: 138, type: "nonveg" as const, recipe: "Prepare fish tikka with salad 52 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn Coconut Curry with Rice 53", quantity: "1 bowl (250g)", calories: 495, protein: 40, carbs: 29, fats: 14, fiber: 4, price: 108, type: "nonveg" as const, recipe: "Prepare prawn coconut curry with rice 53 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Stew (lean) 54", quantity: "1 plate (300g)", calories: 674, protein: 60, carbs: 63, fats: 25, fiber: 1, price: 141, type: "nonveg" as const, recipe: "Prepare chicken stew (lean) 54 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Grilled Salmon with Veg 55", quantity: "1 bowl (250g)", calories: 294, protein: 24, carbs: 14, fats: 20, fiber: 1, price: 142, type: "nonveg" as const, recipe: "Prepare grilled salmon with veg 55 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Egg & Vegetable Stir Fry 56", quantity: "1 plate (300g)", calories: 465, protein: 46, carbs: 39, fats: 23, fiber: 4, price: 94, type: "nonveg" as const, recipe: "Prepare egg & vegetable stir fry 56 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Prawn & Broccoli Bowl 57", quantity: "1 bowl (250g)", calories: 517, protein: 36, carbs: 39, fats: 29, fiber: 6, price: 227, type: "nonveg" as const, recipe: "Prepare prawn & broccoli bowl 57 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Mutton Soup with Millet 58", quantity: "1 serving", calories: 381, protein: 37, carbs: 28, fats: 27, fiber: 4, price: 185, type: "nonveg" as const, recipe: "Prepare mutton soup with millet 58 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Chicken Keema Khichdi 59", quantity: "1 serving", calories: 400, protein: 21, carbs: 32, fats: 26, fiber: 7, price: 222, type: "nonveg" as const, recipe: "Prepare chicken keema khichdi 59 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
    { name: "Fish Curry Light 60", quantity: "200g serving", calories: 284, protein: 40, carbs: 58, fats: 22, fiber: 6, price: 258, type: "nonveg" as const, recipe: "Prepare fish curry light 60 using lean protein, seasonal vegetables, and mild spices. Cook until tender." },
  ],

  snack: [
    { name: "Roasted Chana & Peanut Mix", quantity: "50g", calories: 260, protein: 13, carbs: 20, fats: 14, fiber: 7, price: 25, type: "veg" as const, recipe: "Dry roast chana and peanuts, cool and season with chaat masala." },
    { name: "Grilled Chicken Strips", quantity: "100g", calories: 150, protein: 28, carbs: 2, fats: 4, fiber: 0, price: 90, type: "nonveg" as const, recipe: "Marinate chicken strips and grill 8-10 min. Serve with lemon." },
    { name: "Grilled Chicken Strips (3)", quantity: "100g", calories: 173, protein: 18, carbs: 3, fats: 4, fiber: 3, price: 44, type: "nonveg" as const, recipe: "Make grilled chicken strips with lean protein, grill or bake, serve as a portable snack." },
    { name: "Boiled Egg Salad", quantity: "80g", calories: 216, protein: 23, carbs: 9, fats: 11, fiber: 3, price: 79, type: "nonveg" as const, recipe: "Make boiled egg salad with lean protein, grill or bake, serve as a portable snack." },
    { name: "Trail Mix", quantity: "1 bowl", calories: 129, protein: 9, carbs: 12, fats: 9, fiber: 9, price: 63, type: "veg" as const, recipe: "Prepare trail mix following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Sprouted Moong Chaat", quantity: "30g", calories: 289, protein: 9, carbs: 25, fats: 14, fiber: 5, price: 90, type: "veg" as const, recipe: "Prepare sprouted moong chaat following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Fruit Salad Cup", quantity: "1 piece", calories: 194, protein: 3, carbs: 39, fats: 11, fiber: 6, price: 64, type: "veg" as const, recipe: "Prepare fruit salad cup following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Tuna Salad Bowl", quantity: "100g", calories: 165, protein: 25, carbs: 20, fats: 11, fiber: 3, price: 100, type: "nonveg" as const, recipe: "Make tuna salad bowl with lean protein, grill or bake, serve as a portable snack." },
    { name: "Veg Sandwich", quantity: "1 piece", calories: 152, protein: 6, carbs: 27, fats: 2, fiber: 8, price: 72, type: "veg" as const, recipe: "Prepare veg sandwich following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Dates & Nuts", quantity: "1 bowl", calories: 89, protein: 11, carbs: 36, fats: 5, fiber: 1, price: 19, type: "veg" as const, recipe: "Prepare dates & nuts following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Egg Muffin (2)", quantity: "1 cup", calories: 202, protein: 29, carbs: 20, fats: 10, fiber: 3, price: 72, type: "nonveg" as const, recipe: "Make egg muffin with lean protein, grill or bake, serve as a portable snack." },
    { name: "Grilled Chicken Strips (12)", quantity: "100g", calories: 220, protein: 27, carbs: 10, fats: 9, fiber: 2, price: 148, type: "nonveg" as const, recipe: "Make grilled chicken strips with lean protein, grill or bake, serve as a portable snack." },
    { name: "Tuna Salad Bowl (13)", quantity: "1 cup", calories: 178, protein: 31, carbs: 5, fats: 12, fiber: 0, price: 76, type: "nonveg" as const, recipe: "Make tuna salad bowl with lean protein, grill or bake, serve as a portable snack." },
    { name: "Baked Sweet Potato", quantity: "1 piece", calories: 113, protein: 3, carbs: 39, fats: 3, fiber: 1, price: 43, type: "veg" as const, recipe: "Prepare baked sweet potato following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Baked Sweet Potato (15)", quantity: "1 cup", calories: 187, protein: 14, carbs: 7, fats: 8, fiber: 7, price: 24, type: "veg" as const, recipe: "Prepare baked sweet potato following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Fruit Salad Cup (16)", quantity: "50g", calories: 123, protein: 14, carbs: 23, fats: 6, fiber: 4, price: 31, type: "veg" as const, recipe: "Prepare fruit salad cup following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Egg Muffin (17)", quantity: "100g", calories: 195, protein: 36, carbs: 4, fats: 10, fiber: 0, price: 128, type: "nonveg" as const, recipe: "Make egg muffin with lean protein, grill or bake, serve as a portable snack." },
    { name: "Sprouted Moong Chaat (18)", quantity: "50g", calories: 147, protein: 11, carbs: 22, fats: 6, fiber: 8, price: 77, type: "veg" as const, recipe: "Prepare sprouted moong chaat following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Mixed Nuts", quantity: "1 cup", calories: 119, protein: 11, carbs: 29, fats: 4, fiber: 1, price: 37, type: "veg" as const, recipe: "Prepare mixed nuts following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Apple & Peanut Butter", quantity: "1 cup", calories: 146, protein: 2, carbs: 31, fats: 4, fiber: 5, price: 83, type: "veg" as const, recipe: "Prepare apple & peanut butter following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Baked Sweet Potato (21)", quantity: "1 piece", calories: 164, protein: 13, carbs: 33, fats: 17, fiber: 2, price: 79, type: "veg" as const, recipe: "Prepare baked sweet potato following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Boiled Egg Salad (22)", quantity: "1 piece", calories: 139, protein: 12, carbs: 12, fats: 12, fiber: 1, price: 128, type: "nonveg" as const, recipe: "Make boiled egg salad with lean protein, grill or bake, serve as a portable snack." },
    { name: "Trail Mix (23)", quantity: "1 bowl", calories: 236, protein: 10, carbs: 18, fats: 18, fiber: 6, price: 65, type: "veg" as const, recipe: "Prepare trail mix following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Trail Mix (24)", quantity: "50g", calories: 127, protein: 8, carbs: 18, fats: 10, fiber: 10, price: 66, type: "veg" as const, recipe: "Prepare trail mix following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Grilled Chicken Strips (25)", quantity: "1 piece", calories: 249, protein: 27, carbs: 12, fats: 5, fiber: 1, price: 42, type: "nonveg" as const, recipe: "Make grilled chicken strips with lean protein, grill or bake, serve as a portable snack." },
    { name: "Trail Mix (26)", quantity: "1 cup", calories: 274, protein: 6, carbs: 34, fats: 12, fiber: 5, price: 45, type: "veg" as const, recipe: "Prepare trail mix following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Sprouted Moong Chaat (27)", quantity: "50g", calories: 141, protein: 5, carbs: 9, fats: 1, fiber: 10, price: 15, type: "veg" as const, recipe: "Prepare sprouted moong chaat following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Apple & Peanut Butter (28)", quantity: "50g", calories: 145, protein: 10, carbs: 15, fats: 6, fiber: 5, price: 21, type: "veg" as const, recipe: "Prepare apple & peanut butter following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Cucumber Sticks & Hummus", quantity: "50g", calories: 128, protein: 10, carbs: 36, fats: 17, fiber: 7, price: 42, type: "veg" as const, recipe: "Prepare cucumber sticks & hummus following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Chicken Skewers", quantity: "1 cup", calories: 161, protein: 31, carbs: 17, fats: 7, fiber: 0, price: 144, type: "nonveg" as const, recipe: "Make chicken skewers with lean protein, grill or bake, serve as a portable snack." },
    { name: "Cucumber Sticks & Hummus (31)", quantity: "1 piece", calories: 108, protein: 14, carbs: 13, fats: 3, fiber: 2, price: 32, type: "veg" as const, recipe: "Prepare cucumber sticks & hummus following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Apple & Peanut Butter (32)", quantity: "1 piece", calories: 97, protein: 4, carbs: 14, fats: 15, fiber: 8, price: 87, type: "veg" as const, recipe: "Prepare apple & peanut butter following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Sprouted Moong Chaat (33)", quantity: "50g", calories: 150, protein: 8, carbs: 32, fats: 5, fiber: 4, price: 53, type: "veg" as const, recipe: "Prepare sprouted moong chaat following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Baked Sweet Potato (34)", quantity: "1 cup", calories: 220, protein: 9, carbs: 17, fats: 0, fiber: 8, price: 85, type: "veg" as const, recipe: "Prepare baked sweet potato following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Cucumber Sticks & Hummus (35)", quantity: "1 piece", calories: 213, protein: 5, carbs: 33, fats: 12, fiber: 8, price: 86, type: "veg" as const, recipe: "Prepare cucumber sticks & hummus following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Makhana Roasted", quantity: "1 cup", calories: 299, protein: 5, carbs: 33, fats: 6, fiber: 1, price: 61, type: "veg" as const, recipe: "Prepare makhana roasted following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Roasted Chickpea", quantity: "1 bowl", calories: 277, protein: 13, carbs: 27, fats: 11, fiber: 9, price: 47, type: "veg" as const, recipe: "Prepare roasted chickpea following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Trail Mix (38)", quantity: "1 piece", calories: 66, protein: 3, carbs: 17, fats: 2, fiber: 7, price: 74, type: "veg" as const, recipe: "Prepare trail mix following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Boiled Egg Salad (39)", quantity: "1 piece", calories: 231, protein: 35, carbs: 17, fats: 6, fiber: 3, price: 73, type: "nonveg" as const, recipe: "Make boiled egg salad with lean protein, grill or bake, serve as a portable snack." },
    { name: "Tuna Salad Bowl (40)", quantity: "1 cup", calories: 230, protein: 33, carbs: 20, fats: 3, fiber: 2, price: 156, type: "nonveg" as const, recipe: "Make tuna salad bowl with lean protein, grill or bake, serve as a portable snack." },
    { name: "Cucumber Sticks & Hummus (41)", quantity: "50g", calories: 224, protein: 4, carbs: 33, fats: 9, fiber: 10, price: 84, type: "veg" as const, recipe: "Prepare cucumber sticks & hummus following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Roasted Chana Mix", quantity: "1 cup", calories: 222, protein: 12, carbs: 35, fats: 15, fiber: 2, price: 69, type: "veg" as const, recipe: "Prepare roasted chana mix following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Makhana Roasted (43)", quantity: "1 piece", calories: 134, protein: 2, carbs: 27, fats: 13, fiber: 4, price: 29, type: "veg" as const, recipe: "Prepare makhana roasted following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Cucumber Sticks & Hummus (44)", quantity: "1 piece", calories: 127, protein: 7, carbs: 31, fats: 11, fiber: 10, price: 44, type: "veg" as const, recipe: "Prepare cucumber sticks & hummus following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Roasted Chickpea (45)", quantity: "1 piece", calories: 270, protein: 13, carbs: 13, fats: 2, fiber: 1, price: 78, type: "veg" as const, recipe: "Prepare roasted chickpea following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Smoked Salmon Bites", quantity: "80g", calories: 255, protein: 19, carbs: 3, fats: 12, fiber: 2, price: 97, type: "nonveg" as const, recipe: "Make smoked salmon bites with lean protein, grill or bake, serve as a portable snack." },
    { name: "Apple & Peanut Butter (47)", quantity: "1 piece", calories: 189, protein: 12, carbs: 13, fats: 15, fiber: 7, price: 81, type: "veg" as const, recipe: "Prepare apple & peanut butter following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Grilled Chicken Strips (48)", quantity: "80g", calories: 209, protein: 24, carbs: 11, fats: 11, fiber: 2, price: 60, type: "nonveg" as const, recipe: "Make grilled chicken strips with lean protein, grill or bake, serve as a portable snack." },
    { name: "Chicken Skewers (49)", quantity: "1 cup", calories: 125, protein: 15, carbs: 20, fats: 10, fiber: 2, price: 137, type: "nonveg" as const, recipe: "Make chicken skewers with lean protein, grill or bake, serve as a portable snack." },
    { name: "Mixed Nuts (50)", quantity: "1 bowl", calories: 126, protein: 14, carbs: 24, fats: 1, fiber: 10, price: 56, type: "veg" as const, recipe: "Prepare mixed nuts following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Apple & Peanut Butter (51)", quantity: "30g", calories: 64, protein: 9, carbs: 26, fats: 15, fiber: 4, price: 62, type: "veg" as const, recipe: "Prepare apple & peanut butter following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Dates & Nuts (52)", quantity: "30g", calories: 170, protein: 14, carbs: 8, fats: 15, fiber: 9, price: 76, type: "veg" as const, recipe: "Prepare dates & nuts following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Egg Muffin (53)", quantity: "80g", calories: 239, protein: 18, carbs: 15, fats: 3, fiber: 2, price: 75, type: "nonveg" as const, recipe: "Make egg muffin with lean protein, grill or bake, serve as a portable snack." },
    { name: "Tuna Salad Bowl (54)", quantity: "1 piece", calories: 141, protein: 17, carbs: 20, fats: 12, fiber: 0, price: 79, type: "nonveg" as const, recipe: "Make tuna salad bowl with lean protein, grill or bake, serve as a portable snack." },
    { name: "Boiled Egg Salad (55)", quantity: "1 cup", calories: 205, protein: 32, carbs: 4, fats: 10, fiber: 2, price: 52, type: "nonveg" as const, recipe: "Make boiled egg salad with lean protein, grill or bake, serve as a portable snack." },
    { name: "Fruit Salad Cup (56)", quantity: "30g", calories: 253, protein: 9, carbs: 17, fats: 6, fiber: 4, price: 19, type: "veg" as const, recipe: "Prepare fruit salad cup following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Roasted Chana Mix (57)", quantity: "1 bowl", calories: 207, protein: 11, carbs: 34, fats: 7, fiber: 3, price: 28, type: "veg" as const, recipe: "Prepare roasted chana mix following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Veg Sandwich (58)", quantity: "50g", calories: 300, protein: 3, carbs: 25, fats: 7, fiber: 1, price: 46, type: "veg" as const, recipe: "Prepare veg sandwich following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Mixed Nuts (59)", quantity: "1 cup", calories: 134, protein: 9, carbs: 22, fats: 0, fiber: 7, price: 78, type: "veg" as const, recipe: "Prepare mixed nuts following standard snack prep. Keep portions small and nutrient-dense." },
    { name: "Sprouted Moong Chaat (60)", quantity: "1 piece", calories: 122, protein: 8, carbs: 33, fats: 4, fiber: 8, price: 56, type: "veg" as const, recipe: "Prepare sprouted moong chaat following standard snack prep. Keep portions small and nutrient-dense." },
  ],

  drink: [
    { name: "Green Tea", quantity: "1 glass (250ml)", calories: 101, protein: 11, carbs: 3, fats: 3, fiber: 0, price: 12, type: "veg" as const, recipe: "Prepare green tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Tulsi Ginger Tea", quantity: "1 glass (250ml)", calories: 153, protein: 10, carbs: 33, fats: 4, fiber: 1, price: 12, type: "veg" as const, recipe: "Prepare tulsi ginger tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Lemongrass Tea", quantity: "1 glass (250ml)", calories: 11, protein: 12, carbs: 3, fats: 1, fiber: 2, price: 16, type: "veg" as const, recipe: "Prepare lemongrass tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Chamomile Tea", quantity: "1 glass (250ml)", calories: 94, protein: 12, carbs: 35, fats: 4, fiber: 1, price: 21, type: "veg" as const, recipe: "Prepare chamomile tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Peppermint Herbal Tea", quantity: "1 glass (250ml)", calories: 62, protein: 9, carbs: 27, fats: 5, fiber: 2, price: 38, type: "veg" as const, recipe: "Prepare peppermint herbal tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Cardamom Tea (Unsweetened)", quantity: "1 glass (250ml)", calories: 52, protein: 12, carbs: 32, fats: 5, fiber: 2, price: 38, type: "veg" as const, recipe: "Prepare cardamom tea (unsweetened) fresh. Serve chilled or warm depending on recipe." },
    { name: "Cinnamon Detox Tea", quantity: "1 glass (250ml)", calories: 117, protein: 12, carbs: 33, fats: 0, fiber: 1, price: 5, type: "veg" as const, recipe: "Prepare cinnamon detox tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Ginger Lemon Tea", quantity: "1 glass (250ml)", calories: 38, protein: 4, carbs: 25, fats: 5, fiber: 0, price: 36, type: "veg" as const, recipe: "Prepare ginger lemon tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Hibiscus Tea", quantity: "1 glass (250ml)", calories: 52, protein: 9, carbs: 27, fats: 4, fiber: 1, price: 8, type: "veg" as const, recipe: "Prepare hibiscus tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Spearmint Tea", quantity: "1 glass (250ml)", calories: 9, protein: 2, carbs: 30, fats: 3, fiber: 0, price: 13, type: "veg" as const, recipe: "Prepare spearmint tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Rose Tea", quantity: "1 glass (250ml)", calories: 115, protein: 5, carbs: 13, fats: 3, fiber: 3, price: 14, type: "veg" as const, recipe: "Prepare rose tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Blue Tea (Butterfly Pea Flower)", quantity: "1 glass (250ml)", calories: 109, protein: 10, carbs: 32, fats: 2, fiber: 1, price: 18, type: "veg" as const, recipe: "Prepare blue tea (butterfly pea flower) fresh. Serve chilled or warm depending on recipe." },
    { name: "Ashwagandha Herbal Tea", quantity: "1 glass (250ml)", calories: 109, protein: 3, carbs: 30, fats: 2, fiber: 3, price: 6, type: "veg" as const, recipe: "Prepare ashwagandha herbal tea fresh. Serve chilled or warm depending on recipe." },
    { name: "Skim Milk (Warm)", quantity: "1 glass (250ml)", calories: 38, protein: 4, carbs: 17, fats: 1, fiber: 1, price: 14, type: "veg" as const, recipe: "Prepare skim milk (warm) fresh. Serve chilled or warm depending on recipe." },
    { name: "Ragi Malt Drink", quantity: "1 glass (250ml)", calories: 136, protein: 7, carbs: 3, fats: 1, fiber: 2, price: 56, type: "veg" as const, recipe: "Prepare ragi malt drink fresh. Serve chilled or warm depending on recipe." },
    { name: "Masala Chaas (Buttermilk)", quantity: "1 glass (250ml)", calories: 40, protein: 2, carbs: 28, fats: 3, fiber: 2, price: 8, type: "veg" as const, recipe: "Prepare masala chaas (buttermilk) fresh. Serve chilled or warm depending on recipe." },
    { name: "Low-Fat Lassi", quantity: "1 glass (250ml)", calories: 90, protein: 3, carbs: 25, fats: 0, fiber: 3, price: 58, type: "veg" as const, recipe: "Prepare low-fat lassi fresh. Serve chilled or warm depending on recipe." },
    { name: "Spiced Turmeric Milk", quantity: "1 glass (250ml)", calories: 31, protein: 6, carbs: 23, fats: 3, fiber: 0, price: 12, type: "veg" as const, recipe: "Prepare spiced turmeric milk fresh. Serve chilled or warm depending on recipe." },
    { name: "Cinnamon Milk", quantity: "1 glass (250ml)", calories: 36, protein: 3, carbs: 11, fats: 5, fiber: 2, price: 49, type: "veg" as const, recipe: "Prepare cinnamon milk fresh. Serve chilled or warm depending on recipe." },
    { name: "Protein Shake (Whey)", quantity: "1 glass (250ml)", calories: 124, protein: 7, carbs: 3, fats: 2, fiber: 2, price: 25, type: "veg" as const, recipe: "Prepare protein shake (whey) fresh. Serve chilled or warm depending on recipe." },
    { name: "Almond Milk (Unsweetened)", quantity: "1 glass (250ml)", calories: 37, protein: 8, carbs: 5, fats: 1, fiber: 0, price: 39, type: "veg" as const, recipe: "Prepare almond milk (unsweetened) fresh. Serve chilled or warm depending on recipe." },
    { name: "Soy Milk (Plain)", quantity: "1 glass (250ml)", calories: 72, protein: 5, carbs: 3, fats: 4, fiber: 2, price: 39, type: "veg" as const, recipe: "Prepare soy milk (plain) fresh. Serve chilled or warm depending on recipe." },
    { name: "Peanut Milk", quantity: "1 glass (250ml)", calories: 149, protein: 9, carbs: 8, fats: 3, fiber: 0, price: 57, type: "veg" as const, recipe: "Prepare peanut milk fresh. Serve chilled or warm depending on recipe." },
    { name: "Oats Milk Shake (Low Sugar)", quantity: "1 glass (250ml)", calories: 97, protein: 1, carbs: 3, fats: 2, fiber: 0, price: 44, type: "veg" as const, recipe: "Prepare oats milk shake (low sugar) fresh. Serve chilled or warm depending on recipe." },
    { name: "Carrot Juice", quantity: "1 glass (250ml)", calories: 33, protein: 0, carbs: 5, fats: 2, fiber: 1, price: 14, type: "veg" as const, recipe: "Prepare carrot juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Beetroot Juice", quantity: "1 glass (250ml)", calories: 115, protein: 8, carbs: 8, fats: 5, fiber: 0, price: 45, type: "veg" as const, recipe: "Prepare beetroot juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Apple Celery Juice", quantity: "1 glass (250ml)", calories: 86, protein: 9, carbs: 25, fats: 2, fiber: 1, price: 25, type: "veg" as const, recipe: "Prepare apple celery juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Carrot-Apple-Ginger Juice", quantity: "1 glass (250ml)", calories: 16, protein: 5, carbs: 6, fats: 5, fiber: 1, price: 28, type: "veg" as const, recipe: "Prepare carrot-apple-ginger juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Pomegranate Juice (Fresh)", quantity: "1 glass (250ml)", calories: 118, protein: 6, carbs: 8, fats: 4, fiber: 0, price: 9, type: "veg" as const, recipe: "Prepare pomegranate juice (fresh) fresh. Serve chilled or warm depending on recipe." },
    { name: "Mosambi Sweet Lime Juice", quantity: "1 glass (250ml)", calories: 93, protein: 6, carbs: 3, fats: 0, fiber: 1, price: 40, type: "veg" as const, recipe: "Prepare mosambi sweet lime juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Fresh Watermelon Juice", quantity: "1 glass (250ml)", calories: 98, protein: 0, carbs: 27, fats: 3, fiber: 3, price: 23, type: "veg" as const, recipe: "Prepare fresh watermelon juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Pineapple Mint Juice", quantity: "1 glass (250ml)", calories: 78, protein: 11, carbs: 31, fats: 5, fiber: 1, price: 23, type: "veg" as const, recipe: "Prepare pineapple mint juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Orange Juice (Unsweetened)", quantity: "1 glass (250ml)", calories: 118, protein: 10, carbs: 10, fats: 3, fiber: 0, price: 54, type: "veg" as const, recipe: "Prepare orange juice (unsweetened) fresh. Serve chilled or warm depending on recipe." },
    { name: "Amla Aloe Detox Juice", quantity: "1 glass (250ml)", calories: 101, protein: 6, carbs: 16, fats: 2, fiber: 0, price: 5, type: "veg" as const, recipe: "Prepare amla aloe detox juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Cucumber Mint Cooler", quantity: "1 glass (250ml)", calories: 73, protein: 1, carbs: 26, fats: 5, fiber: 0, price: 49, type: "veg" as const, recipe: "Prepare cucumber mint cooler fresh. Serve chilled or warm depending on recipe." },
    { name: "Sugarcane Juice (No Ice)", quantity: "1 glass (250ml)", calories: 10, protein: 3, carbs: 16, fats: 4, fiber: 2, price: 52, type: "veg" as const, recipe: "Prepare sugarcane juice (no ice) fresh. Serve chilled or warm depending on recipe." },
    { name: "Banana Peanut Smoothie", quantity: "1 glass (250ml)", calories: 123, protein: 1, carbs: 21, fats: 1, fiber: 1, price: 55, type: "veg" as const, recipe: "Prepare banana peanut smoothie fresh. Serve chilled or warm depending on recipe." },
    { name: "Mango Yogurt Smoothie", quantity: "1 glass (250ml)", calories: 18, protein: 12, carbs: 28, fats: 3, fiber: 3, price: 14, type: "veg" as const, recipe: "Prepare mango yogurt smoothie fresh. Serve chilled or warm depending on recipe." },
    { name: "Strawberry Banana Smoothie", quantity: "1 glass (250ml)", calories: 66, protein: 2, carbs: 29, fats: 4, fiber: 3, price: 9, type: "veg" as const, recipe: "Prepare strawberry banana smoothie fresh. Serve chilled or warm depending on recipe." },
    { name: "Blueberry Oats Smoothie", quantity: "1 glass (250ml)", calories: 146, protein: 6, carbs: 31, fats: 2, fiber: 1, price: 60, type: "veg" as const, recipe: "Prepare blueberry oats smoothie fresh. Serve chilled or warm depending on recipe." },
    { name: "Spinach - Banana Smoothie", quantity: "1 glass (250ml)", calories: 79, protein: 11, carbs: 4, fats: 3, fiber: 2, price: 16, type: "veg" as const, recipe: "Prepare spinach - banana smoothie fresh. Serve chilled or warm depending on recipe." },
    { name: "Papaya Ginger Smoothie", quantity: "1 glass (250ml)", calories: 159, protein: 2, carbs: 23, fats: 4, fiber: 3, price: 34, type: "veg" as const, recipe: "Prepare papaya ginger smoothie fresh. Serve chilled or warm depending on recipe." },
    { name: "Chocolate Protein Smoothie", quantity: "1 glass (250ml)", calories: 90, protein: 1, carbs: 11, fats: 4, fiber: 0, price: 26, type: "veg" as const, recipe: "Prepare chocolate protein smoothie fresh. Serve chilled or warm depending on recipe." },
    { name: "Coconut Water", quantity: "1 glass (250ml)", calories: 46, protein: 10, carbs: 13, fats: 4, fiber: 2, price: 55, type: "veg" as const, recipe: "Prepare coconut water fresh. Serve chilled or warm depending on recipe." },
    { name: "Jeera Water", quantity: "1 glass (250ml)", calories: 83, protein: 12, carbs: 18, fats: 5, fiber: 3, price: 7, type: "veg" as const, recipe: "Prepare jeera water fresh. Serve chilled or warm depending on recipe." },
    { name: "Ajwain Water", quantity: "1 glass (250ml)", calories: 146, protein: 1, carbs: 4, fats: 3, fiber: 0, price: 42, type: "veg" as const, recipe: "Prepare ajwain water fresh. Serve chilled or warm depending on recipe." },
    { name: "Fennel Seed Water (Saunf Water)", quantity: "1 glass (250ml)", calories: 51, protein: 11, carbs: 17, fats: 5, fiber: 1, price: 47, type: "veg" as const, recipe: "Prepare fennel seed water (saunf water) fresh. Serve chilled or warm depending on recipe." },
    { name: "Barley Water", quantity: "1 glass (250ml)", calories: 118, protein: 12, carbs: 3, fats: 5, fiber: 3, price: 38, type: "veg" as const, recipe: "Prepare barley water fresh. Serve chilled or warm depending on recipe." },
    { name: "Rice Kanji", quantity: "1 glass (250ml)", calories: 98, protein: 10, carbs: 30, fats: 4, fiber: 1, price: 50, type: "veg" as const, recipe: "Prepare rice kanji fresh. Serve chilled or warm depending on recipe." },
    { name: "Sattu Drink (Low Sugar)", quantity: "1 glass (250ml)", calories: 7, protein: 11, carbs: 26, fats: 3, fiber: 0, price: 51, type: "veg" as const, recipe: "Prepare sattu drink (low sugar) fresh. Serve chilled or warm depending on recipe." },
    { name: "Nimbu Pani (Salted)", quantity: "1 glass (250ml)", calories: 9, protein: 11, carbs: 24, fats: 2, fiber: 1, price: 14, type: "veg" as const, recipe: "Prepare nimbu pani (salted) fresh. Serve chilled or warm depending on recipe." },
    { name: "Jal Jeera", quantity: "1 glass (250ml)", calories: 90, protein: 11, carbs: 34, fats: 0, fiber: 0, price: 32, type: "veg" as const, recipe: "Prepare jal jeera fresh. Serve chilled or warm depending on recipe." },
    { name: "Tulsi Detox Water", quantity: "1 glass (250ml)", calories: 11, protein: 1, carbs: 24, fats: 4, fiber: 2, price: 47, type: "veg" as const, recipe: "Prepare tulsi detox water fresh. Serve chilled or warm depending on recipe." },
    { name: "Mint Lemon Infused Water", quantity: "1 glass (250ml)", calories: 29, protein: 3, carbs: 28, fats: 0, fiber: 2, price: 35, type: "veg" as const, recipe: "Prepare mint lemon infused water fresh. Serve chilled or warm depending on recipe." },
    { name: "Ginger Honey Water", quantity: "1 glass (250ml)", calories: 111, protein: 3, carbs: 34, fats: 0, fiber: 1, price: 52, type: "veg" as const, recipe: "Prepare ginger honey water fresh. Serve chilled or warm depending on recipe." },
    { name: "Aloe Vera Water", quantity: "1 glass (250ml)", calories: 69, protein: 1, carbs: 9, fats: 4, fiber: 3, price: 50, type: "veg" as const, recipe: "Prepare aloe vera water fresh. Serve chilled or warm depending on recipe." },
    { name: "Tomato Juice (Fresh)", quantity: "1 glass (250ml)", calories: 39, protein: 5, carbs: 17, fats: 5, fiber: 0, price: 19, type: "veg" as const, recipe: "Prepare tomato juice (fresh) fresh. Serve chilled or warm depending on recipe." },
    { name: "Celery Cucumber Juice", quantity: "1 glass (250ml)", calories: 105, protein: 7, carbs: 13, fats: 0, fiber: 3, price: 60, type: "veg" as const, recipe: "Prepare celery cucumber juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Spinach-Carrot Juice", quantity: "1 glass (250ml)", calories: 134, protein: 2, carbs: 27, fats: 4, fiber: 2, price: 18, type: "veg" as const, recipe: "Prepare spinach-carrot juice fresh. Serve chilled or warm depending on recipe." },
    { name: "Mixed Vegetable Detox Juice", quantity: "1 glass (250ml)", calories: 138, protein: 1, carbs: 28, fats: 3, fiber: 0, price: 33, type: "veg" as const, recipe: "Prepare mixed vegetable detox juice fresh. Serve chilled or warm depending on recipe." },
  ],

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
                  value={formData.age === 0 ? "" : formData.age}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      updateFormData("age", 0);
                    } else {
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) updateFormData("age", num);
                    }
                  }}
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
                  value={formData.weight === 0 ? "" : formData.weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      updateFormData("weight", 0);
                    } else {
                      const num = parseFloat(val);
                      if (!isNaN(num)) updateFormData("weight", num);
                    }
                  }}
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
                  value={formData.height === 0 ? "" : formData.height}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      updateFormData("height", 0);
                    } else {
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) updateFormData("height", num);
                    }
                  }}
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
                  value={formData.budget === 0 ? "" : formData.budget}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      updateFormData("budget", 0);
                    } else {
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) updateFormData("budget", num);
                    }
                  }}
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

