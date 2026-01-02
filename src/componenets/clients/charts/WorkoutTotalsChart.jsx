import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

// -----------------------------------------------------------------------------
// What this component does:
// -> Displays a bar chart summarizing total workout volume per exercise.
// -> Compares total sets and total reps completed across all saved workouts.
//
// Where it's used:
// -> Inside the client's progress charts section (alongside weight & macro charts).
//
// Props:
// data (array)
// -> Pre-calculated workout totals per exercise.
// -> Each item is expected to look like:
//    {
//      name: string,        // exercise name
//      totalSets: number,   // sum of sets completed for this exercise
//      totalReps: number    // sum of reps completed for this exercise
//    }
//
// Notes:
// -> This component is presentation-only.
// -> All aggregation (summing sets/reps across workouts) is done BEFORE passing data here.
// -----------------------------------------------------------------------------

export default function WorkoutTotalsChart({ data }) {
  // Guard clause:
  // -> If no workout data exists yet, show a friendly empty-state message
  if (!data || data.length === 0) {
    return (
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Workout Volume</h5>
          <p className="text-muted mb-0">
            No workout progress saved yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Workout Volume by Exercise</h5>

        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          Comparing how many sets and reps you&apos;ve done for each exercise
          in total.
        </p>

        <div style={{ width: "100%", height: 280 }}>
          {/* ResponsiveContainer keeps the chart fluid across screen sizes */}
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            >
              {/* Grid lines improve readability */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X axis lists exercise names */}
              {/* Rotated labels prevent overlap when names are long */}
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
              />

              {/* Y axis represents total volume values */}
              <YAxis />

              {/* Tooltip shows exact values on hover */}
              <Tooltip />

              {/* Legend explains each bar color */}
              <Legend />

              {/* One bar per metric, grouped by exercise name */}
              <Bar dataKey="totalSets" name="Total sets" />
              <Bar dataKey="totalReps" name="Total reps" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
