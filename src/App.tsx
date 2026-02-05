import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";
import { Form } from "./components/Form/Form";

export default function App() {
  return (
    <div>
      <h1 className="bg-red-500">Budżet domowy</h1>
      <Form />
      <ExpensesTable />
      <BudgetSummaryTable />
    </div>
  );
}
