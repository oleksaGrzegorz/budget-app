import {
  categories,
  getCategoryAverageType,
} from "../../data/categories";
import type { BudgetData } from "../../types/budgetData";
import type { GoalsData } from "../../types/goalsData";
import type { PeriodOption } from "../../utils/budgetAverages";
import { BiggestOverspendingCard } from "./BiggestOverspendingCard";
import { BiggestSavingsCard } from "./BiggestSavingsCard";
import { MonthProgressCard } from "./MonthProgressCard";

interface BudgetInsightsProps {
  expenses: BudgetData;
  expenseGoals: GoalsData;
  period: PeriodOption;
}

export const BudgetInsights = ({
  expenses,
  expenseGoals,
  period,
}: BudgetInsightsProps) => {
  const expectedExpensesLeft =
    period === "average"
      ? 0
      : categories.reduce((sum, category) => {
          if (getCategoryAverageType(category) === "annual") {
            return sum;
          }

          const goal = expenseGoals[category] ?? 0;
          const spent = expenses[category]?.[period] ?? 0;

          if (spent >= goal) {
            return sum;
          }

          return sum + (goal - spent);
        }, 0);

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <BiggestSavingsCard
        expenses={expenses}
        expenseGoals={expenseGoals}
        period={period}
      />

      <MonthProgressCard expectedExpensesLeft={expectedExpensesLeft} />

      <BiggestOverspendingCard
        expenses={expenses}
        expenseGoals={expenseGoals}
        period={period}
      />
    </section>
  );
};