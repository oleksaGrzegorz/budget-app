import type { Entry } from "../../App";

interface ExpensesListProps {
  entries: Entry[];
}

export const ExpensesList = ({ entries }: ExpensesListProps) => {
  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Lista wpisów</h2>
      {entries.length === 0 ? (
        <p>Brak wpisów</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((item, index) => (
            <li
              key={index}
              className={`border border-gray-300 p-2 rounded ${
                item.type === "expense" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
              }`}
            >
              <strong>{index + 1}. [{item.type === "expense" ? "Wydatek" : "Przychód"}]</strong>{" "}
              {item.category}, <strong>Miesiąc:</strong> {item.month},{" "}
              <strong>Kwota:</strong> {item.amount} zł
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};