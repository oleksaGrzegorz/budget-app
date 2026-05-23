import { useMemo, useState } from "react";
import { Header } from "./components/Header/Header";
import { Form } from "./components/Form/Form";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";
import { IncomesTable } from "./components/IncomesTable/IncomesTable";
import { sumExpenses } from "./utils/sumExpenses";
import { sumIncomes } from "./utils/sumIncomes";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import type { Entry } from "./types/entry";
import { initialEntries } from "./data/initialEntries";
import { BitcoinPrice } from "./components/BitcoinPrice";
import { BudgetUsageSummary } from "./components/BudgetUsageSummary/BudgetUsageSummary";
import { BudgetInsights } from "./components/BudgetInsights/BudgetInsights";

export default function App() {
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [formType, setFormType] = useState<"expense" | "income">("expense");

  const [entries, setEntries] = useLocalStorageState<Entry[]>(
    "budget.entries",
    initialEntries,
  );

  const [expenseGoals, setExpenseGoals] = useLocalStorageState<
    Record<string, number | null>
  >("budget.expenseGoals", {});

  const [incomeGoals, setIncomeGoals] = useLocalStorageState<
    Record<string, number | null>
  >("budget.incomeGoals", {});

  const expensesForTable = useMemo(() => sumExpenses(entries), [entries]);
  const incomesForTable = useMemo(() => sumIncomes(entries), [entries]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <main className="mx-auto max-w-7xl space-y-10 px-6 py-10">
        <Header />

        <BitcoinPrice />

        <Form
          amount={amount}
          setAmount={setAmount}
          setEntries={setEntries}
          category={category}
          setCategory={setCategory}
          month={month}
          setMonth={setMonth}
          setFormType={setFormType}
          formType={formType}
        />

        <BudgetUsageSummary
          expenses={expensesForTable}
          expenseGoals={expenseGoals}
        />

        <BudgetInsights
          expenses={expensesForTable}
          expenseGoals={expenseGoals}
        />

        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ExpensesTable
            expenses={expensesForTable}
            goals={expenseGoals}
            setGoals={setExpenseGoals}
          />
        </section>

        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <IncomesTable
            incomes={incomesForTable}
            incomeGoals={incomeGoals}
            setIncomeGoals={setIncomeGoals}
          />
        </section>

        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <BudgetSummaryTable
            expenses={expensesForTable}
            incomes={incomesForTable}
            incomeGoals={incomeGoals}
            setIncomeGoals={setIncomeGoals}
          />
        </section>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ExpensesList entries={entries} />
        </div>
      </main>
    </div>
  );
}
