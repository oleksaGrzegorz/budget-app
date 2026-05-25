import { categories } from "../../data/categories";
import { months } from "../../data/months";
import { calculateAverage } from "../../utils/calculateAverage";

interface BudgetUsageSummaryProps {
  expenses: Record<string, Record<string, number>>;
  expenseGoals: Record<string, number | null>;
}

export const BudgetUsageSummary = ({
  expenses,
  expenseGoals,
}: BudgetUsageSummaryProps) => {
  const plannedBudget = categories.reduce(
    (sum, category) => sum + (expenseGoals[category] ?? 0),
    0,
  );

  const spentAverage = categories.reduce((total, category) => {
    const average = calculateAverage(
      months.map((month) => expenses[category]?.[month] ?? 0),
    );

    return total + (average ?? 0);
  }, 0);

  const usagePercent =
    plannedBudget > 0 ? Math.round((spentAverage / plannedBudget) * 100) : null;

  const remaining = plannedBudget - spentAverage;
  const isOverBudget = remaining < 0;

  const overPercent =
    usagePercent !== null && usagePercent > 100 ? usagePercent - 100 : 0;

  const progress =
    usagePercent !== null ? Math.min(Math.max(usagePercent, 0), 100) : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <h2 className="text-sm font-bold text-slate-700">Budget usage</h2>

        <span
          className={`text-sm font-semibold ${
            isOverBudget ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {isOverBudget
            ? `Over budget by ${Math.abs(remaining).toFixed(
                2,
              )} euro (+${overPercent}%)`
            : `Remaining ${remaining.toFixed(2)} euro`}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div
          className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
            isOverBudget ? "bg-rose-50" : "bg-emerald-50"
          }`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
              isOverBudget
                ? "bg-rose-100 text-rose-500"
                : "bg-emerald-100 text-emerald-500"
            }`}
          >
            ↗
          </div>

          <div>
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {spentAverage.toFixed(2)}
            </div>
            <div className="text-sm font-medium text-slate-500">
              average spent
            </div>
          </div>
        </div>

        <div className="text-2xl font-semibold text-slate-300">/</div>

        <div className="flex items-center gap-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl ring-1 ring-amber-200">
            🎯
          </div>

          <div>
            <div className="text-3xl font-bold tracking-tight text-amber-900">
              {plannedBudget.toFixed(2)}
            </div>

            <div className="text-sm font-medium text-amber-700">
              planned budget
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-end">
          <span
            className={`text-sm font-bold tabular-nums ${
              isOverBudget ? "text-rose-600" : "text-slate-700"
            }`}
          >
            {usagePercent !== null ? `${usagePercent}%` : "-"}
          </span>
        </div>

        <div className="relative h-2 overflow-visible rounded-full bg-slate-100">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
              isOverBudget ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />

          {isOverBudget && (
            <div className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-rose-500 ring-4 ring-white" />
          )}

          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 h-full w-px bg-white/90"
              style={{
                left: `${mark}%`,
              }}
            />
          ))}
        </div>

        <div className="mt-2 flex justify-between px-[1px] text-[10px] font-medium text-slate-400">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </section>
  );
};
