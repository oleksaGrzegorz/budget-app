import {
  categories,
  categoryEmojis,
  categoryIconClassNames,
} from "../../data/categories";
import { months } from "../../data/months";
import { GoalCell } from "../BudgetSummaryTable/GoalCell";
import {
  getActiveMonths,
  getCategoryAverage,
  type PeriodOption,
} from "../../utils/budgetAverages";
import { expenseCategoryAverageTypes } from "../../data/expenseCategoryAverageTypes";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
  goals: Record<string, number | null>;
  setGoals: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
  period: PeriodOption;
}

export const ExpensesTable = ({
  expenses,
  goals,
  setGoals,
  period,
}: ExpensesTableProps) => {
  const activeMonths = getActiveMonths(expenses);

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
            Goal usage
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((category) => {
          const average = getCategoryAverage(
            expenses,
            category,
            activeMonths,
            expenseCategoryAverageTypes,
          );

          return (
            <tr key={category} className="hover:bg-slate-50">
              <th
                className="border border-slate-200 bg-slate-50 px-4 py-2 text-left font-medium text-slate-800"
                scope="row"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base ${
                      categoryIconClassNames[category] ??
                      "bg-slate-100 text-slate-600"
                    }`}
                    aria-hidden="true"
                  >
                    {categoryEmojis[category] ?? "🏷️"}
                  </span>

                  <span>{category}</span>
                </div>
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
                    {expenses[category]?.[month] ?? (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                );
              })}

              <td className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
                {average !== null ? average.toFixed(2) : "-"}
              </td>

              <GoalCell
                value={goals[category] ?? null}
                onChange={(val) =>
                  setGoals((prev) => ({
                    ...prev,
                    [category]: val,
                  }))
                }
                average={average}
                isHigherBetter={false}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};