import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function WorkoutTotalsChart({ data }) {
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
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSets" name="Total sets" />
              <Bar dataKey="totalReps" name="Total reps" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
