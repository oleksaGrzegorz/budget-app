interface ExpensesListProps {
  expenses: Record<string, Record<string, number>>;
}

export const ExpensesList = ({ expenses }: ExpensesListProps) => {
  const expenseItems = Object.entries(expenses).flatMap(([category, monthsObj]) =>
    Object.entries(monthsObj).map(([month, amount]) => ({
      category,
      month,
      amount,
    }))
  );

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Lista wydatków</h2>
      {expenseItems.length === 0 ? (
        <p>Brak wydatków</p>
      ) : (
        <ul className="space-y-2">
          {expenseItems.map((item, index) => (
            <li key={index} className="border border-gray-300 p-2 rounded">
              <strong>Kategoria:</strong> {item.category}, <strong>Miesiąc:</strong> {item.month}, <strong>Kwota:</strong> {item.amount} zł
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
