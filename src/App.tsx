import { BudgetSummaryTable } from "./components/BudgetSummaryTable/BudgetSummaryTable";
import { ExpensesTable } from "./components/ExpensesTable/ExpensesTable";

export default function App() {
  return (
    <div>
      <h1 className="bg-red-500">Budżet domowy</h1>
      <ExpensesTable />
      <BudgetSummaryTable />
    </div>
  );
}
