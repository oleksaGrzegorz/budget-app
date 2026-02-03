import { categories } from "../data/categories";
import { months } from "../data/months";

export const Table = () => (
  <>
    <table className="border border-black border-collapse">
      <thead>
        <tr>
          <th className="border border-black">Kategoria</th>
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
            <td className="p-2 border border-black bg-yellow-200">
              {category}
            </td>
            {months.map((month) => (
              <td key={month} className="p-2 text-center border border-black">
                0
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
