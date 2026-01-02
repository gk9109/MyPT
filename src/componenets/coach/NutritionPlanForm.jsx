import { useState } from "react";
import { toast } from "react-toastify";

// What this component does:
// -> Allows a coach to build and edit a nutrition (diet) plan for a client.
// -> The coach can define multiple meals, each with macro targets.
// -> On submit, the full meals structure is passed back to the parent.
//
// Where it's used:
// -> Coach-side pages where a diet/nutrition plan is assigned to a client.
//
// Props:
// initialMeals (array, optional)
// -> Initial list of meals (e.g. when editing an existing plan).
// -> Currently not applied to state initialization, but kept for future use.
//
// onSave (function)
// -> Callback provided by the parent.
// -> Called with the final nutrition plan object: { meals }.
// -> Parent is responsible for saving it to Firestore.
//
// Notes:
// -> This component manages ONLY form state.
// -> It does not perform any database operations itself.
export default function NutritionPlanForm({ initialMeals = [], onSave }) {
  // Local form state:
  // -> Each item represents one meal in the nutrition plan
  const [meals, setMeals] = useState([
    { title: "Breakfast", carbs: "", fats: "", protein: "", calories: "" },
    { title: "Lunch", carbs: "", fats: "", protein: "", calories: "" },
    { title: "Dinner", carbs: "", fats: "", protein: "", calories: "" },
  ]);

  // Update a specific field for a specific meal
  // index -> which meal
  // field -> which property (carbs / fats / protein / calories / title)
  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  // Add a new empty meal block to the form
  const handleAddMeal = () => {
    setMeals([...meals, { title: "", carbs: "", fats: "", protein: "", calories: "" }]);
  };

  // Submit nutrition plan:
  // -> Prevent default form submit
  // -> Pass meals structure to parent
  // -> Show success/error feedback
  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      onSave({ meals });
      toast.success("Saved successfully"); 
    } catch (error) {
      toast.error("Something went wrong, try again"); 
    }
   
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="d-flex row justify-content-center">
        {/* Render one card per meal */}
        {meals.map((meal, i) => (
          <div key={i} className="card mb-3 p-3 shadow-sm">
            <label>Title:</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Meal name (Breakfast, Lunch, ...)"
              value={meal.name}
              onChange={(e) => handleMealChange(i, "name", e.target.value)}
            />
            {/* Carbs input */}
            <div className="col mt-3">
              <span>Carbs:</span>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Carbs"
                  value={meal.carbs}
                  onChange={(e) => handleMealChange(i, "carbs", e.target.value)}
                />
              </div>
              {/* Fats input */}
              <div className="col mt-3">
                <span>Fats:</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Fats"
                  value={meal.fats}
                  onChange={(e) => handleMealChange(i, "fats", e.target.value)}
                />
              </div>
              {/* Protein input */}
              <div className="col mt-3">
                <span>Protein:</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Proteins"
                  value={meal.proteins}
                  onChange={(e) => handleMealChange(i, "proteins", e.target.value)}
                />
              </div>
              {/* Calories input */}
              <div className="col mt-3">
                <span>Total Calories:</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Total Calories"
                  value={meal.totalCalories}
                  onChange={(e) => handleMealChange(i, "totalCalories", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        {/* Add another meal block */}
        <button type="button" className="btn btn-outline-primary mb-3" onClick={handleAddMeal}>
          + Add Meal
        </button>
        {/* Save full nutrition plan */}
        <button type="submit" className="btn btn-success">Save Diet Plan</button>
      </form>
    </div>
  );
}
