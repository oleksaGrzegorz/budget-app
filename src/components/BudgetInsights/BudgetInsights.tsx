import type { Forecast } from "../../data/initialForecast";
import type { BudgetData } from "../../types/budgetData";
import type { GoalsData } from "../../types/goalsData";
import type { PeriodOption } from "../../utils/budgetAverages";
import { IncomeGoalCard } from "./IncomeGoalCard";

interface BudgetInsightsProps {
  expenses: BudgetData;
  incomes: BudgetData;
  expenseGoals: GoalsData;
  forecast: Forecast;
  period: PeriodOption;
}

export const BudgetInsights = ({
  incomes,
  forecast,
  period,
}: BudgetInsightsProps) => {
  return (
    <IncomeGoalCard incomes={incomes} forecast={forecast} period={period} />
  );
};
