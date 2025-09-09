import { serverTimestamp } from "firebase/firestore";

/**
 * @typedef {Object} WorkoutPlan
 * @property {string} title - Title of the plan (e.g. "Chest & Arms")
 * @property {Array<Object>} exercises - List of exercises in this plan
 * @property {string} exercises[].name - Exercise name (e.g. "Bench Press")
 * @property {string} exercises[].sets - Number of sets
 * @property {string} exercises[].reps - Number of reps
 * @property {string} [exercises[].notes] - Optional notes
 * @property {*} createdAt - Firestore Timestamp
 * @property {*} updatedAt - Firestore Timestamp
 */

/** Build a normalized workout plan with defaults */
export function makeWorkoutPlan({
  title = "",
  exercises = [],
}) {
  /** @type {WorkoutPlan} */
  const plan = {
    title,
    exercises: exercises.map(e => ({
      name: e.name || "",
      sets: e.sets || "",
      reps: e.reps || "",
      notes: e.notes || "",
    })),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  return plan;
}
