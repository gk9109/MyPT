import React, { useState } from "react";

export default function WorkoutPlan() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", notes: "" },
  ]);

  // Dummy clients for now
  const clients = [
    { uid: "1", name: "Client One" },
    { uid: "2", name: "Client Two" },
    { uid: "3", name: "Client Three" },
  ];

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", notes: "" }]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit workout for", selectedClient);
    console.log("Exercises:", exercises);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Workout Plan</h2>

      {!selectedClient && (
        <>
          <h4>Select a Client</h4>
          <div className="row">
            {clients.map((client) => (
              <div key={client.uid} className="col-md-4 mb-3">
                <div
                  className="card shadow-sm p-3 cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                  style={{ cursor: "pointer" }}
                >
                  <h5>{client.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedClient && (
        <>
          <h4 className="mt-4">Creating Plan for: {selectedClient.name}</h4>

          <form onSubmit={handleSubmit} className="mt-3">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="card mb-3 p-3 shadow-sm"
              >
                <div className="row g-2">
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Exercise Name"
                      value={exercise.name}
                      onChange={(e) =>
                        handleExerciseChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Sets"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(index, "sets", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Reps"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(index, "reps", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Notes"
                      value={exercise.notes}
                      onChange={(e) =>
                        handleExerciseChange(index, "notes", e.target.value)
                      }
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
        </>
      )}
    </div>
  );
}
