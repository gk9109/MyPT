import React, { useEffect, useState } from 'react'
import { useAuth } from '../../firebase/AuthContext';

export default function NutritionPlans() {
    const [plans, setPlans] = useState([]);
    const { user, coach } = useAuth();

    useEffect(async() => {
      try {
        const subRef = doc(db, "subscriptions", subId(user.uid, selectedClient.uid));
        const diettRef = collection(subRef, "diet");
        const snap = await getDocs(diettRef);

        // map docs into plain JS objects
        const list = snap.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));

        setPlans(list);
      } catch (error) {
        console.log("Error fetching diet plans:", error);
      }
    })

  return (
    <div>

    </div>
  )
}
