import { useMemo } from "react";

import type { Entry } from "../types/entry";

import { sumExpenses } from "../utils/sumExpenses";
import { sumIncomes } from "../utils/sumIncomes";

import { initialEntries } from "../data/initialEntries";
import { initialExpenseGoals } from "../data/initialExpenseGoals";
import { initialForecast } from "../data/initialForecast";

import { useLocalStorageState } from "./useLocalStorageState";

export const useBudgetData = () => {
  const [entries, setEntries] = useLocalStorageState<Entry[]>(
    "budget.entries",
    initialEntries,
  );
  const [expenseGoals, setExpenseGoals] = useLocalStorageState<
    Record<string, number | null>
  >("budget.expenseGoals", initialExpenseGoals);
  const [incomeGoals, setIncomeGoals] = useLocalStorageState<
    Record<string, number | null>
  >("budget.incomeGoals", {});
  const [forecast, setForecast] = useLocalStorageState(
    "budget.forecast",
    initialForecast,
  );

  const expensesForTable = useMemo(() => sumExpenses(entries), [entries]);
  const incomesForTable = useMemo(() => sumIncomes(entries), [entries]);
  return {
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
