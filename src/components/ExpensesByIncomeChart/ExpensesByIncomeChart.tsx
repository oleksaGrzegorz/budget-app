import { categoryGroups } from "../../data/categories";
import { expenseCategoryAverageTypes } from "../../data/expenseCategoryAverageTypes";
import {
  getActiveMonths,
  getCategoryAverage,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface ExpensesByIncomeChartProps {
  expenses: Record<string, Record<string, number>>;
  incomes: Record<string, Record<string, number>>;
  period: PeriodOption;
}

const chartColors = [
  "#0f172a",
  "#334155",
  "#64748b",
  "#38bdf8",
  "#22c55e",
  "#f59e0b",
  "#f43f5e",
  "#cbd5e1",
];

const maxVisibleItems = 7;

export const ExpensesByIncomeChart = ({
  expenses,
  incomes,
  period,
}: ExpensesByIncomeChartProps) => {
  const activeMonths = getActiveMonths(expenses, incomes);

  const totalIncome =
    period === "average"
      ? activeMonths.length > 0
        ? activeMonths.reduce((sum, month) => {
            const monthIncome = Object.values(incomes).reduce(
              (total, category) => total + (category[month] ?? 0),
              0,
            );

            return sum + monthIncome;
          }, 0) / activeMonths.length
        : 0
      : Object.values(incomes).reduce(
          (sum, category) => sum + (category[period] ?? 0),
          0,
        );

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

  const totalSpent = items.reduce((sum, item) => sum + item.value, 0);
  const usedPercent = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0;
  const remainingIncome = totalIncome - totalSpent;

  let currentPercent = 0;

  const gradient =
    totalIncome > 0
      ? items
          .map((item, index) => {
            const percent = (item.value / totalIncome) * 100;
            const start = currentPercent;
            const end = currentPercent + percent;

            currentPercent = end;

            return `${chartColors[index]} ${start}% ${end}%`;
          })
          .join(", ")
      : "#e2e8f0 0% 100%";

  const backgroundStart = Math.min(usedPercent, 100);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Income usage
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-500">
            How much of income goes to each group
          </p>
        </div>

        <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
          {period === "average" ? "Average" : period}
        </span>
      </div>

      {totalIncome > 0 ? (
        <>
          <div className="grid flex-1 gap-6 lg:grid-cols-[210px_1fr] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div
                className="relative h-52 w-52 rounded-full"
                style={{
                  background: `conic-gradient(${gradient}, #e2e8f0 ${backgroundStart}% 100%)`,
                }}
              >
                <div className="absolute inset-16 rounded-full bg-white" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-500">
                    Used
                  </span>

                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    {usedPercent.toFixed(0)}%
                  </span>

                  <span className="text-xs font-semibold text-slate-400">
                    income
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const percent = (item.value / totalIncome) * 100;

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

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm font-bold text-slate-500">
                Income used
              </div>

              <div className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                {totalSpent.toFixed(2)} euro
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-sm font-bold text-slate-500">
                Remaining
              </div>

              <div
                className={`mt-1 text-2xl font-black tracking-tight ${
                  remainingIncome < 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {remainingIncome.toFixed(2)} euro
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-400">
          No income for selected period
        </div>
      )}
    </section>
  );
};