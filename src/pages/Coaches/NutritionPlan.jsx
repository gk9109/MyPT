import { useAuth } from "../../firebase/AuthContext";
import { addDietPlan } from "../../Services/plans";
import NutritionPlanForm from "../../componenets/coach/NutritionPlanForm";

export default function NutritionPlan() {
  const { user, selectedClient } = useAuth();

  const handleSave = (plan) => {
    addDietPlan(user.uid, selectedClient.uid, {
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Diet plan saved!", plan);
  };

  return (
    <div className="container py-4">
      <NutritionPlanForm onSave={handleSave} />
    </div>
  );
}
