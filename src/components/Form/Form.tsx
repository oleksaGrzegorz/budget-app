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
        activeTab: "bg-rose-500 text-white",
        inactiveTab: "text-slate-600 hover:bg-slate-100",
        icon: "bg-rose-100 text-rose-600",
        focus: "focus:border-rose-300 focus:ring-rose-200",
        button: "bg-rose-500 hover:bg-rose-600 focus:ring-rose-200",
      }
    : {
        activeTab: "bg-emerald-500 text-white",
        inactiveTab: "text-slate-600 hover:bg-slate-100",
        icon: "bg-emerald-100 text-emerald-600",
        focus: "focus:border-emerald-300 focus:ring-emerald-200",
        button: "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-200",
      };

  const handleFormTypeChange = (type: "expense" | "income") => {
    setFormType(type);
    setCategory("");
  };

  const isSubmitDisabled = !category || !month || amount === null || amount <= 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => handleFormTypeChange("expense")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              isExpense ? accent.activeTab : accent.inactiveTab
            }`}
          >
            Expenses
          </button>

          <button
            type="button"
            onClick={() => handleFormTypeChange("income")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              !isExpense ? accent.activeTab : accent.inactiveTab
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (isSubmitDisabled) return;

          setEntries((prev) => [
            ...prev,
            { formType, category, month, amount },
          ]);

          setAmount(null);
          setCategory("");
          setMonth("");
        }}
        className="grid items-end gap-5 lg:grid-cols-[280px_1fr_auto]"
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${accent.icon}`}
            aria-hidden="true"
          >
            {isExpense ? "💸" : "💰"}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isExpense ? "Add expense" : "Add income"}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {isExpense
                ? "Add a new expense to track your finances."
                : "Add new income to track your finances."}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </span>

            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 250"
                value={amount ?? ""}
                onChange={(e) =>
                  setAmount(
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                className={`h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${accent.focus}`}
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                zł
              </span>
            </div>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </span>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${accent.focus}`}
            >
              <option value="">Choose category</option>

              {categoriesToShow.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Month
            </span>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${accent.focus}`}
            >
              <option value="">Choose month</option>

              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`h-11 rounded-lg px-8 text-sm font-semibold text-white transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white ${
            isSubmitDisabled ? "" : accent.button
          }`}
        >
          Add
        </button>
      </form>
    </section>
  );
};