import { months } from "../../data/months";
import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";

interface BudgetSummaryTableProps {
  expenses: Record<string, Record<string, number>>;
  incomes: Record<string, Record<string, number>>;
  incomeGoals: Record<string, number>;
  setIncomeGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const BudgetSummaryTable = ({
  expenses,
  incomes,
  incomeGoals,
  setIncomeGoals,
}: BudgetSummaryTableProps) => {
  const getTotalExpenses = (month: string): number | null => {
    const total = Object.values(expenses ?? {}).reduce(
      (sum, cat) => sum + (cat?.[month] || 0),
      0,
    );
    return total === 0 ? null : total;
  };

  const getTotalIncome = (month: string): number | null => {
    const total = Object.values(incomes).reduce(
      (sum, cat) => sum + (cat[month] || 0),
      0,
    );
    return total === 0 ? null : total;
  };

  const getSavings = (month: string): number | null => {
    const income = getTotalIncome(month);
    const expenses = getTotalExpenses(month);
    if (income === null && expenses === null) return null;
    return (income ?? 0) - (expenses ?? 0);
  };

  const getAverageIncomeForCategory = (category: string) => {
    const monthsData = incomes[category];
    if (!monthsData) return null;

    const values = Object.values(monthsData).filter((v) => v > 0);
    if (values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(2);
  };

  const getAverageSavings = (): string | null => {
    const validMonths = months.filter(
      (m) => getTotalIncome(m) != null || getTotalExpenses(m) != null,
    );

    if (validMonths.length === 0) return null;

    const sum = validMonths.reduce((acc, m) => acc + (getSavings(m) ?? 0), 0);

    return (sum / validMonths.length).toFixed(2);
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
            Śr
          </th>
          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-amber-300 text-amber-900">
            Cel
          </th>
        </tr>
      </thead>
      <tbody>
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

        <tr className="bg-gray-100 font-semibold">
          <th className="px-4 py-2 text-left border border-gray-300">
            Łącznie wpływy
          </th>
          {months.map((month) => (
            <td
              key={month}
              className="px-3 py-2 text-center border border-gray-300"
            >
              {getTotalIncome(month)}
            </td>
          ))}
          <td className="px-3 py-2 text-center border border-gray-300"></td>
          <td className="px-3 py-2 text-center border border-gray-300"></td>
        </tr>

        <tr className="bg-gray-100 font-semibold">
          <th className="px-4 py-2 text-left border border-gray-300">
            Wydatki
          </th>
          {months.map((month) => (
            <td
              key={month}
              className="px-3 py-2 text-center border border-gray-300"
            >
              {getTotalExpenses(month)}
            </td>
          ))}
          <td className="px-3 py-2 text-center border border-gray-300"></td>
          <td className="px-3 py-2 text-center border border-gray-300"></td>
        </tr>

        <tr className="bg-gray-200 font-semibold">
          <th className="px-4 py-2 text-left border border-gray-300">
            Oszczędności
          </th>
          {months.map((month) => {
            const savings = getSavings(month);
            return (
              <td
                key={month}
                className={`px-3 py-2 text-center border border-gray-300 ${
                  savings != null && savings < 0
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {savings}
              </td>
            );
          })}
          <td className="px-3 py-2 text-center border border-gray-300">
            {getAverageSavings()}
          </td>
          <td className="px-3 py-2 text-center border border-gray-300"></td>
        </tr>

        <tr className="bg-gray-100 font-semibold">
          <th className="px-4 py-2 text-left border border-gray-300">
            Oszczędności (%)
          </th>
          {months.map((month) => {
            const savings = getSavings(month);
            const totalIncome = getTotalIncome(month);

            const percentage =
              totalIncome != null && savings != null
                ? Number(((savings / totalIncome) * 100).toFixed(1))
                : null;

            return (
              <td
                key={month}
                className={`px-3 py-2 text-center border border-gray-300 ${
                  percentage != null && percentage < 0
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {percentage != null ? percentage + "%" : null}
              </td>
            );
          })}
          <td className="px-3 py-2 text-center border border-gray-300">
            {(() => {
              const totalSavings = months.reduce(
                (acc, m) => acc + (getSavings(m) ?? 0),
                0,
              );
              const totalIncome = months.reduce(
                (acc, m) => acc + (getTotalIncome(m) ?? 0),
                0,
              );

              if (!totalIncome) return null;

              const avgPercentage = Number(
                ((totalSavings / totalIncome) * 100).toFixed(1),
              );

              return avgPercentage + "%";
            })()}
          </td>
          <td className="px-3 py-2 text-center border border-gray-300"></td>
        </tr>
      </tbody>
    </table>
  );
};