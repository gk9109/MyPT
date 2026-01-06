import { addDoc, collection, query, doc, getDoc, getDocs, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase/config';

// SERVICES: progress.js
// -> Firestore helper functions for client daily progress.
// -> Handles weight, meals, workouts, and chart-ready data.
// -> Collection path used here: clients/{uid}/progress
// -> Each document represents ONE day (date-based).

// addDailyProgress
// -> Adds or updates daily progress for a specific date.
// -> If a doc for that date exists -> update it
// -> If not -> create a new one
// -> Writes to: clients/{uid}/progress
export async function addDailyProgress(uid, entry) {
    try {
        const progressRef = collection(db, "clients", uid, "progress");
        
        // Date string is used as the unique identifier for "daily" progress
        // Format: "YYYY-MM-DD"
        const dateString = entry.date; // "2025-11-19"
        
        // Check if a progress document for this date already exists
        const q = query(progressRef, where("date", "==", dateString));
        const snap = await getDocs(q);
        
        // --- UPDATE EXISTING DAILY PROGRESS ---
        if (!snap.empty) {
          const existingDoc = snap.docs[0];
          const docRef = doc(db, "clients", uid, "progress", existingDoc.id);
          const existingData = existingDoc.data();

          // Merge meals:
          // -> keep existing meals
          // -> append newly added meals
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
      
        // --- CREATE NEW DAILY PROGRESS DOC ---
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

// getProgress
// -> Fetches all progress docs for a client.
// -> Converts date strings back to JS Date objects.
// -> Sorts by date (oldest -> newest).
// -> Used mainly for line / history charts.
export async function getProgress(uid){
    try {
        const progressRef = collection(db, "clients", uid, "progress");
        const progressSnap = await getDocs(progressRef);
        const progressArr = progressSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...doc.data(),
                // Convert stored date string back into JS Date
                date: new Date(data.date + "T00:00:00"),
                 
            }
        });
        
        // Sort by date so charts are drawn correctly
        progressArr.sort((a, b) => a.date - b.date);
        console.log("pregress snap:", progressArr);
        return progressArr;
    } catch (error) {
        console.log(error);
    }
}

// dailyPieData
// -> Fetches meals for a specific day.
// -> Used for macro pie charts.
// -> Reads from: clients/{uid}/progress where date == dateString
// -> Returns: meals array only
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

      // There should only be ONE doc per date
      const doc = snap.docs[0];
      const data = doc.data();

      // Return only the meals array (chart doesn't need the rest)
      return data.meals || [];
    } catch (error) {
      console.log("error fetching pie data:", error);
      return null;
    }
}   

// getWorkoutTotals
// -> Goes over ALL progress docs of a client.
// -> Aggregates workouts by exercise name.
// -> Sums total sets + total reps.
// -> Used for cumulative workout charts.
export async function getWorkoutTotals(uid) {
  try {
    // creating ref and fetching docs
    const progressRef = collection(db, "clients", uid, "progress");
    const snap = await getDocs(progressRef);

      // accumulator object: { "Bench Press": { name: "Bench Press", totalSets: 0, totalReps: 0 }, ... }
      const totals = {};

      snap.forEach((docSnap) => {
      const data = docSnap.data(); 

      // Ensure workouts is always an array
      const workouts = Array.isArray(data.workouts) ? data.workouts : []; 

      workouts.forEach((w) => {
        // Each workout contains an exercises array
        (w.exercises || []).forEach((ex) => {

          const name = ex.name; 
          if (!name) return; // skip exercises without a name

          // Convert values to numbers to avoid NaN / string issues
          const setsDone = Number(ex.completedSets || 0);
          const repsPerSet = Number(ex.reps || 0);
          const repsDone = setsDone * repsPerSet;

          // Init exercise entry if it doesn't exist yet 
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
    // Convert object -> array for chart usage
    return Object.values(totals);
  } catch (error) {
    console.log("error getting workout totals:", error);
    return [];
  }
}

// saveWorkoutProgress
// -> Saves or updates a workout for a specific date.
// -> If daily progress exists -> update workouts array
// -> If not -> create a new daily progress doc
export async function saveWorkoutProgress(uid, workoutData, dateString) {
  try {
    const progressRef = collection(db, "clients", uid, "progress");

    // Try to find an existing progress doc for this date
    const q = query(progressRef, where("date", "==", dateString));
    const snap = await getDocs(q);

    // --- UPDATE EXISTING DAILY DOC ---
    if (!snap.empty) {
      const docId = snap.docs[0].id;
      const docRef = doc(db, "clients", uid, "progress", docId);
      const existing = snap.docs[0].data();
      const workouts = existing.workouts || [];

      // Check if a workout with the same title already exists
      const index = workouts.findIndex(w => w.title === workoutData.title);

      // -1 means not found
      if (index !== -1) {
        // Replace existing workout
        workouts[index] = workoutData;
      } else {
        // Add as new workout
        workouts.push(workoutData);
      }

      await updateDoc(docRef, { workouts });

      return { updated: true };
    }

    // --- CREATE NEW DAILY DOC ---
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
