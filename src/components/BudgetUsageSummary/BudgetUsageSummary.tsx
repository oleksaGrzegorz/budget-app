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
  selectedYear: string;
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

type Tone = "slate" | "rose" | "emerald";

type InsightMetric = {
  title: string;
  value: string;
  subtitle: string;
  tone: Tone;
  meta?: string;
};

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getMonthRelation = (month: string, year: number) => {
  const now = new Date();
  const selectedMonthIndex = Number(month) - 1;

  if (Number.isNaN(selectedMonthIndex)) return "unknown";

  const selectedDate = new Date(year, selectedMonthIndex, 1);
  const currentDate = new Date(now.getFullYear(), now.getMonth(), 1);

  if (selectedDate < currentDate) return "past";
  if (selectedDate > currentDate) return "future";

  return "current";
};

const getMonthProgressPercent = (month: string, year: number) => {
  const now = new Date();
  const selectedMonthIndex = Number(month) - 1;

  if (Number.isNaN(selectedMonthIndex)) return null;
  if (now.getFullYear() !== year) return null;
  if (now.getMonth() !== selectedMonthIndex) return null;

  const daysInMonth = new Date(year, selectedMonthIndex + 1, 0).getDate();

  return Math.round((now.getDate() / daysInMonth) * 100);
};

const getToneTextClass = (tone: Tone) => {
  if (tone === "rose") return "text-rose-600";
  if (tone === "emerald") return "text-emerald-600";

  return "text-slate-900";
};

const getToneSubtextClass = (tone: Tone) => {
  if (tone === "rose") return "text-rose-500";
  if (tone === "emerald") return "text-emerald-500";

  return "text-slate-500";
};

const formatGapText = (
  gap: number,
  positiveLabel: string,
  negativeLabel: string,
) =>
  gap < 0
    ? `${formatMoney(Math.abs(gap))} ${negativeLabel}`
    : `${formatMoney(gap)} ${positiveLabel}`;

