import { addMealToBank } from '../../Services/mealBank';
import { useAuth } from "../../firebase/AuthContext";


export default function CustomMeals({ meals, onMealChange, onAddMeal, onRemoveMeal }) {

    const { user } = useAuth();
    const uid = user.uid;


  // this function saves a single meal (by index) into the mealBank collection
  const saveMealToBank = async (meal) => {
    try {
      // basic validation -> no empty names allowed
      if (!meal.name.trim()) {
        alert("Please give the meal a name before saving.");
        return;
      }

      // calling our firestore function that creates the subcollection if needed
      await addMealToBank(uid, meal);

      alert(`Meal "${meal.name}" saved to your bank.`);
    } catch (err) {
      console.log("error saving meal:", err);
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
