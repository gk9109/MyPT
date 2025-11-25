import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, } from "recharts";
// a library built for react that lets you easily make charts 

export default function CalChart({data}) {
    return (
        <div className="chart-container mb-5">
            <h6>Calories Trend</h6>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDashaaray="3 3" />
                    <XAxis
                        dataKey="date"
                         tickFormatter={(date) => new Date(date).toLocaleDateString("en-GB")}
                    />
                    <YAxis label={{ value: "kcal", angle: 0, position: "insideLeft" }} />
                    <Tooltip
                         tickFormatter={(date) => new Date(date).toLocaleDateString("en-GB")}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="totalCalories" stroke="#007bff" name = "Weight (kg)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
