import React, { useState } from "react";
import WorkoutPlanList from "../Coaches/WorkoutPlanList";
import NutritionPlanList from "../Coaches/NutritionPlanList";
import { useAuth } from "../../firebase/AuthContext";

// MyPlans
// What this component does:
// -> Displays the logged-in client's assigned plans.
// -> Allows switching between Workout Plans and Diet Plans using tabs.
// -> Passes coachUid + clientUid down to plan list components.
//
// Where it's used:
// -> Client side after selecting a coach.
// -> Visible to clients who are linked to a coach.
//
// Notes:
// -> Coach data usually comes from AuthContext (selectedCoach).
// -> Falls back to localStorage if context is not yet available.
// -> Actual Firestore fetching is handled inside the child list components.
export default function MyPlans() {
  // Controls which tab is currently active ("workout" | "diet")
  const [activeTab, setActiveTab] = useState("workout");
  // Global auth data
  const { user, selectedCoach } = useAuth();

  // Coach info:
  // -> Prefer AuthContext value.
  // -> Fallback to localStorage in case of refresh or direct navigation.
  const coach = selectedCoach || JSON.parse(localStorage.getItem("selectedCoach"));

  // UIDs used by Firestore service functions in child components
  const coachUid = coach?.uid;
  const clientUid = user?.uid;

  return (
    <div className="container border card p-3" id="my plans">
      <h4>My Plans</h4>

      {/* Tabs for switching between plan types */}
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

      {/* Render workout plans when workout tab is active */}
      {activeTab === "workout" && coachUid && clientUid && (
        <WorkoutPlanList coachUid={coachUid} clientUid={clientUid} />
      )}
      {/* Render workout plans when diet tab is active */}
      {activeTab === "diet" && coachUid && clientUid && (
        <NutritionPlanList coachUid={coachUid} clientUid={clientUid} />
      )}

      {/* Fallback if no coach is linked to the client */}
      {!coachUid && (
        <p className="text-muted mt-3">
          No coach linked. Please contact your coach to view plans.
        </p>
      )}
    </div>
  );
}
