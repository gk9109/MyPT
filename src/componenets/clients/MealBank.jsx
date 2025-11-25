import { Button } from "react-bootstrap";

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
          key={meal.id}
          className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{meal.name}</strong>
            <div className="small text-muted">
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
