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

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-700">Budget usage</h2>

        <span
          className={`text-sm font-semibold ${
            isOverBudget ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          Remaining {remaining.toFixed(2)} zł
        </span>
      </div>

      <div className="mt-6">
        <div className="text-3xl font-bold tracking-tight text-slate-900">
          {spentAverage.toFixed(2)}
          <span className="mx-2 text-slate-300">/</span>
          {plannedBudget.toFixed(2)} zł
        </div>

        <div className="mt-1 text-sm text-slate-500">
          average spent / planned
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{
              width:
                usagePercent !== null
                  ? `${Math.min(Math.max(usagePercent, 0), 100)}%`
                  : "0%",
            }}
          />
        </div>

        <span
          className={`min-w-[50px] text-right text-sm font-bold ${
            isOverBudget ? "text-rose-600" : "text-slate-700"
          }`}
        >
          {usagePercent !== null ? `${usagePercent}%` : "-"}
        </span>
      </div>
    </section>
  );
};