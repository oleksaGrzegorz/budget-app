import type { Entry } from "../../types/entry";

interface ExpensesListProps {
  entries: Entry[];
}

export const ExpensesList = ({ entries }: ExpensesListProps) => {
  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-slate-700">
        Entries list
      </h2>

      {entries.length === 0 ? (
        <div className="text-sm text-slate-400">No entries</div>
      ) : (
        <ul className="space-y-3">
          {entries.map((item, index) => (
            <li
              key={index}
              className={`flex items-center justify-between rounded-xl border p-4 text-sm ${
                item.formType === "expense"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <div>
                <div className="font-semibold">
                  {index + 1}. {item.category}
                </div>

                <div className="text-xs opacity-70">
                  {item.month} •{" "}
                  {item.formType === "expense" ? "Expense" : "Income"}
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