import {
  categories,
  categoryEmojis,
  categoryIconClassNames,
} from "../../data/categories";
import { months } from "../../data/months";
import { GoalCell } from "../BudgetSummaryTable/GoalCell";
import { calculateAverage } from "../../utils/calculateAverage";

interface ExpensesTableProps {
  expenses: Record<string, Record<string, number>>;
  goals: Record<string, number | null>;
  setGoals: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
}

export const ExpensesTable = ({
  expenses,
  goals,
  setGoals,
}: ExpensesTableProps) => {
  return (
    <table className="w-full border-collapse border border-slate-200 text-xs">
      <thead className="bg-slate-50">
        <tr>
          <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">
            Kategoria
          </th>

          {months.map((month) => (
            <th
              key={month}
              className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700"
            >
              {month}
            </th>
          ))}

          <th className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
            Średnia
          </th>

          <th className="border border-slate-200 bg-amber-50 px-3 py-2 text-center font-semibold text-amber-900">
            Wykorzystanie celu
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((category) => {
          const average = calculateAverage(
            months.map((month) => expenses[category]?.[month] ?? 0),
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

              {months.map((month) => (
                <td
                  key={month}
                  className="border border-slate-200 px-3 py-2 text-center text-slate-700"
                >
                  {expenses[category]?.[month] ?? (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
              ))}

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