import { months } from "../../data/months";
import { tableStyles } from "./tableStyles";

interface MonthlyPerformanceTableProps {
  getActualIncome: (month: string) => number;
  getPlannedIncome: (month: string) => number;
  getActualExpenses: (month: string) => number;
  getPlannedExpenses: (month: string) => number;
  getSavingsGoal: (month: string) => number;
  getActualSavings: (month: string) => number;
  hasActualData: (month: string) => boolean;
  getRating: (month: string) => number | null;
  getAverageRating: () => number | null;
  getActualAverage: (
    getValueForMonth: (month: string) => number,
  ) => number | null;
  getActualYearTotal: (getValueForMonth: (month: string) => number) => number;
  getAverage: (getValueForMonth: (month: string) => number) => number;
  getYearTotal: (getValueForMonth: (month: string) => number) => number;
}

const formatMoney = (value: number) => value.toFixed(2);

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

export const MonthlyPerformanceTable = ({
  getActualIncome,
  getPlannedIncome,
  getActualExpenses,
  getPlannedExpenses,
  getSavingsGoal,
  getActualSavings,
  hasActualData,
  getRating,
  getAverageRating,
  getActualAverage,
  getActualYearTotal,
  getAverage,
  getYearTotal,
}: MonthlyPerformanceTableProps) => {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-black tracking-tight text-slate-900">
        Monthly performance
      </h3>

      <table className={tableStyles.table}>
        <thead className="bg-slate-50">
          <tr>
            <th className={tableStyles.baseHeader}>Metric</th>

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
          <tr>
            <th className={tableStyles.label}>Income diff.</th>

            {months.map((month) => {
              const difference =
                getActualIncome(month) - getPlannedIncome(month);
              const hasData =
                getActualIncome(month) > 0 || getPlannedIncome(month) > 0;

              return (
                <td
                  key={month}
                  className={`${tableStyles.valueCell} ${
                    hasData ? getTextClassName(difference) : "text-slate-400"
                  }`}
                >
                  {hasData ? formatMoney(difference) : "-"}
                </td>
              );
            })}

            <td className={tableStyles.summaryCell}>
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

            <td className={tableStyles.summaryCell}>
              {formatMoney(
                getActualYearTotal(
                  (month) => getActualIncome(month) - getPlannedIncome(month),
                ),
              )}
            </td>
          </tr>

          <tr>
            <th className={tableStyles.label}>Expense diff.</th>

            {months.map((month) => {
              const difference =
                getPlannedExpenses(month) - getActualExpenses(month);
              const hasData =
                getPlannedExpenses(month) > 0 || getActualExpenses(month) > 0;

              return (
                <td
                  key={month}
                  className={`${tableStyles.valueCell} ${
                    hasData ? getTextClassName(difference) : "text-slate-400"
                  }`}
                >
                  {hasData ? formatMoney(difference) : "-"}
                </td>
              );
            })}

            <td className={tableStyles.summaryCell}>
              {getActualAverage(
                (month) => getPlannedExpenses(month) - getActualExpenses(month),
              ) !== null
                ? formatMoney(
                    getActualAverage(
                      (month) =>
                        getPlannedExpenses(month) - getActualExpenses(month),
                    ) ?? 0,
                  )
                : "-"}
            </td>

            <td className={tableStyles.summaryCell}>
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
              <td key={month} className={tableStyles.valueCell}>
                {formatMoney(getSavingsGoal(month))}
              </td>
            ))}

            <td className={tableStyles.summaryCell}>
              {formatMoney(getAverage(getSavingsGoal))}
            </td>

            <td className={tableStyles.summaryCell}>
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

            <td className={tableStyles.summaryCell}>
              {getActualAverage(getActualSavings) !== null
                ? formatMoney(getActualAverage(getActualSavings) ?? 0)
                : "-"}
            </td>

            <td className={tableStyles.summaryCell}>
              {formatMoney(getActualYearTotal(getActualSavings))}
            </td>
          </tr>

          <tr>
            <th className={tableStyles.label}>Savings diff.</th>

            {months.map((month) => {
              const difference =
                getActualSavings(month) - getSavingsGoal(month);
              const hasData = hasActualData(month);

              return (
                <td
                  key={month}
                  className={`${tableStyles.valueCell} ${
                    hasData ? getTextClassName(difference) : "text-slate-400"
                  }`}
                >
                  {hasData ? formatMoney(difference) : "-"}
                </td>
              );
            })}

            <td className={tableStyles.summaryCell}>
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

            <td className={tableStyles.summaryCell}>
              {formatMoney(
                getActualYearTotal(
                  (month) => getActualSavings(month) - getSavingsGoal(month),
                ),
              )}
            </td>
          </tr>

          <tr>
            <th className={tableStyles.label}>Rating</th>

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

            <td className={tableStyles.summaryCell}>
              {getAverageRating() !== null
                ? getAverageRating()?.toFixed(1)
                : "-"}
            </td>

            <td className={tableStyles.summaryCell}>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
