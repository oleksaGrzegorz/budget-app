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

const monthNames: Record<string, string> = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

const formatNumber = (value: number) =>
  value
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, " ");

const formatMoney = (value: number) => `${formatNumber(value)} euro`;

const formatSignedMoney = (value: number) =>
  `${value > 0 ? "+" : ""}${formatMoney(value)}`;

const getDiffPillClassName = (value: number) => {
  if (value > 0) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (value < 0) {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-slate-50 text-slate-400";
};

const getRatingClassName = (rating: number | null) => {
  if (rating === null) return "text-slate-400";
  if (rating >= 4) return "text-emerald-600";
  if (rating === 3) return "text-amber-600";
  return "text-rose-600";
};

interface MoneyPillProps {
  value: number | null;
  signed?: boolean;
  muted?: boolean;
}

const MoneyPill = ({ value, signed = false, muted = false }: MoneyPillProps) => {
  if (value === null || muted) {
    return <span className="font-black text-slate-400">-</span>;
  }

  return (
    <span
      className={`inline-flex min-w-[92px] justify-center rounded-lg px-2 py-1 text-[11px] font-black ${getDiffPillClassName(
        value,
      )}`}
    >
      {signed ? formatSignedMoney(value) : formatMoney(value)}
    </span>
  );
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
  const getIncomeDiff = (month: string) =>
    getActualIncome(month) - getPlannedIncome(month);

  const getExpenseDiff = (month: string) =>
    getPlannedExpenses(month) - getActualExpenses(month);

  const getSavingsDiff = (month: string) =>
    getActualSavings(month) - getSavingsGoal(month);

  const incomeDiffAverage = getActualAverage(getIncomeDiff);
  const expenseDiffAverage = getActualAverage(getExpenseDiff);
  const actualSavingsAverage = getActualAverage(getActualSavings);
  const savingsDiffAverage = getActualAverage(getSavingsDiff);
  const averageRating = getAverageRating();

  return (
    <div className={tableStyles.section}>
      <h3 className={tableStyles.sectionHeader}>Monthly performance</h3>

      <div className={tableStyles.tableScroll}>
        <table className={`${tableStyles.table} min-w-[980px]`}>
          <thead>
            <tr>
              <th className={tableStyles.baseHeader}>Month</th>
              <th className={tableStyles.monthHeader}>Income diff.</th>
              <th className={tableStyles.monthHeader}>Expense diff.</th>
              <th className={tableStyles.monthHeader}>Savings goal</th>
              <th className={tableStyles.monthHeader}>Result</th>
              <th className={tableStyles.monthHeader}>Savings diff.</th>
              <th className={tableStyles.monthHeader}>Rating</th>
            </tr>
          </thead>

          <tbody>
            {months.map((month) => {
              const hasData = hasActualData(month);
              const rating = getRating(month);

              return (
                <tr
                  key={month}
                  className={!hasData ? "bg-slate-50/40" : "bg-white"}
                >
                  <th className={tableStyles.label}>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900">{month}</span>
                      <span
                        className={`font-bold ${
                          hasData ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        {monthNames[month] ?? month}
                      </span>
                    </div>
                  </th>

                  <td className={tableStyles.valueCell}>
                    <MoneyPill
                      value={hasData ? getIncomeDiff(month) : null}
                      signed
                    />
                  </td>

                  <td className={tableStyles.valueCell}>
                    <MoneyPill
                      value={hasData ? getExpenseDiff(month) : null}
                      signed
                    />
                  </td>

                  <td className={tableStyles.valueCell}>
                    {formatMoney(getSavingsGoal(month))}
                  </td>

                  <td className={tableStyles.valueCell}>
                    <MoneyPill
                      value={hasData ? getActualSavings(month) : null}
                    />
                  </td>

                  <td className={tableStyles.valueCell}>
                    <MoneyPill
                      value={hasData ? getSavingsDiff(month) : null}
                      signed
                    />
                  </td>

                  <td
                    className={`border border-slate-200 px-2 py-2 text-center font-black ${getRatingClassName(
                      rating,
                    )}`}
                  >
                    {rating !== null ? (
                      <span className="inline-flex items-center gap-2">
                        {rating}
                        <span>★</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}

            <tr className="border-t-4 border-t-slate-100">
              <th className={tableStyles.summaryCell}>Average</th>

              <td className={tableStyles.summaryCell}>
                {incomeDiffAverage !== null
                  ? formatSignedMoney(incomeDiffAverage)
                  : "-"}
              </td>

              <td className={tableStyles.summaryCell}>
                {expenseDiffAverage !== null
                  ? formatSignedMoney(expenseDiffAverage)
                  : "-"}
              </td>

              <td className={tableStyles.summaryCell}>
                {formatMoney(getAverage(getSavingsGoal))}
              </td>

              <td className={tableStyles.summaryCell}>
                {actualSavingsAverage !== null
                  ? formatMoney(actualSavingsAverage)
                  : "-"}
              </td>

              <td className={tableStyles.summaryCell}>
                {savingsDiffAverage !== null
                  ? formatSignedMoney(savingsDiffAverage)
                  : "-"}
              </td>

              <td className={tableStyles.summaryCell}>
                {averageRating !== null ? averageRating.toFixed(1) : "-"}
              </td>
            </tr>

            <tr>
              <th className={tableStyles.summaryCell}>Year total</th>

              <td className={tableStyles.summaryCell}>
                {formatSignedMoney(getActualYearTotal(getIncomeDiff))}
              </td>

              <td className={tableStyles.summaryCell}>
                {formatSignedMoney(getActualYearTotal(getExpenseDiff))}
              </td>

              <td className={tableStyles.summaryCell}>
                {formatMoney(getYearTotal(getSavingsGoal))}
              </td>

              <td className={tableStyles.summaryCell}>
                {formatMoney(getActualYearTotal(getActualSavings))}
              </td>

              <td className={tableStyles.summaryCell}>
                {formatSignedMoney(getActualYearTotal(getSavingsDiff))}
              </td>

              <td className={tableStyles.summaryCell}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};