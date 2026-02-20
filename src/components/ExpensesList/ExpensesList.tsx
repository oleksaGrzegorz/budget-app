interface ExpensesListProps {
  expenses: { category: string; month: string; amount: number }[];
}

export const ExpensesList = ({ expenses }: ExpensesListProps) => {
  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Lista wydatków</h2>
      {expenses.length === 0 ? (
        <p>Brak wydatków</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((item, index) => (
            <li key={index} className="border border-gray-300 p-2 rounded">
              <strong>{index + 1}. Kategoria:</strong> {item.category},{" "}
              <strong>Miesiąc:</strong> {item.month},{" "}
              <strong>Kwota:</strong> {item.amount} zł
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};