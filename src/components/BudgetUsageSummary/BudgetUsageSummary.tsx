import {
  categories,
  categoryAverageTypes,
  categoryEmojis,
  getCategoryAverageType,
} from "../../data/categories";
import { months } from "../../data/months";
import type { BudgetData } from "../../types/budgetData";
import type { GoalsData } from "../../types/goalsData";
import {
  getActiveMonths,
  getCategoriesAverageTotal,
  getMonthTotal,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface BudgetUsageSummaryProps {
  expenses: BudgetData;
  expenseGoals: GoalsData;
  period: PeriodOption;
  setPeriod: React.Dispatch<React.SetStateAction<PeriodOption>>;
}

type ExpectedExpenseItem = {
  category: string;
  emoji: string;
  left: number;
};

type OverspendingItem = {
  category: string;
  emoji: string;
  diff: number;
};

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getMonthProgressPercent = (month: string) => {
  const now = new Date();
  const selectedMonthIndex = Number(month) - 1;

  if (Number.isNaN(selectedMonthIndex)) return null;

  const selectedYear = now.getFullYear();
  const daysInMonth = new Date(
    selectedYear,
    selectedMonthIndex + 1,
    0,
  ).getDate();

  const isCurrentMonth = now.getMonth() === selectedMonthIndex;

  if (!isCurrentMonth) return 100;

  return Math.round((now.getDate() / daysInMonth) * 100);
};

const CategoryName = ({
  category,
  emoji,
}: {
  category: string;
  emoji: string;
}) => {
  const isAnnual = getCategoryAverageType(category) === "annual";

  return (
    <span className="truncate text-slate-500">
      <span className="mr-1">{emoji}</span>
      {category}
      {isAnnual && (
        <span
          className="ml-1 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-indigo-600"
          title="Annual category"
        >
          annual
        </span>
      )}
    </span>
  );
};

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

  const expectedExpenseItems: ExpectedExpenseItem[] =
    period === "average"
      ? []
      : categories
          .map((category): ExpectedExpenseItem | null => {
            if (getCategoryAverageType(category) === "annual") return null;

            const goal = expenseGoals[category] ?? 0;
            const spent = expenses[category]?.[period] ?? 0;

            if (!goal || spent >= goal) return null;

            return {
              category,
              emoji: categoryEmojis[category] ?? "",
              left: goal - spent,
            };
          })
          .filter((item): item is ExpectedExpenseItem => item !== null)
          .sort((a, b) => b.left - a.left);

  const expectedExpensesLeft = expectedExpenseItems.reduce(
    (sum, item) => sum + item.left,
    0,
  );

  const topExpectedItems = expectedExpenseItems.slice(0, 3);

  const overspendingItems: OverspendingItem[] =
    period === "average"
      ? []
      : categories
          .map((category): OverspendingItem | null => {
            const goal = expenseGoals[category] ?? 0;
            const spent = expenses[category]?.[period] ?? 0;

            if (!goal || spent <= goal) return null;

            return {
              category,
              emoji: categoryEmojis[category] ?? "",
              diff: spent - goal,
            };
          })
          .filter((item): item is OverspendingItem => item !== null)
          .sort((a, b) => b.diff - a.diff);

  const topOverspendingItems = overspendingItems.slice(0, 3);

  const projectedMonthEnd =
    period === "average" ? selectedSpent : selectedSpent + expectedExpensesLeft;

  const remaining = plannedBudget - selectedSpent;
  const projectedGap = plannedBudget - projectedMonthEnd;

  const isOverBudget = remaining < 0;
  const isProjectedOverBudget = projectedGap < 0;

  const usagePercent =
    plannedBudget > 0
      ? Math.round((selectedSpent / plannedBudget) * 100)
      : null;

  const projectedUsagePercent =
    plannedBudget > 0
      ? Math.round((projectedMonthEnd / plannedBudget) * 100)
      : null;

  const monthProgressPercent =
    period === "average" ? null : getMonthProgressPercent(period);

  const isSpendingTooFast =
    monthProgressPercent !== null &&
    usagePercent !== null &&
    usagePercent > monthProgressPercent;

  const progress =
    usagePercent !== null ? Math.min(Math.max(usagePercent, 0), 100) : 0;

  const projectedProgress =
    projectedUsagePercent !== null
      ? Math.min(Math.max(projectedUsagePercent, 0), 100)
      : 0;

  const spentLabel =
    period === "average" ? "average spent" : `spent in ${period}`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
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
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-8">
        <div className="flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 sm:px-5 lg:w-auto lg:min-w-[270px] lg:px-6 lg:py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-slate-500 ring-1 ring-slate-200 sm:h-12 sm:w-12 lg:h-14 lg:w-14 lg:text-3xl">
            ↗
          </div>

          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {formatMoney(selectedSpent)}
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
          className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 sm:px-5 lg:w-auto lg:min-w-[270px] lg:px-6 lg:py-5 ${
            isOverBudget
              ? "border-rose-100 bg-rose-50"
              : "border-emerald-100 bg-emerald-50"
          }`}
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl ring-1 sm:h-12 sm:w-12 lg:h-14 lg:w-14 lg:text-3xl ${
              isOverBudget ? "ring-rose-200" : "ring-emerald-200"
            }`}
          >
            🎯
          </div>

          <div>
            <div
              className={`text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl ${
                isOverBudget ? "text-rose-900" : "text-emerald-900"
              }`}
            >
              {formatMoney(plannedBudget)}
            </div>

            <div
              className={`text-sm font-medium lg:text-base ${
                isOverBudget ? "text-rose-700" : "text-emerald-700"
              }`}
            >
              planned budget
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-slate-400">
              Current: {usagePercent !== null ? `${usagePercent}%` : "-"}
            </span>

            {monthProgressPercent !== null && (
              <span
                className={`text-[10px] font-bold ${
                  isSpendingTooFast ? "text-amber-500" : "text-emerald-600"
                }`}
              >
                Month progress: {monthProgressPercent}%
              </span>
            )}
          </div>

          {period !== "average" && (
            <span
              className={`text-xs font-black ${
                isProjectedOverBudget ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              Projected:{" "}
              {projectedUsagePercent !== null
                ? `${projectedUsagePercent}%`
                : "-"}
            </span>
          )}
        </div>

        <div className="relative h-2 overflow-visible rounded-full bg-slate-100">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
              isOverBudget ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{ width: `${progress}%` }}
          />

          {monthProgressPercent !== null && (
            <div
              className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-slate-400 ring-4 ring-white"
              style={{ left: `${Math.min(monthProgressPercent, 100)}%` }}
              title="Month progress"
            />
          )}

          {period !== "average" && (
            <div
              className={`absolute top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full ring-4 ring-white ${
                isProjectedOverBudget ? "bg-rose-500" : "bg-emerald-500"
              }`}
              style={{ left: `${projectedProgress}%` }}
              title="Projected month end"
            />
          )}

          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 h-full w-px bg-white/90"
              style={{ left: `${mark}%` }}
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

      {period !== "average" && (
        <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 lg:grid-cols-[1fr_1.3fr_1fr]">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Current status
            </div>

            <div
              className={`mt-1 text-xl font-black ${
                isOverBudget ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {isOverBudget ? "Over by" : "Under by"}{" "}
              {formatMoney(Math.abs(remaining))}
            </div>

            <div className="mt-1 text-xs font-semibold text-slate-500">
              Actual spend vs planned budget
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Expected regular left
            </div>

            <div className="mt-1 text-xl font-black text-slate-900">
              {formatMoney(expectedExpensesLeft)}
            </div>

            {topExpectedItems.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {topExpectedItems.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between gap-3 text-xs font-bold"
                  >
                    <CategoryName
                      category={item.category}
                      emoji={item.emoji}
                    />

                    <span className="shrink-0 text-slate-700">
                      {formatMoney(item.left)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Forecast month end
            </div>

            <div
              className={`mt-1 text-xl font-black ${
                isProjectedOverBudget ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {formatMoney(projectedMonthEnd)}
            </div>

            {isProjectedOverBudget && topOverspendingItems.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {topOverspendingItems.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between gap-3 text-xs font-bold"
                  >
                    <CategoryName
                      category={item.category}
                      emoji={item.emoji}
                    />

                    <span className="shrink-0 text-rose-600">
                      {formatMoney(item.diff)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};