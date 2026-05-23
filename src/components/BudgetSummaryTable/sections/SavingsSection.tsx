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
      <tr className="hover:bg-slate-50">
        <th className="border border-slate-200 bg-slate-50 px-4 py-2 text-left font-semibold text-slate-800">
          Oszczędności
        </th>

        {months.map((month) => {
          const savings = getSavings(month);

          return (
            <td
              key={month}
              className={`border border-slate-200 px-3 py-2 text-center font-medium ${
                savings == null
                  ? "text-slate-400"
                  : savings < 0
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {savings != null ? savings.toFixed(2) : "-"}
            </td>
          );
        })}

        <td className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
          {getAverageSavings() != null ? getAverageSavings()?.toFixed(2) : "-"}
        </td>

        <GoalCell
          value={goals.savings}
          onChange={(val) => setGoals((prev) => ({ ...prev, savings: val }))}
          average={getAverageSavings()}
          isHigherBetter={true}
        />
      </tr>

      <tr className="hover:bg-slate-50">
        <th className="border border-slate-200 bg-slate-50 px-4 py-2 text-left font-semibold text-slate-800">
          Oszczędności (%)
        </th>

        {months.map((month) => {
          const percentage = getSavingsPercentage(month);

          return (
            <td
              key={month}
              className={`border border-slate-200 px-3 py-2 text-center font-medium ${
                percentage == null
                  ? "text-slate-400"
                  : percentage < 0
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {percentage != null ? `${percentage.toFixed(2)}%` : "-"}
            </td>
          );
        })}

        <td className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
          {getAverageSavingsPercentage() != null
            ? `${getAverageSavingsPercentage()?.toFixed(2)}%`
            : "-"}
        </td>

        <GoalCell
          value={goals.savingsPercentage}
          onChange={(val) =>
            setGoals((prev) => ({ ...prev, savingsPercentage: val }))
          }
          average={getAverageSavingsPercentage()}
          isHigherBetter={true}
        />
      </tr>
    </>
  );
};