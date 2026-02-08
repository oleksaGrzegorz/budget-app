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
    <table className="text-xs border border-black border-collapse w-full">
      <tbody>
        {incomeCategories.map((category) => (
          <tr key={category}>
            <th className="bg-green-700 border w-40" scope="row">
              {category}
            </th>
            {months.map((month) => (
              <td key={month} className="bg-green-300 p-2 border text-center">
                {incomes[category]?.[month] || 0}
              </td>
            ))}
            <td className="w-25 p-2 border bg-blue-100">0</td>
            <td className="w-25 p-2 border bg-blue-100">0</td>
          </tr>
        ))}

        <tr>
          <th className="bg-blue-700 border w-40" scope="row">
            Łącznie wpływy
          </th>
          {months.map((month) => (
            <td key={month} className="bg-blue-300 p-2 border text-center">
              {getTotalIncome(month)}
            </td>
          ))}
          <td className="w-25 p-2 border bg-blue-100">0</td>
          <td className="w-25 p-2 border bg-blue-100">0</td>
        </tr>

        <tr>
          <th className="bg-red-700 border w-40" scope="row">
            Wydatki
          </th>
          {months.map((month) => (
            <td key={month} className="bg-red-300 p-2 border text-center">
              {getTotalExpenses(month)}
            </td>
          ))}
          <td className="w-25 p-2 border bg-blue-100">0</td>
          <td className="w-25 p-2 border bg-blue-100">0</td>
        </tr>
      </tbody>
    </table>
  );
};
