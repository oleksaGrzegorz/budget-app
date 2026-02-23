import { useMemo, useState } from "react";
import { Header } from "./components/Header/Header";
import { Form } from "./components/Form/Form";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";
import { sumExpenses } from "./utils/sumExpenses";
import type { Entry } from "./types/entry";

export default function App() {
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [formType, setFormType] = useState<"expense" | "income">("expense");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [incomes, setIncomes] = useState<Record<string, Record<string, number>>>({});
  const [expenseGoals, setExpenseGoals] = useState<Record<string, number>>({});
  const [incomeGoals, setIncomeGoals] = useState<Record<string, number>>({});
  const expensesForTable = useMemo(() => sumExpenses(entries), [entries]);

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