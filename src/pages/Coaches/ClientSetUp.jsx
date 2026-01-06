import { useState, useEffect } from "react";
import { useAuth } from "../../firebase/AuthContext";
import WorkoutPlan from "./WorkoutPlan";
import NutritionForm from "./NutritionPlan";
import WorkoutPlanList from "./WorkoutPlanList";
import NutritionPlanList from './NutritionPlanList'

// ClientSetUp
// What this component does:
// -> Coach-facing page for managing a specific client.
// -> Allows creating new workout/diet plans.
// -> Allows viewing existing workout/diet plans.
// -> Uses tab-like buttons to switch between sections.
//
// Where it's used:
// -> Coach routes/pages (client management / setup).
//
// Notes:
// -> Relies on selectedClient from AuthContext.
// -> Restores selectedClient from localStorage on refresh.
export default function ClientSetUp() {
  const { selectedClient, setSelectedClient } = useAuth();
  // Controls which section/tab is currently displayed
  const [activeTab, setActiveTab] = useState("Create Workout");

  // Restore selected client from localStorage if context is empty
  // -> Handles page refresh or direct navigation
  // -> Prevents showing "No client selected" after refresh
  useEffect(() => {
    if (!selectedClient) {
      const saved = localStorage.getItem("selectedClient");
      if (saved) {
        setSelectedClient(JSON.parse(saved));
      }
    }
  }, [selectedClient, setSelectedClient]);

  // Guard: no client selected
  if (!selectedClient) {
    return <p className="text-muted">No client selected</p>;
  }

  // Client display data
  const { searchName, firstName, lastName, status } = selectedClient;
   
  return (
    <div className="container">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Client header (name + status badge) */}
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
          {/* Navigation tabs */}
          <div className="mb-3 p-3 d-flex justify-content-between border-bottom border-black">
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Create Workout")}>Create Workout</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Existing workout plans")}>Existing workout plans</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Create Diet")}>Create Diet</button>
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("Existing diet plans")}>Existing diet plans</button>
          </div>
          {/* Tab content */}
          {activeTab === "Create Workout" && <WorkoutPlan />}
          {activeTab === "Create Diet" && <NutritionForm />}
          {activeTab === "Existing workout plans" && <WorkoutPlanList />}
          {activeTab === "Existing diet plans" && <NutritionPlanList />} 

          

        
        </div>
      </div>
    </div>
  );
}
