import type { Forecast } from "../../data/initialForecast";
import type { BudgetData } from "../../types/budgetData";
import type { GoalsData } from "../../types/goalsData";
import type { PeriodOption } from "../../utils/budgetAverages";
import { BiggestOverspendingCard } from "./BiggestOverspendingCard";
import { BiggestSavingsCard } from "./BiggestSavingsCard";
import { IncomeGoalCard } from "./IncomeGoalCard";

interface BudgetInsightsProps {
  expenses: BudgetData;
  incomes: BudgetData;
  expenseGoals: GoalsData;
  forecast: Forecast;
  period: PeriodOption;
}

export const BudgetInsights = ({
  expenses,
  incomes,
  expenseGoals,
  forecast,
  period,
}: BudgetInsightsProps) => {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <BiggestSavingsCard
        expenses={expenses}
        expenseGoals={expenseGoals}
        period={period}
      />

      <IncomeGoalCard
        incomes={incomes}
        forecast={forecast}
        period={period}
      />

      <BiggestOverspendingCard
        expenses={expenses}
        expenseGoals={expenseGoals}
        period={period}
      />
    </section>
  );
};