import { months } from "../../data/months";
import { SavingsSection } from "./sections/SavingsSection";
import { TotalsSection } from "./sections/TotalsSection";
import { useBudgetMetrics } from "../../hooks/useBudgetMetrics";
import { useState } from "react";
import type { Goals } from "../../types/goals";

interface BudgetSummaryTableProps {
  expenses: Record<string, Record<string, number>>;
  incomes: Record<string, Record<string, number>>;
  incomeGoals: Record<string, number>;
  setIncomeGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const BudgetSummaryTable = ({
  expenses,
  incomes,
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

  const [goals, setGoals] = useState<Goals>({
    income: null,
    expenses: null,
    savings: null,
    savingsPercentage: null,
  });

  return (
    <table className="w-full text-xs border border-gray-300 border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left font-semibold border border-gray-300">
            Kategoria
          </th>
          {months.map((month) => (
            <th
              key={month}
              className="px-3 py-2 text-center font-semibold border border-gray-300"
            >
              {month}
            </th>
          ))}
          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-gray-300 text-gray-800">
            Średnia
          </th>
          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-amber-300 text-amber-900">
            Cel
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
          
        />

        <SavingsSection
          getSavings={getSavings}
          getAverageSavings={getAverageSavings}
          getSavingsPercentage={getSavingsPercentage}
          getAverageSavingsPercentage={getAverageSavingsPercentage}
          goals={goals}
          setGoals={setGoals}
        />
      </tbody>
    </table>
  );
};
