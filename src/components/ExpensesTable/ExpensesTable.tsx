import { categories } from "../../data/categories";
import { months } from "../../data/months";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
}

export const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  return (
    <table className="border border-black border-collapse text-xs mx-auto table-fixed">
      <thead>
        <tr>
          <th className="w-40 border border-black">Kategoria</th>
          {months.map((month) => (
            <th key={month} className="w-20 p-2 border border-black bg-blue-100">
              {month}
            </th>
          ))}
          <th className="w-20 p-2 border border-black bg-blue-100">Średnia</th>
          <th className="w-20 p-2 border border-black bg-blue-100">Cel</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category}>
            <th className="w-40 bg-amber-700 border" scope="row">
              {category}
            </th>
            {months.map((month) => (
              <td
                key={month}
                className="w-20 bg-amber-300 p-2 border text-center"
              >
                {expenses[category]?.[month] || 0}
              </td>
            ))}
            <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
            <td className="w-20 p-2 border bg-blue-100 text-center">0</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
