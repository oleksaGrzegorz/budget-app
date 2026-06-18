import { useMemo } from "react";

import type { Entry } from "../types/entry";

import { sumExpenses } from "../utils/sumExpenses";
import { sumIncomes } from "../utils/sumIncomes";

import { initialEntries } from "../data/initialEntries";
import { initialExpenseGoals } from "../data/initialExpenseGoals";
import { initialForecast } from "../data/initialForecast";
import { initialIncomeGoals } from "../data/initialIncomeGoals";

import { useLocalStorageState } from "./useLocalStorageState";

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
  };
};
