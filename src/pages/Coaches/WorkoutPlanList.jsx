import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { subId } from "../../Models/subscriptions";
import WorkoutPlanForm from "../../componenets/coach/WorkoutPlanForm";
import { useAuth } from "../../firebase/AuthContext";

export default function WorkoutPlanList() {
  const { user, selectedClient } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const subRef = doc(db, "subscriptions", subId(user.uid, selectedClient.uid));
        const workoutRef = collection(subRef, "workout");
        const snap = await getDocs(workoutRef);

        // map docs into plain JS objects
        const list = snap.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));

        setPlans(list);
      } catch (error) {
        console.log("Error fetching workout plans:", error);
      }
    }

    if (user?.uid && selectedClient?.uid) {
      fetchPlans();
    }
  }, [user?.uid, selectedClient?.uid]);

  return (
    <div>
      {plans.length === 0 && <p>No workout plans found.</p>}

      {plans.map((plan) => (
        <div key={plan.docId} className="mb-4">
          <WorkoutPlanForm
            initialTitle={plan.title}
            initialExercises={plan.exercises}
            onSave={async (updated) => {
              try {
                const subRef = doc(db, "subscriptions", subId(user.uid, selectedClient.uid));
                const planRef = doc(subRef, "workout", plan.docId);

                await updateDoc(planRef, { ...updated, updatedAt: new Date(),});

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
