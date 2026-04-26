import { months } from "../../data/months";
import { useIncomesMetrics } from "../../hooks/useIncomesMetrics";
import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";

interface IncomesTableProps {
  incomes: Record<string, Record<string, number>>;
  incomeGoals: Record<string, number>;
  setIncomeGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
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
          const average = Number(getAverageIncomeForCategory(category));
          const goal = incomeGoals[category];

          const difference =
            average !== null && goal !== undefined ? average - goal : null;

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

              <td
                className={`px-3 py-2 text-center border border-gray-300 font-semibold ${
                  incomeGoals[category] &&
                  Number(getAverageIncomeForCategory(category)) >
                    incomeGoals[category]
                    ? "bg-green-200 text-green-800"
                    : incomeGoals[category]
                      ? "bg-red-200 text-red-800"
                      : "bg-amber-200 text-amber-900"
                }`}
              >
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={incomeGoals[category] || ""}
                    onChange={(e) =>
                      setIncomeGoals((prev) => ({
                        ...prev,
                        [category]: Number(e.target.value),
                      }))
                    }
                    className="w-20 text-center bg-transparent outline-none"
                  />

                  {difference !== null && (
                    <span className="text-xs">
                      {difference > 0
                        ? `+${difference.toFixed(2)}`
                        : difference.toFixed(2)}
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