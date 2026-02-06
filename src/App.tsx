import { useState } from "react";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { Form } from "./components/Form/Form";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [category, setCategory] = useState("");
  return (
    <div>
      <h1 className="bg-red-500">Budżet domowy</h1>
      <Form
        amount={amount}
        setAmount={setAmount}
        setExpenses={setExpenses}
        category={category}
        setCategory={setCategory}
      />
      <ExpensesTable expenses={expenses}/>
      <BudgetSummaryTable />
    </div>
  );
}
