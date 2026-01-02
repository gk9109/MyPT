import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import MealBank from "./MealBank";
import CustomMeals from "./customMeals";
import { useAuth } from "../../firebase/AuthContext";
import MealsToBeAdded from "./MealsToBeAdded";

// ProgressForm.jsx
// -> Lets a client log daily progress (date + weight + meals) and submit it as ONE progressEntry object.
// Used in:
// -> ClientProfilePage (the parent page passes callbacks like onSave / onLiveMeals).
//
// Data flow summary:
// -> User picks meals (from CustomMeals + MealBank) -> we collect them into loggedMeals
// -> On submit: we calculate totals from loggedMeals -> build progressEntry -> send to parent via onSave()
//
// Props:
// onSave(progressEntry)
// -> Parent handles the actual "save to Firestore" (this component only builds the entry).
//
// customMeals
// -> List of saved meals (passed down into MealBank so the client can quickly pick meals).
//
// onLiveMeals(loggedMeals)
// -> "Live / reactive" hook for the parent so charts can update BEFORE saving to Firestore.
//
// onMealSaved(meal)
// -> Callback used by CustomMeals when a new custom meal is saved (so parent can refresh customMeals).

export default function ProgressForm({ onSave, customMeals, onLiveMeals, onMealSaved }) {
  // --- State management for inputs ---
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [weight, setWeight] = useState("");
  // meals = the editable inputs inside CustomMeals (draft meals before saving into bank)
  const [meals, setMeals] = useState([{ name: "", items: "", calories: "", protein: "", carbs: "", fat: ""}]);
  // loggedMeals = meals the user has ACTUALLY chosen for today (from bank / custom meals)
  const [loggedMeals, setLoggedMeals] = useState([]); 
  const { user } = useAuth();

  // Runs whenever loggedMeals changes:
  // -> gives parent the latest loggedMeals so charts/UI can update instantly
  useEffect(() => {
    if (onLiveMeals) {
      onLiveMeals(loggedMeals);  
    }
  }, [loggedMeals, onLiveMeals]);

  // Updates a single field in a single draft meal (CustomMeals inputs)
  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  // Adds another empty draft meal row (CustomMeals inputs)
  const addMeal = () => {
    setMeals([...meals, { name: "", items: "", calories: "", protein: "", carbs: "", fat: "" }]);
  };

  // Submit:
  // -> calculate totals from loggedMeals (not from draft "meals")
  // -> build progressEntry in the exact shape we want saved
  // -> hand it to the parent (parent does Firestore)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Reduce = "sum everything into one number"
    // Number(...) ensures numeric addition instead of string concatenation
    const totalCalories = loggedMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
    const totalProtein = loggedMeals.reduce((sum, m) => sum + Number(m.protein || 0), 0);
    const totalCarbs = loggedMeals.reduce((sum, m) => sum + Number(m.carbs || 0), 0);
    const totalFat = loggedMeals.reduce((sum, m) => sum + Number(m.fat || 0), 0);

    const progressEntry = {
      date,    
      weight: Number(weight), // converting to number
      meals: loggedMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      createdAt: serverTimestamp()
    };

    if (onSave) onSave(progressEntry); // send to parent (ClientProfilePage)
    
  };

  // Removes a draft meal row (CustomMeals inputs)
  const removeMeal = (index) => {
    const updated = [...meals];
    updated.splice(index, 1);
    setMeals(updated);
  };

  // Removes a meal the user already added to "today's loggedMeals"
  const removeLoggedMeal = (index) => {
    setLoggedMeals(prev => prev.filter((_, i) => i !== index));
  };

  // Called when user picks a meal from MealBank
  // -> append to loggedMeals (today’s meals list)
  const handleAddMealFromBank = (meal) => {
    setLoggedMeals((prev) => [...prev, meal]);
    console.log("meal added to bank")
  };

  return (
    <form onSubmit={handleSubmit} className="progress-form container p-3">
      <h3 className="mb-3">Daily Progress - {user.searchName}</h3>

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

      <CustomMeals
        meals={meals}
        onMealChange={handleMealChange}
        onAddMeal={addMeal}
        onRemoveMeal={removeMeal}
        onMealSaved={onMealSaved}
      />

      <div className="mt-3 mb-3">
        <MealBank customMeals={customMeals} onAddMeal={handleAddMealFromBank}/>
      </div>

      <div className="mt-3 mb-3">
        <MealsToBeAdded meals={loggedMeals} onRemove={removeLoggedMeal}/>
      </div>

      <Button variant="success" type="submit">
        Save Progress
      </Button>
    </form>
  );
}
