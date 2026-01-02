import { useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { toast } from "react-toastify";

// What this component does:
// -> Allows a coach to create or edit a workout plan.
// -> A workout plan consists of a title and a list of exercises.
// -> Each exercise has name, sets, reps, and optional notes.
// -> On submit, the workout plan data is passed back to the parent.
//
// Where it's used:
// -> Coach-side pages for assigning or editing workout plans for clients.
//
// Props:
// initialTitle (string, optional)
// -> Initial workout title (used when editing an existing plan).
//
// initialExercises (array, optional)
// -> Initial list of exercises (used when editing an existing plan).
// -> Each exercise is expected to look like:
//    { name: string, sets: string|number, reps: string|number, notes: string }
//
// onSave (function)
// -> Callback provided by the parent.
// -> Called with { title, exercises }.
// -> Parent is responsible for saving the plan to Firestore.
//
// Notes:
// -> This component manages only form state and validation.
// -> It does not perform any Firestore operations itself.
export default function WorkoutPlanForm({ initialTitle = "", initialExercises = [], onSave }) {
  // Workout title input state
  const [title, setTitle] = useState(initialTitle);
  // Exercises form state:
  // -> If editing an existing plan, preload exercises
  // -> Otherwise start with one empty exercise row
  const [exercises, setExercises] = useState(
    initialExercises.length > 0 ? initialExercises : [{ name: "", sets: "", reps: "", notes: "" }]
  );
  const { user } = useAuth();
  const userRole = user.role;

  // Add a new empty exercise block to the form
  const handleAddExercise = () => {
    // ...exercises -> copies everything already in the array (so you keep the old inputs).
    // { name: "", sets: "", reps: "", notes: "" } -> adds a fresh empty exercise at the end.
    setExercises([...exercises, { name: "", sets: "", reps: "", notes: "" }]);
  };

  // Update a specific field of a specific exercise
  // index -> which exercise
  // field -> which property (name / sets / reps / notes)
  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  // Submit workout plan:
  // -> Prevent default form submit
  // -> Pass workout plan data to parent
  // -> Parent decides how/where to save it
  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      onSave({ title, exercises }); // parent handles Firestore write
       toast.success("Saved successfully");
    } catch (error) {
      console.log("error saving workout plan", error);
      toast.error("Something went wrong, try again"); 
    }
    
  };

  return (
    <div id="workout form" className="border border-dark-subtle p-3 card shadow">
      {/* Workout title input */}
      <label className="form-label">Workout Title</label>
      <input
        type="text"
        placeholder="Workout Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control d-inline-block w-auto"
      />

      <form onSubmit={handleSubmit} className="mt-3">
        {/* Render one form section per exercise */}
        {exercises.map((exercise, index) => (
          <div key={index} className="card mb-3 p-3 shadow-sm">
            <div className="row g-2">
              <div className="col-md-3">
                <label className="form-label">Exercise Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                />
              </div>
        
              <div className="col-md-2">
                <label className="form-label">Sets</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sets"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                />
              </div>
        
              <div className="col-md-2">
                <label className="form-label">Reps</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                />
              </div>
        
              <div className="col-md-5">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Notes"
                  value={exercise.notes}
                  onChange={(e) => handleExerciseChange(index, "notes", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        {/* Add another exercise row */}
        <div className="mb-3">
          <button
            type="button"
            onClick={handleAddExercise}
            className="btn btn-outline-primary"
          >
            + Add Exercise
          </button>
        </div>
        {/* Save full workout plan */}
        <button type="submit" className="btn btn-success">
          Save Workout Plan
        </button>
      </form>
    </div>
    
  );
}
