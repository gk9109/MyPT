import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { subId } from "../../Services/subscriptions";
import { useAuth } from "../../firebase/AuthContext";
import NutritionPlanForm from "../../componenets/coach/NutritionPlanForm";

export default function NutritionPlanList({ coachUid, clientUid }) {
  const { user, selectedClient } = useAuth();
  const [plans, setPlans] = useState([]);

  // → Determine which UIDs to use
  // Coach logged in → use user.uid (coach) and selectedClient.uid
  // Client logged in → use selectedCoach (prop) and user.uid
  const effectiveCoachUid = coachUid || (user?.role === "coach" ? user?.uid : null);
  const effectiveClientUid = clientUid || (user?.role === "client" ? user?.uid : selectedClient?.uid);

  // → Fetch diet plans from Firestore
  useEffect(() => {
    async function fetchPlans() {
      try {
        // → Reference to this subscription's diet plans subcollection
        const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
        const dietRef = collection(subRef, "diet");

        // → Get all plan documents
        const snap = await getDocs(dietRef);

        // → Convert Firestore docs to plain JS objects
        const list = snap.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));

        setPlans(list);
      } catch (err) {
        console.error("Error fetching diet plans:", err);
      }
    }

    if (effectiveCoachUid && effectiveClientUid) {
      fetchPlans();
    }
  }, [effectiveCoachUid, effectiveClientUid]);

  // → Fallback if no plans exist
  if (plans.length === 0) return <p>No diet plans found.</p>;

  return (
    <div>
      {/* → Render each fetched diet plan */}
      {plans.map((plan) => (
        <div key={plan.docId} className="mb-4">
          <NutritionPlanForm
            initialMeals={plan.meals}
            // → When updated, save changes to Firestore
            onSave={async (updated) => {
              try {
                const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
                const planRef = doc(subRef, "diet", plan.docId);

                await updateDoc(planRef, {
                  ...updated,
                  updatedAt: new Date(),
                });

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
