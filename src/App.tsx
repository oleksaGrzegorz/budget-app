import { useMemo, useState, useEffect } from "react";
import { Header } from "./components/Header/Header";
import { Form } from "./components/Form/Form";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";
import { sumExpenses } from "./utils/sumExpenses";
import type { Entry } from "./types/entry";
import { IncomesTable } from "./components/IncomesTable/IncomesTable";

export default function App() {
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [formType, setFormType] = useState<"expense" | "income">("expense");

  const [entries, setEntries] = useState<Entry[]>(
    JSON.parse(localStorage.getItem("entries") || "[]"),
  );

  const [incomes, setIncomes] = useState<
    Record<string, Record<string, number>>
  >(JSON.parse(localStorage.getItem("incomes") || "{}"));

  const [expenseGoals, setExpenseGoals] = useState<Record<string, number>>(
    JSON.parse(localStorage.getItem("expenseGoals") || "{}"),
  );

  const [incomeGoals, setIncomeGoals] = useState<Record<string, number>>(
    JSON.parse(localStorage.getItem("incomeGoals") || "{}"),
  );

  const expensesForTable = useMemo(() => sumExpenses(entries), [entries]);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expenseGoals", JSON.stringify(expenseGoals));
  }, [expenseGoals]);

  useEffect(() => {
    localStorage.setItem("incomeGoals", JSON.stringify(incomeGoals));
  }, [incomeGoals]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        <Header />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <Form
            amount={amount}
            setAmount={setAmount}
            setEntries={setEntries}
            setIncomes={setIncomes}
            category={category}
            setCategory={setCategory}
            month={month}
            setMonth={setMonth}
            setFormType={setFormType}
            formType={formType}
          />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
          <ExpensesTable
            expenses={expensesForTable}
            goals={expenseGoals}
            setGoals={setExpenseGoals}
          />
        </section>
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
          <IncomesTable
            incomes={incomes}
            incomeGoals={incomeGoals}
            setIncomeGoals={setIncomeGoals}
          />
        </section>
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
          <BudgetSummaryTable
            expenses={expensesForTable}
            incomes={incomes}
            incomeGoals={incomeGoals}
            setIncomeGoals={setIncomeGoals}
          />
        </section>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <ExpensesList entries={entries} />
        </div>
      </main>
    </div>
  );
}
