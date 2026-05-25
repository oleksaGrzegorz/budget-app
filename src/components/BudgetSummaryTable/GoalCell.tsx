import { useRef, useState } from "react";

interface GoalCellProps {
  value: number | null;
  onChange: (val: number | null) => void;
  average: number | null;
  isHigherBetter: boolean;
}

export const GoalCell = ({
  value,
  onChange,
  average,
  isHigherBetter,
}: GoalCellProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const skipBlurSave = useRef(false);

  const [draftValue, setDraftValue] = useState(
    value !== null ? String(value) : "",
  );

  const formatMoney = (amount: number) =>
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const goal = value ?? 0;
  const avg = average ?? 0;

  const hasGoal = value !== null && Number.isFinite(value) && value > 0;
  const hasAverage = average !== null && Number.isFinite(average);
  const hasData = hasGoal && hasAverage;

  const rawProgress = hasData ? (avg / goal) * 100 : null;
  const progress = rawProgress !== null ? Math.round(rawProgress) : null;

  const signedDifference = hasData ? avg - goal : 0;
  const absDifference = Math.abs(signedDifference);
  const isOnTarget = hasData && absDifference < 0.01;

  const isProblem = hasData && (isHigherBetter ? avg < goal : avg > goal);

  const isStrongProblem =
    isProblem &&
    rawProgress !== null &&
    (isHigherBetter ? rawProgress < 95 : rawProgress > 110);

  const isSoftProblem = isProblem && !isStrongProblem;

  const statusText = !hasData
    ? "-"
    : isOnTarget
      ? "0 euro"
      : `${signedDifference > 0 ? "+" : "-"}${formatMoney(absDifference)} euro`;

  const statusClass = !hasData
    ? "text-slate-300"
    : isStrongProblem
      ? "text-rose-600"
      : isSoftProblem
        ? "text-amber-600"
        : "text-slate-500";

  const progressBarClass = !hasData
    ? "bg-slate-200"
    : isStrongProblem
      ? "bg-rose-500"
      : isSoftProblem
        ? "bg-amber-400"
        : "bg-slate-300";

  const progressWidth =
    rawProgress !== null ? `${Math.min(Math.max(rawProgress, 0), 100)}%` : "0%";

  const formattedValue =
    value !== null ? `${formatMoney(value)} euro` : "+ Set target";

  const tooltip = !hasGoal
    ? "No goal set"
    : !hasAverage
      ? "No average data"
      : [
          `Average: ${formatMoney(avg)} euro`,
          `Goal: ${formatMoney(goal)} euro`,
          `Usage: ${progress}%`,
        ].join("\n");

  const saveValue = () => {
    const normalized = draftValue.trim().replace(",", ".");

    if (normalized === "") {
      onChange(null);
      setIsEditing(false);
      return;
    }

    const parsed = Number(normalized);

    if (Number.isFinite(parsed) && parsed > 0) {
      onChange(parsed);
    } else {
      setDraftValue(value !== null ? String(value) : "");
    }

    setIsEditing(false);
  };

  const cancelEditing = () => {
    skipBlurSave.current = true;
    setDraftValue(value !== null ? String(value) : "");
    setIsEditing(false);
  };

  return (
    <td className="min-w-[250px] border border-slate-200 px-2.5 py-2">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="relative">
            <input
              autoFocus
              type="text"
              inputMode="decimal"
              value={draftValue}
              placeholder="0"
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => setDraftValue(e.target.value)}
              onBlur={() => {
                if (skipBlurSave.current) {
                  skipBlurSave.current = false;
                  return;
                }

                saveValue();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveValue();
                if (e.key === "Escape") cancelEditing();
              }}
              className="h-8 w-28 rounded-lg border border-slate-300 bg-white px-2 pr-7 text-right text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
            />

            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
              euro
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`flex h-8 w-28 items-center justify-between rounded-lg px-2 text-xs font-semibold transition ${
              value !== null
                ? "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-900"
                : "border border-dashed border-slate-300 bg-white text-slate-400 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <span className="truncate">{formattedValue}</span>

            {value !== null && <span className="ml-1 text-slate-400">✎</span>}
          </button>
        )}

        <div className="flex-1" title={tooltip}>
          <div className="mb-1 flex justify-end">
            <span
              className={`text-[11px] font-medium tabular-nums tracking-tight ${statusClass}`}
            >
              {statusText}
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${progressBarClass}`}
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </td>
  );
};
