import { Button } from "react-bootstrap";

// MealBank
// -> shows the list of saved custom meals for the current user.
// -> lets the user add one of these meals into today's progress.

// props:
// customMeals - array of meal objects saved in the meal bank (comes from parent)
// onAddMeal   - callback from parent, called when the user clicks "Add" on a meal

export default function MealBank({ customMeals = [], onAddMeal }) {
  return (
    <div className="mt-4">
      <h5>Meal Bank</h5>

      {/* If no saved meals */}
      {customMeals.length === 0 && (
        <p className="text-muted">No saved meals yet.</p>
      )}

      {/* List saved meals */}
      {customMeals.map((meal) => (
        <div
          key={meal.id} // used to identify each individual meal
          className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{meal.name}</strong>
            <div className="small text-muted">
              {/* meal info */}
              {meal.calories} kcal — Protein:{meal.protein} Carbs:{meal.carbs} Fat:{meal.fat} 
            </div>
          </div>

          <Button 
            variant="outline-success"
            size="sm"
            onClick={() => onAddMeal(meal)}
          >
            Add
          </Button>
        </div>
      ))}
    </div>
  );
}
