interface HeaderProps {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

export const Header = ({
  theme,
  setTheme,
}: HeaderProps) => {
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
    <header className="mb-6">
      <div
        className={`rounded-3xl border p-6 shadow-lg transition-colors duration-300 ${
          theme === "dark"
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span
              className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                theme === "dark"
                  ? "bg-slate-800 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Personal Finance
            </span>

            <h1
              className={`text-3xl font-black tracking-tight lg:text-4xl ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Home Budget
            </h1>

            <p
              className={`mt-2 text-base ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Track expenses, income and savings
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
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

          <div className="flex flex-col gap-4 lg:min-w-[280px]">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
              className={`relative ml-auto flex h-10 w-20 items-center rounded-full border p-1 transition-colors duration-300 ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-200 bg-slate-100"
              }`}
            >
              <span
                className={`absolute flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-bold shadow-sm transition-transform duration-300 ${
                  theme === "dark"
                    ? "translate-x-10 text-slate-800"
                    : "translate-x-0 text-amber-500"
                }`}
              >
                {theme === "dark" ? "☾" : "☀"}
              </span>
            </button>

            <div
              className={`rounded-2xl border p-4 ${
                theme === "dark"
                  ? "border-slate-800 bg-slate-950"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div
                    className={`text-xs font-bold uppercase tracking-wide ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Month progress
                  </div>

                  <div
                    className={`mt-1 text-2xl font-black leading-none ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {daysLeft}
                    <span className="ml-1 text-sm font-bold text-indigo-500">
                      days left
                    </span>
                  </div>

                  <div
                    className={`mt-1 text-xs font-semibold ${
                      theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {monthName} {year}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-indigo-500">
                    {Math.round(progress)}%
                  </div>

                  <div
                    className={`mt-1 text-xs font-semibold ${
                      theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    completed
                  </div>
                </div>
              </div>

              <div
                className={`mt-3 h-2 overflow-hidden rounded-full ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(Math.max(progress, 0), 100)}%`,
                  }}
                />
              </div>         
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};