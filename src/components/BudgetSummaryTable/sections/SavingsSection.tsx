import { months } from "../../../data/months";
import type { Goals } from "../../../types/goals";
import { GoalCell } from "../GoalCell";

interface SavingsSectionProps {
  getSavings: (month: string) => number | null;
  getAverageSavings: () => number | null;
  getSavingsPercentage: (month: string) => number | null;
  getAverageSavingsPercentage: () => number | null;
  goals: Goals;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
}

export const SavingsSection = ({
  getSavings,
  getAverageSavings,
  getSavingsPercentage,
  getAverageSavingsPercentage,
  goals,
  setGoals,
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
        <GoalCell
          value={goals.savings}
          onChange={(val) => setGoals((prev) => ({ ...prev, savings: val }))}
          average={getAverageSavings()}
        />
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
        <GoalCell
          value={goals.savingsPercentage}
          onChange={(val) => setGoals((prev) => ({ ...prev, savingsPercentage: val }))}
          average={getAverageSavingsPercentage()}
        />
      </tr>
    </>
  );
};
