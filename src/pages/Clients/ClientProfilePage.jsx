import ProgressForm from "../../componenets/clients/ProgressForm"
import ProgressCharts from "../../componenets/clients/ProgressCharts"
import { addDailyProgress, dailyPieData, getProgress } from '../../Services/progress'
import { useAuth } from "../../firebase/AuthContext"
import { useState, useEffect } from "react";
import { getMealBank } from '../../Services/mealBank'
import { toast } from "react-toastify";

// ClientProfilePage
// What this component does:
// -> Main client page for tracking progress.
// -> Loads saved progress history + meal bank from Firestore (via Services/*).
// -> Loads today's saved meals for the macro pie chart.
// -> Keeps "live meals" in state so charts can update instantly before saving.
//
// Where it's used:
// -> Clients routes/pages (profile / progress area).
// -> Renders 2 main child components:
//    1) ProgressForm   (user inputs progress + meals)
//    2) ProgressCharts (shows weight/macros/workout charts)
//
// Notes:
// -> Firestore logic is NOT in this page. It uses Services/progress.js and Services/mealBank.js.
// -> "todayMeals" = saved meals from Firestore for today.
// -> "liveMeals"  = meals currently selected in the form (not saved yet), used for reactive UI.
export default function ClientProfilePage() {
  const { user } = useAuth(); // global auth user from AuthContext
  const uid = user.uid; // Firebase Auth uid (used as the doc/collection owner id)

  // State used by charts (progress history)
  const [progressData, setProgressData] = useState([]); // full progress history fetched from Firestore
  const [filtered, setFiltered] = useState([]); // progressData after filters (currently same as progressData)

  // State used by meals system
  const [customMeals, setCustomMeals] = useState([]); // saved meal bank (templates) from Firestore
  const [todayMeals, setTodayMeals] = useState([]); // today's saved meals from Firestore (pie chart baseline)
  const [liveMeals, setLiveMeals] = useState([]); // meals in-progress in the form (for reactive pie chart)

  const [loading, setLoading] = useState(true); // page loading flag for initial fetch

  // Initial load: progress history + meal bank
  useEffect(() => {
    async function fetchData(){
      try {    
        // getProgress(uid)
        // -> Service function that fetches all progress docs for this client.
        // -> Returns: array of progress entries (each entry is a plain JS object from Firestore docs).     
        const data = await getProgress(uid);
        setProgressData(data);
        setFiltered(data);

        // getMealBank(uid)
        // -> Service function that fetches the client's meal bank (saved meal templates).
        // -> Returns: array of meals (plain JS objects).
        const meals = await getMealBank(uid);
        setCustomMeals(meals);

        setLoading(false);
      } catch (error) {
        console.log(error)
      }         
    }
    fetchData();
  }, [uid]);

  // Load meals saved for TODAY (for the macro pie chart)
  useEffect(() => {
    // fetchTodayMeals
    async function fetchTodayMeals() {
      try {
        const today = new Date().toISOString().split("T")[0]; // "2025-11-20"

        // dailyPieData(uid, dateString)
        // -> Service function that aggregates today's meals from Firestore.
        // -> Returns: array of meals or macro entries (depends on your progress.js implementation).
        const meals = await dailyPieData(uid, today);

        // If meals exist -> save them, else save empty array
        setTodayMeals(meals || []);
      } catch (err) {
        console.log("Error loading pie data (useeffect):", err);
      }
    }

    fetchTodayMeals();
  }, [uid]);

  // Handles saving a progress entry to Firestore (called from ProgressForm)
  const handleSaveProgress = async (entry) => {
    try {
      // addDailyProgress(uid, entry)
      // -> Service function that writes this progress entry into Firestore under the client.
      // -> Returns: Promise<void> or doc info (depends on implementation).
      await addDailyProgress(uid, entry);
      console.log("success saving progress to collection!", uid, entry);
      toast.success("Saved successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, try again");
    }
  }

  // Called when user saves a meal into the meal bank
  // -> Updates local state so the bank UI updates instantly (no refresh needed)
  const handleMealSavedToBank = (meal) => {
    // add the new meal to the existing bank list so UI updates instantly
    setCustomMeals((prev) => [...prev, meal]); // append meal to existing bank list
  };

  return (
    <div>
      {/* ProgressForm:
        -> user inputs progress + selects meals
        -> sends "entry" to onSave when user submits
        -> sends "live meals" upward so charts can update before saving */}
      <ProgressForm
        onSave={handleSaveProgress}
        customMeals={customMeals}
        onLiveMeals={setLiveMeals} 
        onMealSaved={handleMealSavedToBank} />
      {/* ProgressCharts:
        -> displays charts based on progress + meals
        -> todayMeals = saved DB data for today
        -> liveMeals  = unsaved form state to show instant updates */}
      <ProgressCharts
        data={filtered}
        loading={loading}
        todayMeals={todayMeals}
        liveMeals={liveMeals}
      />
    </div>
  )
}
