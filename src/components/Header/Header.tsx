interface HeaderProps {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

export const Header = ({ theme, setTheme }: HeaderProps) => {
  return (
    <header className="mb-8">
      <div
        className={`rounded-3xl border p-8 shadow-lg transition-colors duration-300 ${
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
              className={`text-4xl font-black tracking-tight lg:text-5xl ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Home Budget
            </h1>

            <p
              className={`mt-2 text-lg ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
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

          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className={`relative flex h-10 w-20 items-center rounded-full border p-1 transition-colors duration-300 ${
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
        </div>
      </div>
    </header>
  );
};
