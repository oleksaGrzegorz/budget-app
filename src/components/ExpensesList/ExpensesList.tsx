import { useState } from "react";
import type { Entry } from "../../types/entry";

interface ExpensesListProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

export const ExpensesList = ({ entries, setEntries }: ExpensesListProps) => {
  const [showAll, setShowAll] = useState(false);

  const removeEntry = (index: number) => {
    setEntries((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const visibleEntries = showAll ? entries : entries.slice(-3);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Entries</h2>

        {!!entries.length && (
          <span className="text-sm text-slate-400">{entries.length}</span>
        )}
      </div>

      {!entries.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
          No entries yet
        </div>
      ) : (
        <>
          <ul className="space-y-3 transition-all duration-300 ease-in-out">
            {visibleEntries.map((item, index) => {
              const realIndex = showAll
                ? index
                : entries.length - visibleEntries.length + index;

              return (
                <li
                  key={realIndex}
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all duration-300 ease-in-out hover:shadow-sm ${
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
                      {item.formType === "expense" ? "Expense" : "Income"}
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
                      {item.amount.toFixed(2)} euro
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEntry(realIndex)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {entries.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {showAll ? "Show less" : "Show details"}
            </button>
          )}
        </>
      )}
    </div>
  );
};