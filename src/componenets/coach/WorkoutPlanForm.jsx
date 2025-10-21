import { useState } from "react";

export default function WorkoutPlanForm({ initialTitle = "", initialExercises = [], onSave }) {
  const [title, setTitle] = useState(initialTitle);
  const [exercises, setExercises] = useState(
    initialExercises.length > 0 ? initialExercises : [{ name: "", sets: "", reps: "", notes: "" }]
  );

  const handleAddExercise = () => {
    // ...exercises -> copies everything already in the array (so you keep the old inputs).
    // { name: "", sets: "", reps: "", notes: "" } -> adds a fresh empty exercise at the end.
    setExercises([...exercises, { name: "", sets: "", reps: "", notes: "" }]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, exercises }); // parent handles Firestore write
  };

  return (
    <div className="border border-dark-subtle p-3 card shadow">
      <label className="form-label">Workout Title</label>
      <input
        type="text"
        placeholder="Workout Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control d-inline-block w-auto"
      />

      <form onSubmit={handleSubmit} className="mt-3">
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
        <div className="mb-3">
          <button
            type="button"
            onClick={handleAddExercise}
            className="btn btn-outline-primary"
          >
            + Add Exercise
          </button>
        </div>
        <button type="submit" className="btn btn-success">
          Save Workout Plan
        </button>
      </form>
    </div>
  );
}
