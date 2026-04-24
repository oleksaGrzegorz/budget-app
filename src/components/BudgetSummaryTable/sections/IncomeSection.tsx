import { months } from "../../../data/months";
import { budgetSummaryLabels as incomeCategories } from "../../../data/budgetSummaryLabels";

interface IncomeSectionProps {
  incomes: Record<string, Record<string, number>>;
  incomeGoals: Record<string, number>;
  setIncomeGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  getAverageIncomeForCategory: (category: string) => string | null;
}

export const IncomeSection = ({
  incomes,
  incomeGoals,
  setIncomeGoals,
  getAverageIncomeForCategory
}: IncomeSectionProps) => {
  return (
    <>
      {incomeCategories.map((category) => (
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
                        ? "bg-red-200 text-red-800"
                        : incomeGoals[category]
                          ? "bg-green-200 text-green-800"
                          : "bg-amber-200 text-amber-900"
                    }`}
                  >
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
                  </td>
                </tr>
              ))}
    </>
  );
}