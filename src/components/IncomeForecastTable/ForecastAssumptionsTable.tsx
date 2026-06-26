import { useState } from "react";

import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import type { Forecast } from "../../data/initialForecast";
import { months } from "../../data/months";
import { tableStyles } from "./tableStyles";

const formatNumber = (value: number) =>
  value
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, " ");

const formatMoney = (value: number) => `${formatNumber(value)} €`;

const formatSignedMoney = (value: number) =>
  `${value > 0 ? "+" : ""}${formatNumber(value)} €`;

const getTextClassName = (value: number) => {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-rose-600";
  return "text-slate-400";
};

interface ForecastAssumptionsTableProps {
  forecast: Forecast;
  setForecast: React.Dispatch<React.SetStateAction<Forecast>>;
  getAverage: (getValue: (month: string) => number) => number;
  getYearTotal: (getValue: (month: string) => number) => number;
  getActualIncomeByCategory: (category: string, month: string) => number;
  getPlannedExpenses: (month: string) => number;
  getActualAverage: (getValue: (month: string) => number) => number | null;
  getActualYearTotal: (getValue: (month: string) => number) => number;
  getActualExpenses?: (month: string) => number;
  hasActualData?: (month: string) => boolean;
}

interface DifferenceTextProps {
  value: number | null;
  visible: boolean;
}

const DifferenceText = ({ value, visible }: DifferenceTextProps) => {
  if (!visible || value === null) return null;

  return (
    <div className={`mt-1 text-[10px] font-black ${getTextClassName(value)}`}>
      {formatSignedMoney(value)}
    </div>
  );
};

export const ForecastAssumptionsTable = ({
  forecast,
  setForecast,
  getAverage,
  getYearTotal,
  getActualIncomeByCategory,
  getPlannedExpenses,
  getActualAverage,
  getActualYearTotal,
  getActualExpenses,
  hasActualData,
}: ForecastAssumptionsTableProps) => {
  const [showDifferences, setShowDifferences] = useState(false);

  const updatePlannedExpenses = (month: string, value: number | null) => {
    setForecast((prev) => ({
      ...prev,
      plannedExpenses: {
        ...prev.plannedExpenses,
        [month]: value ?? 0,
      },
    }));
  };

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
          ...(prev.incomes[category] ?? {}),
          [month]: value ?? 0,
        },
      },
    }));
  };

  const monthHasActualData = (month: string) => {
    if (hasActualData) return hasActualData(month);

    return incomeCategories.some(
      (category) => getActualIncomeByCategory(category, month) > 0,
    );
  };

  const getIncomeDifference = (category: string, month: string) => {
    const planned = forecast.incomes[category]?.[month] ?? 0;
    const actual = getActualIncomeByCategory(category, month);

    return actual - planned;
  };

  const getPlannedExpenseDifference = (month: string) => {
    if (!getActualExpenses) return null;

    return getPlannedExpenses(month) - getActualExpenses(month);
  };

  return (
    <div className={tableStyles.section}>
      <div className={tableStyles.sectionHeader}>
        <h3>Forecast assumptions</h3>

        <button
          type="button"
          onClick={() => setShowDifferences((prev) => !prev)}
          className="flex items-center gap-2 rounded-full text-[11px] font-black text-slate-600"
        >
          <span>Show differences</span>

          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
              showDifferences ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
                showDifferences ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
      </div>

      <div className={tableStyles.tableScroll}>
        <table className={`${tableStyles.table} min-w-[1320px]`}>
          <thead>
            <tr>
              <th className={tableStyles.baseHeader}>Category</th>

              {months.map((month) => (
                <th key={month} className={tableStyles.monthHeader}>
                  {month}
                </th>
              ))}

              <th className={tableStyles.summaryHeader}>Avg</th>
              <th className={tableStyles.summaryHeader}>Year total</th>
            </tr>
          </thead>

          <tbody>
            {incomeCategories.map((category) => (
              <tr key={category}>
                <th className={tableStyles.label}>{category}</th>

                {months.map((month) => {
                  const difference = getIncomeDifference(category, month);
                  const canShowDifference =
                    showDifferences && monthHasActualData(month);

                  return (
                    <td key={month} className={tableStyles.valueCell}>
                      <div className="flex flex-col items-center">
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
                          className={tableStyles.input}
                        />

                        <DifferenceText
                          value={difference}
                          visible={canShowDifference}
                        />
                      </div>
                    </td>
                  );
                })}

                <td className={tableStyles.summaryCell}>
                  <div>
                    {formatMoney(
                      getAverage(
                        (month) => forecast.incomes[category]?.[month] ?? 0,
                      ),
                    )}
                  </div>

                  <DifferenceText
                    value={
                      getActualAverage(
                        (month) =>
                          getActualIncomeByCategory(category, month) -
                          (forecast.incomes[category]?.[month] ?? 0),
                      ) ?? null
                    }
                    visible={showDifferences}
                  />
                </td>

                <td className={tableStyles.summaryCell}>
                  <div>
                    {formatMoney(
                      getYearTotal(
                        (month) => forecast.incomes[category]?.[month] ?? 0,
                      ),
                    )}
                  </div>

                  <DifferenceText
                    value={getActualYearTotal(
                      (month) =>
                        getActualIncomeByCategory(category, month) -
                        (forecast.incomes[category]?.[month] ?? 0),
                    )}
                    visible={showDifferences}
                  />
                </td>
              </tr>
            ))}

            <tr className="border-t-4 border-t-slate-100">
              <th className={tableStyles.label}>Planned expenses</th>

              {months.map((month) => {
                const difference = getPlannedExpenseDifference(month);
                const canShowDifference =
                  showDifferences && monthHasActualData(month);

                return (
                  <td key={month} className={tableStyles.valueCell}>
                    <div className="flex flex-col items-center">
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
                        className={tableStyles.expenseInput}
                      />

                      <DifferenceText
                        value={difference}
                        visible={canShowDifference && difference !== null}
                      />
                    </div>
                  </td>
                );
              })}

              <td className={tableStyles.summaryCell}>
                {formatMoney(getAverage(getPlannedExpenses))}
              </td>

              <td className={tableStyles.summaryCell}>
                {formatMoney(getYearTotal(getPlannedExpenses))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};