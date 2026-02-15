import { categories } from "../../data/categories";
import { months } from "../../data/months";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
}

export const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  const getAverageForCategory = (category: string) => {
    const monthsData = expenses[category];
    if (!monthsData) return 0;

    const values = Object.values(monthsData).filter((v) => v > 0);

    if (values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(2);
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
            Średnia
          </th>

          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-amber-300 text-amber-900">
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

            <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800 font-medium">
              {getAverageForCategory(category)}
            </td>

            <td className="px-3 py-2 text-center border border-gray-300 bg-amber-200 text-amber-900 font-semibold">
              0
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
