import { useState } from "react";

import type { Entry } from "../../types/entry";

interface ExpensesListProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

export const ExpensesList = ({ entries, setEntries }: ExpensesListProps) => {
  const [showAll, setShowAll] = useState(false);

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const yearDifference = Number(b.year) - Number(a.year);

    if (yearDifference !== 0) {
      return yearDifference;
    }

    const monthDifference = Number(b.month) - Number(a.month);

    if (monthDifference !== 0) {
      return monthDifference;
    }

    return b.id.localeCompare(a.id);
  });

  const visibleEntries = showAll ? sortedEntries : sortedEntries.slice(0, 5);

  const groupedEntries = visibleEntries.reduce<Record<string, Entry[]>>(
    (groups, entry) => {
      if (!groups[entry.month]) {
        groups[entry.month] = [];
      }

      groups[entry.month].push(entry);

      return groups;
    },
    {},
  );

  return (
    <div>
      {!entries.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
          No entries yet
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([month, monthEntries]) => (
              <section key={month}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />

                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {month}
                  </h3>

                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <ul>
                  {monthEntries.map((item) => {
                    const isExpense = item.formType === "expense";

                    return (
                      <li
                        key={item.id}
                        className="group flex items-center justify-between border-b border-slate-100 py-4 transition hover:bg-slate-50"
                      >
                        <div className="font-medium text-slate-800">
                          {item.category}
                        </div>

                        <div className="ml-4 flex items-center gap-4">
                          <span
                            className={`text-sm font-bold ${
                              isExpense ? "text-rose-600" : "text-emerald-600"
                            }`}
                          >
                            {isExpense ? "-" : "+"}
                            {item.amount.toFixed(2)} €
                          </span>

                          <button
                            type="button"
                            onClick={() => removeEntry(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 opacity-100 transition hover:bg-slate-100 hover:text-rose-600 lg:opacity-0 lg:group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          {entries.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-6 w-full rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {showAll ? "Show less" : "Show details"}
            </button>
          )}
        </>
      )}
    </div>
  );
};
