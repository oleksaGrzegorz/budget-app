interface Props {
  expectedExpensesLeft: number;
}

export const MonthProgressCard = ({
  expectedExpensesLeft,
}: Props) => {
  const now = new Date();

  const currentDay = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthName = now.toLocaleString("en-US", {
    month: "long",
  });

  const lastDay = new Date(year, month + 1, 0).getDate();

  const daysLeft = lastDay - currentDay;
  const progress = (currentDay / lastDay) * 100;

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-lg font-black text-indigo-600">
            ⏳
          </span>
        </div>

        <div>
          <h3 className="text-base font-black tracking-tight text-slate-900">
            Month progress
          </h3>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="mt-6 flex flex-1 flex-col justify-center">
        <div className="text-center">
          <div className="text-7xl font-black leading-none tracking-tight text-slate-900">
            {daysLeft}
          </div>

          <div className="mt-2 text-sm font-semibold uppercase tracking-[0.15em] text-indigo-600">
            days left
          </div>

          <div className="mt-4 text-sm font-medium text-slate-400">
            {monthName} {year}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Month completed
            </span>

            <span className="text-xs font-black text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Expected expenses left
            </div>

            <div className="mt-2 text-3xl font-black text-slate-900">
              {expectedExpensesLeft.toFixed(0)} €
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};