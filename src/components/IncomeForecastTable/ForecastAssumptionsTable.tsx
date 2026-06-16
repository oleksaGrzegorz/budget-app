import { Fragment } from "react";

import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import type { Forecast } from "../../data/initialForecast";
import { months } from "../../data/months";
import { tableStyles } from "./tableStyles";

const formatMoney = (value: number) => value.toFixed(2);

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
}

export const ForecastAssumptionsTable = ({
  forecast,
  setForecast,
  getAverage,
  getYearTotal,
  getActualIncomeByCategory,
  getPlannedExpenses,
  getActualAverage,
  getActualYearTotal,
}: ForecastAssumptionsTableProps) => {
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
          ...prev.incomes[category],
          [month]: value ?? 0,
        },
      },
    }));
  };
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-black tracking-tight text-slate-900">
        Forecast assumptions
      </h3>

      <table className={tableStyles.table}>
        <thead className="bg-slate-50">
          <tr>
            <th className={tableStyles.baseHeader}>Category</th>

            {months.map((month) => (
              <th key={month} className={tableStyles.monthHeader}>
                {month}
              </th>
            ))}

            <th className={tableStyles.summaryHeader}>Avg</th>
            <th className={tableStyles.summaryHeader}>Year</th>
          </tr>
        </thead>

        <tbody>
          {incomeCategories.map((category) => (
            <Fragment key={category}>
              <tr>
                <th className={tableStyles.label}>{category}</th>

                {months.map((month) => (
                  <td key={month} className={tableStyles.valueCell}>
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
                  </td>
                ))}

                <td className={tableStyles.summaryCell}>
                  {formatMoney(
                    getAverage(
                      (month) => forecast.incomes[category]?.[month] ?? 0,
                    ),
                  )}
                </td>

                <td className={tableStyles.summaryCell}>
                  {formatMoney(
                    getYearTotal(
                      (month) => forecast.incomes[category]?.[month] ?? 0,
                    ),
                  )}
                </td>
              </tr>

              <tr>
                <th className={tableStyles.mutedLabel}>Diff.</th>

                {months.map((month) => {
                  const planned = forecast.incomes[category]?.[month] ?? 0;
                  const actual = getActualIncomeByCategory(category, month);
                  const difference = actual - planned;
                  const hasData = actual > 0 || planned > 0;

                  return (
                    <td
                      key={month}
                      className={`${tableStyles.valueCell} ${
                        hasData
                          ? getTextClassName(difference)
                          : "text-slate-400"
                      }`}
                    >
                      {hasData ? formatMoney(difference) : "-"}
                    </td>
                  );
                })}

                <td className={tableStyles.summaryCell}>
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

                <td className={tableStyles.summaryCell}>
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
            <th className={tableStyles.label}>Planned expenses</th>

            {months.map((month) => (
              <td key={month} className={tableStyles.valueCell}>
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
              </td>
            ))}

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
  );
};
