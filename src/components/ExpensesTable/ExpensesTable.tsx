import { categories } from "../../data/categories";
import { months } from "../../data/months";
import { GoalCell } from "../BudgetSummaryTable/GoalCell";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
goals: Record<string, number | null>;
setGoals: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
}

export const ExpensesTable = ({
  expenses,
  goals,
  setGoals,
}: ExpensesTableProps) => {
  const getAverageForCategory = (category: string): number | null => {
    const monthsData = expenses[category];
    if (!monthsData) return null;
    const positiveExpenses = Object.values(monthsData).filter(
      (expense) => expense > 0,
    );
    if (positiveExpenses.length === 0) return null;
    const total = positiveExpenses.reduce((sum, expense) => sum + expense, 0);
    return total / positiveExpenses.length;
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
          const average = getAverageForCategory(category);

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
                  {expenses[category]?.[month] || null}
                </td>
              ))}

              <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800 font-medium">
                {average !== null ? average.toFixed(2) : ""}
              </td>

              <GoalCell
                value={goals[category] ?? null}
                onChange={(val) =>
                  setGoals((prev) => ({
                    ...prev,
                    [category]: val,
                  }))
                }
                average={average}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
