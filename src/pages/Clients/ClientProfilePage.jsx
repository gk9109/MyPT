import ProgressForm from "../../componenets/clients/ProgressForm"
import ProgressCharts from "../../componenets/clients/ProgressCharts"
import { addDailyProgress, lastMonth, lastSixMonth, lastWeek, lastYear } from '../../Services/progress'
import { useAuth } from "../../firebase/AuthContext"
import { useState, useEffect } from "react";
import { getProgress } from '../../Services/progress';

export default function ClientProfilePage() {
  const { user } = useAuth(); 
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");

  const uid = user.uid;

    useEffect(() => {
        async function fetchData(){
            try {
                
                const data = await getProgress(uid);
                setProgressData(data);
                setFiltered(data);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }         
        }
        fetchData();
    }, [uid]);

  // hanldes saving progress using /srvices/progress.js logic
  const handleSaveProgress = async (entry) => {
    try {
        // const uid = user.uid;
    await addDailyProgress(uid, entry);
    console.log("success!", uid, entry);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    if (filter === "week") setFiltered(lastWeek(progressData));
    else if (filter === "month") setFiltered(lastMonth(progressData));
    else if (filter === "6months") setFiltered(lastSixMonth(progressData));
    else if (filter === "year") setFiltered(lastYear(progressData));
    else setFiltered(progressData);
  }, [filter, progressData]);

  return (
    <div>
        {/* passing saving logic to progress form */}
        <ProgressForm onSave={handleSaveProgress}/>
        {/* passing data and loading state to charts */}
        <ProgressCharts
            data={filtered}
            loading={loading}
            onFilterChange={setFilter}
        />
    </div>
  )
}
