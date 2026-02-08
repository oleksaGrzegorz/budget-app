import { categories } from "../../data/categories";
import { months } from "../../data/months";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
}

export const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  return (
    <>
      <table className="border border-black border-collapse text-xs">
        <thead>
          <tr>
            <th className="w-40 border border-black">Kategoria</th>
            {months.map((month) => (
              <th className="p-2 border border-black bg-blue-100" key={month}>
                {month}
              </th>
            ))}
            <th className="p-2 border border-black bg-blue-100">średnia</th>
            <th className="p-2 border border-black bg-blue-100">cel</th>
          </tr>
        </thead>
        <tbody>
{categories.map((category) => (
          <tr key={category}>
            <th className="bg-amber-700 border w-40" scope="row">{category}</th>
            {months.map((month) => (
              <td key={month} className="bg-amber-300 p-2 border text-center">
                {expenses[category]?.[month] || 0}
              </td>
            ))}
            <td className="w-25 p-2 border bg-blue-100">0</td>
            <td className="w-25 p-2 border bg-blue-100">0</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
};
