import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { subId } from "../../Models/subscriptions";
import { useAuth } from "../../firebase/AuthContext";
import NutritionPlanForm from "../../componenets/coach/NutritionPlanForm";

export default function NutritionPlanList() {
  const { user, selectedClient } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const subRef = doc(db, "subscriptions", subId(user.uid, selectedClient.uid));
        const dietRef = collection(subRef, "diet");
        const snap = await getDocs(dietRef);
        const list = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));
        setPlans(list);
        console.log("Fetched diet plans:", list);
      } catch (err) {
        console.error("Error fetching diet plans:", err);
      }
    }

    if (user?.uid && selectedClient?.uid) {
      fetchPlans();
    }
  }, [user?.uid, selectedClient?.uid]);


  return (
    <div>
      {plans.length === 0 && <p>No diet plans found.</p>}
      {plans.map((plan) => (
        <div key={plan.docId} className="mb-4">
          <NutritionPlanForm 
            initialMeals={plan.meals}
            onSave={async (updated) => {
              try {
                const subRef = doc(db, "subscriptions", subId(user.uid, selectedClient.uid));
                const planRef = doc(subRef, "diet", plan.docId);
                await updateDoc(planRef, { ...updated, updatedAt: new Date() });
                console.log("Diet plan updated:", plan.docId);
              } catch (err) {
                console.error("Error updating diet plan:", err);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
