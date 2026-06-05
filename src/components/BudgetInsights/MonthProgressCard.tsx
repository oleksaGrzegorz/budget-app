export const MonthProgressCard = () => {
  const now = new Date();

  const currentDay = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();

  const displayMonth = String(month + 1).padStart(2, "0");
  const lastDay = new Date(year, month + 1, 0).getDate();

  const daysLeft = lastDay - currentDay;
  const progress = (currentDay / lastDay) * 100;

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-lg font-black text-amber-600">
            ⏳
          </span>
        </div>

        <div>
          <h3 className="text-base font-black tracking-tight text-slate-900">
            Month progress
          </h3>

          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Day {currentDay} of {lastDay}
          </p>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="mt-5 flex flex-1 flex-col justify-between">
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 text-center">
          <div className="text-xs font-black uppercase tracking-wide text-amber-600">
            Days left
          </div>

          <div className="mt-2 text-6xl font-black leading-none tracking-tight text-slate-900">
            {daysLeft}
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-500">
            until {lastDay}.{displayMonth}.{year}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Month completed
            </span>

            <span className="text-xs font-black text-amber-600">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-xs font-bold text-slate-400">Current day</div>
            <div className="mt-1 text-lg font-black text-slate-900">
              {currentDay}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-xs font-bold text-slate-400">Days total</div>
            <div className="mt-1 text-lg font-black text-slate-900">
              {lastDay}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};