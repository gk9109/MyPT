import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

// -----------------------------------------------------------------------------
// What this component does:
// -> Displays a line chart of the client's weight over time.
// -> Each point represents the user's weight on a specific date.
//
// Where it's used:
// -> Inside the client's progress charts section (profile/progress page).
//
// Props:
// data (array)
// -> Array of progress objects used to draw the chart.
// -> Each item is expected to look like:
//    { date: "YYYY-MM-DD", weight: number }
//
// Notes:
// -> This component is presentation-only.
// -> It does NOT fetch or transform data; it only visualizes what it receives.
// -----------------------------------------------------------------------------

export default function WeightChart({ data }) {
  return (
    <div className="chart-container mb-5">
      <h6>Weight Over Time</h6>

      {/* ResponsiveContainer makes the chart adapt to its parent width */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Grid lines for better readability */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X axis shows dates from the progress entries */}
          {/* tickFormatter converts stored date strings into readable format */}
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-GB")
            }
          />

          {/* Y axis represents weight values (kg) */}
          <YAxis
            label={{ value: "kg", angle: 0, position: "insideLeft" }}
          />

          {/* Tooltip appears on hover and formats the date label */}
          <Tooltip
            labelFormatter={(date) =>
              new Date(date).toLocaleDateString("en-GB")
            }
          />

          {/* Legend shows what the line represents */}
          <Legend />

          {/* 
            Single line:
            -> dataKey="weight" tells Recharts which field to plot
            -> type="monotone" smooths the curve
          */}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#007bff"
            name="Weight (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
