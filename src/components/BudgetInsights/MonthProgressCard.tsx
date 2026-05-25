export const MonthProgressCard = () => {
  const now = new Date();

  const currentDay = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();

  const displayMonth = String(month + 1).padStart(2, "0");
  const lastDay = new Date(year, month + 1, 0).getDate();

  const remaining = lastDay - currentDay;
  const progress = (currentDay / lastDay) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-lg font-bold text-slate-900">
            ⏳
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-800">
          Days left this month
        </h3>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="mt-5 flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 120 120" className="-rotate-90">
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
              strokeDashoffset={302 - (progress / 100) * 302}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-slate-800">
              {remaining}
            </div>

            <div className="text-sm text-slate-500">days</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Until {lastDay}.{displayMonth}.{year}
        </div>
      </div>
    </div>
  );
};