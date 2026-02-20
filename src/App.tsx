import { useState } from "react";

import { Header } from "./components/Header/Header";
import { Form } from "./components/Form/Form";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesList } from "./components/ExpensesList/ExpensesList";

export default function App() {
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");

  const [expenses, setExpenses] = useState<Record<string, Record<string, number>>>({});
  const [incomes, setIncomes] = useState<Record<string, Record<string, number>>>({});

  const [expenseGoals, setExpenseGoals] = useState<Record<string, number>>({});
  const [incomeGoals, setIncomeGoals] = useState<Record<string, number>>({});
  
  const [formType, setFormType] = useState<"expense" | "income">("expense");

  return (
    <div className="min-h-screen bg-gray-200">
      
      <main className="mx-auto max-w-7xl px-6 py-8 bg-amber-300">
        <Header />
        <div className="space-y-8">

          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <Form
              amount={amount}
              setAmount={setAmount}
              setExpenses={formType === "expense" ? setExpenses : setIncomes}
              category={category}
              setCategory={setCategory}
              month={month}
              setMonth={setMonth}
              type={formType}
              setFormType={setFormType}
              formType={formType}
            />
          </div>

          <section className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <ExpensesTable
              expenses={expenses}
              goals={expenseGoals}
              setGoals={setExpenseGoals}
            />
          </section>

          <section className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <BudgetSummaryTable
              expenses={expenses}
              incomes={incomes}
              incomeGoals={incomeGoals}
              setIncomeGoals={setIncomeGoals}
            />
          </section>

          <ExpensesList expenses={expenses} />
        </div>
      </main>
    </div>
  );
}
