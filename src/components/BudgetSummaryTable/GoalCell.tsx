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
  const difference =
    average !== null && value != null
      ? isHigherBetter
        ? average - value
        : value - average
      : null;

  const isGood =
    average !== null &&
    value !== null &&
    (isHigherBetter ? average >= value : average <= value);

  const bgClass =
    average !== null && value !== null
      ? isGood
        ? "bg-green-200 text-green-800"
        : "bg-red-200 text-red-800"
      : "bg-gray-50 text-gray-400";

  return (
    <td
      className={`px-3 py-2 text-center border border-gray-300 font-semibold ${bgClass}`}
    >
      <div className="flex flex-col items-center">
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : Number(v));
          }}
          className="w-20 text-center bg-amber-100 outline-none mb-1"
        />

        {difference !== null && (
          <span className="text-xs">
            {difference > 0
              ? `+${difference}`
              : difference}
          </span>
        )}
      </div>
    </td>
  );
};