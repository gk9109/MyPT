import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { subId } from "../../Models/subscriptions";
import WorkoutPlanForm from "../../componenets/coach/WorkoutPlanForm";
import { useAuth } from "../../firebase/AuthContext";

export default function WorkoutPlanList({ coachUid, clientUid }) {
  const { user, selectedClient } = useAuth();
  const [plans, setPlans] = useState([]);

  // → Determine which IDs to use depending on who’s logged in
  // If coach is logged in, use user.uid (coach) and selectedClient.uid
  // If client is logged in, use selectedCoach.uid (from props) and user.uid
  const effectiveCoachUid = coachUid || (user?.role === "coach" ? user?.uid : null);
  const effectiveClientUid = clientUid || (user?.role === "client" ? user?.uid : selectedClient?.uid);

  // → Fetch workout plans from Firestore
  useEffect(() => {
    async function fetchPlans() {
      try {
        // → Get subcollection path for workout plans
        const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
        const workoutRef = collection(subRef, "workout");

        // → Fetch all workout plan documents
        const snap = await getDocs(workoutRef);

        // → Convert docs to plain JS objects
        const list = snap.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));

        setPlans(list);
      } catch (err) {
        console.log("Error fetching workout plans:", err);
      }
    }

    if (effectiveCoachUid && effectiveClientUid) {
      fetchPlans();
    }
  }, [effectiveCoachUid, effectiveClientUid]);

  // → Show fallback if no plans exist
  if (plans.length === 0) return <p>No workout plans found.</p>;

  return (
    <div>
      {/* → Map through all fetched plans */}
      {plans.map((plan) => (
        <div key={plan.docId} className="mb-4">
          <WorkoutPlanForm
            initialTitle={plan.title}
            initialExercises={plan.exercises}
            // → When user updates a plan, update the Firestore document
            onSave={async (updated) => {
              try {
                const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
                const planRef = doc(subRef, "workout", plan.docId);

                await updateDoc(planRef, {
                  ...updated,
                  updatedAt: new Date(),
                });

                console.log("Plan updated:", plan.docId);
              } catch (err) {
                console.error("Error updating plan:", err);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
