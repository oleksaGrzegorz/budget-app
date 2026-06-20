import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import type { Forecast } from "../../data/initialForecast";
import { months } from "../../data/months";
import type { BudgetData } from "../../types/budgetData";
import {
  getActiveMonths,
  getCategoryAverage,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface IncomeGoalCardProps {
  incomes: BudgetData;
  forecast: Forecast;
  period: PeriodOption;
}

type IncomePlanItem = {
  category: string;
  actual: number;
  planned: number;
  difference: number;
  missing: number;
  progress: number;
  displayProgress: number;
  isBelowPlan: boolean;
  hasPlan: boolean;
};

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getPlannedAverage = (
  forecast: Forecast,
  category: string,
  monthsForAverage: string[],
) => {
  if (monthsForAverage.length === 0) return 0;

  const total = monthsForAverage.reduce(
    (sum, month) => sum + (forecast.incomes[category]?.[month] ?? 0),
    0,
  );

  return total / monthsForAverage.length;
};

export const IncomeGoalCard = ({
  incomes,
  forecast,
  period,
}: IncomeGoalCardProps) => {
  const activeMonths = getActiveMonths(incomes);
  const monthsForAverage = activeMonths.length > 0 ? activeMonths : months;

  const items = incomeCategories
    .map((category): IncomePlanItem => {
      const actual =
        period === "average"
          ? (getCategoryAverage(incomes, category, activeMonths) ?? 0)
          : (incomes[category]?.[period] ?? 0);

      const planned =
        period === "average"
          ? getPlannedAverage(forecast, category, monthsForAverage)
          : (forecast.incomes[category]?.[period] ?? 0);

      const difference = actual - planned;
      const missing = difference < 0 ? Math.abs(difference) : 0;
      const rawProgress = planned > 0 ? (actual / planned) * 100 : 0;
      const progress = Math.min(rawProgress, 100);

      return {
        category,
        actual,
        planned,
        difference,
        missing,
        progress,
        displayProgress: rawProgress,
        isBelowPlan: difference < 0,
        hasPlan: planned > 0,
      };
    })
    .filter((item) => item.actual > 0 || item.hasPlan);

  const belowPlanItems = items
    .filter((item) => item.hasPlan && item.isBelowPlan)
    .sort((a, b) => b.missing - a.missing);

  const reachedPlanItems = items
    .filter((item) => item.hasPlan && !item.isBelowPlan)
    .sort((a, b) => b.difference - a.difference);

  const totalActual = items.reduce((sum, item) => sum + item.actual, 0);
  const totalPlanned = items.reduce((sum, item) => sum + item.planned, 0);
  const totalDifference = totalActual - totalPlanned;
  const totalRawProgress =
    totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
  const totalProgress = Math.min(totalRawProgress, 100);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-base font-black text-emerald-600">
            €
          </span>
        </div>

        <div>
          <h3 className="text-sm font-black tracking-tight text-slate-900">
            Income plan
          </h3>

          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {period === "average" ? "Average vs forecast" : `Month ${period}`}
          </p>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-3 items-center gap-3 text-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Actual income
            </div>

            <div className="mt-1 text-xl font-black text-slate-900">
              {formatMoney(totalActual)}
            </div>
          </div>

          <div className="border-x border-slate-200 px-3">
            <div
              className={`text-[11px] font-bold uppercase tracking-wide ${
                totalDifference < 0 ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {totalDifference < 0 ? "Missing" : "Above"}
            </div>

            <div
              className={`mt-1 text-xl font-black ${
                totalDifference < 0 ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {formatMoney(Math.abs(totalDifference))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Forecast
            </div>

            <div className="mt-1 text-xl font-black text-slate-900">
              {formatMoney(totalPlanned)}
            </div>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalDifference < 0 ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        <div className="mt-1 text-center text-[11px] font-bold text-slate-400">
          {Math.round(totalRawProgress)}% of forecast
        </div>
      </div>

      <div className="mt-4 grid flex-1 gap-3 md:grid-cols-2">
        <div>
          <div className="mb-2 text-[11px] font-black uppercase tracking-wide text-slate-400">
            Needs attention
          </div>

          <div className="space-y-2">
            {belowPlanItems.length > 0 ? (
              belowPlanItems.map((item) => (
                <div
                  key={item.category}
                  className="rounded-xl bg-rose-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-black text-slate-800">
                      {item.category}
                    </span>

                    <span className="shrink-0 font-black text-rose-600">
                      -{formatMoney(item.missing)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-3 text-[10px] font-bold text-slate-400">
                    <span>
                      {formatMoney(item.actual)} / {formatMoney(item.planned)}
                    </span>

                    <span>{Math.round(item.displayProgress)}%</span>
                  </div>

                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-600">
                All planned income reached
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-black uppercase tracking-wide text-slate-400">
            Reached
          </div>

          <div className="space-y-2">
            {reachedPlanItems.length > 0 ? (
              reachedPlanItems.map((item) => (
                <div
                  key={item.category}
                  className="rounded-xl bg-emerald-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-black text-slate-800">
                      {item.category}
                    </span>

                    <span className="shrink-0 font-black text-emerald-600">
                      +{formatMoney(item.difference)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-3 text-[10px] font-bold text-slate-400">
                    <span>
                      {formatMoney(item.actual)} / {formatMoney(item.planned)}
                    </span>

                    <span>{Math.round(item.displayProgress)}%</span>
                  </div>

                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-bold text-slate-400">
                No reached income yet
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};