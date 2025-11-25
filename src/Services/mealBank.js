import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// creacte a reference to collection and saves meals for easy reuse later on
export async function addMealToBank(uid, meal) {
    try {
        const ref = collection(db, "clients", uid, "mealBank");
        return await addDoc(ref, meal);
    } catch (error) {
        console.log("error adding meals to banks:", error);
    }
  
}

// fetches meals from bank to reuse
export async function getMealBank(uid) {
    try {
        const ref = collection(db, "clients", uid, "mealBank");
        const snap = await getDocs(ref);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.log("error getting custom meals:", error)
    }
  
}
