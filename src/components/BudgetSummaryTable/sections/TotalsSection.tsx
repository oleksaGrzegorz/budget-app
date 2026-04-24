import { months } from "../../../data/months";

interface TotalsSectionProps {
  getTotalIncome: (month: string) => number | null;
  getTotalExpenses: (month: string) => number | null;
  getAverageIncome: () => string | null;
  getAverageExpense: () => string | null;
}

export const TotalsSection = ({
  getTotalIncome,
  getTotalExpenses,
  getAverageIncome,
  getAverageExpense
}: TotalsSectionProps) => {
  return (
    <>
      <tr className="bg-gray-100 font-semibold">
                
                <th className="px-4 py-2 text-left border border-gray-300">
                  Łącznie wpływy
                </th>
      
                {months.map((month) => (
                  <td
                    key={month}
                    className="px-3 py-2 text-center border border-gray-300"
                  >
                    {getTotalIncome(month)}
                  </td>
                ))}
      
                <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800">
                  {getAverageIncome()}
                </td>
      
                <td className="px-3 py-2 text-center border border-gray-300 bg-amber-200 text-amber-900"></td>
              </tr>
      
              <tr className="bg-gray-100 font-semibold">
                <th className="px-4 py-2 text-left border border-gray-300">
                  Wydatki
                </th>
                {months.map((month) => (
                  <td
                    key={month}
                    className="px-3 py-2 text-center border border-gray-300"
                  >
                    {getTotalExpenses(month)}
                  </td>
                ))}
                <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800">
                  {getAverageExpense()}
                </td>
                <td className="px-3 py-2 text-center border border-gray-300 bg-amber-200 text-amber-900"></td>
              </tr>
    </>
  );
}