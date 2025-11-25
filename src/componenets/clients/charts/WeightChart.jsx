import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, } from "recharts";
// a library built for react that lets you easily make charts 

export default function WeightChart({data}) {
  return (
    <div className="chart-container mb-5">
        <h6>Weight Over Time</h6>
        <ResponsiveContainer width="100%" height={300} >
            <LineChart data={data} >
                <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-GB")}
                    />
                    <YAxis label={{ value: "kg", angle: 0, position: "insideLeft" }} />
                    <Tooltip
                        labelFormatter={(date) => new Date(date).toLocaleDateString("en-GB")}
                    />
                    <Legend />
                <Line type="monotone" dataKey="weight" stroke="#007bff" name = "Weight (kg)" />
            </LineChart>
        </ResponsiveContainer>
    </div>
  )
}
