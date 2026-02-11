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
    <div className="min-h-screen bg-gray-200">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Header />

        <div className="flex gap-8 mt-8">
          
          <div className="w-1/3 bg-white rounded-lg shadow-md p-6 h-fit">
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setFormType("expense")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                  formType === "expense"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Wydatki
              </button>

              <button
                onClick={() => setFormType("income")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                  formType === "income"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700"
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
          </div>

          <div className="w-2/3 space-y-8">
            <section className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
              <ExpensesTable expenses={expenses} />
            </section>

            <section className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
              <BudgetSummaryTable expenses={expenses} incomes={incomes} />
            </section>

            <section>
              <ExpensesList expenses={expenses} />
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
