import { months } from "../../data/months";
import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";

interface BudgetSummaryTableProps {
  expenses: Record<string, Record<string, number>>;
  incomes: Record<string, Record<string, number>>;
}

export const BudgetSummaryTable = ({
  expenses,
  incomes,
}: BudgetSummaryTableProps) => {
  const getTotalExpenses = (month: string) =>
    Object.values(expenses).reduce((sum, cat) => sum + (cat[month] || 0), 0);

  const getTotalIncome = (month: string) =>
    Object.values(incomes).reduce((sum, cat) => sum + (cat[month] || 0), 0);

  return (
    <table className="text-xs border border-black border-collapse mx-auto table-fixed">
      <thead>
        <tr>
          <th className="w-40 border border-black">Kategoria</th>
          {months.map((month) => (
            <th key={month} className="w-20 p-2 border border-black bg-blue-100">
              {month}
            </th>
          ))}
          <th className="w-20 p-2 border border-black bg-blue-100">Śr</th>
          <th className="w-20 p-2 border border-black bg-blue-100">Cel</th>
        </tr>
      </thead>
      <tbody>
        {incomeCategories.map((category) => (
          <tr key={category}>
            <th className="w-40 bg-green-700 border" scope="row">
              {category}
            </th>
            {months.map((month) => (
              <td
                key={month}
                className="w-20 bg-green-300 p-2 border text-center"
              >
                {incomes[category]?.[month] || 0}
              </td>
            ))}
            <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
            <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
          </tr>
        ))}

        <tr>
          <th className="w-40 bg-blue-700 border" scope="row">
            Łącznie wpływy
          </th>
          {months.map((month) => (
            <td
              key={month}
              className="w-20 bg-blue-300 p-2 border text-center"
            >
              {getTotalIncome(month)}
            </td>
          ))}
          <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
          <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
        </tr>

        <tr>
          <th className="w-40 bg-red-700 border" scope="row">
            Wydatki
          </th>
          {months.map((month) => (
            <td
              key={month}
              className="w-20 bg-red-300 p-2 border text-center"
            >
              {getTotalExpenses(month)}
            </td>
          ))}
          <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
          <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
        </tr>
      </tbody>
    </table>
  );
};
