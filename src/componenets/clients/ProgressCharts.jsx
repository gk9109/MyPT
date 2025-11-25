import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import progressAnimation from "../../assets/Exercise for diet or health.json";
import Loader from "../shared/Loader";
import WeightChart from "./charts/WeightChart";
import CalChart from "./charts/CalChart";
import MacroPieChart from "./charts/MacroPieChart";

export default function ProgressCharts({ data, loading, onFilterChange, liveMeals, todayMeals }) {
    // data is expected as an array of objects:
    // [{ date: '2025-10-20', whight: 72, totalCalories: 1800 }, ...]

    console.log("progress chart data:", data)
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
                {/* <select className="form-select form-select-sm"
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
                {/* weight charts */}
                <WeightChart data={data}/>

                {/* calories chart */}
                {/* <CalChart data={data} /> */}

                {/* pie charts */}
                <MacroPieChart todayMeals={todayMeals} liveMeals={liveMeals}/>
            </div>       
        </div>
    )
}


