import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { subId } from "../../Services/subscriptions";
import { useAuth } from "../../firebase/AuthContext";
import NutritionPlanForm from "../../componenets/coach/NutritionPlanForm";

// NutritionPlanList
// What this component does:
// -> Fetches and displays existing diet plans for a coach-client relationship.
// -> Supports BOTH coach view and client view using flexible UID resolution.
// -> Allows updating existing diet plans via NutritionPlanForm.
//
// Where it's used:
// -> Coach side: ClientSetUp → "Existing diet plans"
// -> Client side: MyPlans → NutritionPlanList
//
// Notes:
// -> Firestore structure:
//    subscriptions/{subscriptionId}/diet/{planId}
// -> subscriptionId is derived from coachUid + clientUid using subId().
export default function NutritionPlanList({ coachUid, clientUid }) {
  const { user, selectedClient } = useAuth();
  // All fetched diet plans
  const [plans, setPlans] = useState([]);

  // Determine which UIDs to use
  //
  // Coach logged in:
  // -> coachUid = user.uid
  // -> clientUid = selectedClient.uid
  //
  // Client logged in:
  // -> coachUid comes from props (passed from MyPlans)
  // -> clientUid = user.uid
  const effectiveCoachUid = coachUid || (user?.role === "coach" ? user?.uid : null);
  const effectiveClientUid = clientUid || (user?.role === "client" ? user?.uid : selectedClient?.uid);

  // Fetch diet plans from Firestore
  useEffect(() => {
    async function fetchPlans() {
      try {
        // doc(db, "subscriptions", subscriptionId)
        // -> Reference to the coach-client subscription document
        const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
        // collection(docRef, "diet")
        // -> Reference to the "diet" subcollection under this subscription
        const dietRef = collection(subRef, "diet");

        // getDocs(collectionRef)
        // -> Fetches ALL diet plan documents
        // -> Returns: QuerySnapshot
        const snap = await getDocs(dietRef);

        // Convert Firestore docs to plain JS objects
        const list = snap.docs.map((d) => ({
          docId: d.id, // Firestore document ID
          ...d.data(), // plan fields (meals, macros, timestamps, etc.)
        }));

        setPlans(list);
      } catch (err) {
        console.error("Error fetching diet plans:", err);
      }
    }

    // Guard: only fetch when both UIDs are known
    if (effectiveCoachUid && effectiveClientUid) {
      fetchPlans();
    }
  }, [effectiveCoachUid, effectiveClientUid]);

  // Fallback UI when no diet plans exist
  if (plans.length === 0) return <p>No diet plans found.</p>;

  return (
    <div>
      {/* Render each existing diet plan */}
      {plans.map((plan) => (
        <div key={plan.docId} className="mb-4">
          <NutritionPlanForm
            initialMeals={plan.meals}
            // Called when a plan is edited and saved
            onSave={async (updated) => {
              try {
                // Reference to this specific diet plan document
                const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
                const planRef = doc(subRef, "diet", plan.docId);

                // updateDoc(docRef, data)
                // -> Updates only the provided fields in Firestore
                // -> Returns: Promise<void>
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
