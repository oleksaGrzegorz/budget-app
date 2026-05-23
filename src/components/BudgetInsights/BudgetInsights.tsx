import { BiggestOverspendingCard } from "./BiggestOverspendingCard";
import { BiggestSavingsCard } from "./BiggestSavingsCard";
import { MonthProgressCard } from "./MonthProgressCard";

interface BudgetInsightsProps {
  expenses: Record<string, Record<string, number>>;
  expenseGoals: Record<string, number | null>;
}

export const BudgetInsights = ({
  expenses,
  expenseGoals,
}: BudgetInsightsProps) => {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <BiggestOverspendingCard
        expenses={expenses}
        expenseGoals={expenseGoals}
      />

      <BiggestSavingsCard
        expenses={expenses}
        expenseGoals={expenseGoals}
      />

      <MonthProgressCard />
    </section>
  );
};