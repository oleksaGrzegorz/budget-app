import { months } from "../data/months";

export const useBudgetMetrics = (
  expenses: Record<string, Record<string, number>>,
  incomes: Record<string, Record<string, number>>,
) => {
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

    if (savings == null || totalIncome == null || totalIncome === 0)
      return null;

    return Number(((savings / totalIncome) * 100).toFixed(1));
  };

  const getAverageSavingsPercentage = (): number | null => {
    const totalSavings = months.reduce(
      (acc, m) => acc + (getSavings(m) ?? 0),
      0,
    );

    const totalIncome = months.reduce(
      (acc, m) => acc + (getTotalIncome(m) ?? 0),
      0,
    );

    if (!totalIncome) return null;

    return (totalSavings / totalIncome) * 100;
  };

  const getAverageIncomeForCategory = (category: string) => {
    const monthsData = incomes[category];
    if (!monthsData) return null;

    const values = Object.values(monthsData).filter((v) => v > 0);
    if (values.length === 0) return null;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(2);
  };

  const getAverageSavings = (): number | null => {
    const validMonths = months.filter(
      (m) => getTotalIncome(m) != null || getTotalExpenses(m) != null,
    );
    if (validMonths.length === 0) return null;
    const sum = validMonths.reduce((acc, m) => acc + (getSavings(m) ?? 0), 0);
    return sum / validMonths.length;
  };

  const getAverageIncome = (): number | null => {
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

    return sum / count;
  };

  const getAverageExpense = (): number | null => {
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

    return sum / count;
  };

  return {
    getTotalExpenses,
    getTotalIncome,
    getSavings,
    getSavingsPercentage,
    getAverageSavingsPercentage,
    getAverageIncomeForCategory,
    getAverageSavings,
    getAverageIncome,
    getAverageExpense,
  };
};
