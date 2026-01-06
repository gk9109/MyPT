import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { subId } from "./subscriptions";

// SERVICES: plans.js
// -> Firestore helper functions for workout & diet plans.
// -> Plans belong to a subscription (coach <-> client relationship),
//    not directly to a coach or a client.
// -> Collection path pattern:
//    subscriptions/{subscriptionId}/workout
//    subscriptions/{subscriptionId}/diet

// addWorkoutPlan
// -> Adds a workout plan for a specific coach-client subscription.
// -> Writes to: subscriptions/{subscriptionId}/workout
// -> Params:
//    -> coachUid: coach user uid
//    -> clientUid: client user uid
//    -> plan: full workout plan object
export async function addWorkoutPlan(coachUid, clientUid, plan) {
  try {
    // Build the subscription document reference using both users' uids
    // -> subId(...) guarantees a consistent document id for this pair
    const subRef = doc(db, "subscriptions", subId(coachUid, clientUid));    
    // Reference the "workout" subcollection under the subscription
    // -> Firestore creates the subcollection automatically if it doesn’t exist
    const workoutRef = collection(subRef, "workout");
    // Add the plan as a new document
    return await addDoc(workoutRef, plan);
  } catch (error) {
    console.error("Error adding workout plan:", error);
  }
}

// getWorkoutPlans
// -> Fetches all workout plans for a subscription.
// -> Reads from: subscriptions/{subscriptionId}/workout
// -> Returns: array like [{ docId, ...planData }, ...]
export async function getWorkoutPlans(coachUid, clientUid) {
    try {
        const subRef = doc(db, "subscriptions", subId(coachUid, clientUid));
        const workoutsRef = collection(subRef, "workout");
        const snap = await getDocs(workoutsRef);

        // Mapping Firestore docs into plain JS objects
        return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    } catch (error) {
        console.log(error)
    }
  
}

// addDietPlan
// -> Adds a diet plan for a specific subscription.
// -> Writes to: subscriptions/{subscriptionId}/diet
export async function addDietPlan(coachUid, clientUid, plan) {
    try {
        const subRef = doc(db, "subscriptions", subId(coachUid, clientUid));
        const dietsRef = collection(subRef, "diet");

        return await addDoc(dietsRef, plan);
    } catch (error) {
        console.log(error);
    }
  
}

// getDietPlans
// -> Fetches all diet plans for a subscription.
// -> Reads from: subscriptions/{subscriptionId}/diet
// -> Returns: array like [{ docId, ...planData }, ...]
export async function getDietPlans(coachUid, clientUid) {
    try {
        const subRef = doc(db, "subscriptions", subId(coachUid, clientUid));
        const dietsRef = collection(subRef, "diet");
        const snap = await getDocs(dietsRef);
        
        return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    } catch (error) {
        console.log(error)
    }
  
}