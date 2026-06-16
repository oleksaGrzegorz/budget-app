import { Fragment } from "react";

import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import type { Forecast } from "../../data/initialForecast";
import { months } from "../../data/months";
import { getIncomeForecastMetrics } from "../../hooks/getIncomeForecastMetrics";
import type { BudgetData } from "../../types/budgetData";
import { AnnualSavingsProgress } from "./AnnualSavingsProgress";
import { MonthlyNotes } from "./MonthlyNotes";
import { MonthlyPerformanceTable } from "./MonthlyPerformanceTable";

interface IncomeForecastTableProps {
  incomes: BudgetData;
  expenses: BudgetData;
  forecast: Forecast;
  setForecast: React.Dispatch<React.SetStateAction<Forecast>>;
}
const formatMoney = (value: number) => value.toFixed(2);

const inputClassName =
  "w-16 rounded-md border border-slate-200 bg-white px-1 py-1 text-center text-[11px] font-semibold text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100";

const expenseInputClassName =
  "w-16 rounded-md border border-rose-200 bg-white px-1 py-1 text-center text-[11px] font-semibold text-rose-700 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100";

const mutedLabelClassName =
  "w-28 border border-slate-200 bg-white px-2 py-1 text-left font-medium text-slate-500";

const summaryHeaderClassName =
  "border border-slate-200 bg-sky-50 px-1 py-1 text-center font-black text-sky-900";

const labelClassName =
  "w-28 border border-slate-200 bg-slate-50 px-2 py-1 text-left font-semibold text-slate-800";

const tableClassName =
  "w-full table-fixed border-collapse border border-slate-200 text-[11px]";

const baseHeaderClassName =
  "w-28 border border-slate-200 px-2 py-1 text-left font-semibold text-slate-700";

const monthHeaderClassName =
  "border border-slate-200 px-1 py-1 text-center font-semibold text-slate-700";

const summaryCellClassName =
  "border border-slate-200 bg-sky-50 px-1 py-1 text-center font-black text-sky-900";

const valueCellClassName =
  "border border-slate-200 bg-white px-1 py-1 text-center font-bold";

const getTextClassName = (value: number) => {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-rose-600";
  return "text-slate-400";
};

