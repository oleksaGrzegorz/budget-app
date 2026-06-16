import { Fragment } from "react";

import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import type { Forecast } from "../../data/initialForecast";
import { months } from "../../data/months";
import { getIncomeForecastMetrics } from "../../hooks/getIncomeForecastMetrics";
import type { BudgetData } from "../../types/budgetData";
import { MonthlyNotes } from "./MonthlyNotes";

interface IncomeForecastTableProps {
  incomes: BudgetData;
  expenses: BudgetData;
  forecast: Forecast;
  setForecast: React.Dispatch<React.SetStateAction<Forecast>>;
}
const formatMoney = (value: number) => value.toFixed(2);

const tableClassName =
  "w-full table-fixed border-collapse border border-slate-200 text-[11px]";

const inputClassName =
  "w-16 rounded-md border border-slate-200 bg-white px-1 py-1 text-center text-[11px] font-semibold text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100";

const expenseInputClassName =
  "w-16 rounded-md border border-rose-200 bg-white px-1 py-1 text-center text-[11px] font-semibold text-rose-700 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100";

const baseHeaderClassName =
  "w-28 border border-slate-200 px-2 py-1 text-left font-semibold text-slate-700";

const monthHeaderClassName =
  "border border-slate-200 px-1 py-1 text-center font-semibold text-slate-700";

const summaryHeaderClassName =
  "border border-slate-200 bg-sky-50 px-1 py-1 text-center font-black text-sky-900";

const labelClassName =
  "w-28 border border-slate-200 bg-slate-50 px-2 py-1 text-left font-semibold text-slate-800";

const mutedLabelClassName =
  "w-28 border border-slate-200 bg-white px-2 py-1 text-left font-medium text-slate-500";

const valueCellClassName =
  "border border-slate-200 bg-white px-1 py-1 text-center font-bold";

const summaryCellClassName =
  "border border-slate-200 bg-sky-50 px-1 py-1 text-center font-black text-sky-900";

const getTextClassName = (value: number) => {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-rose-600";
  return "text-slate-400";
};

