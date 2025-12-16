import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FoodSearchBar from "./FoodSearchBar";
import MealBank from "./MealBank";
import CustomMeals from "./customMeals";
import { useAuth } from "../../firebase/AuthContext";
import MealsToBeAdded from "./MealsToBeAdded";

export default function ProgressForm({ onSave, customMeals, onLiveMeals, onMealSaved }) {
  // --- State management for inputs ---
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [weight, setWeight] = useState("");
  const [meals, setMeals] = useState([{ name: "", items: "", calories: "", protein: "", carbs: "", fat: ""}]);
  const [loggedMeals, setLoggedMeals] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (onLiveMeals) {
      onLiveMeals(loggedMeals);  
    }
  }, [loggedMeals, onLiveMeals]);


  // --- Handlers ---
  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  // copy the array, add meal and setMeals()
  const addMeal = () => {
    setMeals([...meals, { name: "", items: "", calories: "", protein: "", carbs: "", fat: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // reduce -> calc the total values, reducing the array values to a single value -> sum
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

  const removeMeal = (index) => {
    const updated = [...meals];
    updated.splice(index, 1);
    setMeals(updated);
  };

  const removeLoggedMeal = (index) => {
    setLoggedMeals(prev => prev.filter((_, i) => i !== index));
  };

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
