import { useState } from "react";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { Form } from "./components/Form/Form";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";

export default function App() {
  const [amount, setAmount] = useState<number | "">("");
  const [expenses, setExpenses] = useState<
    Record<string, Record<string, number>>
  >({});
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4">
        <h1 className="text-2xl font-bold py-6 text-center">Budżet domowy</h1>
        <section className="my-8">
          <Form
            amount={amount}
            setAmount={setAmount}
            setExpenses={setExpenses}
            category={category}
            setCategory={setCategory}
            month={month}
            setMonth={setMonth}
          />
        </section>
        <section className="my-12 overflow-x-auto">
          <ExpensesTable expenses={expenses} />
        </section>
        <section className="my-12 overflow-x-auto">
          <BudgetSummaryTable />
        </section>
        <section className="my-12">
          <ExpensesList expenses={expenses} />
        </section>
      </main>
    </div>
  );
}
