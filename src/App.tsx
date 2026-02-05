import { useState } from "react";
import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { Form } from "./components/Form/Form";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [expense, setExpense] = useState(0);
  return (
    <div>
      <h1 className="bg-red-500">Budżet domowy</h1>
      <Form amount={amount} setAmount={setAmount} setExpense={setExpense} />
      <ExpensesTable expense={expense} />
      <BudgetSummaryTable />
    </div>
  );
}
