import { useAuth } from "../../firebase/AuthContext";
import { addWorkoutPlan } from "../../Services/plans";
import WorkoutPlanForm from "../../componenets/coach/WorkoutPlanForm";

export default function WorkoutPlan() {
  const { selectedClient, user } = useAuth();

  const handleSave = (plan) => {
    addWorkoutPlan(user.uid, selectedClient.uid, {
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Workout plan saved!", plan);
  };

  return (
    <div className="container py-4">
      <WorkoutPlanForm onSave={handleSave} />
    </div>
  );
}
