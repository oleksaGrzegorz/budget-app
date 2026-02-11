import { categories } from "../../data/categories";
import { months } from "../../data/months";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
}

export const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
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
          <th className="px-3 py-2 text-center font-semibold border border-gray-300">
            Średnia
          </th>
          <th className="px-3 py-2 text-center font-semibold border border-gray-300">
            Cel
          </th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
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
                {expenses[category]?.[month] || 0}
              </td>
            ))}
            <td className="px-3 py-2 text-center border border-gray-300">0</td>
            <td className="px-3 py-2 text-center border border-gray-300">0</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
