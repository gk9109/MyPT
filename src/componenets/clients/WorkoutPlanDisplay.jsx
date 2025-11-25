import { useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, updateDoc, addDoc, arrayUnion, doc } from "firebase/firestore";

export default function WorkoutPlanDisplay({ title, exercises }) {
  const { user } = useAuth();
  const [completedSets, setCompletedSets] = useState({}); // track per exercise

  // mark completed sets (slider or input)
  const handleSetChange = (index, value) => {
    setCompletedSets({ ...completedSets, [index]: value });
  };

  const handleSaveProgress = async () => {
      try {
        // Step 1: Get today's logical date (formatted as "YYYY-MM-DD")
        // This date will be used to find or create the correct progress document
        const logicalDate = new Date().toISOString().split("T")[0];

        // Step 2: Point to the user's "progress" subcollection inside Firestore
        // Each user has their own "progress" subcollection
        const progressRef = collection(db, "users", user.uid, "progress");

        // 🔍 Step 3: Build a query to check if there's already a progress document for today
        // The "date" field is stored inside the document, not as the doc ID, so we query by it
        const q = query(progressRef, where("date", "==", logicalDate));
        const snapshot = await getDocs(q);

        // Step 4: Create the workout progress data object we want to save
        // This includes the title, all exercises, how many sets were completed, and a timestamp
        const workoutProgress = {
          title, // workout title (e.g., "Leg Day")
          exercises: exercises.map((ex, i) => ({
            ...ex, // keep all original exercise fields (name, sets, reps, notes)
            completedSets: completedSets[i] || 0, // number of sets completed by the user
          })),
          completedAt: new Date().toISOString(), // when the workout was saved
        };

        // Step 5: If a progress document for this date already exists → update it
        if (!snapshot.empty) {
          // Get the first matching document's reference
          const docRef = snapshot.docs[0].ref;

          // Use updateDoc to safely append a new workout entry without overwriting anything
          await updateDoc(docRef, {
            // arrayUnion ensures the workout is added to the workouts array,
            // but doesn't delete or modify meals, weight, or previous workouts
            workouts: arrayUnion(workoutProgress),
          });

          console.log("Workout progress added to existing document.");
        } 
        // Step 6: If no document exists for this date → create a new one
        else {
          await addDoc(progressRef, {
            date: logicalDate, // store the date for querying later
            workouts: [workoutProgress], // create a new workouts array
            createdAt: new Date().toISOString(), // track when the doc was created
          });

          console.log("New progress document created with workout data.");
        }

        // Optional success message for user feedback
        alert("Workout progress saved!");
      } catch (err) {
        // Step 7: Handle and log any errors that occur during the Firestore operations
        console.error("Error saving workout progress:", err);
      }
    };


  return (
    <div id="workout-display" className="border border-dark-subtle p-3 card shadow">
      <h5 className="fw-bold">{title}</h5>

      {exercises.map((ex, i) => (
        <div key={i} className="card mb-3 p-3 shadow-sm">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <p className="mb-1"><strong>{ex.name}</strong></p>
              <p className="mb-1">{ex.sets} sets × {ex.reps} reps</p>
              <p className="text-muted small">{ex.notes}</p>
            </div>

            <div className="col-md-8">
              <label className="form-label mb-1">
                Completed sets ({completedSets[i] || 0}/{ex.sets})
              </label>
              <input
                type="range"
                min="0"
                max={ex.sets}
                value={completedSets[i] || 0}
                onChange={(e) => handleSetChange(i, Number(e.target.value))}
                className="form-range"
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={handleSaveProgress} className="btn btn-success">
        Save Progress
      </button>
    </div>
  );
}
