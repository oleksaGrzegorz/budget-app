export const MonthProgressCard = () => {
  const now = new Date();

  const currentDay = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();

  const displayMonth = String(month + 1).padStart(2, "0");

  const lastDay = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const remaining = lastDay - currentDay;

  const progress =
    (currentDay / lastDay) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-base font-bold text-slate-800">
        Dni do końca miesiąca
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg
            viewBox="0 0 120 120"
            className="-rotate-90"
          >
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />

            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray={302}
              strokeDashoffset={
                302 - (progress / 100) * 302
              }
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-slate-800">
              {remaining}
            </div>

            <div className="text-sm text-slate-500">
              dni
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Do {lastDay}.{displayMonth}.{year}
        </div>
      </div>
    </div>
  );
};