import { useAuth } from "../../firebase/AuthContext";
import { addWorkoutPlan } from "../../Services/plans";
import WorkoutPlanForm from "../../componenets/coach/WorkoutPlanForm";

// WorkoutPlan
// What this component does:
// -> Coach-side page for creating a workout plan for the selected client.
// -> Receives plan data from WorkoutPlanForm and saves it to Firestore.
//
// Where it's used:
// -> Coach routes/pages (create workout plan).
// -> Also rendered inside ClientSetUp under "Create Workout".
//
// Notes:
// -> selectedClient comes from AuthContext (or restored from localStorage).
// -> Firestore write logic is handled by Services/plans.js (addWorkoutPlan).
export default function WorkoutPlan() {
  // Logged-in coach + currently selected client
  const { selectedClient, user } = useAuth();

  // Called by WorkoutPlanForm when the coach saves a new plan
  const handleSave = (plan) => {
    try {
      // addWorkoutPlan(coachUid, clientUid, planData)
    // -> Service function that creates a workout plan in Firestore
    // -> Stored under the coach-client relationship (subscriptions or plans collection)
    addWorkoutPlan(user.uid, selectedClient.uid, {
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Workout plan saved!", plan);
    } catch (error) {
      console.log("error:", error);
    }
    
  };

  return (
    <div className="container py-4">
      {/* WorkoutPlanForm:
        -> Handles the workout plan UI and input state
        -> Calls onSave(plan) when the form is submitted */}
      <WorkoutPlanForm onSave={handleSave} />
    </div>
  );
}
