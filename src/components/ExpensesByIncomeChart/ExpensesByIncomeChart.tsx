import { categories } from "../../data/categories";
import {
  getActiveMonths,
  getCategoriesAverageTotal,
  getMonthTotal,
  type PeriodOption,
} from "../../utils/budgetAverages";

interface ExpensesByIncomeChartProps {
  expenses: Record<string, Record<string, number>>;
  incomes: Record<string, Record<string, number>>;
  period: PeriodOption;
}

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const ExpensesByIncomeChart = ({
  expenses,
  incomes,
  period,
}: ExpensesByIncomeChartProps) => {
  const activeMonths = getActiveMonths(expenses, incomes);

  const totalIncome =
    period === "average"
      ? activeMonths.length > 0
        ? activeMonths.reduce((sum, month) => {
            const monthIncome = Object.values(incomes).reduce(
              (total, category) => total + (category[month] ?? 0),
              0,
            );

            return sum + monthIncome;
          }, 0) / activeMonths.length
        : 0
      : Object.values(incomes).reduce(
          (sum, category) => sum + (category[period] ?? 0),
          0,
        );

  const totalExpenses =
    period === "average"
      ? (getCategoriesAverageTotal(
          expenses,
          categories,
          activeMonths,
        ) ?? 0)
      : getMonthTotal(expenses, categories, period);

  const savings = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : null;

  const maxValue = Math.max(totalIncome, totalExpenses, Math.abs(savings), 1);

  const rows = [
    {
      label: "Income",
      value: totalIncome,
      percent: (totalIncome / maxValue) * 100,
      barClassName: "bg-emerald-500",
      bgClassName: "bg-emerald-50",
      textClassName: "text-emerald-700",
      icon: "↑",
    },
    {
      label: "Expenses",
      value: totalExpenses,
      percent: (totalExpenses / maxValue) * 100,
      barClassName: "bg-rose-500",
      bgClassName: "bg-rose-50",
      textClassName: "text-rose-700",
      icon: "↓",
    },
    {
      label: "Savings",
      value: savings,
      percent: (Math.abs(savings) / maxValue) * 100,
      barClassName: savings < 0 ? "bg-rose-500" : "bg-sky-500",
      bgClassName: savings < 0 ? "bg-rose-50" : "bg-sky-50",
      textClassName: savings < 0 ? "text-rose-700" : "text-sky-700",
      icon: savings < 0 ? "!" : "✓",
    },
  ];

return (
  <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-lg font-black text-emerald-600">
          €
        </span>
      </div>

      <div>
        <h3 className="text-base font-black tracking-tight text-slate-900">
          Income balance
        </h3>

        <p className="mt-0.5 text-xs font-semibold text-slate-500">
          {period === "average" ? "Average view" : `Month ${period}`}
        </p>
      </div>
    </div>

    <div className="h-px bg-slate-100" />

    {totalIncome > 0 || totalExpenses > 0 ? (
      <>
        <div className="mt-5 flex flex-1 flex-col justify-center gap-5">
          {rows.map((row) => (
            <div
              key={row.label}
              className={`rounded-2xl border border-slate-100 p-4 ${row.bgClassName}`}
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-black shadow-sm ${row.textClassName}`}
                  >
                    {row.icon}
                  </span>

                  <span className="text-sm font-black text-slate-800">
                    {row.label}
                  </span>
                </div>

                <span className={`text-lg font-black ${row.textClassName}`}>
                  {formatMoney(row.value)} euro
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${row.barClassName}`}
                  style={{
                    width: `${Math.min(Math.max(row.percent, 0), 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="my-6 h-px bg-slate-100" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-base font-bold text-slate-900">
            Savings rate
          </span>

          <span
            className={`text-2xl font-black tracking-tight ${
              savings < 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {savingsRate !== null ? `${savingsRate}%` : "-"}
          </span>
        </div>
      </>
    ) : (
      <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-8 text-center">
        <div className="text-sm font-black text-slate-700">
          No income or expenses
        </div>

        <div className="mt-1 text-xs font-semibold text-slate-500">
          No data for selected period
        </div>
      </div>
    )}
  </section>
);
};
