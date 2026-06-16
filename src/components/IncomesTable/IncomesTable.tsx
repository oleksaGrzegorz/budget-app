import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import { months } from "../../data/months";
import type { BudgetData } from "../../types/budgetData";
import type { GoalsData } from "../../types/goalsData";
import {
  getActiveMonths,
  getCategoryAverage,
  type PeriodOption,
} from "../../utils/budgetAverages";
import { GoalCell } from "../BudgetSummaryTable/GoalCell";

interface IncomesTableProps {
  incomes: BudgetData;
  incomeGoals: GoalsData;
  setIncomeGoals: React.Dispatch<
    React.SetStateAction<Record<string, number | null>>
  >;
  period: PeriodOption;
}

export const IncomesTable = ({
  incomes,
  incomeGoals,
  setIncomeGoals,
  period,
}: IncomesTableProps) => {
  const activeMonths = getActiveMonths(incomes);

  return (
    <table className="w-full border-collapse border border-slate-200 text-xs">
      <thead className="bg-slate-50">
        <tr>
          <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">
            Category
          </th>

          {months.map((month) => {
            const isSelectedMonth = period === month;

            return (
              <th
                key={month}
                className={`border border-slate-200 px-3 py-2 text-center font-semibold ${
                  isSelectedMonth
                    ? "bg-sky-100 text-sky-900"
                    : "text-slate-700"
                }`}
              >
                {month}
              </th>
            );
          })}

          <th className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
            Average
          </th>

          <th className="border border-slate-200 bg-amber-50 px-3 py-2 text-center font-semibold text-amber-900">
            Goal
          </th>
        </tr>
      </thead>

      <tbody>
        {incomeCategories.map((category) => {
          const average = getCategoryAverage(incomes, category, activeMonths);

          return (
            <tr key={category} className="hover:bg-slate-50">
              <th
                className="border border-slate-200 bg-slate-50 px-4 py-2 text-left font-medium text-slate-800"
                scope="row"
              >
                {category}
              </th>

              {months.map((month) => {
                const isSelectedMonth = period === month;

                return (
                  <td
                    key={month}
                    className={`border border-slate-200 px-3 py-2 text-center text-slate-700 ${
                      isSelectedMonth ? "bg-sky-50 font-semibold" : ""
                    }`}
                  >
                    {incomes[category]?.[month] ?? (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                );
              })}

              <td className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
                {average !== null ? average.toFixed(2) : "-"}
              </td>

              <GoalCell
                value={incomeGoals[category] ?? null}
                onChange={(val) =>
                  setIncomeGoals((prev) => ({
                    ...prev,
                    [category]: val,
                  }))
                }
                average={average}
                isHigherBetter={true}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};