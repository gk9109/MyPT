import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, } from "recharts";
// a library built for react that lets you easily make charts 
import Lottie from "lottie-react";
import progressAnimation from "../../assets/Exercise for diet or health.json";
import Loader from "../shared/Loader";

export default function ProgressCharts({ data, loading, onFilterChange }) {
    // data is expected as an array of objects:
    // [{ date: '2025-10-20', whight: 72, totalCalories: 1800 }, ...]

    
    console.log("data:", data)
    //if no data 
    if (loading) {
        return <Loader />
    }

    if (!data || data.length === 0) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center">
                <Lottie animationData={progressAnimation} loop autoplay style={{ width: 300, height: 300 }} />
                <p className="mt-2 text-muted">No progress data yet.</p>
            </div>
        );
    }

    return (
        <div id="progress-charts" className="progress-chsrt mt-4">

            <div className=" d-flex col">
                
                <h4>Progress Overview</h4>
                <select className="form-select form-select-sm"
                    onChange={(e) => onFilterChange(e.target.value)}
                >
                    <option>Last week</option>
                    <option>Last month</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                    <option>All time</option>
                </select>
            </div>
            

            {/* weight charts */}
            <div className="chart-container mb-5">
                <h6>Weight Over Time</h6>
                <ResponsiveContainer width="100%" height={300} >
                    <LineChart data={data} >
                        <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis label={{ value: "kg", angle: 0, position: "insideLeft" }} />
                            <Tooltip
                                labelFormatter={(date) => new Date(date).toLocaleDateString("en-GB")}
                            />
                            <Legend />
                        <Line type="monotone" dataKey="weight" stroke="#007bff" name = "Weight (kg)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* calories chart */}
            <div className="chart-container mb-5">
                <h6>Calories Trend</h6>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDashaaray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: "kcal", angle: 0, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="totalCalories" stroke="#007bff" name = "Weight (kg)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>


        </div>
    )
}


