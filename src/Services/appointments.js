import { db } from "../firebase/config";
import { addDoc, collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"

// Get all appoinmets for coach
export async function getAppointments(coachUid){
    try {
        // Creating ref and fetching docs
        const colRef = collection(db, "coaches", coachUid, "appointments");
        const snap = await getDocs(colRef);
        // Returning array with docId + data
        return snap.docs.map((d) => ({
            docId: d.id,
            ...d.data()
        }));
    } catch (error) {
        console.log("error fetching appointments data", error)
        return [];
        //use toast
    }
}

// Add appointment
export async function addAppointment(coachUid, data){
    try {
        const colRef = collection(db, "coaches", coachUid, "appointments");
        const docRef = await addDoc(colRef, data);
        return docRef.id // return doc id so UI can use it
    } catch (error) {
        console.log("error adding appointment", error);
        // use toast
    }
}

// Update appointment
export async function updateAppointment(coachUid, docId, data){
    try {
        const docRef = doc(db, "coaches", coachUid, "appointments", docId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.log("error updating appointment", error);
        // use toast
    }
}

// Delete appointment
export async function deleteAppointment(coachUid, docId){
    try {
        const docRef = doc(db, "coaches", coachUid, "appointments", docId);
        await deleteDoc(docRef);
    } catch (error) {
        console.log("error deleting appointment", error);
        // use toast
    }
}


