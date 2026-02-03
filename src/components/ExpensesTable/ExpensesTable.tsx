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
          <th className="p-2 border border-black bg-blue-100">
            średnia z całego roku
          </th>
          <th className="p-2 border border-black bg-blue-100">
            cel średniej na cały rok
          </th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category}>
            <th
              className="border border-black bg-amber-700 leading-tight"
              scope="row"
            >
              {category}
            </th>
            {months.map((month) => (
              <td
                key={month}
                className="bg-amber-300 w-25 p-5 text-center border border-black"
              ></td>
            ))}
            <td className="p-2 border border-black bg-blue-100">0</td>
            <td className="p-2 border border-black bg-blue-100">0</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
