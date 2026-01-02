import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import progressAnimation from "../../assets/Exercise for diet or health.json";
import Loader from "../shared/Loader";
import WeightChart from "./charts/WeightChart";
import WorkoutTotalsChart from "./charts/WorkoutTotalsChart";
import MacroPieChart from "./charts/MacroPieChart";
import { useAuth } from "../../firebase/AuthContext";
import { getWorkoutTotals } from "../../Services/progress";

// ProgressCharts
// -> groups all progress visualizations for the client:
//    weight over time, macro pie chart, and workout totals.

// Props:
// data         - array of daily progress docs (weight + meals) from Firestore
// loading      - true while the main progress data is being fetched
// liveMeals    - meals currently in state (not yet saved to Firestore)
// todayMeals   - meals loaded from today's saved progress doc
export default function ProgressCharts({ data, loading, liveMeals, todayMeals }) {
  const { user } = useAuth(); // current logged-in user
  // local state for workout totals chart
  const [workoutTotals, setWorkoutTotals] = useState([]);
  const [workoutLoading, setWorkoutLoading] = useState(true);

  // fetch aggregated workout totals for this user
  // runs when the user is known (after AuthContext loads)
  useEffect(() => {
    if (!user) return;

    let cancelled = false;  // safety flag if component unmounts
    setWorkoutLoading(true);
    // getWorkoutTotals(uid) -> total sets/reps per exercise from all progress docs
    getWorkoutTotals(user.uid)
      .then((totals) => {
        if (!cancelled) {
          setWorkoutTotals(totals || []);
        }
      })
      .catch((err) => {
        console.log("Error loading workout totals:", err);
      })
      .finally(() => {
        if (!cancelled) setWorkoutLoading(false);
      });

    // cleanup: mark as cancelled so we don't call setState on unmounted component
    return () => {
      cancelled = true;
    };
  }, [user]);

  console.log("progress chart data:", data);

   // while the main progress (weight/meals) is loading -> show loader
  if (loading) {
    return <Loader />;
  }

  // if there are no progress docs at all -> show animation + message
  if (!data || data.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Lottie
          animationData={progressAnimation}
          loop
          autoplay
          style={{ width: 300, height: 300 }}
        />
        <p className="mt-2 text-muted">No progress data yet.</p>
      </div>
    );
  }

  return (
    <div id="progress-charts" className="progress-chsrt mt-4">
      <div className="d-flex col">
        <h4>Progress Overview</h4>
      </div>

      <div className="chart-container mb-5">
        {/* line chart -> shows weight change over time using all progress docs */}
        <WeightChart data={data} />

        {/* macro pie chart -> combines today's saved meals (todayMeals)
          with liveMeals from the form that are not saved yet */}
        <MacroPieChart todayMeals={todayMeals} liveMeals={liveMeals} />

        {/* workout volume per exercise (sum of sets/reps from all workout docs) */}
        {workoutLoading ? (
          // simple text loader for the workout chart (can be replaced later with Loader/Lottie)
          <p className="text-muted mt-3">Loading workout stats...</p>
        ) : (
          <WorkoutTotalsChart data={workoutTotals} />
        )}
      </div>
    </div>
  );
}
