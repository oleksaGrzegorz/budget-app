import { categories } from "../../data/categories";
import { months } from "../../data/months";

interface ExpensesTableProps {
  expense: number;
}

export const ExpensesTable = ({ expense }: ExpensesTableProps) => {
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
                >
                  {category === "Kredyt" && month === "Luty" ? expense : ""}
                </td>
              ))}
              <td className="w-25 p-2 border border-black bg-blue-100">0</td>
              <td className="w-25 p-2 border border-black bg-blue-100">0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
