import { Fragment } from "react";

import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import type { Forecast } from "../../data/initialForecast";
import { months } from "../../data/months";
import type { BudgetData } from "../../types/budgetData";

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

  const updateNote = (month: string, value: string) => {
    setForecast((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [month]: value,
      },
    }));
  };

  const getActualIncomeByCategory = (category: string, month: string) =>
    incomes[category]?.[month] ?? 0;

  const getActualIncome = (month: string) =>
    Object.values(incomes).reduce(
      (sum, values) => sum + (values[month] ?? 0),
      0,
    );

  const getActualExpenses = (month: string) =>
    Object.values(expenses).reduce(
      (sum, values) => sum + (values[month] ?? 0),
      0,
    );

  const getPlannedIncome = (month: string) =>
    incomeCategories.reduce(
      (sum, category) => sum + (forecast.incomes[category]?.[month] ?? 0),
      0,
    );

  const getPlannedExpenses = (month: string) =>
    forecast.plannedExpenses[month] ?? 0;

  const getSavingsGoal = (month: string) =>
    getPlannedIncome(month) - getPlannedExpenses(month);

  const getActualSavings = (month: string) =>
    getActualIncome(month) - getActualExpenses(month);

  const hasActualData = (month: string) =>
    getActualIncome(month) > 0 || getActualExpenses(month) > 0;

  const getRating = (month: string): number | null => {
    if (!hasActualData(month)) return null;

    const goal = getSavingsGoal(month);
    const result = getActualSavings(month);
    const difference = result - goal;

    if (difference >= 0) return 5;

    if (goal <= 0) {
      return result >= 0 ? 4 : 2;
    }

    const missRatio = Math.abs(difference) / Math.abs(goal);

    if (missRatio <= 0.1) return 4;
    if (missRatio <= 0.25) return 3;
    if (missRatio <= 0.5) return 2;

    return 1;
  };

  const getYearTotal = (getValue: (month: string) => number) =>
    months.reduce((sum, month) => sum + getValue(month), 0);

  const getAverage = (getValue: (month: string) => number) =>
    getYearTotal(getValue) / months.length;

  const getActualAverage = (getValue: (month: string) => number) => {
    const activeMonths = months.filter((month) => hasActualData(month));

    if (activeMonths.length === 0) return null;

    return (
      activeMonths.reduce((sum, month) => sum + getValue(month), 0) /
      activeMonths.length
    );
  };

  const getActualYearTotal = (getValue: (month: string) => number) =>
    months.reduce(
      (sum, month) => (hasActualData(month) ? sum + getValue(month) : sum),
      0,
    );

  const getAverageRating = () => {
    const ratings = months
      .map((month) => getRating(month))
      .filter((rating): rating is number => rating !== null);

    if (ratings.length === 0) return null;

    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const annualGoal = getYearTotal(getSavingsGoal);
  const annualResult = getActualYearTotal(getActualSavings);

  const remainingForecast = months.reduce(
    (sum, month) => (hasActualData(month) ? sum : sum + getSavingsGoal(month)),
    0,
  );

  const forecastedYearEnd = annualResult + remainingForecast;
  const forecastGap = forecastedYearEnd - annualGoal;

  const actualProgress =
    annualGoal > 0
      ? Math.min(Math.max((annualResult / annualGoal) * 100, 0), 100)
      : 0;

  const forecastProgress =
    annualGoal > 0
      ? Math.min(
          Math.max((remainingForecast / annualGoal) * 100, 0),
          100 - actualProgress,
        )
      : 0;

  const gapProgress = Math.max(100 - actualProgress - forecastProgress, 0);

  const forecastedProgress =
    annualGoal > 0
      ? Math.min(Math.max((forecastedYearEnd / annualGoal) * 100, 0), 100)
      : 0;

  const savedProgress =
    annualGoal > 0
      ? Math.min(Math.max((annualResult / annualGoal) * 100, 0), 100)
      : 0;

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
      </div>

      <div>
        <h3 className="mb-3 text-sm font-black tracking-tight text-slate-900">
          Monthly notes
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {months.map((month) => (
            <label
              key={month}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <span className="mb-2 block text-xs font-black text-slate-700">
                Month {month}
              </span>

              <textarea
                value={forecast.notes[month] ?? ""}
                onChange={(event) => updateNote(month, event.target.value)}
                className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
