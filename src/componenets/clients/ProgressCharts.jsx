import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import progressAnimation from "../../assets/Exercise for diet or health.json";
import Loader from "../shared/Loader";
import WeightChart from "./charts/WeightChart";
import WorkoutTotalsChart from "./charts/WorkoutTotalsChart";
import MacroPieChart from "./charts/MacroPieChart";

// new imports
import { useAuth } from "../../firebase/AuthContext";
import { getWorkoutTotals } from "../../Services/progress";

export default function ProgressCharts({
  data,
  loading,
  onFilterChange,
  liveMeals,
  todayMeals,
}) {
  // current logged-in user
  const { user } = useAuth();

  // local state for workout totals chart
  const [workoutTotals, setWorkoutTotals] = useState([]);
  const [workoutLoading, setWorkoutLoading] = useState(true);

  // fetch workout totals once we know the user
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setWorkoutLoading(true);

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

    return () => {
      cancelled = true;
    };
  }, [user]);

  console.log("progress chart data:", data);

  // overall progress (weight/meals) still uses the existing loading flag
  if (loading) {
    return <Loader />;
  }

  // if there are no progress docs at all, show the animation
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
        {/* filters are still available if you want them later */}
        {/* <select
          className="form-select form-select-sm"
          onChange={(e) => onFilterChange(e.target.value.toLowerCase())}
        >
          <option value="last week">Last week</option>
          <option value="last month">Last month</option>
          <option value="last 6 months">Last 6 months</option>
          <option value="last year">Last year</option>
          <option value="all">All time</option>
        </select> */}
      </div>

      <div className="chart-container mb-5">
        {/* weight over time */}
        <WeightChart data={data} />

        {/* meals pie chart – uses today's doc (from progress.js) +
           liveMeals that are still in state and not saved yet */}
        <MacroPieChart todayMeals={todayMeals} liveMeals={liveMeals} />

        {/* workout volume per exercise (total sets / reps from all docs) */}
        {workoutLoading ? (
          <p className="text-muted mt-3">Loading workout stats...</p>
        ) : (
          <WorkoutTotalsChart data={workoutTotals} />
        )}
      </div>
    </div>
  );
}
