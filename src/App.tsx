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

  const [selectedYear, setSelectedYear] = useState("2026");

  const {
    entriesForSelectedYear,
    setEntries,
    expenseGoals,
    setExpenseGoals,
    incomeGoals,
    setIncomeGoals,
    forecast,
    setForecast,
    expensesForTable,
    incomesForTable,
  } = useBudgetData(selectedYear);

  return (
    <AppLayout theme={theme}>
      <Header theme={theme} setTheme={setTheme} />

      <BitcoinPrice />

      <select
        value={selectedYear}
        onChange={(event) => setSelectedYear(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="2025">2025</option>
        <option value="2026">2026</option>
      </select>

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

      <DashboardCard title="Expenses" subtitle="Monthly expenses by category">
        <ExpensesTable
          expenses={expensesForTable}
          goals={expenseGoals}
          setGoals={setExpenseGoals}
          period={budgetPeriod}
        />
      </DashboardCard>

      <DashboardCard title="Income" subtitle="Monthly income by category">
        <IncomesTable
          incomes={incomesForTable}
          incomeGoals={incomeGoals}
          setIncomeGoals={setIncomeGoals}
          period={budgetPeriod}
        />
      </DashboardCard>

      <DashboardCard
        title="Budget summary"
        subtitle="Income, expenses and savings"
      >
        <BudgetSummaryTable
          expenses={expensesForTable}
          incomes={incomesForTable}
          incomeGoals={incomeGoals}
          setIncomeGoals={setIncomeGoals}
          period={budgetPeriod}
        />
      </DashboardCard>

      <DashboardCard
        title="Income forecast"
        subtitle="Predicted income for the next period"
      >
        <IncomeForecastTable
          incomes={incomesForTable}
          expenses={expensesForTable}
          forecast={forecast}
          setForecast={setForecast}
        />
      </DashboardCard>

      <DashboardCard
        title="Transactions history"
        subtitle="All your transactions in one place"
      >
        <ExpensesList
          entries={entriesForSelectedYear}
          setEntries={setEntries}
        />
      </DashboardCard>
    </AppLayout>
  );
}
