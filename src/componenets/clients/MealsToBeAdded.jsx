

// MealsToBeAdded
// -> shows the list of meals the user selected for today before they click "Save Progress".

// Props:
// meals    - array of meal objects to preview (comes from parent state)
// onRemove - callback to remove a meal by index from that list
export default function MealsToBeAdded({ meals, onRemove }) {
  // if there are no meals, just show a small message and exit
  if (!meals || meals.length === 0) {
    return (
      <div className="text-muted small mt-3">
        No meals added yet.
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h6>Meals To Be Added</h6>
      <ul className="list-group">
        {meals.map((meal, index) => (
          <li 
            key={index} 
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              {meal.name}
              <span className="text-muted small ms-2">
                {meal.calories} kcal
              </span>
            </div>

            {/* remove this meal from the list (via parent callback) */}
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemove(index)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
