import { months } from "../../../data/months";

interface SavingsSectionProps {
  getSavings: (month: string) => number | null;
  getAverageSavings: () => string | null;
  getSavingsPercentage: (month: string) => number | null;
  getAverageSavingsPercentage: () => string | null;
}

export const SavingsSection = ({
  getSavings,
  getAverageSavings,
  getSavingsPercentage,
  getAverageSavingsPercentage,
}: SavingsSectionProps) => {
  return (
    <>
      <tr>
        <th className="px-4 py-2 text-left border border-gray-300">
          Oszczędności
        </th>
        {months.map((month) => {
          const savings = getSavings(month);
          return (
            <td
              key={month}
              className={`px-3 py-2 text-center border border-gray-300 ${
                savings == null
                  ? "bg-gray-100 text-gray-500"
                  : savings < 0
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
              }`}
            >
              {savings}
            </td>
          );
        })}

        <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800">
          {getAverageSavings()}
        </td>
        <td className="px-3 py-2 text-center border border-gray-300 bg-amber-200 text-amber-900"></td>
      </tr>

      <tr>
        <th className="px-4 py-2 text-left border border-gray-300">
          Oszczędności (%)
        </th>
{months.map((month) => {
  const percentage = getSavingsPercentage(month);

  return (
    <td
      key={month}
      className={`px-3 py-2 text-center border border-gray-300 ${
        percentage == null
          ? "bg-gray-100 text-gray-500"
          : percentage < 0
            ? "bg-red-200 text-red-800"
            : "bg-green-200 text-green-800"
      }`}
    >
      {percentage != null ? `${percentage}%` : "-"}
    </td>
  );
})}

        <td className="px-3 py-2 text-center border border-gray-300 bg-gray-200 text-gray-800">
          {getAverageSavingsPercentage()}
        </td>
        <td className="px-3 py-2 text-center border border-gray-300 bg-amber-200 text-amber-900"></td>
      </tr>
    </>
  );
};
