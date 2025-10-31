import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Button } from "react-bootstrap"; // optional if you use Bootstrap

export default function ProgressForm({ onSave }) {
  // --- State management for inputs ---
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [weight, setWeight] = useState("");
  const [meals, setMeals] = useState([{ name: "", items: "", calories: "" }]);
  const [notes, setNotes] = useState("");

  // --- Handlers ---
  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  // copy the array, add meal and setMeals()
  const addMeal = () => {
    setMeals([...meals, { name: "", items: "", calories: "" }]);
  };

 //   const removeMeal = (index) => {
 //     const updated = meals.filter((_, i) => i !== index);
 //     setMeals(updated);
 //   };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate total calories
    const totalCalories = meals.reduce(
      (sum, m) => sum + Number(m.calories || 0),
      0
    );

    const progressEntry = {
      date,
      //converting to number
      weight: Number(weight),
      meals,
      totalCalories,
      notes,
      createdAt: serverTimestamp()
    };

    if (onSave) onSave(progressEntry); // send to parent (ClientProfilePage)
    
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="progress-form container p-3">
      <h3 className="mb-3">Daily Progress</h3>

      <div className="mb-3">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="form-control"
        />
      </div>

      <h5 className="mt-4">Meals ADD API</h5>
      {meals.map((meal, index) => (
        <div key={index} className="meal-block border p-2 rounded mb-2">
          <input
            type="text"
            placeholder="Meal name (Breakfast, Lunch...)"
            value={meal.name}
            onChange={(e) =>
              handleMealChange(index, "name", e.target.value)
            }
            className="form-control mb-1"
          />
          <input
            type="text"
            placeholder="Food items"
            value={meal.items}
            onChange={(e) =>
              handleMealChange(index, "items", e.target.value)
            }
            className="form-control mb-1"
          />
          <input
            type="number"
            placeholder="Calories"
            value={meal.calories}
            onChange={(e) =>
              handleMealChange(index, "calories", e.target.value)
            }
            className="form-control mb-1"
          />

          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => removeMeal(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button variant="outline-primary" type="button" onClick={addMeal}>
        + Add Meal
      </Button>

      <div className="mt-3 mb-3">
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="form-control"
          rows={3}
          placeholder="How was your day? Workout, trip, etc..."
        ></textarea>
      </div>

      <Button variant="success" type="submit">
        Save Progress
      </Button>
    </form>
  );
}
