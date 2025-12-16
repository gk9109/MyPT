import { addMealToBank } from '../../Services/mealBank';
import { useAuth } from "../../firebase/AuthContext";
import { toast } from "react-toastify";

export default function CustomMeals({ meals, onMealChange, onAddMeal, onRemoveMeal, onMealSaved }) {

  const { user } = useAuth();
  const uid = user.uid;


  // this function saves a single meal (by index) into the mealBank collection
  const saveMealToBank = async (meal) => {
    try {
      // basic validation -> no empty names allowed
      if (!meal.name.trim()) {
        toast.error("Please make sure the meal has a name and data.");
        return;
      }

      // calling our firestore function that creates the subcollection if needed
      await addMealToBank(uid, meal);
      toast.success("Meal saved successfully");

      // also update local state in ClientProfilePage so Meal Bank updates instantly
      if (onMealSaved) {
        const mealForState = {
          ...meal,
          // temporary id for React key; Firestore id will be used next reload
          id: Date.now().toString(),
        };
        onMealSaved(mealForState);
      }

    } catch (err) {
      console.log("error saving meal:", err);
      toast.error("Something went wrong, try again");
    }
  };

  return (
    <div id="custom-meals">
      <h5 className="mt-4">Custom Meals</h5>

      {meals.map((meal, index) => (
        <div key={index} className="meal-block border p-2 rounded mb-2">

          {/* name */}
          <input
            type="text"
            placeholder="Meal name"
            value={meal.name}
            onChange={(e) => onMealChange(index, "name", e.target.value)}
            className="form-control mb-1"
          />

          {/* items description */}
          <input
            type="text"
            placeholder="Food items"
            value={meal.items}
            onChange={(e) => onMealChange(index, "items", e.target.value)}
            className="form-control mb-1"
          />

          {/* calories */}
          <input
            type="number"
            placeholder="Calories"
            value={meal.calories}
            onChange={(e) => onMealChange(index, "calories", e.target.value)}
            className="form-control mb-1"
          />

          {/* macros */}
          <input
            type="number"
            placeholder="Protein (g)"
            value={meal.protein}
            onChange={(e) => onMealChange(index, "protein", e.target.value)}
            className="form-control mb-1"
          />

          <input
            type="number"
            placeholder="Carbs (g)"
            value={meal.carbs}
            onChange={(e) => onMealChange(index, "carbs", e.target.value)}
            className="form-control mb-1"
          />

          <input
            type="number"
            placeholder="Fat (g)"
            value={meal.fat}
            onChange={(e) => onMealChange(index, "fat", e.target.value)}
            className="form-control mb-1"
          />

          {/* action buttons */}
          <div className='d-flex justify-content-between'>

            {/* save this meal to bank */}
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => saveMealToBank(meal)}   // <-- correctly called
            >
              Save to Bank
            </button>

            {/* remove from local list */}
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onRemoveMeal(index)}
            >
              Remove
            </button>

          </div>

        </div>
      ))}

      {/* add a new empty meal block */}
      <button
        type="button"
        className='btn btn-outline-primary'
        onClick={onAddMeal}
      >
        + Add Meal
      </button>
    </div>
  );
}
