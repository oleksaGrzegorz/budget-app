import { useState } from "react";

import { useBudgetData } from "./hooks/useBudgetData";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

import { AppLayout } from "./components/AppLayout/AppLayout";
import { BitcoinPrice } from "./components/BitcoinPrice";
import { BudgetInsights } from "./components/BudgetInsights/BudgetInsights";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { BudgetUsageSummary } from "./components/BudgetUsageSummary/BudgetUsageSummary";
import { DashboardCard } from "./components/DashboardCard/DashboardCard";
import { ExpensesByCategoryChart } from "./components/ExpensesByCategoryChart/ExpensesByCategoryChart";
import { ExpensesByIncomeChart } from "./components/ExpensesByIncomeChart/ExpensesByIncomeChart";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { Form } from "./components/Form/Form";
import { Header } from "./components/Header/Header";
import { IncomeForecastTable } from "./components/IncomeForecastTable/IncomeForecastTable";
import { IncomesTable } from "./components/IncomesTable/IncomesTable";

import type { PeriodOption } from "./utils/budgetAverages";

export default function App() {
  const [theme, setTheme] = useLocalStorageState<"light" | "dark">(
    "budget.theme",
    "light",
  );
  const [budgetPeriod, setBudgetPeriod] = useState<PeriodOption>("average");

  const {
    entries,
    setEntries,
    expenseGoals,
    setExpenseGoals,
    incomeGoals,
    setIncomeGoals,
    forecast,
    setForecast,
    expensesForTable,
    incomesForTable,
  } = useBudgetData();

  return (
    <AppLayout theme={theme}>
      <Header theme={theme} setTheme={setTheme} />

      <BitcoinPrice />

      <Form setEntries={setEntries} />

      <BudgetUsageSummary
        expenses={expensesForTable}
        expenseGoals={expenseGoals}
        period={budgetPeriod}
        setPeriod={setBudgetPeriod}
      />

      <BudgetInsights
        expenses={expensesForTable}
        expenseGoals={expenseGoals}
        period={budgetPeriod}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ExpensesByIncomeChart
          expenses={expensesForTable}
          incomes={incomesForTable}
          period={budgetPeriod}
        />

        <ExpensesByCategoryChart
          expenses={expensesForTable}
          period={budgetPeriod}
        />
      </div>

      <DashboardCard>
        <ExpensesTable
          expenses={expensesForTable}
          goals={expenseGoals}
          setGoals={setExpenseGoals}
          period={budgetPeriod}
        />
      </DashboardCard>

      <DashboardCard>
        <IncomesTable
          incomes={incomesForTable}
          incomeGoals={incomeGoals}
          setIncomeGoals={setIncomeGoals}
          period={budgetPeriod}
        />
      </DashboardCard>

      <DashboardCard>
        <BudgetSummaryTable
          expenses={expensesForTable}
          incomes={incomesForTable}
          incomeGoals={incomeGoals}
          setIncomeGoals={setIncomeGoals}
          period={budgetPeriod}
        />
      </DashboardCard>

      <DashboardCard>
        <IncomeForecastTable
          incomes={incomesForTable}
          expenses={expensesForTable}
          forecast={forecast}
          setForecast={setForecast}
        />
      </DashboardCard>
      
      <DashboardCard>
        <ExpensesList entries={entries} setEntries={setEntries} />
      </DashboardCard>
    </AppLayout>
  );
}
