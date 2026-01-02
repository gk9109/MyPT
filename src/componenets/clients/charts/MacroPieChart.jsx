import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// What this component does:
  // -> Displays a Pie Chart of today's macro breakdown (Protein / Carbs / Fat).
  // -> Combines two sources of meals:
  //    1) todayMeals  = meals already saved in Firestore for today
  //    2) liveMeals   = meals the user added in the UI but hasn't saved yet
  // -> The chart always reflects what the user currently sees (saved + pending).
  //
  // Where it's used:
  // -> Inside your progress charts section on the client profile page.
  //
  // Props:
  // todayMeals (array, default = [])
  // -> Meals fetched from Firestore for today's progress document.
  // -> Each meal is expected to have numeric-ish fields: protein, carbs, fat.
  //
  // liveMeals (array, default = [])
  // -> "Temporary" meals stored in React state while the user is editing.
  // -> This makes the chart reactive before the user hits Save.
  //
  // Why there are many "|| 0":
  // -> Meals may have missing macros (undefined/null/empty string).
  // -> Using "|| 0" prevents NaN and keeps totals stable.
export default function MacroPieChart({ todayMeals = [], liveMeals = [] }) {
  // Merge Firestore meals + UI pending meals
  // -> If the user has live meals, show them on top of saved ones
  // -> Otherwise, show only what's saved in Firestore
  const finalMeals =
    liveMeals && liveMeals.length > 0
      ? [...todayMeals, ...liveMeals] // collection + state together
      : todayMeals;                   // only collection when there is nothing pending

  // Reduce = "turn an array into one value" (here: sum of macros)
  // Number(...) converts strings like "12" into 12 to ensure numeric addition
  const protein = finalMeals?.reduce((sum, meal) => sum + Number(meal.protein || 0), 0) || 0;
  const carbs = finalMeals?.reduce((sum, meal) => sum + Number(meal.carbs || 0), 0) || 0;
  const fat = finalMeals?.reduce((sum, meal) => sum + Number(meal.fat || 0), 0) || 0;

  const total = protein + carbs + fat;
  const empty = total === 0;

  // Chart input:
  // -> Recharts Pie needs positive values to draw slices.
  // -> If total is 0, we use 1/1/1 so it still renders a neutral pie,
  //    while labels show "0%" to reflect reality.
  const data = empty
    ? [
        { name: "Protein (0%)", value: 1 },
        { name: "Carbs (0%)", value: 1 },
        { name: "Fat (0%)", value: 1 },
      ]
    : [
        {
          name: `Protein (${((protein / total) * 100).toFixed(1)}%)`,
          value: protein,
        },
        {
          name: `Carbs (${((carbs / total) * 100).toFixed(1)}%)`,
          value: carbs,
        },
        {
          name: `Fat (${((fat / total) * 100).toFixed(1)}%)`,
          value: fat,
        },
      ];

  const COLORS = empty
    ? ["#cccccc", "#cccccc", "#cccccc"] // grey when empty
    : ["#4285F4", "#F4B400", "#DB4437"]; // Protein (blue) / Carbs (yellow) / Fat (red)

  return (
    <div className="mb-5" style={{ width: "100%", height: 330 }}>
      
      <h6 className="mb-3">Macronutrient Breakdown</h6>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90} // radius
            // innerRadius={40} // radius of another empty pie in the middle
            // paddingAngle={0} // padding between colors
            // Show labels only when we have real data
            label={!empty ? ({ name }) => name : false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          {/* Tooltip only makes sense when there is real data */}
          {!empty && <Tooltip />}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
