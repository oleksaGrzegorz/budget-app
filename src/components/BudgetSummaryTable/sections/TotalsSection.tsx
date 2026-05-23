import { months } from "../../../data/months";
import { GoalCell } from "../GoalCell";
import type { Goals } from "../../../types/goals";

interface TotalsSectionProps {
  getTotalIncome: (month: string) => number | null;
  getTotalExpenses: (month: string) => number | null;
  getAverageIncome: () => number | null;
  getAverageExpense: () => number | null;
  goals: Goals;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
}

export const TotalsSection = ({
  getTotalIncome,
  getTotalExpenses,
  getAverageIncome,
  getAverageExpense,
  goals,
  setGoals,
}: TotalsSectionProps) => {
  return (
    <>
      <tr className="font-semibold hover:bg-slate-50">
        <th className="border border-slate-200 bg-slate-50 px-4 py-2 text-left text-slate-800">
          Łącznie wpływy
        </th>

        {months.map((month) => {
          const income = getTotalIncome(month);

          return (
            <td
              key={month}
              className="border border-slate-200 px-3 py-2 text-center text-slate-700"
            >
              {income != null ? income.toFixed(2) : "-"}
            </td>
          );
        })}

        <td className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
          {getAverageIncome() != null ? getAverageIncome()?.toFixed(2) : "-"}
        </td>

        <GoalCell
          value={goals.income}
          onChange={(val) => setGoals((prev) => ({ ...prev, income: val }))}
          average={getAverageIncome()}
          isHigherBetter={true}
        />
      </tr>

      <tr className="font-semibold hover:bg-slate-50">
        <th className="border border-slate-200 bg-slate-50 px-4 py-2 text-left text-slate-800">
          Wydatki
        </th>

        {months.map((month) => {
          const expenses = getTotalExpenses(month);

          return (
            <td
              key={month}
              className="border border-slate-200 px-3 py-2 text-center text-slate-700"
            >
              {expenses != null ? expenses.toFixed(2) : "-"}
            </td>
          );
        })}

        <td className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
          {getAverageExpense() != null ? getAverageExpense()?.toFixed(2) : "-"}
        </td>

        <GoalCell
          value={goals.expenses}
          onChange={(val) => setGoals((prev) => ({ ...prev, expenses: val }))}
          average={getAverageExpense()}
          isHigherBetter={false}
        />
      </tr>
    </>
  );
};