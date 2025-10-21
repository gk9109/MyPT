import { useState } from "react";

export default function NutritionPlanForm({ initialMeals = [], onSave }) {
  const [meals, setMeals] = useState([
  { title: "Breakfast", carbs: "", fats: "", protein: "", calories: "" },
  { title: "Lunch", carbs: "", fats: "", protein: "", calories: "" },
  { title: "Dinner", carbs: "", fats: "", protein: "", calories: "" },
]);


  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const handleAddMeal = () => {
    setMeals([...meals, { title: "", carbs: "", fats: "", protein: "", calories: "" }]);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ meals });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="d-flex row justify-content-center">
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
              {/* <div className="d-flex justify-content-center mt-3">
                
              </div> */}
               
            </div>
          </div>
        ))}
        
        <button type="button" className="btn btn-outline-primary mb-3" onClick={handleAddMeal}>
          + Add Meal
        </button>

        <button type="submit" className="btn btn-success">Save Diet Plan</button>
      </form>
    </div>
  );
}
