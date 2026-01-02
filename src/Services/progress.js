import { addDoc, collection, query, doc, getDoc, getDocs, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase/config';

// add and or update depending of the existance of a doc
export async function addDailyProgress(uid, entry) {
    try {
        const progressRef = collection(db, "clients", uid, "progress");
        
        // Use the date selected by the user
        const dateString = entry.date; // "2025-11-19"
        
        // Query for an existing progress document for this date
        const q = query(progressRef, where("date", "==", dateString));
        const snap = await getDocs(q);
        
        // If a document exists, append meals to it
        if (!snap.empty) {
          const existingDoc = snap.docs[0];
          const docRef = doc(db, "clients", uid, "progress", existingDoc.id);

          const existingData = existingDoc.data();
          const updatedMeals = [
            ...(existingData.meals || []),
            ...(entry.meals || [])
          ];
        
          await updateDoc(docRef, {
            meals: updatedMeals,
            weight: entry.weight || existingData.weight,
            date: dateString
          });
        
          console.log("Progress updated for:", dateString);
          return;
        }
      
        // Otherwise, create a new document for that date
        await addDoc(progressRef, {
          date: dateString,
          weight: entry.weight,
          meals: entry.meals || [],
          createdAt: entry.createdAt
        });

        console.log("New daily progress created for:", dateString);

    } catch (error) {
      console.log("Error saving progress:", error);
    }
}

// get progress data (graph)
export async function getProgress(uid){
    try {
        const progressRef = collection(db, "clients", uid, "progress");
        const progressSnap = await getDocs(progressRef);
        const progressArr = progressSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...doc.data(),
                date: new Date(data.date + "T00:00:00"), // convert it back to JS date object
                 
            }
        });
        // sport the array by date
        progressArr.sort((a, b) => a.date - b.date);
        console.log("pregress snap:", progressArr);
        return progressArr;
    } catch (error) {
        console.log(error);
    }
}

// pie chart data
export async function dailyPieData(uid, dateString) {
    try {
      const dataRef = collection(db, "clients", uid, "progress");

      // Query where date == "YYYY-MM-DD"
      const q = query(dataRef, where("date", "==", dateString));

      const snap = await getDocs(q);

      if (snap.empty) {
        console.log("No progress doc for today");
        return null;
      }

      // Get the first (and only) doc
      const doc = snap.docs[0];
      const data = doc.data();

      // return only the meals array ->  see example below
      return data.meals || [];

        //   [
        //     { name: "bbb", protein: "111", carbs: "111", fat: "111", ... },
        //     { name: "doritos", protein: "2", carbs: "150", fat: "10", ... }
        //   ]


    } catch (error) {
      console.log("error fetching pie data:", error);
      return null;
    }
}   

// getWorkoutTotals
// -> goes over all progress docs of a client
// -> sums total sets and total reps for each exercise name
// -> returns an array like: [{ name: "Bench Press", totalSets: 12, totalReps: 120 }, ...]
export async function getWorkoutTotals(uid) {
  try {
    // creating ref and fetching docs
    const progressRef = collection(db, "clients", uid, "progress");
    const snap = await getDocs(progressRef);

    const totals = {}; // accumulator object: { "Bench Press": { name: "Bench Press", totalSets: 0, totalReps: 0 }, ... }

    snap.forEach((docSnap) => {
      const data = docSnap.data(); // data extruction
      // make sure workouts an array, otherwise an empty array
      const workouts = Array.isArray(data.workouts) ? data.workouts : []; 

      workouts.forEach((w) => {
        // each workout has an exercises array
        (w.exercises || []).forEach((ex) => {

          const name = ex.name; 
          if (!name) return; // skip exercises without a name
          // convert sets / reps to numbers (avoid undefined / string issues)
          const setsDone = Number(ex.completedSets || 0);
          const repsPerSet = Number(ex.reps || 0);
          const repsDone = setsDone * repsPerSet;
          // if this is the first time we see this exercise name -> init it 
          if (!totals[name]) {
            totals[name] = {
              name,
              totalSets: 0,
              totalReps: 0,
            };
          }
          // add this workout's sets/reps to the totals
          totals[name].totalSets += setsDone;
          totals[name].totalReps += repsDone;
        });
      });
    });
    // convert the totals object into an array for the chart
    return Object.values(totals);
  } catch (error) {
    console.log("error getting workout totals:", error);
    return [];
  }
}


// Save or update a workout for a given user + date
export async function saveWorkoutProgress(uid, workoutData, dateString) {
  try {
    const progressRef = collection(db, "clients", uid, "progress");

    // Try to find today's progress doc
    const q = query(progressRef, where("date", "==", dateString));
    const snap = await getDocs(q);

    if (!snap.empty) {
      // --- UPDATE EXISTING DOC ---
      const docId = snap.docs[0].id;
      const docRef = doc(db, "clients", uid, "progress", docId);
      const existing = snap.docs[0].data();
      const workouts = existing.workouts || [];

      // Try to find an existing workout by title
      const index = workouts.findIndex(w => w.title === workoutData.title);
      // -1 means not found
      if (index !== -1) {
        // Update in place
        workouts[index] = workoutData;
      } else {
        // Add as new workout
        workouts.push(workoutData);
      }

      await updateDoc(docRef, { workouts });

      return { updated: true };
    }

    // --- CREATE NEW DOC ---
    await addDoc(progressRef, {
      date: dateString,
      createdAt: new Date().toISOString(),
      meals: [],
      weight: null,
      workouts: [workoutData]
    });

    return { created: true };

  } catch (err) {
    console.error("saveWorkoutProgress error:", err);
    return { error: err };
  }
}
