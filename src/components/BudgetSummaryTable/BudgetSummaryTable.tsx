import { months } from "../../data/months";
import { budgetSummaryLabels } from "../../data/budgetSummaryLabels";

export const BudgetSummaryTable = () => (
  <table className="text-xs">
    <tbody>
      {budgetSummaryLabels.map((label) => (
        <tr key={label}>
          <th className="bg-amber-700 border w-40" scope="row">{label}</th>
          {months.map((month) => (
            <td className="bg-amber-300 p-5 w-25 border" key={month}></td>
          ))}
          <td className="w-25 p-2 border border-black bg-blue-100">0</td>
            <td className="w-25 p-2 border border-black bg-blue-100">0</td>
        </tr>
      ))}
    </tbody>
  </table>
);
