import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function MacroPieChart({ todayMeals = [], liveMeals = [] }) {
  // Base data -> meals already saved in Firestore for today
  // Overlay     -> meals currently in "Meals To Be Added" (state)
  // What the user actually sees -> base + overlay
  const finalMeals =
    liveMeals && liveMeals.length > 0
      ? [...todayMeals, ...liveMeals] // collection + state together
      : todayMeals;                   // only collection when there is nothing pending

  // Sum up macros from all meals
  const protein =
    finalMeals?.reduce((sum, meal) => sum + Number(meal.protein || 0), 0) || 0;
  const carbs =
    finalMeals?.reduce((sum, meal) => sum + Number(meal.carbs || 0), 0) || 0;
  const fat =
    finalMeals?.reduce((sum, meal) => sum + Number(meal.fat || 0), 0) || 0;

  const total = protein + carbs + fat;
  const empty = total === 0;

  // When empty -> just show 3 equal grey slices with “0%”
  // When not empty -> show real percentages based on totals
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
    <div style={{ width: "100%", height: 330 }}>
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