const getRatingClassName = (rating: number | null) => {
  if (rating === null) return "text-slate-400";
  if (rating >= 4) return "text-emerald-600";
  if (rating === 3) return "text-amber-600";
  return "text-rose-600";
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
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black tracking-tight text-slate-900">
              Annual savings progress
            </h3>

            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              Saved so far, expected savings and gap to your full-year goal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                Saved
              </div>

              <div className="text-lg font-black text-emerald-700">
                {savedProgress.toFixed(0)}%
              </div>
            </div>

            <div className="rounded-lg bg-sky-50 px-3 py-2 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wide text-sky-600">
                Forecast
              </div>

              <div className="text-lg font-black text-sky-700">
                {forecastedProgress.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${actualProgress}%` }}
            title="Saved YTD"
          />

          <div
            className="h-full bg-emerald-200 transition-all duration-500"
            style={{ width: `${forecastProgress}%` }}
            title="Remaining forecast"
          />

          <div
            className="h-full bg-rose-200 transition-all duration-500"
            style={{ width: `${gapProgress}%` }}
            title="Gap vs goal"
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div className="mt-3 rounded-xl bg-white p-3"></div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            Saved
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-200" />
            Forecast
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-rose-200" />
            Gap
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-white p-5">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Expected year end
            </div>

            <div className="mt-1 text-3xl font-black text-slate-900">
              {formatMoney(forecastedYearEnd)}
            </div>
          </div>

          <div className="my-5 h-px bg-slate-100" />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-emerald-50 p-3 text-center">
              <div className="text-xs font-bold text-emerald-600">Saved</div>

              <div className="mt-1 text-xl font-black text-emerald-700">
                {formatMoney(annualResult)}
              </div>
            </div>

            <div className="rounded-lg bg-sky-50 p-3 text-center">
              <div className="text-xs font-bold text-sky-600">Planned</div>

              <div className="mt-1 text-xl font-black text-sky-700">
                {formatMoney(remainingForecast)}
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-slate-100" />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500">Goal</div>

              <div className="text-lg font-black text-slate-900">
                {formatMoney(annualGoal)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-500">
                {forecastGap < 0 ? "Missing" : "Above goal"}
              </div>

              <div
                className={`text-lg font-black ${
                  forecastGap < 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {formatMoney(Math.abs(forecastGap))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-black tracking-tight text-slate-900">
          Monthly performance
        </h3>

        <table className={tableClassName}>
          <thead className="bg-slate-50">
            <tr>
              <th className={baseHeaderClassName}>Metric</th>

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
            <tr>
              <th className={labelClassName}>Income diff.</th>

              {months.map((month) => {
                const difference =
                  getActualIncome(month) - getPlannedIncome(month);
                const hasData =
                  getActualIncome(month) > 0 || getPlannedIncome(month) > 0;

                return (
                  <td
                    key={month}
                    className={`${valueCellClassName} ${
                      hasData ? getTextClassName(difference) : "text-slate-400"
                    }`}
                  >
                    {hasData ? formatMoney(difference) : "-"}
                  </td>
                );
              })}

              <td className={summaryCellClassName}>
                {getActualAverage(
                  (month) => getActualIncome(month) - getPlannedIncome(month),
                ) !== null
                  ? formatMoney(
                      getActualAverage(
                        (month) =>
                          getActualIncome(month) - getPlannedIncome(month),
                      ) ?? 0,
                    )
                  : "-"}
              </td>

              <td className={summaryCellClassName}>
                {formatMoney(
                  getActualYearTotal(
                    (month) => getActualIncome(month) - getPlannedIncome(month),
                  ),
                )}
              </td>
            </tr>

            <tr>
              <th className={labelClassName}>Expense diff.</th>

              {months.map((month) => {
                const difference =
                  getPlannedExpenses(month) - getActualExpenses(month);
                const hasData =
                  getPlannedExpenses(month) > 0 || getActualExpenses(month) > 0;

                return (
                  <td
                    key={month}
                    className={`${valueCellClassName} ${
                      hasData ? getTextClassName(difference) : "text-slate-400"
                    }`}
                  >
                    {hasData ? formatMoney(difference) : "-"}
                  </td>
                );
              })}

              <td className={summaryCellClassName}>
                {getActualAverage(
                  (month) =>
                    getPlannedExpenses(month) - getActualExpenses(month),
                ) !== null
                  ? formatMoney(
                      getActualAverage(
                        (month) =>
                          getPlannedExpenses(month) - getActualExpenses(month),
                      ) ?? 0,
                    )
                  : "-"}
              </td>

              <td className={summaryCellClassName}>
                {formatMoney(
                  getActualYearTotal(
                    (month) =>
                      getPlannedExpenses(month) - getActualExpenses(month),
                  ),
                )}
              </td>
            </tr>

            <tr className="border-t-4 border-t-slate-100">
              <th className="border border-slate-200 bg-amber-50 px-2 py-1 text-left font-black text-amber-900">
                Savings goal
              </th>

              {months.map((month) => (
                <td
                  key={month}
                  className="border border-slate-200 bg-amber-50 px-1 py-1 text-center font-black text-amber-900"
                >
                  {formatMoney(getSavingsGoal(month))}
                </td>
              ))}

              <td className={summaryCellClassName}>
                {formatMoney(getAverage(getSavingsGoal))}
              </td>

              <td className={summaryCellClassName}>
                {formatMoney(getYearTotal(getSavingsGoal))}
              </td>
            </tr>

            <tr>
              <th className="border border-slate-200 bg-emerald-50 px-2 py-1 text-left font-black text-emerald-900">
                Result
              </th>

              {months.map((month) => {
                const result = getActualSavings(month);
                const hasData = hasActualData(month);

                return (
                  <td
                    key={month}
                    className={`border border-slate-200 px-1 py-1 text-center font-black ${
                      !hasData
                        ? "bg-white text-slate-400"
                        : result < 0
                          ? "bg-rose-50 text-rose-600"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {hasData ? formatMoney(result) : "-"}
                  </td>
                );
              })}

              <td className={summaryCellClassName}>
                {getActualAverage(getActualSavings) !== null
                  ? formatMoney(getActualAverage(getActualSavings) ?? 0)
                  : "-"}
              </td>

              <td className={summaryCellClassName}>
                {formatMoney(getActualYearTotal(getActualSavings))}
              </td>
            </tr>

            <tr>
              <th className={labelClassName}>Savings diff.</th>

              {months.map((month) => {
                const difference =
                  getActualSavings(month) - getSavingsGoal(month);
                const hasData = hasActualData(month);

                return (
                  <td
                    key={month}
                    className={`${valueCellClassName} ${
                      hasData ? getTextClassName(difference) : "text-slate-400"
                    }`}
                  >
                    {hasData ? formatMoney(difference) : "-"}
                  </td>
                );
              })}

              <td className={summaryCellClassName}>
                {getActualAverage(
                  (month) => getActualSavings(month) - getSavingsGoal(month),
                ) !== null
                  ? formatMoney(
                      getActualAverage(
                        (month) =>
                          getActualSavings(month) - getSavingsGoal(month),
                      ) ?? 0,
                    )
                  : "-"}
              </td>

              <td className={summaryCellClassName}>
                {formatMoney(
                  getActualYearTotal(
                    (month) => getActualSavings(month) - getSavingsGoal(month),
                  ),
                )}
              </td>
            </tr>

            <tr>
              <th className={labelClassName}>Rating</th>

              {months.map((month) => {
                const rating = getRating(month);

                return (
                  <td
                    key={month}
                    className={`border border-slate-200 bg-white px-1 py-1 text-center font-black ${getRatingClassName(
                      rating,
                    )}`}
                  >
                    {rating ?? "-"}
                  </td>
                );
              })}

              <td className={summaryCellClassName}>
                {getAverageRating() !== null
                  ? getAverageRating()?.toFixed(1)
                  : "-"}
              </td>

              <td className={summaryCellClassName}>-</td>
            </tr>
          </tbody>
        </table>
      </div>

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

        <MonthlyNotes forecast={forecast} setForecast={setForecast} />
      </div>
    </div>
  );
};
