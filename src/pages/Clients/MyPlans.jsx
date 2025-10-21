import React, { useState } from "react";
import WorkoutPlanList from "../Coaches/WorkoutPlanList";
import NutritionPlanList from "../Coaches/NutritionPlanList";
import { useAuth } from "../../firebase/AuthContext";

export default function MyPlans() {
  // track which tab is active (workout or diet)
  const [activeTab, setActiveTab] = useState("workout");
  const { user, selectedCoach } = useAuth();

  // if we don’t have coach info yet, try to fetch from localStorage (optional)
  const coach = selectedCoach || JSON.parse(localStorage.getItem("selectedCoach"));

  // UIDs used to fetch from Firestore
  const coachUid = coach?.uid;
  const clientUid = user?.uid;

  return (
    <div className="container border card p-3">
      <h4>My Plans</h4>

      {/* Tabs */}
      <div className="mb-3 d-flex justify-content-between border-bottom border-black pb-2">
        <button
          className={`btn btn-outline-primary ${activeTab === "workout" ? "active" : ""}`}
          onClick={() => setActiveTab("workout")}
        >
          Workout Plans
        </button>

        <button
          className={`btn btn-outline-primary ${activeTab === "diet" ? "active" : ""}`}
          onClick={() => setActiveTab("diet")}
        >
          Diet Plans
        </button>
      </div>

      {/* Render the right plan list depending on active tab */}
      {activeTab === "workout" && coachUid && clientUid && (
        <WorkoutPlanList coachUid={coachUid} clientUid={clientUid} />
      )}

      {activeTab === "diet" && coachUid && clientUid && (
        <NutritionPlanList coachUid={coachUid} clientUid={clientUid} />
      )}

      {/* Optional fallback if coach data missing */}
      {!coachUid && (
        <p className="text-muted mt-3">
          No coach linked. Please contact your coach to view plans.
        </p>
      )}
    </div>
  );
}
