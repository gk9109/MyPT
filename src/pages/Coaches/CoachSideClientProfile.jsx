import { useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import WorkoutPlan from "./WorkoutPlan";
import NutritionForm from "./NutritionPlan";
import WorkoutPlanList from "./WorkoutPlanList";
import NutritionPlanList from './NutritionPlanList'

export default function CoachSideClientProfile() {
  const { selectedClient } = useAuth();
  const [activeTab, setActiveTab] = useState("workout");

  if (!selectedClient) {
    return <p className="text-muted">No client selected</p>;
  }

  const {
    searchName,
    firstName,
    lastName,
    status,
  } = selectedClient;
   
  return (
    <div className="container">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="card-title mb-0">
              {searchName || `${firstName || ""} ${lastName || ""}`.trim() || "(Unnamed)"}
            </h3>
            {status && (
              <span
                className={`badge ${
                  status === "active" ? "bg-success" : "bg-secondary"
                }`}
              >
                {status}
              </span>
            )}
          </div>

          <div className="mb-3 p-3 d-flex justify-content-between border-bottom border-black">
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("workout")}>Workout</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Workout plan")}>Workout plan</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("diet")}>Diet</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Diet plan")}>Diet plan</button>
          </div>
            
          {activeTab === "workout" && <WorkoutPlan />}
          {activeTab === "diet" && <NutritionForm />}
          {activeTab === "Workout plan" && <WorkoutPlanList />}
          {activeTab === "Diet plan" && <NutritionPlanList />} 

          

        
        </div>
      </div>
    </div>
  );
}
