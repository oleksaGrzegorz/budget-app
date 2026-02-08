import { useState } from "react";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { Form } from "./components/Form/Form";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";
import { Header } from "./components/Header/Header";

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
        <Header />
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
          <BudgetSummaryTable expenses={expenses} />
        </section>
        <section className="my-12">
          <ExpensesList expenses={expenses} />
        </section>
      </main>
    </div>
  );
}
