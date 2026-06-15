import { useEffect, useState } from "react";

import { months } from "../../data/months";
import { useBudgetMetrics } from "../../hooks/useBudgetMetrics";
import type { Goals } from "../../types/goals";
import type { PeriodOption } from "../../utils/budgetAverages";
import { SavingsSection } from "./sections/SavingsSection";
import { TotalsSection } from "./sections/TotalsSection";

interface BudgetSummaryTableProps {
  expenses: Record<string, Record<string, number>>;
  incomes: Record<string, Record<string, number>>;
  incomeGoals: Record<string, number | null>;
  setIncomeGoals: React.Dispatch<
    React.SetStateAction<Record<string, number | null>>
  >;
  period: PeriodOption;
}

export const BudgetSummaryTable = ({
  expenses,
  incomes,
  period,
}: BudgetSummaryTableProps) => {
  const {
    getTotalExpenses,
    getTotalIncome,
    getSavings,
    getSavingsPercentage,
    getAverageSavings,
    getAverageSavingsPercentage,
    getAverageIncome,
    getAverageExpense,
  } = useBudgetMetrics(expenses, incomes);

  const [goals, setGoals] = useState<Goals>(
    JSON.parse(localStorage.getItem("budgetGoals") || "null") ?? {
      income: null,
      expenses: null,
      savings: null,
      savingsPercentage: null,
    },
  );

  useEffect(() => {
    localStorage.setItem("budgetGoals", JSON.stringify(goals));
  }, [goals]);

  return (
    <table className="w-full border-collapse border border-slate-200 text-xs">
      <thead className="bg-slate-50">
        <tr>
          <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">
            Category
          </th>

          {months.map((month) => {
            const isSelectedMonth = period === month;

            return (
              <th
                key={month}
                className={`border border-slate-200 px-3 py-2 text-center font-semibold ${
                  isSelectedMonth
                    ? "bg-sky-100 text-sky-900"
                    : "text-slate-700"
                }`}
              >
                {month}
              </th>
            );
          })}

          <th className="border border-slate-200 bg-sky-50 px-3 py-2 text-center font-semibold text-sky-900">
            Average
          </th>

          <th className="border border-slate-200 bg-amber-50 px-3 py-2 text-center font-semibold text-amber-900">
            Goal
          </th>
        </tr>
      </thead>

      <tbody>
        <TotalsSection
          getTotalIncome={getTotalIncome}
          getTotalExpenses={getTotalExpenses}
          getAverageIncome={getAverageIncome}
          getAverageExpense={getAverageExpense}
          goals={goals}
          setGoals={setGoals}
          period={period}
        />

        <SavingsSection
          getSavings={getSavings}
          getAverageSavings={getAverageSavings}
          getSavingsPercentage={getSavingsPercentage}
          getAverageSavingsPercentage={getAverageSavingsPercentage}
          goals={goals}
          setGoals={setGoals}
          period={period}
        />
      </tbody>
    </table>
  );
};