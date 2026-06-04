import { categories } from "../data/categories";
import { expenseCategoryAverageTypes } from "../data/expenseCategoryAverageTypes";
import {
  getActiveMonths,
  getCategoriesAverageTotal,
} from "../utils/budgetAverages";

export const useBudgetMetrics = (
  expenses: Record<string, Record<string, number>>,
  incomes: Record<string, Record<string, number>>,
) => {
  const activeMonths = getActiveMonths(expenses, incomes);

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

    if (savings == null || totalIncome == null || totalIncome === 0) {
      return null;
    }

    return Number(((savings / totalIncome) * 100).toFixed(1));
  };

  const getAverageIncomeForCategory = (category: string) => {
    const monthsData = incomes[category];

    if (!monthsData || activeMonths.length === 0) return null;

    const sum = activeMonths.reduce(
      (acc, month) => acc + (monthsData[month] ?? 0),
      0,
    );

    return (sum / activeMonths.length).toFixed(2);
  };

  const getAverageIncome = (): number | null => {
    if (activeMonths.length === 0) return null;

    const sum = activeMonths.reduce(
      (acc, month) => acc + (getTotalIncome(month) ?? 0),
      0,
    );

    return sum / activeMonths.length;
  };

  const getAverageExpense = (): number | null => {
    return getCategoriesAverageTotal(
      expenses,
      categories,
      activeMonths,
      expenseCategoryAverageTypes,
    );
  };

  const getAverageSavings = (): number | null => {
    const averageIncome = getAverageIncome();
    const averageExpense = getAverageExpense();

    if (averageIncome === null && averageExpense === null) return null;

    return (averageIncome ?? 0) - (averageExpense ?? 0);
  };

  const getAverageSavingsPercentage = (): number | null => {
    const averageSavings = getAverageSavings();
    const averageIncome = getAverageIncome();

    if (
      averageSavings === null ||
      averageIncome === null ||
      averageIncome === 0
    ) {
      return null;
    }

    return (averageSavings / averageIncome) * 100;
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