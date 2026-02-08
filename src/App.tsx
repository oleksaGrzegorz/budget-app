import { useState } from "react";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { Form } from "./components/Form/Form";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";
import { Header } from "./components/Header/Header";

export default function App() {
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");

  const [expenses, setExpenses] = useState<Record<string, Record<string, number>>>({});
  const [incomes, setIncomes] = useState<Record<string, Record<string, number>>>({});

  const [formType, setFormType] = useState<"expense" | "income">("expense");

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4">
        <Header />
        <div className="flex gap-4 my-6 justify-center"> 
          <button
            onClick={() => setFormType("expense")}
            className={`px-4 py-2 border ${
              formType === "expense" ? "bg-red-400" : "bg-white"
            }`}
          >
            Wydatki
          </button>

          <button
            onClick={() => setFormType("income")}
            className={`px-4 py-2 border ${
              formType === "income" ? "bg-green-400" : "bg-white"
            }`}
          >
            Przychody
          </button>
        </div>
        <Form
          amount={amount}
          setAmount={setAmount}
          setExpenses={formType === "expense" ? setExpenses : setIncomes}
          category={category}
          setCategory={setCategory}
          month={month}
          setMonth={setMonth}
          type={formType}
        />

        <section className="my-12 overflow-x-auto">
          <ExpensesTable expenses={expenses} />
        </section>

        <section className="my-12 overflow-x-auto">
          <BudgetSummaryTable expenses={expenses} incomes={incomes} />
        </section>

        <section className="my-12">
          <ExpensesList expenses={expenses} />
        </section>
      </main>
    </div>
  );
}
