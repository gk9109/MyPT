import ProgressForm from "../../componenets/clients/ProgressForm"
import ProgressCharts from "../../componenets/clients/ProgressCharts"
import { addDailyProgress, dailyPieData, getProgress } from '../../Services/progress'
import { useAuth } from "../../firebase/AuthContext"
import { useState, useEffect } from "react";
import { getMealBank } from '../../Services/mealBank'
import { toast } from "react-toastify";

export default function ClientProfilePage() {
  const { user } = useAuth(); 
    const uid = user.uid;
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]); 
  const [customMeals, setCustomMeals] = useState([]);
  const [liveMeals, setLiveMeals] = useState([]);
  const [todayMeals, setTodayMeals] = useState([]);

  useEffect(() => {
    async function fetchData(){
      try {         
        const data = await getProgress(uid);
        setProgressData(data);
        setFiltered(data);

        const meals = await getMealBank(uid);
        setCustomMeals(meals);

        setLoading(false);
      } catch (error) {
        console.log(error)
      }         
    }
    fetchData();
  }, [uid]);

  // fetching TODAYS meals
  useEffect(() => {
    async function fetchTodayMeals() {
      try {
        const today = new Date().toISOString().split("T")[0]; // "2025-11-20"
        const meals = await dailyPieData(uid, today);

        // If meals exist -> save them, else save empty array
        setTodayMeals(meals || []);
      } catch (err) {
        console.log("Error loading pie data (useeffect):", err);
      }
    }

    fetchTodayMeals();
  }, [uid]);


  // hanldes saving progress using /srvices/progress.js logic
  const handleSaveProgress = async (entry) => {
    try {
      // const uid = user.uid;
      await addDailyProgress(uid, entry);
      console.log("success saving progress to collection!", uid, entry);
      toast.success("Saved successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, try again");
    }
  }

  const handleMealSavedToBank = (meal) => {
    // add the new meal to the existing bank list so UI updates instantly
    setCustomMeals((prev) => [...prev, meal]);
  };


  return (
    <div>
        {/* passing saving logic to progress form */}
        <ProgressForm
          onSave={handleSaveProgress}
          customMeals={customMeals}
          onLiveMeals={setLiveMeals} 
          onMealSaved={handleMealSavedToBank} />
        {/* passing data and loading state to charts */}
        <ProgressCharts
          data={filtered}
          loading={loading}
          todayMeals={todayMeals}
          // onFilterChange={setFilter}
          liveMeals={liveMeals}
        />
    </div>
  )
}
