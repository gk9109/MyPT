import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { subId } from "../../Models/subscriptions";
import WorkoutPlanForm from "../../componenets/coach/WorkoutPlanForm";
import { useAuth } from "../../firebase/AuthContext";
import WorkoutPlanDisplay from "../../componenets/clients/WorkoutPlanDisplay";
import { getCoachVideos } from "../../Services/videos";

// Fetching client plans and coach videos, passing them down to other components 

export default function WorkoutPlanList({ coachUid, clientUid }) {
  const { user, selectedClient } = useAuth();
  const [plans, setPlans] = useState([]);
  const [coachVideos, setCoachVideos] = useState([]);

  // Determine which IDs to use depending on who’s logged in
  // If coach is logged in, use user.uid (coach) and selectedClient.uid
  // If client is logged in, use selectedCoach.uid (from props) and user.uid
  const effectiveCoachUid = coachUid || (user?.role === "coach" ? user?.uid : null);
  const effectiveClientUid = clientUid || (user?.role === "client" ? user?.uid : selectedClient?.uid);

  // Fetch workout plans from Firestore
  useEffect(() => {
    async function fetchPlans() {
      try {
        // Get subcollection path for workout plans
        const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
        const workoutRef = collection(subRef, "workout");

        // Fetch all workout plan documents
        const snap = await getDocs(workoutRef);

        // Convert docs to plain JS objects
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

  // Fetching coach videos to pass to them down  
  useEffect(() => {
    async function fetchVideos() {
      try {
        if (!effectiveCoachUid) return;
        const vids = await getCoachVideos(effectiveCoachUid);
        setCoachVideos(vids);
      } catch (err) {
        console.log("Error fetching coach videos:", err);
      }
    }

    fetchVideos();
  }, [effectiveCoachUid]);


  // Show fallback if no plans exist
  if (plans.length === 0) return <p>No workout plans found.</p>;

  return (
    <div id="workout plan list">
      {plans.length === 0 ? (
        <p>No workout plans found.</p>
      ) : user.role === "coach" ? (
        // COACH VIEW — can edit and save
        plans.map((plan) => (
          <div key={plan.docId} className="mb-4" id="workout list">
            <WorkoutPlanForm
              initialTitle={plan.title}
              initialExercises={plan.exercises}
              coachVideos={coachVideos} // will be used later for suggestions
              onSave={async (updated) => {
                try {
                  const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
                  const planRef = doc(subRef, "workout", plan.docId);

                  await updateDoc(planRef, {
                    ...updated,
                    updatedAt: new Date(),
                  });

                  console.log("Plan updated:", plan.docId);
                  // toast.success("Updated successfully"); 
                } catch (err) {
                  console.error("Error updating plan:", err);
                  // toast.error("Something went wrong, try again"); 
                }
              }}
            />
          </div>
        ))
      ) : (
        // CLIENT VIEW — can see and mark progress
        plans.map((plan) => (
          <div key={plan.docId} className="mb-4" id="workout list">
            <WorkoutPlanDisplay
              title={plan.title}
              exercises={plan.exercises}
              coachVideos={coachVideos} // pasing for client view
            />
          </div>
        ))
      )}
    </div>
);

}
