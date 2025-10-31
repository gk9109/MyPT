import { addDoc, collection, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from '../firebase/config';



// add
export async function addDailyProgress(uid, entry) {
    try {
        const progressRef = collection(db, "clients", uid, "progress");
        await addDoc(progressRef, entry);      
        console.log("doc added successfuly");
    } catch (error) {
        console.log(error);
    }
} 

// delete
export async function deleteProgressDoc(uid){
    try {
        const docRef = doc(db, "clients", uid, "progress", docIda);
        await deleteDoc(docRef);
        console.log("deleted successfuly");
    } catch (error) {
        console.log(error);
    }
}

// update 
export async function updateProgress(uid){
    try {
        const docRef = doc(db, "clients", uid, "progress", docIda);
        await updateDoc(docRef);
        console.log("updated successfuly");
    } catch (error) {
        console.log(error);
    }
}

// get
export async function getProgress(uid){
    try {
        const progressRef = collection(db, "clients", uid, "progress");
        const progressSnap = await getDocs(progressRef);
        const progressArr = progressSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...doc.data(),
                date: new Date(data.date), // convert it back to JS date object
                 
            }
        });
        // sport the array by date
        progressArr.sort((a, b) => a.date - b.date);
        console.log("pregress sanp:", progressArr);
        return progressArr;
    } catch (error) {
        console.log(error);
    }
}

// ------ FILTERS ------

// 1. Last week
export function lastWeek(data) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const filtered = data.filter(entry => entry.date >= oneWeekAgo);

  return filtered;
}

// 2. Last month
export function lastMonth(data) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const filtered = data.filter(entry => entry.date >= oneMonthAgo);

  return filtered;
}

// 3. Last six months
export function lastSixMonth(data) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const filtered = data.filter(entry => entry.date >= sixMonthsAgo);

  return filtered;
}

// 4. Last year
export function lastYear(data) {
  const aYearAgo = new Date();
  aYearAgo.setFullYear(aYearAgo.getFullYear() - 1);

  const filtered = data.filter(entry => entry.date >= aYearAgo);

  return filtered;
}






