interface GoalCellProps {
  value?: number;
  onChange: (val: number) => void;
  average: number | null;
}

export const GoalCell = ({ value, onChange, average }: GoalCellProps) => {
  const difference =
    average !== null && value !== undefined ? average - value : null;

  const bgClass =
    average !== null && value !== undefined
      ? average > value
        ? "bg-red-200 text-red-800"
        : "bg-green-200 text-green-800"
      : "";

  return (
    <td
      className={`px-3 py-2 text-center border border-gray-300 font-semibold ${bgClass}`}
    >
      <div className="flex flex-col items-center">
        <input
        placeholder="cel"
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? 0 : Number(v));
          }}
          className="w-20 text-center bg-amber-100 outline-none mb-1"
        />

        {difference !== null && (
          <span className="text-xs">
            {difference > 0
              ? `+${difference.toFixed(2)}`
              : difference.toFixed(2)}
          </span>
        )}
      </div>
    </td>
  );
};