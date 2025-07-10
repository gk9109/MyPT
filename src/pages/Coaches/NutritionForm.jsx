import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../firebase/AuthContext';

const defaultMeal = { food: '', grams: '', protein: '', sugar: '', calories: '' };
const mealTimes = ['breakfast', 'lunch', 'dinner'];
const mealLabels = { breakfast: 'בוקר', lunch: 'צהריים', dinner: 'ערב' };

export default function NutritionForm() {
  const { currentUser } = useAuth();
  const [clientUID, setClientUID] = useState('');
  const [meals, setMeals] = useState({
    breakfast: [ { ...defaultMeal } ],
    lunch: [ { ...defaultMeal } ],
    dinner: [ { ...defaultMeal } ]
  });

  const handleInputChange = (time, index, field, value) => {
    const updated = { ...meals };
    updated[time][index][field] = value;
    setMeals(updated);
  };

  const addMealOption = (time) => {
    const updated = { ...meals };
    updated[time].push({ ...defaultMeal });
    setMeals(updated);
  };

  const saveNutritionPlan = async () => {
    if (!clientUID.trim()) return alert("הכנס UID של לקוח");
    const dataToSave = {
      coachId: currentUser?.uid || 'unknown',
      meals,
    };
    await setDoc(doc(db, "nutritionPlans", clientUID.trim()), dataToSave);
    alert("התפריט נשמר בהצלחה!");
  };

  const loadNutritionPlan = async () => {
    if (!clientUID.trim()) return;
    const snap = await getDoc(doc(db, "nutritionPlans", clientUID.trim()));
    if (snap.exists()) {
      const data = snap.data();
      setMeals(data.meals || {
        breakfast: [ { ...defaultMeal } ],
        lunch: [ { ...defaultMeal } ],
        dinner: [ { ...defaultMeal } ]
      });
    }
  };

  useEffect(() => {
    loadNutritionPlan();
  }, [clientUID]);

  return (
    <div className="p-8 direction-rtl text-right">
      <h1 className="text-3xl font-bold mb-4">הזנת תפריט ללקוח</h1>

      <label className="block mb-2 font-semibold">UID של לקוח</label>
      <input
        className="border rounded p-2 mb-6 w-full"
        placeholder="הכנס UID של לקוח"
        value={clientUID}
        onChange={e => setClientUID(e.target.value)}
      />

      {mealTimes.map(time => (
        <div key={time} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{mealLabels[time]}</h2>
          {meals[time].map((meal, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 mb-2">
              <input placeholder="מאכל" value={meal.food} onChange={e => handleInputChange(time, index, 'food', e.target.value)} className="border rounded p-2" />
              <input placeholder="גרם" value={meal.grams} onChange={e => handleInputChange(time, index, 'grams', e.target.value)} className="border rounded p-2" />
              <input placeholder="חלבון" value={meal.protein} onChange={e => handleInputChange(time, index, 'protein', e.target.value)} className="border rounded p-2" />
              <input placeholder="סוכר" value={meal.sugar} onChange={e => handleInputChange(time, index, 'sugar', e.target.value)} className="border rounded p-2" />
              <input placeholder="קלוריות" value={meal.calories} onChange={e => handleInputChange(time, index, 'calories', e.target.value)} className="border rounded p-2" />
            </div>
          ))}
          <button onClick={() => addMealOption(time)} className="bg-blue-100 text-blue-800 px-4 py-1 rounded">הוסף אופציה לארוחה</button>
        </div>
      ))}

      <button onClick={saveNutritionPlan} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        שמור תפריט
      </button>
    </div>
  );
}