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

const maxVisibleItems = 9;

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
            ? (getCategoryAverage(
                expenses,
                category,
                activeMonths,
                expenseCategoryAverageTypes,
              ) ?? 0)
            : (expenses[category]?.[period] ?? 0);

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
  const hiddenItems = groupItems.slice(maxVisibleItems);

  const otherValue = hiddenItems.reduce((sum, item) => sum + item.value, 0);

  const visibleOtherItem = topItems.find((item) => item.name === "Other");

  const items =
    otherValue > 0
      ? visibleOtherItem
        ? topItems.map((item) =>
            item.name === "Other"
              ? { ...item, value: item.value + otherValue }
              : item,
          )
        : [...topItems, { name: "Other", emoji: "📦", value: otherValue }]
      : topItems;

  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-lg font-black text-amber-600">
              ▮
            </span>
          </div>

          <div>
            <h3 className="text-base font-black tracking-tight text-slate-900">
              Expense categories
            </h3>

            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              {period === "average" ? "Average view" : `Month ${period}`}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {total > 0 ? (
        <>
          <div className="mt-5 flex flex-1 flex-col justify-center rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                Share of total spending
              </span>

              <span className="text-xs font-black text-slate-500">
                Top {items.length}
              </span>
            </div>

            <div className="relative h-64">
              <div className="absolute inset-x-0 top-0 bottom-10 flex flex-col justify-between">
                {[40, 30, 20, 10, 0].map((mark) => (
                  <div key={mark} className="flex items-center gap-2">
                    <span className="w-7 text-right text-[10px] font-black text-slate-400">
                      {mark}%
                    </span>

                    <div className="h-px flex-1 border-t border-dashed border-slate-200" />
                  </div>
                ))}
              </div>

              <div className="absolute left-9 right-0 top-0 bottom-10 flex items-end justify-between gap-3">
                {items.map((item, index) => {
                  const percent = (item.value / total) * 100;
                  const height = (Math.min(percent, 40) / 40) * 100;

                  return (
                    <div
                      key={item.name}
                      className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      title={`${item.name}: ${formatMoney(item.value)} euro (${percent.toFixed(1)}%)`}
                    >
                      <div className="mb-2 text-xs font-black text-slate-700">
                        {percent.toFixed(0)}%
                      </div>

                      <div className="flex h-full w-full max-w-12 items-end justify-center">
                        <div
                          className={`w-full rounded-t-2xl shadow-sm transition-all duration-500 ${
                            index === 0
                              ? "bg-amber-600"
                              : index === 1
                                ? "bg-amber-500"
                                : index === 2
                                  ? "bg-amber-400"
                                  : "bg-amber-300"
                          }`}
                          style={{
                            height: `${Math.max(height, 6)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute left-9 right-0 bottom-0 flex justify-between gap-3">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="min-w-0 flex-1 text-center"
                    title={item.name}
                  >
                    <div className="text-base leading-none">{item.emoji}</div>

                    <div className="mt-1 truncate text-[10px] font-black text-slate-500">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-slate-100" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-slate-500">
              Total spent
            </span>

            <span className="text-xl font-black tracking-tight text-slate-900">
              {formatMoney(total)} euro
            </span>
          </div>
        </>
      ) : (
        <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-8 text-center">
          <div className="text-sm font-black text-slate-700">No expenses</div>

          <div className="mt-1 text-xs font-semibold text-slate-500">
            No category data for selected period
          </div>
        </div>
      )}
    </section>
  );
};
