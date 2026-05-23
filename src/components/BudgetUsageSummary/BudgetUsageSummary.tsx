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
    plannedBudget > 0
      ? Math.round((spentAverage / plannedBudget) * 100)
      : null;

  const remaining = plannedBudget - spentAverage;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-700">
        Wykorzystanie zaplanowanego budżetu
      </h2>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">Zaplanowano</p>
          <p className="text-lg font-bold">{plannedBudget.toFixed(2)} zł</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Średnio wydano</p>
          <p className="text-lg font-bold">{spentAverage.toFixed(2)} zł</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Wykorzystano</p>
          <p className="text-lg font-bold">
            {usagePercent !== null ? `${usagePercent}%` : "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Pozostało</p>
          <p
            className={`text-lg font-bold ${
              remaining < 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {remaining.toFixed(2)} zł
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${
            usagePercent !== null && usagePercent > 100
              ? "bg-rose-500"
              : "bg-emerald-500"
          }`}
          style={{
            width:
              usagePercent !== null
                ? `${Math.min(Math.max(usagePercent, 0), 100)}%`
                : "0%",
          }}
        />
      </div>
    </section>
  );
};