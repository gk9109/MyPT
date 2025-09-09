import { serverTimestamp } from "firebase/firestore";

/**
 * @typedef {Object} DietMeal
 * @property {string} name - Meal name (e.g. "Breakfast")
 * @property {string} carbs - Carbs content or description
 * @property {string} fats - Fats content or description
 * @property {string} proteins - Protein content or description
 * @property {string} totalCalories - Total calories for this meal
 */

/**
 * @typedef {Object} DietPlan
 * @property {string} title - Title of the diet plan
 * @property {Array<DietMeal>} meals - List of meals (Breakfast, Lunch, Dinner, etc.)
 * @property {*} createdAt - Firestore Timestamp
 * @property {*} updatedAt - Firestore Timestamp
 */

/** Build a normalized diet plan with defaults */
export function makeDietPlan({
  title = "",
  meals = [],
}) {
  /** @type {DietPlan} */
  const plan = {
    title,
    meals: meals.map(m => ({
      name: m.name || "",          // Breakfast, Lunch, Dinner
      carbs: m.carbs || "",
      fats: m.fats || "",
      proteins: m.proteins || "",
      totalCalories: m.totalCalories || "",
    })),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  return plan;
}
