import type { BudgetData } from "../types/budgetData";

import { budgetSummaryLabels as incomeCategories } from "../data/budgetSummaryLabels";
import type { Forecast } from "../data/initialForecast";
import { months } from "../data/months";

export const getIncomeForecastMetrics = (
  incomes: BudgetData,
  expenses: BudgetData,
  forecast: Forecast,
) => {
  const getActualIncomeByCategory = (category: string, month: string) =>
    incomes[category]?.[month] ?? 0;

  const getActualIncome = (month: string) =>
    Object.values(incomes).reduce(
      (sum, values) => sum + (values[month] ?? 0),
      0,
    );

  const getActualExpenses = (month: string) =>
    Object.values(expenses).reduce(
      (sum, values) => sum + (values[month] ?? 0),
      0,
    );

  const getPlannedIncome = (month: string) =>
    incomeCategories.reduce(
      (sum, category) => sum + (forecast.incomes[category]?.[month] ?? 0),
      0,
    );

  const getPlannedExpenses = (month: string) =>
    forecast.plannedExpenses[month] ?? 0;

  const getSavingsGoal = (month: string) =>
    getPlannedIncome(month) - getPlannedExpenses(month);

  const getActualSavings = (month: string) =>
    getActualIncome(month) - getActualExpenses(month);

  const hasActualData = (month: string) =>
    getActualIncome(month) > 0 || getActualExpenses(month) > 0;

  const getRating = (month: string): number | null => {
    if (!hasActualData(month)) return null;

    const goal = getSavingsGoal(month);
    const result = getActualSavings(month);
    const difference = result - goal;

    if (difference >= 0) return 5;

    if (goal <= 0) {
      return result >= 0 ? 4 : 2;
    }

    const missRatio = Math.abs(difference) / Math.abs(goal);

    if (missRatio <= 0.1) return 4;
    if (missRatio <= 0.25) return 3;
    if (missRatio <= 0.5) return 2;

    return 1;
  };

  const getYearTotal = (getValue: (month: string) => number) =>
    months.reduce((sum, month) => sum + getValue(month), 0);

  const getAverage = (getValue: (month: string) => number) =>
    getYearTotal(getValue) / months.length;

  const getActualAverage = (getValue: (month: string) => number) => {
    const activeMonths = months.filter((month) => hasActualData(month));

    if (activeMonths.length === 0) return null;

    return (
      activeMonths.reduce((sum, month) => sum + getValue(month), 0) /
      activeMonths.length
    );
  };

  const getActualYearTotal = (getValue: (month: string) => number) =>
    months.reduce(
      (sum, month) => (hasActualData(month) ? sum + getValue(month) : sum),
      0,
    );

  const getAverageRating = () => {
    const ratings = months
      .map((month) => getRating(month))
      .filter((rating): rating is number => rating !== null);

    if (ratings.length === 0) return null;

    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const annualGoal = getYearTotal(getSavingsGoal);
  const annualResult = getActualYearTotal(getActualSavings);

  const remainingForecast = months.reduce(
    (sum, month) => (hasActualData(month) ? sum : sum + getSavingsGoal(month)),
    0,
  );

  const forecastedYearEnd = annualResult + remainingForecast;
  const forecastGap = forecastedYearEnd - annualGoal;

  const actualProgress =
    annualGoal > 0
      ? Math.min(Math.max((annualResult / annualGoal) * 100, 0), 100)
      : 0;

  const forecastProgress =
    annualGoal > 0
      ? Math.min(
          Math.max((remainingForecast / annualGoal) * 100, 0),
          100 - actualProgress,
        )
      : 0;

  const gapProgress = Math.max(100 - actualProgress - forecastProgress, 0);

  const forecastedProgress =
    annualGoal > 0
      ? Math.min(Math.max((forecastedYearEnd / annualGoal) * 100, 0), 100)
      : 0;

  const savedProgress =
    annualGoal > 0
      ? Math.min(Math.max((annualResult / annualGoal) * 100, 0), 100)
      : 0;

  return {
    getActualIncomeByCategory,
    getActualIncome,
    getActualExpenses,
    getPlannedIncome,
    getPlannedExpenses,
    getSavingsGoal,
    getActualSavings,
    hasActualData,
    getRating,
    getYearTotal,
    getAverage,
    getActualAverage,
    getActualYearTotal,
    getAverageRating,
    annualGoal,
    annualResult,
    forecastedYearEnd,
    forecastGap,
    actualProgress,
    forecastProgress,
    gapProgress,
    forecastedProgress,
    savedProgress, 
    remainingForecast,
  };
};
