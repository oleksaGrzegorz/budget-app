import { months } from "../../data/months";
import { SavingsSection } from "./sections/SavingsSection";
import { IncomeSection } from "./sections/IncomeSection";
import { TotalsSection } from "./sections/TotalsSection";

interface BudgetSummaryTableProps {
  expenses: Record<string, Record<string, number>>;
  incomes: Record<string, Record<string, number>>;
  incomeGoals: Record<string, number>;
  setIncomeGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const BudgetSummaryTable = ({
  expenses,
  incomes,
  incomeGoals,
  setIncomeGoals,
}: BudgetSummaryTableProps) => {
  const getTotalExpenses = (month: string): number | null => {
    const total = Object.values(expenses ?? {}).reduce(
      (sum, cat) => sum + (cat?.[month] || 0),
      0,
    );
    return total === 0 ? null : total;
  };

  const getTotalIncome = (month: string): number | null => {
    const total = Object.values(incomes).reduce(
      (sum, cat) => sum + (cat[month] || 0),
      0,
    );
    return total === 0 ? null : total;
  };

  const getSavings = (month: string): number | null => {
    const income = getTotalIncome(month);
    const expenses = getTotalExpenses(month);
    if (income === null && expenses === null) return null;
    return (income ?? 0) - (expenses ?? 0);
  };

const getSavingsPercentage = (month: string): number | null => {
  const savings = getSavings(month);
  const totalIncome = getTotalIncome(month);

  if (savings == null || totalIncome == null || totalIncome === 0) return null;

  return Number(((savings / totalIncome) * 100).toFixed(1));
};

const getAverageSavingsPercentage = (): string | null => {
  const totalSavings = months.reduce(
    (acc, m) => acc + (getSavings(m) ?? 0),
    0
  );

  const totalIncome = months.reduce(
    (acc, m) => acc + (getTotalIncome(m) ?? 0),
    0
  );

  if (!totalIncome) return null;

  return ((totalSavings / totalIncome) * 100).toFixed(1);
};

  const getAverageIncomeForCategory = (category: string) => {
    const monthsData = incomes[category];
    if (!monthsData) return null;

    const values = Object.values(monthsData).filter((v) => v > 0);
    if (values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(2);
  };

  const getAverageSavings = (): string | null => {
    const validMonths = months.filter(
      (m) => getTotalIncome(m) != null || getTotalExpenses(m) != null,
    );
    if (validMonths.length === 0) return null;
    const sum = validMonths.reduce((acc, m) => acc + (getSavings(m) ?? 0), 0);
    return (sum / validMonths.length).toFixed(2);
  };

  const getAverageIncome = () => {
    let sum = 0;
    let count = 0;

    months.forEach((month) => {
      const totalIncome = getTotalIncome(month);

      if (totalIncome != null) {
        sum += totalIncome;
        count++;
      }
    });

    if (count === 0) return null;

    return (sum / count).toFixed(2);
  };

  const getAverageExpense = () => {
    let sum = 0;
    let count = 0;

    months.forEach((month) => {
      const totalExpense = getTotalExpenses(month);

      if (totalExpense != null) {
        sum += totalExpense;
        count++;
      }
    });

    if (count === 0) return null;

    return (sum / count).toFixed(2);
  };

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
            Śr
          </th>
          <th className="px-3 py-2 text-center font-semibold border border-gray-300 bg-amber-300 text-amber-900">
            Cel
          </th>
        </tr>
      </thead>
      <tbody>
        <IncomeSection
          incomes={incomes}
          incomeGoals={incomeGoals}
          setIncomeGoals={setIncomeGoals}
          getAverageIncomeForCategory={getAverageIncomeForCategory}
        />

        <TotalsSection
          getTotalIncome={getTotalIncome}
          getTotalExpenses={getTotalExpenses}
          getAverageIncome={getAverageIncome}
          getAverageExpense={getAverageExpense}
        />

        <SavingsSection
          getSavings={getSavings}
          getTotalIncome={getTotalIncome}
          getAverageSavings={getAverageSavings}
          getSavingsPercentage={getSavingsPercentage}
          getAverageSavingsPercentage={getAverageSavingsPercentage}
        />
      </tbody>
    </table>
  );
};
