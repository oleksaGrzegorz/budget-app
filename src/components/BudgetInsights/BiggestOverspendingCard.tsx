import { categories, categoryEmojis } from "../../data/categories";
import {
  getActiveMonths,
  getCategoryAverage,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface Props {
  expenses: Record<string, Record<string, number>>;
  expenseGoals: Record<string, number | null>;
  period: PeriodOption;
}

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const BiggestOverspendingCard = ({
  expenses,
  expenseGoals,
  period,
}: Props) => {
  const activeMonths = getActiveMonths(expenses);

  const items = categories
    .map((category) => {
      const spent =
        period === "average"
          ? getCategoryAverage(expenses, category, activeMonths)
          : expenses[category]?.[period] ?? 0;

      const goal = expenseGoals[category];

      if (!goal || spent === null || spent <= goal) {
        return null;
      }

      const diff = spent - goal;
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

  const maxDiff = Math.max(...items.map((item) => item.diff), 0);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-lg font-black text-rose-600">
              ↓
            </span>
          </div>

          <div>
            <h3 className="text-base font-black tracking-tight text-slate-900">
              Over budget
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
          {items.map((item) => {
            const barWidth =
              maxDiff > 0 ? Math.max((item.diff / maxDiff) * 100, 8) : 0;

            return (
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
                    <div className="text-xl font-black leading-none text-rose-600">
                      {formatMoney(item.diff)}
                    </div>

                    <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-rose-500">
                      over
                    </div>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-emerald-50 px-4 py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            ✓
          </div>

          <div className="text-sm font-black text-emerald-700">
            No overspending
          </div>

          <div className="mt-1 text-xs font-semibold text-emerald-600">
            All categories are within their budget
          </div>
        </div>
      )}
    </section>
  );
};