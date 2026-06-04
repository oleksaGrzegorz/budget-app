import { categoryGroups } from "../../data/categories";
import { expenseCategoryAverageTypes } from "../../data/expenseCategoryAverageTypes";
import {
  getActiveMonths,
  getCategoryAverage,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface ExpensesByCategoryChartProps {
  expenses: Record<string, Record<string, number>>;
  period: PeriodOption;
}

const chartColors = [
  "#f43f5e",
  "#8b5cf6",
  "#3b82f6",
  "#f59e0b",
  "#94a3b8",
  "#10b981",
  "#06b6d4",
  "#ec4899",
];

const maxVisibleItems = 7;

export const ExpensesByCategoryChart = ({
  expenses,
  period,
}: ExpensesByCategoryChartProps) => {
  const activeMonths = getActiveMonths(expenses);

  const groupItems = categoryGroups
    .map((group) => {
      const value = group.categories.reduce((sum, category) => {
        const amount =
          period === "average"
            ? getCategoryAverage(
                expenses,
                category,
                activeMonths,
                expenseCategoryAverageTypes,
              ) ?? 0
            : expenses[category]?.[period] ?? 0;

        return sum + amount;
      }, 0);

      return {
        name: group.name,
        emoji: group.emoji,
        value,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const topItems = groupItems.slice(0, maxVisibleItems);
  const otherValue = groupItems
    .slice(maxVisibleItems)
    .reduce((sum, item) => sum + item.value, 0);

  const items =
    otherValue > 0
      ? [...topItems, { name: "Other", emoji: "📦", value: otherValue }]
      : topItems;

  const total = items.reduce((sum, item) => sum + item.value, 0);

  let currentPercent = 0;

  const gradient =
    total > 0
      ? items
          .map((item, index) => {
            const percent = (item.value / total) * 100;
            const start = currentPercent;
            const end = currentPercent + percent;

            currentPercent = end;

            return `${chartColors[index]} ${start}% ${end}%`;
          })
          .join(", ")
      : "#e2e8f0 0% 100%";

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Expenses by category
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Share of your total spending
          </p>
        </div>

        <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
          {period === "average" ? "Average" : period}
        </span>
      </div>

      {total > 0 ? (
        <>
          <div className="grid flex-1 gap-6 lg:grid-cols-[210px_1fr] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div
                className="relative h-52 w-52 rounded-full"
                style={{
                  background: `conic-gradient(${gradient})`,
                }}
              >
                <div className="absolute inset-16 rounded-full bg-white" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                </div>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const percent = (item.value / total) * 100;

                return (
                  <div key={item.name} className="flex items-start gap-3">
                    <span
                      className="mt-1 h-3.5 w-3.5 shrink-0 rounded-md"
                      style={{ backgroundColor: chartColors[index] }}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-slate-800">
                          <span className="mr-1">{item.emoji}</span>
                          {item.name}
                        </span>

                        <span className="shrink-0 text-sm font-black text-slate-900">
                          {percent.toFixed(0)}%
                        </span>
                      </div>

                      <div className="mt-0.5 text-xs font-semibold text-slate-500">
                        {item.value.toFixed(2)} euro
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="my-6 h-px bg-slate-100" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-bold text-slate-900">
              Total spent
            </span>

            <span className="text-2xl font-black tracking-tight text-slate-900">
              {total.toFixed(2)} euro
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-400">
          No expenses for selected period
        </div>
      )}
    </section>
  );
};