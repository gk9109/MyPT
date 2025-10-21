import { useState, useEffect } from "react";
import { useAuth } from "../../firebase/AuthContext";
import WorkoutPlan from "./WorkoutPlan";
import NutritionForm from "./NutritionPlan";
import WorkoutPlanList from "./WorkoutPlanList";
import NutritionPlanList from './NutritionPlanList'

export default function ClientSetUp() {
  const { selectedClient, setSelectedClient } = useAuth();
  const [activeTab, setActiveTab] = useState("Create Workout");

  // Restore selected client from localStorage if context is empty
  // this is making sure the you get the desired page on refresh and no the:
  // "no client selected" from the if check below
  useEffect(() => {
    if (!selectedClient) {
      const saved = localStorage.getItem("selectedClient");
      if (saved) {
        setSelectedClient(JSON.parse(saved));
      }
    }
  }, [selectedClient, setSelectedClient]);

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
            {/* set the active tab based on the button */}
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Create Workout")}>Create Workout</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Existing workout plans")}>Existing workout plans</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Create Diet")}>Create Diet</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Existing diet plans")}>Existing diet plans</button>
          </div>
          
          {activeTab === "Create Workout" && <WorkoutPlan />}
          {activeTab === "Create Diet" && <NutritionForm />}
          {activeTab === "Existing workout plans" && <WorkoutPlanList />}
          {activeTab === "Existing diet plans" && <NutritionPlanList />} 

          

        
        </div>
      </div>
    </div>
  );
}
