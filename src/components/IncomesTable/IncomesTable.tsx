import { months } from "../../data/months";
import { useIncomesMetrics } from "../../hooks/useIncomesMetrics";
import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import { GoalCell } from "../BudgetSummaryTable/GoalCell";

interface IncomesTableProps {
  incomes: Record<string, Record<string, number>>;
incomeGoals: Record<string, number | null>;
setIncomeGoals: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
}

export const IncomesTable = ({
  incomes,
  incomeGoals,
  setIncomeGoals,
}: IncomesTableProps) => {
  const { getAverageIncomeForCategory } = useIncomesMetrics(incomes);

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
            Śr
          </th>
          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-amber-300 text-amber-900">
            Cel
          </th>
        </tr>
      </thead>

      <tbody>
        {incomeCategories.map((category) => {
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
                  {incomes[category]?.[month] || null}
                </td>
              ))}

              <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800 font-medium">
                {getAverageIncomeForCategory(category)}
              </td>

              <GoalCell
                value={incomeGoals[category]}
                onChange={(val) =>
                  setIncomeGoals((prev) => ({
                    ...prev,
                    [category]: val,
                  }))
                }
                average={getAverageIncomeForCategory(category)}
                isHigherBetter={true}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
