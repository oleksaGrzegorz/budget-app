import { categories } from "../../data/categories";
import { months } from "../../data/months";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
  goals: Record<string, number>;
  setGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const ExpensesTable = ({ expenses, goals, setGoals }: ExpensesTableProps) => {

  const getAverageForCategory = (category: string) => {
    const monthsData = expenses[category];
    if (!monthsData) return 0;
    const positiveExpenses = Object.values(monthsData).filter((expense) => expense > 0);
    if (positiveExpenses.length === 0) return 0;
    const total = positiveExpenses.reduce((sum, expense) => sum + expense, 0);
    return (total / positiveExpenses.length).toFixed(2);
  };

  return (
    <table className="w-full text-xs border border-gray-300 border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left font-semibold border border-gray-300">
            Kategoria
          </th>

          {months.map((month) => (
            <th
              key={month}
              className="px-3 py-2 text-center font-semibold border border-gray-300"
            >
              {month}
            </th>
          ))}

          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-gray-300 text-gray-800">
            Średnia
          </th>

          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-amber-300 text-amber-900">
            Cel
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((category) => {
          const average = Number(getAverageForCategory(category));
          const goal = goals[category];
          const difference = goal !== undefined ? average - goal : null;

          let bgClass = "";
          if (goal !== undefined) {
            bgClass = average > goal ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800";
          }

          return (
            <tr key={category} className="even:bg-gray-50">
              <th
                className="px-4 py-2 text-left font-medium border border-gray-300 bg-gray-50"
                scope="row"
              >
                {category}
              </th>

              {months.map((month) => (
                <td
                  key={month}
                  className="px-3 py-2 text-center border border-gray-300"
                >
                  {expenses[category]?.[month] || 0}
                </td>
              ))}

              <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800 font-medium">
                {average.toFixed(2)}
              </td>

              <td className={`px-3 py-2 text-center border border-gray-300 font-semibold ${bgClass}`}>
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={goal || ""}
                    onChange={(e) =>
                      setGoals((prev) => ({
                        ...prev,
                        [category]: Number(e.target.value),
                      }))
                    }
                    className="w-20 text-center bg-amber-100 outline-none mb-1"
                    placeholder=""
                  />
                  {difference !== null && (
                    <span className="text-xs">
                      {difference > 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
