import {
  categories,
  categoryAverageTypes,
  categoryEmojis,
  getCategoryAverageType,
} from "../../data/categories";
import type { BudgetData } from "../../types/budgetData";
import type { GoalsData } from "../../types/goalsData";
import {
  getActiveMonths,
  getCategoryAverage,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface Props {
  expenses: BudgetData;
  expenseGoals: GoalsData;
  period: PeriodOption;
}

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const BiggestSavingsCard = ({
  expenses,
  expenseGoals,
  period,
}: Props) => {
  const activeMonths = getActiveMonths(expenses);

  const items = categories
    .map((category) => {
      if (
        period !== "average" &&
        getCategoryAverageType(category) === "annual"
      ) {
        return null;
      }

      const spent =
        period === "average"
          ? getCategoryAverage(expenses, category, activeMonths, categoryAverageTypes)
          : expenses[category]?.[period] ?? 0;

      const goal = expenseGoals[category];

      if (!goal || spent === null || spent >= goal) {
        return null;
      }

      const diff = goal - spent;
      const usagePercent = goal > 0 ? Math.round((spent / goal) * 100) : 0;

      return {
        category,
        emoji: categoryEmojis[category] ?? "",
        diff,
        spent,
        goal,
        usagePercent,
      };
    })
    .filter(
      (
        value,
      ): value is {
        category: string;
        emoji: string;
        diff: number;
        spent: number;
        goal: number;
        usagePercent: number;
      } => value !== null,
    )
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 3);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-lg font-black text-emerald-600">
              ↑
            </span>
          </div>

          <div>
            <h3 className="text-base font-black tracking-tight text-slate-900">
              Budget left
            </h3>

            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              {period === "average" ? "Average view" : `Month ${period}`}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {items.length > 0 ? (
        <div className="mt-5 flex flex-1 flex-col space-y-3">
          {items.map((item) => (
            <div
              key={item.category}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-slate-900">
                    <span className="mr-1">{item.emoji}</span>
                    {item.category}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xl font-black leading-none text-emerald-600">
                    {formatMoney(item.diff)}
                  </div>

                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-emerald-500">
                    left
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      item.usagePercent,
                      item.spent > 0 ? 8 : 0,
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            —
          </div>

          <div className="text-sm font-black text-slate-700">
            No budget left
          </div>

          <div className="mt-1 text-xs font-semibold text-slate-500">
            All visible categories are at or above target
          </div>
        </div>
      )}
    </section>
  );
};