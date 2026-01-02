import { useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, updateDoc, addDoc, arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";

// What this component does:
// -> Displays a workout plan (title + exercises).
// -> Lets the client mark how many sets they completed for each exercise.
// -> Optionally shows matching exercise videos (from coach suggestions).
// -> Saves workout progress into Firestore under the client's daily progress.
//
// Where it's used:
// -> Client-facing page that shows assigned workout plans (e.g., ClientProfilePage).
//
// Props:
// title (string)
// -> Workout plan title shown at the top + saved into progress for history.
//
// exercises (array)
// -> List of exercise objects to display. Each exercise usually has fields like:
//    { name, sets, reps, notes?, videoId? }.
// -> We render one "exercise card" per array item using exercises.map().
//
// coachVideos (array, optional)
// -> Videos uploaded/suggested by the coach.
// -> Used to match and display a demo video per exercise.
// -> Default = [] so the component doesn't crash if parent didn't pass it.
//
// Data flow summary:
// -> Parent passes exercises + coachVideos
// -> User interacts locally (completed sets + open video state)
// -> On save:
//    - find or create today's progress document
//    - append workoutProgress into workouts[] without overwriting meals/weight

export default function WorkoutPlanDisplay({ title, exercises, coachVideos = [] }) {
  const { user } = useAuth();

  // completedSets[i] = how many sets the client completed for exercise index i
  // We use an object so we can update one exercise without rebuilding the whole exercises array.
  const [completedSets, setCompletedSets] = useState({});

  // openVideo[i] = whether the demo video section is open for exercise index i
  const [openVideo, setOpenVideo] = useState({});

  // Update completed sets for a specific exercise (slider)
  const handleSetChange = (index, value) => {
    setCompletedSets({ ...completedSets, [index]: value });
  };

  // Toggle video visibility for a specific exercise card
  const toggleVideo = (index) => {
    setOpenVideo((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Save workout progress:
  // -> We store workouts inside the same daily progress doc as meals/weight,
  //    so the app can show a full "day summary" later in charts.
  //
  // Why query by date?
  // -> We keep date as a field (not as docId), so we search progress/{autoId} where date == today.
  //
  // Why arrayUnion?
  // -> Safely appends a new workout entry without overwriting other fields in the doc.
  const handleSaveProgress = async () => {
    try {
      const logicalDate = new Date().toISOString().split("T")[0];
      const progressRef = collection(db, "clients", user.uid, "progress");

      const q = query(progressRef, where("date", "==", logicalDate));
      const snapshot = await getDocs(q);

      // Build the object we want to append into workouts[].
      // Important: exercises.map() creates a "snapshot" of the workout as it was performed today.
      // We copy the original exercise fields and add completedSets for each item.
      const workoutProgress = {
        title,
        exercises: exercises.map((ex, i) => ({
          ...ex, // keep name/sets/reps/notes/videoId/etc
          completedSets: completedSets[i] || 0, // default 0 if user didn't touch the slider
        })),
        completedAt: new Date().toISOString(),
      };

      // If a progress doc exists for today -> update it (append to workouts[])
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;

        await updateDoc(docRef, {
          workouts: arrayUnion(workoutProgress),
        });
      }
      // Otherwise -> create a new daily progress doc with workouts[] initialized
      else {
        await addDoc(progressRef, {
          date: logicalDate,
          workouts: [workoutProgress],
          createdAt: new Date().toISOString(),
        });
      }

      toast.success("Workout progress saved!");
    } catch (err) {
      toast.error("Error saving progress!");
      console.error("Error saving workout progress:", err);
    }
  };

  return (
    <div id="workout-display" className="border border-dark-subtle p-3 card shadow">
      <h5 className="fw-bold">{title}</h5>

      {/* Render one card per exercise */}
      {exercises.map((ex, i) => {
        // Video matching logic:
        // 1) If exercise has a specific videoId -> use exact match (best, most reliable).
        // 2) Otherwise -> fallback to "loose" name match (less strict, but still helpful).
        let matchingVideos = [];

        if (ex.videoId) {
          matchingVideos = coachVideos.filter((vid) => vid.id === ex.videoId);
        } else {
          const exName = (ex.name || "").toLowerCase();
          matchingVideos = coachVideos.filter((vid) =>
            (vid.name || "").toLowerCase().includes(exName)
          );
        }

        const hasVideo = matchingVideos.length > 0;

        return (
          <div key={i} className="card mb-3 p-3 shadow-sm">
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <p className="mb-1">
                  <strong>{ex.name}</strong>
                </p>
                <p className="mb-1">
                  {ex.sets} sets × {ex.reps} reps
                </p>
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

                {hasVideo && (
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => toggleVideo(i)}
                    >
                      {openVideo[i] ? "Hide Video" : "Show Video"}
                    </button>

                    {openVideo[i] && (
                      <div className="mt-2">
                        {/* Some exercises may match multiple videos -> render them all */}
                        {matchingVideos.map((video) => (
                          <video
                            key={video.id}
                            src={video.videoUrl}
                            controls
                            className="w-100 rounded"
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <button onClick={handleSaveProgress} className="btn btn-success">
        Save Progress
      </button>
    </div>
  );
}
