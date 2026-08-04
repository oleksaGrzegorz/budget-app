import { useMemo } from "react";

import type { Goals } from "../types/goals";

import { initialBudgetSummaryGoals } from "../data/initialBudgetSummaryGoals";
import { initialEntries } from "../data/initialEntries";
import { initialExpenseGoals } from "../data/initialExpenseGoals";
import { initialForecast } from "../data/initialForecast";
import { initialIncomeGoals } from "../data/initialIncomeGoals";

import  { sumExpenses } from "../features/expenses/utils/sumExpenses";
import { sumIncomes } from "../features/incomes/utils/sumIncomes";
import type { Entry } from "../features/transactions/types/entry";
import { useLocalStorageState } from "../shared/hooks/useLocalStorageState";

export const useBudgetData = (selectedYear: string) => {
  const [entries, setEntries] = useLocalStorageState<Entry[]>(
    "budget.entries",
    initialEntries,
  );

  const entriesForSelectedYear = useMemo(
    () => entries.filter((entry) => entry.year === selectedYear),
    [entries, selectedYear],
  );

  const [expenseGoals, setExpenseGoals] = useLocalStorageState<
    Record<string, number | null>
  >(`budget.expenseGoals.${selectedYear}`, initialExpenseGoals);
  const [incomeGoals, setIncomeGoals] = useLocalStorageState<
    Record<string, number | null>
  >(`budget.incomeGoals.${selectedYear}`, initialIncomeGoals);
  const [summaryGoals, setSummaryGoals] = useLocalStorageState<Goals>(
  `budget.summaryGoals.${selectedYear}`,
  initialBudgetSummaryGoals,
);
  const [forecast, setForecast] = useLocalStorageState(
    `budget.forecast.${selectedYear}`,
    initialForecast,
  );

  const expensesForTable = useMemo(
    () => sumExpenses(entriesForSelectedYear),
    [entriesForSelectedYear],
  );
  const incomesForTable = useMemo(
    () => sumIncomes(entriesForSelectedYear),
    [entriesForSelectedYear],
  );
  return {
    entriesForSelectedYear,
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
    summaryGoals,
    setSummaryGoals,
  };
};
