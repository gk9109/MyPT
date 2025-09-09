// firestore/plans.js
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { subId } from "../Models/subscriptions";

export async function addWorkoutPlan(coachUid, clientUid, plan) {
  try {
    // reference the subscription doc
    const subRef = doc(db, "subscriptions", subId(coachUid, clientUid));    
    // reference the subcollection under it
    const workoutRef = collection(subRef, "workout");
    // add the plan — Firestore will create the subcollection if it doesn’t exist
    return await addDoc(workoutRef, plan);
  } catch (error) {
    console.error("Error adding workout plan:", error);
  }
}

// Get all workout plans for a subscription
export async function getWorkoutPlans(coachUid, clientUid) {
    try {
        const subRef = doc(db, "subscriptions", subId(coachUid, clientUid));
        const workoutsRef = collection(subRef, "workout");
        const snap = await getDocs(workoutsRef);

        return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    } catch (error) {
        console.log(error)
    }
  
}

// Same idea for diet plans:
export async function addDietPlan(coachUid, clientUid, plan) {
    try {
        const subRef = doc(db, "subscriptions", subId(coachUid, clientUid));
        const dietsRef = collection(subRef, "diet");

        return await addDoc(dietsRef, plan);
    } catch (error) {
        console.log(error);
    }
  
}

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