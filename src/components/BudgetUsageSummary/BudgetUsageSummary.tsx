import { categories, categoryAverageTypes } from "../../data/categories";
import { months } from "../../data/months";
import type { BudgetData } from "../../types/budgetData";
import {
  getActiveMonths,
  getCategoriesAverageTotal,
  getMonthTotal,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface BudgetUsageSummaryProps {
  expenses: BudgetData;
  expenseGoals: Record<string, number | null>;
  period: PeriodOption;
  setPeriod: React.Dispatch<React.SetStateAction<PeriodOption>>;
}

export const BudgetUsageSummary = ({
  expenses,
  expenseGoals,
  period,
  setPeriod,
}: BudgetUsageSummaryProps) => {
  const activeMonths = getActiveMonths(expenses);

  const plannedBudget = categories.reduce(
    (sum, category) => sum + (expenseGoals[category] ?? 0),
    0,
  );

  const averageSpent =
    getCategoriesAverageTotal(
      expenses,
      categories,
      activeMonths,
      categoryAverageTypes,
    ) ?? 0;

  const selectedSpent =
    period === "average"
      ? averageSpent
      : getMonthTotal(expenses, categories, period);

  const usagePercent =
    plannedBudget > 0
      ? Math.round((selectedSpent / plannedBudget) * 100)
      : null;

  const remaining = plannedBudget - selectedSpent;
  const isOverBudget = remaining < 0;

  const overPercent =
    usagePercent !== null && usagePercent > 100 ? usagePercent - 100 : 0;

  const progress =
    usagePercent !== null ? Math.min(Math.max(usagePercent, 0), 100) : 0;

  const spentLabel =
    period === "average" ? "average spent" : `spent in ${period}`;

  const plannedStyles = isOverBudget
    ? {
        box: "border-rose-100 bg-rose-50",
        icon: "ring-rose-200",
        value: "text-rose-900",
        label: "text-rose-700",
      }
    : {
        box: "border-emerald-100 bg-emerald-50",
        icon: "ring-emerald-200",
        value: "text-emerald-900",
        label: "text-emerald-700",
      };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm sm:h-12 sm:w-12">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xl font-bold text-slate-900">
                ↗
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Budget usage
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {(["average", ...months] as PeriodOption[]).map((option) => {
              const isActive = period === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPeriod(option)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {option === "average" ? "Average" : option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className={`rounded-xl px-3 py-2 text-sm font-bold sm:px-4 ${
                isOverBudget
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isOverBudget ? "Over budget" : "Remaining"}
            </span>

            <span
              className={`text-lg font-bold sm:text-xl ${
                isOverBudget ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {Math.abs(remaining).toFixed(2)} euro
            </span>

            {isOverBudget && (
              <span className="text-sm font-bold text-rose-600 sm:text-base">
                (+{overPercent}%)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-8">
        <div className="flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 sm:px-5 lg:w-auto lg:min-w-[270px] lg:px-6 lg:py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-slate-500 ring-1 ring-slate-200 sm:h-12 sm:w-12 lg:h-14 lg:w-14 lg:text-3xl">
            ↗
          </div>

          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {selectedSpent.toFixed(2)}
            </div>

            <div className="text-sm font-medium text-slate-500 lg:text-base">
              {spentLabel}
            </div>
          </div>
        </div>

        <div className="hidden text-4xl font-semibold text-slate-300 lg:block">
          /
        </div>

        <div
          className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 sm:px-5 lg:w-auto lg:min-w-[270px] lg:px-6 lg:py-5 ${plannedStyles.box}`}
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl ring-1 sm:h-12 sm:w-12 lg:h-14 lg:w-14 lg:text-3xl ${plannedStyles.icon}`}
          >
            🎯
          </div>

          <div>
            <div
              className={`text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl ${plannedStyles.value}`}
            >
              {plannedBudget.toFixed(2)}
            </div>

            <div
              className={`text-sm font-medium lg:text-base ${plannedStyles.label}`}
            >
              planned budget
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex justify-end">
          <span
            className={`text-sm font-bold ${
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
