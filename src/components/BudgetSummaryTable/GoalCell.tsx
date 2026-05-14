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
          className="w-20 rounded-md border border-slate-300 bg-white px-1 py-0.5 text-center outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 mb-1"
        />

{difference !== null && (
  <span
    className={`text-[11px] font-normal ${
      isGood ? "text-green-600" : "text-red-500"
    }`}
  >
    {difference > 0
      ? `+ ${difference.toFixed(2)} zł`
      : `${difference.toFixed(2)} zł`}
  </span>
)}
      </div>
    </td>
  );
};