export const IncomeForecastTable = ({
  incomes,
  expenses,
  forecast,
  setForecast,
}: IncomeForecastTableProps) => {
  const {
    getActualIncome,
    getActualExpenses,
    getPlannedIncome,
    getPlannedExpenses,
    getSavingsGoal,
    getActualSavings,
    hasActualData,
    getRating,
    getYearTotal,
    getAverage,
    getActualAverage,
    getActualYearTotal,
    getAverageRating,
    getActualIncomeByCategory,
    annualGoal,
    annualResult,
    forecastedYearEnd,
    forecastGap,
    actualProgress,
    forecastProgress,
    gapProgress,
    forecastedProgress,
    savedProgress,
    remainingForecast,
  } = getIncomeForecastMetrics(incomes, expenses, forecast);

  const updateIncomeForecast = (
    category: string,
    month: string,
    value: number | null,
  ) => {
    setForecast((prev) => ({
      ...prev,
      incomes: {
        ...prev.incomes,
        [category]: {
          ...prev.incomes[category],
          [month]: value ?? 0,
        },
      },
    }));
  };

  const updatePlannedExpenses = (month: string, value: number | null) => {
    setForecast((prev) => ({
      ...prev,
      plannedExpenses: {
        ...prev.plannedExpenses,
        [month]: value ?? 0,
      },
    }));
  };

  return (
    <div>
      <AnnualSavingsProgress
        annualGoal={annualGoal}
        annualResult={annualResult}
        forecastedYearEnd={forecastedYearEnd}
        forecastGap={forecastGap}
        actualProgress={actualProgress}
        forecastProgress={forecastProgress}
        gapProgress={gapProgress}
        forecastedProgress={forecastedProgress}
        savedProgress={savedProgress}
        remainingForecast={remainingForecast}
      />

      <MonthlyPerformanceTable
        getActualIncome={getActualIncome}
        getPlannedIncome={getPlannedIncome}
        getActualExpenses={getActualExpenses}
        getPlannedExpenses={getPlannedExpenses}
        getSavingsGoal={getSavingsGoal}
        getActualSavings={getActualSavings}
        hasActualData={hasActualData}
        getRating={getRating}
        getAverageRating={getAverageRating}
        getActualAverage={getActualAverage}
        getActualYearTotal={getActualYearTotal}
        getAverage={getAverage}
        getYearTotal={getYearTotal}
      />

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-black tracking-tight text-slate-900">
          Forecast assumptions
        </h3>

        <table className={tableClassName}>
          <thead className="bg-slate-50">
            <tr>
              <th className={baseHeaderClassName}>Category</th>

              {months.map((month) => (
                <th key={month} className={monthHeaderClassName}>
                  {month}
                </th>
              ))}

              <th className={summaryHeaderClassName}>Avg</th>
              <th className={summaryHeaderClassName}>Year</th>
            </tr>
          </thead>

          <tbody>
            {incomeCategories.map((category) => (
              <Fragment key={category}>
                <tr>
                  <th className={labelClassName}>{category}</th>

                  {months.map((month) => (
                    <td
                      key={month}
                      className="border border-slate-200 bg-white px-1 py-1 text-center"
                    >
                      <input
                        type="number"
                        value={forecast.incomes[category]?.[month] ?? 0}
                        onChange={(event) =>
                          updateIncomeForecast(
                            category,
                            month,
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                          )
                        }
                        className={inputClassName}
                      />
                    </td>
                  ))}

                  <td className={summaryCellClassName}>
                    {formatMoney(
                      getAverage(
                        (month) => forecast.incomes[category]?.[month] ?? 0,
                      ),
                    )}
                  </td>

                  <td className={summaryCellClassName}>
                    {formatMoney(
                      getYearTotal(
                        (month) => forecast.incomes[category]?.[month] ?? 0,
                      ),
                    )}
                  </td>
                </tr>

                <tr>
                  <th className={mutedLabelClassName}>Diff.</th>

                  {months.map((month) => {
                    const planned = forecast.incomes[category]?.[month] ?? 0;
                    const actual = getActualIncomeByCategory(category, month);
                    const difference = actual - planned;
                    const hasData = actual > 0 || planned > 0;

                    return (
                      <td
                        key={month}
                        className={`${valueCellClassName} ${
                          hasData
                            ? getTextClassName(difference)
                            : "text-slate-400"
                        }`}
                      >
                        {hasData ? formatMoney(difference) : "-"}
                      </td>
                    );
                  })}

                  <td className={summaryCellClassName}>
                    {getActualAverage(
                      (month) =>
                        getActualIncomeByCategory(category, month) -
                        (forecast.incomes[category]?.[month] ?? 0),
                    ) !== null
                      ? formatMoney(
                          getActualAverage(
                            (month) =>
                              getActualIncomeByCategory(category, month) -
                              (forecast.incomes[category]?.[month] ?? 0),
                          ) ?? 0,
                        )
                      : "-"}
                  </td>

                  <td className={summaryCellClassName}>
                    {formatMoney(
                      getActualYearTotal(
                        (month) =>
                          getActualIncomeByCategory(category, month) -
                          (forecast.incomes[category]?.[month] ?? 0),
                      ),
                    )}
                  </td>
                </tr>
              </Fragment>
            ))}

            <tr className="border-t-4 border-t-slate-100">
              <th className="border border-slate-200 bg-rose-50 px-2 py-1 text-left font-black text-rose-900">
                Planned expenses
              </th>

              {months.map((month) => (
                <td
                  key={month}
                  className="border border-slate-200 bg-rose-50 px-1 py-1 text-center"
                >
                  <input
                    type="number"
                    value={forecast.plannedExpenses[month] ?? 0}
                    onChange={(event) =>
                      updatePlannedExpenses(
                        month,
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                      )
                    }
                    className={expenseInputClassName}
                  />
                </td>
              ))}

              <td className={summaryCellClassName}>
                {formatMoney(getAverage(getPlannedExpenses))}
              </td>

              <td className={summaryCellClassName}>
                {formatMoney(getYearTotal(getPlannedExpenses))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <MonthlyNotes forecast={forecast} setForecast={setForecast} />
    </div>
  );
};
