import { categories } from "../../data/categories";
import { months } from "../../data/months";

export const ExpensesTable = () => (
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
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category}>
            <td className="p-2 border border-black bg-amber-700">
              {category}
            </td>
            {months.map((month) => (
              <td key={month} className="bg-amber-300 w-25 p-5 text-center border border-black">

              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
