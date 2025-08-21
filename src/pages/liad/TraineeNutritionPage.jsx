import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';

export default function TraineeNutritionPage() {
  const [meals, setMeals] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, 'nutritionPlans', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setMeals(snap.data().meals);
      }
    };
    fetchData();
  }, []);

  if (!meals) return <p>לא הוזן תפריט עדיין</p>;

  const renderMeal = (title, data) => (
    <>
      <h3 style={{ marginTop: '20px' }}>{title}</h3>
      <table style={{ width: '100%', direction: 'rtl', textAlign: 'center', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>אוכל</th>
            <th>גרם</th>
            <th>חלבון</th>
            <th>סוכר</th>
            <th>קלוריות</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.food}</td>
              <td>{item.grams}</td>
              <td>{item.protein}</td>
              <td>{item.sugar}</td>
              <td>{item.calories}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>תפריט תזונה</h2>
      {renderMeal('בוקר', meals.breakfast || [])}
      {renderMeal('צהריים', meals.lunch || [])}
      {renderMeal('ערב', meals.dinner || [])}
    </div>
  );
}
