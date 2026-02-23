import type { Entry } from "../../types/entry";

interface ExpensesListProps {
  entries: Entry[];
}

export const ExpensesList = ({ entries }: ExpensesListProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-6">
        Lista wpisów
      </h2>

      {entries.length === 0 ? (
        <div className="text-sm text-slate-400">Brak wpisów</div>
      ) : (
        <ul className="space-y-3">
          {entries.map((item, index) => (
            <li
              key={index}
              className={`p-4 rounded-xl border flex justify-between items-center text-sm ${
                item.formType === "expense"
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              <div>
                <div className="font-semibold">
                  {index + 1}. {item.category}
                </div>
                <div className="text-xs opacity-70">
                  {item.month} • {item.formType === "expense" ? "Wydatek" : "Przychód"}
                </div>
              </div>
              <div className="font-bold">{item.amount} zł</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};