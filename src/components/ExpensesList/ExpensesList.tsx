import type { Entry } from "../../types/entry";

interface ExpensesListProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

export const ExpensesList = ({
  entries,
  setEntries,
}: ExpensesListProps) => {
  const removeEntry = (index: number) => {
    setEntries((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Entries
        </h2>

        {!!entries.length && (
          <span className="text-sm text-slate-400">
            {entries.length}
          </span>
        )}
      </div>

      {!entries.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
          No entries yet
        </div>
      ) : (
        <ul className="space-y-3">
          {entries.map((item, index) => (
            <li
              key={index}
              className={`flex items-center justify-between rounded-xl border p-4 transition hover:shadow-sm ${
                item.formType === "expense"
                  ? "border-rose-200 bg-rose-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}
            >
              <div>
                <div className="font-semibold text-slate-800">
                  {item.category}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {item.month} •{" "}
                  {item.formType === "expense"
                    ? "Expense"
                    : "Income"}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div
                  className={`text-base font-bold ${
                    item.formType === "expense"
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {item.amount.toFixed(2)} zł
                </div>

                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-rose-600"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};