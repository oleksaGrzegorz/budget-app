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
  const hasData =
    average !== null &&
    value !== null &&
    Number.isFinite(average) &&
    Number.isFinite(value) &&
    value > 0;

  const progress = hasData ? Math.round((average / value) * 100) : null;
  const difference = hasData ? average - value : null;

  const problemAmount =
    hasData && difference !== null
      ? isHigherBetter
        ? Math.max(value - average, 0)
        : Math.max(average - value, 0)
      : 0;

  const isProblem = problemAmount >= 0.01;

  const problemText = isHigherBetter
    ? `-${problemAmount.toFixed(2)} zł`
    : `+${problemAmount.toFixed(2)} zł`;

  const progressWidth =
    progress !== null ? `${Math.min(Math.max(progress, 0), 100)}%` : "0%";

  return (
    <td className="min-w-[220px] border border-gray-300 px-2.5 py-2">
      <div className="flex items-center gap-2.5">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={value ?? ""}
          placeholder="0"
          onChange={(e) => {
            const v = e.target.value;

            if (v === "") {
              onChange(null);
              return;
            }

            const parsed = Number(v);

            onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : null);
          }}
          className={[
            "h-7 w-16 rounded-md border bg-white px-1.5 text-right text-xs font-semibold outline-none transition",
            "placeholder:text-slate-300",
            "focus:ring-1",
            isProblem
              ? "border-rose-300 text-rose-700 focus:border-rose-400 focus:ring-rose-200"
              : "border-slate-300 text-slate-800 focus:border-slate-400 focus:ring-slate-300",
          ].join(" ")}
        />

        <div className="flex-1">
          <div className="mb-1 flex h-4 items-center justify-between gap-2">
            <span
              className={`text-xs font-bold tabular-nums ${
                progress === null
                  ? "text-slate-300"
                  : isProblem
                    ? "text-rose-600"
                    : "text-slate-700"
              }`}
            >
              {progress !== null ? `${progress}%` : "—"}
            </span>

            {isProblem && (
              <span className="shrink-0 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold leading-none text-rose-600 ring-1 ring-rose-100">
                {problemText}
              </span>
            )}
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
            title={
              !hasData
                ? "Brak ustawionego celu"
                : isProblem
                  ? isHigherBetter
                    ? `Brakuje ${problemAmount.toFixed(2)} zł do celu`
                    : `Przekroczono cel o ${problemAmount.toFixed(2)} zł`
                  : "Cel w normie"
            }
          >
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isProblem ? "bg-rose-500" : "bg-slate-400"
              }`}
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </td>
  );
};