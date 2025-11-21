import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Utensils, Activity, DollarSign } from "lucide-react";

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
}

interface MealPlan {
  breakfast: FoodItem;
  lunch: FoodItem;
  dinner: FoodItem;
  snack: FoodItem;
  drink: FoodItem;
}

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

const FOOD_DATABASE = {
  breakfast: [
    { name: "Poha", quantity: "1 plate (150g)", calories: 250, protein: 5, carbs: 45, fats: 4, fiber: 3, price: 25, type: "veg" as const },
    { name: "Upma", quantity: "1 bowl (150g)", calories: 200, protein: 6, carbs: 40, fats: 3, fiber: 2, price: 20, type: "veg" as const },
    { name: "Idli (3 pcs)", quantity: "3 pcs (180g)", calories: 180, protein: 6, carbs: 38, fats: 1, fiber: 2, price: 30, type: "veg" as const },
    { name: "Dosa", quantity: "1 large (120g)", calories: 220, protein: 5, carbs: 35, fats: 6, fiber: 2, price: 35, type: "veg" as const },
    { name: "Paratha with Curd", quantity: "1 paratha + 100g curd", calories: 320, protein: 9, carbs: 48, fats: 10, fiber: 3, price: 40, type: "veg" as const },
    { name: "Aloo Paratha", quantity: "1 paratha (120g)", calories: 350, protein: 7, carbs: 55, fats: 11, fiber: 4, price: 45, type: "veg" as const },
    { name: "Bread Omelette", quantity: "2 bread + 2 eggs", calories: 280, protein: 13, carbs: 28, fats: 12, fiber: 2, price: 30, type: "nonveg" as const },
    { name: "Egg Bhurji", quantity: "2 eggs (100g)", calories: 240, protein: 12, carbs: 6, fats: 18, fiber: 1, price: 35, type: "nonveg" as const },
    { name: "Masala Oats", quantity: "1 bowl (40g)", calories: 180, protein: 6, carbs: 30, fats: 3, fiber: 4, price: 25, type: "veg" as const },
    { name: "Vermicelli Upma", quantity: "1 bowl (150g)", calories: 210, protein: 5, carbs: 38, fats: 4, fiber: 2, price: 22, type: "veg" as const },
  ],
  lunch: [
    { name: "Dal Rice", quantity: "1 cup dal + 1 cup rice", calories: 350, protein: 12, carbs: 65, fats: 4, fiber: 5, price: 50, type: "veg" as const },
    { name: "Rajma Rice", quantity: "1 cup rajma + 1 cup rice", calories: 420, protein: 14, carbs: 75, fats: 6, fiber: 7, price: 60, type: "veg" as const },
    { name: "Chole Rice", quantity: "1 cup chole + 1 cup rice", calories: 450, protein: 15, carbs: 78, fats: 7, fiber: 8, price: 65, type: "veg" as const },
    { name: "Veg Pulao", quantity: "1 bowl (200g)", calories: 380, protein: 8, carbs: 70, fats: 7, fiber: 4, price: 55, type: "veg" as const },
    { name: "Roti with Dal and Sabzi", quantity: "2 roti + 1 cup dal + 1 cup sabzi", calories: 400, protein: 13, carbs: 68, fats: 5, fiber: 7, price: 60, type: "veg" as const },
    { name: "Paneer Sabzi with Roti", quantity: "2 roti + 1 cup paneer sabzi", calories: 480, protein: 18, carbs: 55, fats: 16, fiber: 5, price: 90, type: "veg" as const },
    { name: "Chicken Curry with Rice", quantity: "1 cup curry + 1 cup rice", calories: 550, protein: 28, carbs: 70, fats: 18, fiber: 3, price: 120, type: "nonveg" as const },
    { name: "Egg Curry with Rice", quantity: "2 eggs + 1 cup rice", calories: 450, protein: 20, carbs: 65, fats: 12, fiber: 2, price: 70, type: "nonveg" as const },
    { name: "Fish Curry with Rice", quantity: "1 cup curry + 1 cup rice", calories: 500, protein: 25, carbs: 68, fats: 15, fiber: 2, price: 150, type: "nonveg" as const },
    { name: "Sambar Rice", quantity: "1 bowl (200g)", calories: 370, protein: 8, carbs: 72, fats: 3, fiber: 5, price: 55, type: "veg" as const },
  ],
  dinner: [
    { name: "Khichdi", quantity: "1 bowl (200g)", calories: 300, protein: 9, carbs: 55, fats: 5, fiber: 4, price: 40, type: "veg" as const },
    { name: "Dal Roti", quantity: "2 roti + 1 cup dal", calories: 350, protein: 12, carbs: 60, fats: 4, fiber: 5, price: 50, type: "veg" as const },
    { name: "Veg Biryani", quantity: "1 bowl (200g)", calories: 420, protein: 9, carbs: 75, fats: 8, fiber: 4, price: 80, type: "veg" as const },
    { name: "Palak Paneer with Roti", quantity: "2 roti + 1 cup palak paneer", calories: 450, protein: 17, carbs: 52, fats: 15, fiber: 5, price: 95, type: "veg" as const },
    { name: "Sabzi Roti", quantity: "2 roti + 1 cup sabzi", calories: 320, protein: 8, carbs: 58, fats: 3, fiber: 5, price: 55, type: "veg" as const },
    { name: "Grilled Chicken with Roti", quantity: "2 roti + 100g chicken", calories: 480, protein: 30, carbs: 52, fats: 14, fiber: 3, price: 130, type: "nonveg" as const },
    { name: "Egg Fried Rice", quantity: "1 bowl (200g)", calories: 400, protein: 14, carbs: 68, fats: 10, fiber: 3, price: 75, type: "nonveg" as const },
    { name: "Mixed Dal with Rice", quantity: "1 cup dal + 1 cup rice", calories: 360, protein: 13, carbs: 65, fats: 4, fiber: 6, price: 50, type: "veg" as const },
    { name: "Paneer Tikka with Roti", quantity: "2 roti + 1 cup paneer tikka", calories: 500, protein: 20, carbs: 54, fats: 18, fiber: 4, price: 110, type: "veg" as const },
    { name: "Butter Chicken with Naan", quantity: "1 naan + 1 cup butter chicken", calories: 580, protein: 32, carbs: 60, fats: 22, fiber: 3, price: 150, type: "nonveg" as const },
  ],
  snack: [
    { name: "Samosa (2 pcs)", quantity: "2 pcs (100g)", calories: 260, protein: 5, carbs: 32, fats: 12, fiber: 2, price: 20, type: "veg" as const },
    { name: "Banana", quantity: "1 medium (120g)", calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3, price: 10, type: "veg" as const },
    { name: "Apple", quantity: "1 medium (180g)", calories: 95, protein: 0, carbs: 25, fats: 0, fiber: 4, price: 30, type: "veg" as const },
    { name: "Roasted Chana", quantity: "60g", calories: 150, protein: 8, carbs: 18, fats: 6, fiber: 3, price: 15, type: "veg" as const },
    { name: "Biscuits (4 pcs)", quantity: "4 pcs (100g)", calories: 200, protein: 3, carbs: 28, fats: 8, fiber: 1, price: 20, type: "veg" as const },
    { name: "Pakora", quantity: "5 pcs (100g)", calories: 180, protein: 4, carbs: 22, fats: 10, fiber: 1, price: 25, type: "veg" as const },
    { name: "Boiled Egg", quantity: "1 piece (50g)", calories: 155, protein: 13, carbs: 1, fats: 11, fiber: 0, price: 12, type: "nonveg" as const },
    { name: "Mixed Nuts", quantity: "40g", calories: 170, protein: 8, carbs: 10, fats: 18, fiber: 2, price: 40, type: "veg" as const },
    { name: "Fruit Chaat", quantity: "1 cup (150g)", calories: 120, protein: 1, carbs: 28, fats: 1, fiber: 4, price: 35, type: "veg" as const },
    { name: "Peanuts", quantity: "50g", calories: 160, protein: 9, carbs: 8, fats: 22, fiber: 3, price: 15, type: "veg" as const },
  ],
  drink: [
    { name: "Chai", quantity: "1 cup (200ml)", calories: 80, protein: 2, carbs: 12, fats: 2, fiber: 0, price: 10, type: "veg" as const },
    { name: "Coffee", quantity: "1 cup (200ml)", calories: 60, protein: 1, carbs: 6, fats: 1, fiber: 0, price: 15, type: "veg" as const },
    { name: "Lassi", quantity: "1 cup (200ml)", calories: 150, protein: 6, carbs: 18, fats: 3, fiber: 0, price: 30, type: "veg" as const },
    { name: "Buttermilk", quantity: "1 cup (200ml)", calories: 60, protein: 3, carbs: 4, fats: 1, fiber: 0, price: 15, type: "veg" as const },
    { name: "Lemon Water", quantity: "1 glass (200ml)", calories: 10, protein: 0, carbs: 2, fats: 0, fiber: 0, price: 5, type: "veg" as const },
    { name: "Coconut Water", quantity: "1 glass (200ml)", calories: 45, protein: 1, carbs: 9, fats: 0, fiber: 0, price: 30, type: "veg" as const },
    { name: "Nimbu Pani", quantity: "1 glass (200ml)", calories: 40, protein: 0, carbs: 10, fats: 0, fiber: 0, price: 10, type: "veg" as const },
    { name: "Milk", quantity: "1 cup (200ml)", calories: 150, protein: 8, carbs: 12, fats: 8, fiber: 0, price: 20, type: "veg" as const },
  ],
};

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose: -500,
  maintain: 0,
  gain: 500,
};

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
  const [showResults, setShowResults] = useState(false);
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const calculateBMR = (weight: number, height: number, age: number, sex: string): number => {
    if (sex === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const selectBestFood = (
    foods: FoodItem[],
    targetCalories: number,
    maxBudget: number,
    dietPref: string
  ): FoodItem => {
    let filtered = foods.filter((food) => {
      if (dietPref === "veg") return food.type === "veg";
      if (dietPref === "nonveg") return food.type === "nonveg";
      return true;
    });

    if (filtered.length === 0) filtered = foods.filter((f) => f.type === "veg");
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
      totalProtein,
      totalCarbs,
      totalFats,
      totalFiber,
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

  const handleReset = () => {
    setShowResults(false);
    setResults(null);
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
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-main px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
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
              {
                label: "BMI",
                value: results.bmi,
                icon: Calculator,
                unit: "",
              },
              {
                label: "BMR",
                value: results.bmr,
                icon: Activity,
                unit: "cal",
              },
              {
                label: "Target Calories",
                value: results.targetCalories,
                icon: Utensils,
                unit: "cal",
              },
              {
                label: "Your Budget",
                value: `₹${formData.budget}`,
                icon: DollarSign,
                unit: "",
              },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(results.mealPlan).map(([mealType, food], index) => (
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
                      food.type === "veg"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {food.type === "veg" ? "🥗 Veg" : "🍗 Non-Veg"}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">{food.name}</h4>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{food.calories}</span> cal
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">₹{food.price}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 mb-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Daily Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Calories</p>
                <p className="text-4xl font-bold text-foreground">{results.totalCalories}</p>
                <p className="text-sm text-muted-foreground mt-1">Target: {results.targetCalories} cal</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Total Cost</p>
                <p className="text-4xl font-bold text-foreground">₹{results.totalCost}</p>
                <p className="text-sm text-muted-foreground mt-1">Budget: ₹{formData.budget}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Budget Status</p>
                <p
                  className={`text-4xl font-bold ${
                    results.totalCost <= formData.budget ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {results.totalCost <= formData.budget ? "✅" : "⚠️"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {results.totalCost <= formData.budget
                    ? "Within Budget"
                    : `₹${results.totalCost - formData.budget} over`}
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-foreground mb-3">Indian Diet Planner</h1>
          <p className="text-muted-foreground text-lg">
            Get your personalized meal plan based on your goals and budget
          </p>
        </motion.header>

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
                    onClick={() => updateFormData("sex", sex)}
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
                onChange={(e) => updateFormData("activityLevel", e.target.value)}
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
                onChange={(e) => updateFormData("goal", e.target.value)}
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
                    onClick={() => updateFormData("dietPreference", pref.value)}
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
      </motion.div>
    </div>
  );
};

export default Index;
