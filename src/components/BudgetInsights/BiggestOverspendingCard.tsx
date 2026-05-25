import { categories, categoryEmojis } from "../../data/categories";
import { months } from "../../data/months";
import { calculateAverage } from "../../utils/calculateAverage";

interface Props {
  expenses: Record<string, Record<string, number>>;
  expenseGoals: Record<string, number | null>;
}

export const BiggestOverspendingCard = ({
  expenses,
  expenseGoals,
}: Props) => {
  const items = categories
    .map((category) => {
      const average = calculateAverage(
        months.map((month) => expenses[category]?.[month] ?? 0),
      );

      const goal = expenseGoals[category];

      if (!goal || average === null || average <= goal) {
        return null;
      }

      return {
        category,
        emoji: categoryEmojis[category] ?? "",
        diff: average - goal,
      };
    })
    .filter(
      (v): v is { category: string; emoji: string; diff: number } => v !== null,
    )
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 3);

  const max = Math.max(...items.map((i) => i.diff), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-7 text-base font-bold text-slate-800">
        Biggest overspending
      </h3>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.category}>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-slate-700">
                <span className="mr-1">{item.emoji}</span>
                {item.category}
              </span>

              <span className="text-sm font-bold text-rose-500">
                +{item.diff.toFixed(2)} euro
              </span>
            </div>

            <div className="h-1 rounded-full bg-rose-100">
              <div
                className="h-full rounded-full bg-rose-400"
                style={{
                  width: `${Math.max((item.diff / max) * 100, 14)}%`,
                }}
              />
            </div>
          </div>
        ))}

        {!items.length && (
          <div className="text-sm text-slate-400">No overspending</div>
        )}
      </div>
    </div>
  );
};