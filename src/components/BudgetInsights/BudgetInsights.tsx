import { BiggestOverspendingCard } from "./BiggestOverspendingCard";
import { BiggestSavingsCard } from "./BiggestSavingsCard";
import { MonthProgressCard } from "./MonthProgressCard";
import type { PeriodOption } from "../../utils/budgetAverages";

interface BudgetInsightsProps {
  expenses: Record<string, Record<string, number>>;
  expenseGoals: Record<string, number | null>;
  period: PeriodOption;
}

export const BudgetInsights = ({
  expenses,
  expenseGoals,
  period,
}: BudgetInsightsProps) => {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <BiggestOverspendingCard
        expenses={expenses}
        expenseGoals={expenseGoals}
        period={period}
      />

      <BiggestSavingsCard
        expenses={expenses}
        expenseGoals={expenseGoals}
        period={period}
      />

      <MonthProgressCard />
    </section>
  );
};