import { months } from "../../data/months";
import { budgetSummaryLabels } from "../../data/budgetSummaryLabels";

interface BudgetSummaryTableProps {
  expenses: Record<string, Record<string, number>>;
}

export const BudgetSummaryTable = ({ expenses }: BudgetSummaryTableProps) => {
  const getTotalExpenses = (month: string) => {
    return Object.values(expenses).reduce((sum, categoryExpenses) => {
      return sum + (categoryExpenses[month] || 0);
    }, 0);
  };
  return (
    <table className="text-xs border border-black border-collapse">
      <tbody>
        {budgetSummaryLabels.map((label) => (
          <tr key={label}>
            <th className="bg-amber-700 border w-40" scope="row">
              {label}
            </th>
            {months.map((month) => (
              <td
                key={month}
                className="bg-green-300 p-5 w-25 border text-center"
              >
                {label === "Wydatki" ? getTotalExpenses(month) : 0}
              </td>
            ))}
            <td className="w-25 p-2 border border-black bg-blue-100">0</td>
            <td className="w-25 p-2 border border-black bg-blue-100">0</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
