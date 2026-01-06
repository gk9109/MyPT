import { db } from "../firebase/config";
import { addDoc, collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"

// SERVICES: appointments.js
// -> Firestore helper functions for coach appointments.
// -> Keeps CRUD logic out of JSX components.
// -> Collection path used here: coaches/{coachUid}/appointments

// getAppointments
// -> Gets all appointment docs for a specific coach.
// -> Reads from: coaches/{coachUid}/appointments
// -> Returns: array of objects like [{ docId, ...data }, ...]
export async function getAppointments(coachUid){
    try {
        // Creating ref and fetching docs
        const colRef = collection(db, "coaches", coachUid, "appointments");
        const snap = await getDocs(colRef);
        // Returning array with docId + doc data
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

// addAppointment
// -> Adds a new appointment doc for a coach.
// -> Writes to: coaches/{coachUid}/appointments
// -> Params:
//    -> coachUid: coach user uid (Firestore doc id under "coaches")
//    -> data: appointment object to save (title, start, end, etc.)
// -> Returns: the new appointment docId (so UI can update state without refetch)
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

// updateAppointment
// -> Updates an existing appointment doc.
// -> Writes to: coaches/{coachUid}/appointments/{docId}
// -> Params:
//    -> docId: the appointment document id
//    -> data: fields to update (partial object)
export async function updateAppointment(coachUid, docId, data){
    try {
        const docRef = doc(db, "coaches", coachUid, "appointments", docId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.log("error updating appointment", error);
        // use toast
    }
}

// deleteAppointment
// -> Deletes an appointment doc.
// -> Deletes: coaches/{coachUid}/appointments/{docId}
export async function deleteAppointment(coachUid, docId){
    try {
        const docRef = doc(db, "coaches", coachUid, "appointments", docId);
        await deleteDoc(docRef);
    } catch (error) {
        console.log("error deleting appointment", error);
        // use toast
    }
}


