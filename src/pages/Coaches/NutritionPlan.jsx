import { useAuth } from "../../firebase/AuthContext";
import { addDietPlan } from "../../Services/plans";
import NutritionPlanForm from "../../componenets/coach/NutritionPlanForm";

// NutritionPlan
// What this component does:
// -> Coach-side page for creating a diet plan for the selected client.
// -> Receives plan data from NutritionPlanForm and saves it to Firestore (via Services).
//
// Where it's used:
// -> Coach routes/pages (create diet plan).
// -> Also used inside ClientSetUp tabs as "Create Diet".
//
// Notes:
// -> selectedClient comes from AuthContext (or localStorage restore in ClientSetUp).
// -> Firestore write logic is in Services/plans.js (addDietPlan).
export default function NutritionPlan() {
  // Logged-in coach + the client currently selected by the coach
  const { user, selectedClient } = useAuth();

  // Called by NutritionPlanForm when user clicks Save
  const handleSave = (plan) => {
    // addDietPlan(coachUid, clientUid, planData)
    // -> Service function that writes a diet plan into Firestore
    // -> Usually stored under: subscriptions/{subId}/diet or similar (depends on your schema)
    // -> Returns: Promise (you can await if you want toast/error handling)
    addDietPlan(user.uid, selectedClient.uid, {
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Diet plan saved!", plan);
  };

  return (
    <div className="container py-4">
      {/* NutritionPlanForm handles the UI + input state.
        It calls onSave(plan) when the coach submits. */}
      <NutritionPlanForm onSave={handleSave} />
    </div>
  );
}
