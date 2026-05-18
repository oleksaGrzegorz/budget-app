import type { Dispatch, SetStateAction } from "react";
import { categories } from "../../data/categories";
import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import { months } from "../../data/months";
import type { Entry } from "../../types/entry";

interface FormProps {
  amount: number | null;
  setAmount: Dispatch<SetStateAction<number | null>>;
  setEntries: Dispatch<SetStateAction<Entry[]>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  formType: "expense" | "income";
  setFormType: Dispatch<SetStateAction<"expense" | "income">>;
}

export const Form = ({
  amount,
  setAmount,
  setEntries,
  category,
  setCategory,
  month,
  setMonth,
  formType,
  setFormType,
}: FormProps) => {
  const isExpense = formType === "expense";

  const categoriesToShow = isExpense ? categories : incomeCategories;

  const accent = isExpense
    ? {
        section:
          "border-rose-200 bg-gradient-to-br from-rose-100 via-white to-white",
        leftBar: "bg-rose-500",
        glow: "bg-rose-300/60",
        icon: "bg-rose-500 text-white ring-rose-200 shadow-rose-200",
        activeTab: "bg-rose-500 text-white shadow-rose-200",
        inactiveTab: "text-slate-500 hover:bg-white hover:text-slate-800",
        focus: "focus:border-rose-400 focus:ring-rose-200",
        button:
          "bg-rose-500 hover:bg-rose-600 focus:ring-rose-200 shadow-rose-100",
        label: "text-rose-600",
      }
    : {
        section:
          "border-emerald-200 bg-gradient-to-br from-emerald-100 via-white to-white",
        leftBar: "bg-emerald-500",
        glow: "bg-emerald-300/60",
        icon: "bg-emerald-500 text-white ring-emerald-200 shadow-emerald-200",
        activeTab: "bg-emerald-500 text-white shadow-emerald-200",
        inactiveTab: "text-slate-500 hover:bg-white hover:text-slate-800",
        focus: "focus:border-emerald-400 focus:ring-emerald-200",
        button:
          "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-200 shadow-emerald-100",
        label: "text-emerald-600",
      };

  const handleFormTypeChange = (type: "expense" | "income") => {
    setFormType(type);
    setCategory("");
  };

  const isSubmitDisabled = !category || !month || amount === null || amount <= 0;

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border shadow-sm ${accent.section}`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-2 ${accent.leftBar}`}
        aria-hidden="true"
      />

      <div
        className={`pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl ${accent.glow}`}
        aria-hidden="true"
      />

      <div className="relative grid lg:grid-cols-[0.9fr_1.5fr]">
        <div className="border-b border-slate-200/80 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-slate-200/80">
          <div className="inline-flex rounded-2xl bg-white/80 p-1.5 shadow-sm ring-1 ring-slate-200 backdrop-blur">
            <button
              type="button"
              onClick={() => handleFormTypeChange("expense")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                isExpense
                  ? `${accent.activeTab} shadow-md`
                  : accent.inactiveTab
              }`}
            >
              Wydatki
            </button>

            <button
              type="button"
              onClick={() => handleFormTypeChange("income")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                !isExpense
                  ? `${accent.activeTab} shadow-md`
                  : accent.inactiveTab
              }`}
            >
              Przychody
            </button>
          </div>

          <div className="mt-10">
            <div
              className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg ring-4 ${accent.icon}`}
              aria-hidden="true"
            >
              {isExpense ? "💸" : "💰"}
            </div>

            <p
              className={`mb-2 text-xs font-bold uppercase tracking-[0.2em] ${accent.label}`}
            >
              {isExpense ? "Nowy wydatek" : "Nowy przychód"}
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {isExpense ? "Dodaj wydatek" : "Dodaj przychód"}
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              {isExpense
                ? "Uzupełnij kwotę, kategorię i miesiąc. Po dodaniu wpis trafi do tabeli wydatków."
                : "Uzupełnij kwotę, kategorię i miesiąc. Po dodaniu wpis trafi do tabeli przychodów."}
            </p>
          </div>
        </div>

        <form
          className="p-6 sm:p-8 lg:p-10"
          onSubmit={(e) => {
            e.preventDefault();

            if (!category || !month || amount === null || amount <= 0) return;

            setEntries((prev) => [
              ...prev,
              { formType, category, month, amount },
            ]);

            setAmount(null);
            setCategory("");
            setMonth("");
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Kwota
              </span>

              <div className="relative">
                <input
                  type="number"
                  placeholder="np. 250"
                  value={amount ?? ""}
                  onChange={(e) =>
                    setAmount(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className={`h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${accent.focus}`}
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  zł
                </span>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Miesiąc
              </span>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={`h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:ring-4 ${accent.focus}`}
              >
                <option value="">Wybierz miesiąc</option>

                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Kategoria
              </span>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:ring-4 ${accent.focus}`}
              >
                <option value="">Wybierz kategorię</option>

                {categoriesToShow.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`mt-7 flex min-h-[52px] w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${accent.button}`}
          >
            {isExpense ? "Dodaj wydatek" : "Dodaj przychód"}
          </button>
        </form>
      </div>
    </section>
  );
};