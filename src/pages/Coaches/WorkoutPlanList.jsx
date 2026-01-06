import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { subId } from "../../Services/subscriptions";
import WorkoutPlanForm from "../../componenets/coach/WorkoutPlanForm";
import { useAuth } from "../../firebase/AuthContext";
import WorkoutPlanDisplay from "../../componenets/clients/WorkoutPlanDisplay";
import { getCoachVideos } from "../../Services/videos";

// WorkoutPlanList
// What this component does:
// -> Fetches and displays workout plans for a coach-client relationship.
// -> Supports BOTH coach view (edit plans) and client view (view plans + progress).
// -> Fetches coach exercise videos and passes them down to plan components.
//
// Where it's used:
// -> Coach side: ClientSetUp → "Existing workout plans"
// -> Client side: MyPlans → WorkoutPlanList
//
// Notes:
// -> Firestore structure:
//    subscriptions/{subscriptionId}/workout/{planId}
// -> subscriptionId is derived using subId(coachUid, clientUid).
export default function WorkoutPlanList({ coachUid, clientUid }) {
  const { user, selectedClient } = useAuth();
  // All workout plans fetched from Firestore
  const [plans, setPlans] = useState([]);
  // All videos uploaded by the coach (used for exercise suggestions / display)
  const [coachVideos, setCoachVideos] = useState([]);

  // Determine which UIDs to use
  //
  // Coach logged in:
  // -> coachUid = user.uid
  // -> clientUid = selectedClient.uid
  //
  // Client logged in:
  // -> coachUid comes from props (passed from MyPlans)
  // -> clientUid = user.uid
  const effectiveCoachUid = coachUid || (user?.role === "coach" ? user?.uid : null);
  const effectiveClientUid = clientUid || (user?.role === "client" ? user?.uid : selectedClient?.uid);

  // Fetch workout plans from Firestore
  useEffect(() => {
    async function fetchPlans() {
      try {
        // doc(db, "subscriptions", subscriptionId)
        // -> Reference to the coach-client subscription document
        const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
        // collection(docRef, "workout")
        // -> Reference to the workout plans subcollection
        const workoutRef = collection(subRef, "workout");

        // getDocs(collectionRef)
        // -> Fetches ALL workout plan documents
        // -> Returns: QuerySnapshot
        const snap = await getDocs(workoutRef);

        // Convert Firestore docs into plain JS objects
        const list = snap.docs.map((d) => ({
          docId: d.id,
          ...d.data(),
        }));

        setPlans(list);
      } catch (err) {
        console.log("Error fetching workout plans:", err);
      }
    }

    // Guard: only fetch when both IDs are known
    if (effectiveCoachUid && effectiveClientUid) {
      fetchPlans();
    }
  }, [effectiveCoachUid, effectiveClientUid]);

  // Fetch coach videos (used by both coach + client views) 
  useEffect(() => {
    async function fetchVideos() {
      try {
        // getCoachVideos(coachUid)
        // -> Fetches all videos uploaded by this coach
        // -> Returns: array of video objects
        if (!effectiveCoachUid) return;
        const vids = await getCoachVideos(effectiveCoachUid);
        setCoachVideos(vids);
      } catch (err) {
        console.log("Error fetching coach videos:", err);
      }
    }

    fetchVideos();
  }, [effectiveCoachUid]);


  // Fallback UI when no workout plans exist
  if (plans.length === 0) return <p>No workout plans found.</p>;

  return (
    <div id="workout plan list">
      {plans.length === 0 ? (
        <p>No workout plans found.</p>
      ) : user.role === "coach" ? (
        // COACH VIEW
        // -> Can edit existing workout plans
        plans.map((plan) => (
          <div key={plan.docId} className="mb-4" id="workout list">
            <WorkoutPlanForm
              initialTitle={plan.title}
              initialExercises={plan.exercises}
              coachVideos={coachVideos} // will be used later for suggestions
              onSave={async (updated) => {
                try {
                  // Reference to this specific workout plan document
                  const subRef = doc(db, "subscriptions", subId(effectiveCoachUid, effectiveClientUid));
                  const planRef = doc(subRef, "workout", plan.docId);

                  // updateDoc(docRef, data)
                  // -> Updates only the provided fields in Firestore
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
        // CLIENT VIEW
        // -> Read-only display of workout plans + progress interaction
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
