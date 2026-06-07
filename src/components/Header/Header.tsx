export const Header = () => {
  return (
    <header className="mb-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <span className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
          Personal Finance
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 lg:text-5xl">
          Home Budget
        </h1>

        <p className="mt-2 text-lg text-slate-600">
          Track expenses, income and savings
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Savings
          </span>

          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Expenses
          </span>

          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            Income
          </span>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Planning
          </span>
        </div>
      </div>
    </header>
  );
};
