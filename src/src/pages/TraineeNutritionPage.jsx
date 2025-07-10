import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { auth } from '../firebase/config'

export default function TraineeNutritionPlan() {
  const [p, s] = useState(null)

  useEffect(() => {
    const load = async () => {
      const u = auth.currentUser
      if (!u) return
      const snap = await getDoc(doc(db, 'nutritionPlans', u.uid))
      snap.exists() && s(snap.data())
    }
    load()
  }, [])

  if (!p) return <p>No plan yet</p>

  const row = m => (
    <tr>
      <td className="p-2 capitalize">{m}</td>
      <td className="p-2 text-center">{p[m].carbs}</td>
      <td className="p-2 text-center">{p[m].protein}</td>
      <td className="p-2 text-center">{p[m].fat}</td>
    </tr>
  )

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th className="p-2">Meal</th>
          <th className="p-2">Carbs</th>
          <th className="p-2">Protein</th>
          <th className="p-2">Fat</th>
        </tr>
      </thead>
      <tbody>
        {row('breakfast')}
        {row('lunch')}
        {row('dinner')}
      </tbody>
    </table>
  )
}
