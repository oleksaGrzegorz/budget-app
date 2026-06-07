import logo from "../../images/logo.jpeg";

export const Header = () => {
  return (
    <header className="mb-8">
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          px-8
          py-8
          shadow-lg
        "
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
            <div className="relative shrink-0">
              <div className="absolute inset-0 scale-110 rounded-full bg-white blur-xl opacity-70" />

              <img
                src={logo}
                alt="Home Budget"
                className="
                  relative
                  h-40
                  w-40
                  rounded-full
                  object-cover
                  shadow-2xl
                  ring-4
                  ring-white
                  lg:h-48
                  lg:w-48
                "
              />
            </div>

            {/* Content */}
            <div>
              <div className="mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mx-auto lg:mx-0" />

              <h1 className="text-4xl font-black tracking-tight text-slate-900 lg:text-5xl">
                Home Budget
              </h1>

              <p className="mt-2 text-lg font-medium text-slate-600">
                Personal Finance Dashboard
              </p>

              <p className="mt-1 text-sm text-slate-400">by Grzegorz Oleksa</p>

              <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Savings
                </span>

                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  Expenses
                </span>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Planning
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