export const BudgetUsageSummary = ({
  expenses,
  expenseGoals,
  period,
  setPeriod,
  selectedYear,
}: BudgetUsageSummaryProps) => {
  const selectedYearNumber = Number(selectedYear);

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

const monthRelation =
  period === "average"
    ? "average"
    : getMonthRelation(period, selectedYearNumber);

  const isClosedMonth = monthRelation === "past";
  const isFutureMonth = monthRelation === "future";

const monthProgressPercent =
  period === "average"
    ? null
    : getMonthProgressPercent(period, selectedYearNumber);

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

  const totalOverspending = overspendingItems.reduce(
    (sum, item) => sum + item.diff,
    0,
  );

const projectedMonthEnd =
  period === "average" || isClosedMonth
    ? selectedSpent
    : selectedSpent + expectedExpensesLeft;

  const remaining = plannedBudget - selectedSpent;
  const projectedGap = plannedBudget - projectedMonthEnd;

  const isOverBudget = remaining < 0;
  const isProjectedOverBudget = projectedGap < 0;

  const usagePercent =
    plannedBudget > 0
      ? Math.round((selectedSpent / plannedBudget) * 100)
      : null;

  const isSpendingTooFast =
    monthProgressPercent !== null &&
    usagePercent !== null &&
    usagePercent > monthProgressPercent;

  const progress =
    usagePercent !== null ? Math.min(Math.max(usagePercent, 0), 100) : 0;

  const insightTitle = isClosedMonth
    ? "Month result"
    : isFutureMonth
      ? "Planned month"
      : "Month outlook";

  const insightSummary = isClosedMonth
    ? `Finished ${formatGapText(
        remaining,
        "under budget",
        "over budget",
      )}. Unused categories were ${formatMoney(
        expectedExpensesLeft,
      )}, while overspending drivers totaled ${formatMoney(totalOverspending)}.`
    : isFutureMonth
      ? `Planned expenses of ${formatMoney(
          expectedExpensesLeft,
        )} leave ${formatGapText(
          projectedGap,
          "expected left",
          "expected overspend",
        )}.`
      : `Now ${formatGapText(
          remaining,
          "left",
          "over budget",
        )}. With ${formatMoney(
          expectedExpensesLeft,
        )} upcoming expenses, month end is ${formatGapText(
          projectedGap,
          "expected left",
          "expected overspend",
        )}.`;

  const firstMetric: InsightMetric = isClosedMonth
    ? {
        title: "Final position",
        value: `${isOverBudget ? "+" : ""}${formatMoney(Math.abs(remaining))}`,
        subtitle: isOverBudget ? "Over budget" : "Under budget",
        tone: isOverBudget ? "rose" : "emerald",
      }
    : isFutureMonth
      ? {
          title: "Available budget",
          value: formatMoney(plannedBudget),
          subtitle: "Starting budget",
          tone: "slate",
        }
      : {
          title: "Now",
          value: `${isOverBudget ? "+" : ""}${formatMoney(
            Math.abs(remaining),
          )}`,
          subtitle: isOverBudget ? "Over budget" : "Left in budget",
          tone: isOverBudget ? "rose" : "emerald",
        };

  const secondMetric: InsightMetric = isClosedMonth
    ? {
        title: "Unused categories",
        value: formatMoney(expectedExpensesLeft),
        subtitle: `${expectedExpenseItems.length} categories not used`,
        tone: "slate",
      }
    : isFutureMonth
      ? {
          title: "Planned expenses",
          value: formatMoney(expectedExpensesLeft),
          subtitle: `${expectedExpenseItems.length} expected items`,
          tone: "slate",
        }
      : {
          title: "Upcoming expenses",
          value: formatMoney(expectedExpensesLeft),
          subtitle: `${expectedExpenseItems.length} expected items`,
          tone: "slate",
        };

const thirdMetric: InsightMetric = isClosedMonth
  ? {
      title: "Overspending drivers",
      value:
        totalOverspending > 0
          ? `+${formatMoney(totalOverspending)}`
          : formatMoney(0),
      subtitle: `${overspendingItems.length} categories over budget`,
      tone: totalOverspending > 0 ? "rose" : "slate",
      meta: `Final spend: ${formatMoney(selectedSpent)}`,
    }
  : {
      title: isFutureMonth ? "Planned position" : "Month end",
      value: `${isProjectedOverBudget ? "+" : ""}${formatMoney(
        Math.abs(projectedGap),
      )}`,
      subtitle: isProjectedOverBudget ? "Expected overspend" : "Expected left",
      tone: isProjectedOverBudget ? "rose" : "emerald",
      meta: `Projected spend: ${formatMoney(projectedMonthEnd)}`,
    };

  const firstOperator = isClosedMonth
    ? "despite"
    : isFutureMonth
      ? "−"
      : isOverBudget
        ? "+"
        : "−";

  const secondOperator = isClosedMonth ? "driven by" : "=";

  const expectedListTitle = isClosedMonth
    ? "Unused categories"
    : isFutureMonth
      ? "Planned expenses"
      : "Upcoming expenses";

  const driversListTitle = isClosedMonth
    ? "Overspending drivers"
    : isFutureMonth
      ? "Risk drivers"
      : "Forecast drivers";

  const emptyExpectedText = isClosedMonth
    ? "No unused categories"
    : isFutureMonth
      ? "No planned expenses"
      : "No upcoming expenses";

  const emptyDriversText = isFutureMonth
    ? "No overspending yet"
    : "No overspending drivers";

const renderMetric = (metric: InsightMetric) => (
  <div className="rounded-xl border border-slate-100 bg-white px-4 py-4 text-center">
    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
      {metric.title}
    </div>

    <div
      className={`mt-2 text-2xl font-bold tracking-tight ${getToneTextClass(
        metric.tone,
      )}`}
    >
      {metric.value}
    </div>

    <div
      className={`mt-1 text-xs font-medium ${getToneSubtextClass(
        metric.tone,
      )}`}
    >
      {metric.subtitle}
    </div>

    {metric.meta && (
      <div className="mt-1 text-[11px] font-medium text-slate-400">
        {metric.meta}
      </div>
    )}
  </div>
);

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

      <div className="mt-8 flex justify-center">
        <div className="text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Budget
          </div>

          <div className="mt-2 text-4xl font-bold tracking-tight">
            <span className={isOverBudget ? "text-rose-600" : "text-slate-900"}>
              {formatMoney(selectedSpent)}
            </span>

            <span className="mx-3 text-slate-300">/</span>

            <span className="text-slate-900">{formatMoney(plannedBudget)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative h-9">
          {monthProgressPercent !== null && (
            <div
              className={`absolute top-0 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-xs font-black shadow-sm ring-1 ${
                isSpendingTooFast
                  ? "text-amber-500 ring-amber-100"
                  : "text-emerald-600 ring-emerald-100"
              }`}
              style={{ left: `${Math.min(monthProgressPercent, 100)}%` }}
            >
              {monthProgressPercent}%
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-2 rounded-full bg-slate-100">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                isOverBudget ? "bg-rose-500" : "bg-emerald-500"
              }`}
              style={{ width: `${progress}%` }}
            />

            {monthProgressPercent !== null && (
              <div
                className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-slate-400 ring-4 ring-white"
                style={{ left: `${Math.min(monthProgressPercent, 100)}%` }}
                title="Month progress"
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
        </div>

        <div className="mt-2 flex justify-between px-[1px] text-[10px] font-medium text-slate-400">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        {monthProgressPercent !== null && usagePercent !== null && (
          <div className="mt-2 text-center text-xs font-medium text-slate-400">
            <span
              className={
                isSpendingTooFast
                  ? "font-bold text-amber-500"
                  : "text-slate-500"
              }
            >
              {usagePercent}% used
            </span>{" "}
            <span>•</span> <span>{monthProgressPercent}% month elapsed</span>
          </div>
        )}
      </div>

      {period !== "average" && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-center">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {insightTitle}
              </div>

              <div className="mx-auto mt-2 max-w-3xl text-sm font-medium text-slate-500">
                {insightSummary}
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
              {renderMetric(firstMetric)}

              <div className="hidden text-center text-xs font-black uppercase tracking-widest text-slate-300 lg:block">
                {firstOperator}
              </div>

              {renderMetric(secondMetric)}

              <div className="hidden text-center text-xs font-black uppercase tracking-widest text-slate-300 lg:block">
                {secondOperator}
              </div>

              {renderMetric(thirdMetric)}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      {expectedListTitle}
                    </div>

                    <div className="mt-1 text-xs font-medium text-slate-500">
                      Scheduled / regular costs still ahead
                    </div>
                  </div>

                  <div className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500">
                    {topExpectedItems.length} items
                  </div>
                </div>

                {topExpectedItems.length > 0 ? (
                  <div className="mt-3 space-y-1.5">
                    {topExpectedItems.map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sm">
                            {item.emoji}
                          </span>

                          <span className="truncate text-xs font-semibold text-slate-600">
                            {item.category}
                          </span>
                        </div>

                        <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
                          {formatMoney(item.left)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg bg-slate-50 px-3 py-3 text-xs font-medium text-slate-400">
                    {emptyExpectedText}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
                <div className="flex items-center justify-between gap-3 border-b border-rose-100 pb-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-rose-400">
                      {driversListTitle}
                    </div>

                    <div className="mt-1 text-xs font-medium text-rose-500">
                      Categories pushing the forecast up
                    </div>
                  </div>

                  <div className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-rose-600 ring-1 ring-rose-100">
                    Risk
                  </div>
                </div>

                {topOverspendingItems.length > 0 ? (
                  <div className="mt-3 space-y-1.5">
                    {topOverspendingItems.map((item, index) => (
                      <div
                        key={item.category}
                        className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 ${
                          index === 0
                            ? "bg-white shadow-sm ring-1 ring-rose-100"
                            : "bg-white/60"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-sm">
                            {item.emoji}
                          </span>

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-1">
                              <span className="truncate text-xs font-semibold text-slate-600">
                                {item.category}
                              </span>

                              {getCategoryAverageType(item.category) ===
                                "annual" && (
                                <span className="shrink-0 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-indigo-600">
                                  annual
                                </span>
                              )}
                            </div>

                            {index === 0 && (
                              <div className="mt-0.5 text-[10px] font-medium text-rose-400">
                                Biggest driver
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-xs font-black text-rose-600">
                          +{formatMoney(item.diff)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg bg-white px-3 py-3 text-xs font-medium text-slate-400 ring-1 ring-slate-100">
                    {emptyDriversText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
