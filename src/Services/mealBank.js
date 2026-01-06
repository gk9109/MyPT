import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// SERVICES: mealBank.js
// -> Firestore helper functions for the meal bank feature.
// -> Used to store reusable meals (templates), not daily progress entries.
// -> Collection path used here: clients/{uid}/mealBank

// addMealToBank
// -> Saves a meal template so it can be reused later.
// -> Writes to: clients/{uid}/mealBank
// -> Params:
//    -> uid: client user uid
//    -> meal: full meal object (name, macros, calories, etc.)
// -> Returns: Firestore addDoc result (contains the new docId)
export async function addMealToBank(uid, meal) {
    try {
        // Creating reference to the user's mealBank collection
        const ref = collection(db, "clients", uid, "mealBank");
        // Saving the meal object as-is (acts like a reusable template)
        return await addDoc(ref, meal);
    } catch (error) {
        console.log("error adding meals to banks:", error);
    }
  
}

// getMealBank
// -> Fetches all saved meal templates for reuse.
// -> Reads from: clients/{uid}/mealBank
// -> Returns: array like [{ id, ...mealData }, ...]
export async function getMealBank(uid) {
    try {
        const ref = collection(db, "clients", uid, "mealBank");
        const snap = await getDocs(ref);
        
        // Mapping Firestore docs into plain JS objects
        // -> id is kept so UI can use it as a key or reference
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.log("error getting custom meals:", error)
    }
  
}
