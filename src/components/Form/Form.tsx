import {
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
  useState,
} from "react";

import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import { categories } from "../../data/categories";
import { months } from "../../data/months";
import type { Entry } from "../../types/entry";

interface FormProps {
  setEntries: Dispatch<SetStateAction<Entry[]>>;
}

type FormType = "expense" | "income";

export const Form = ({ setEntries }: FormProps) => {
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const currentYear = String(new Date().getFullYear());
  const [year, setYear] = useState(currentYear);
  const [formType, setFormType] = useState<FormType>("expense");

  const isExpense = formType === "expense";

  const categoriesToShow = isExpense ? categories : incomeCategories;

  const accent = isExpense
    ? {
        focus: "focus:border-rose-300 focus:ring-rose-100",
        button: "bg-rose-500 hover:bg-rose-600 focus:ring-rose-100",
      }
    : {
        focus: "focus:border-emerald-300 focus:ring-emerald-100",
        button: "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-100",
      };

  const isSubmitDisabled =
    !category || !month || !year || amount === null || amount <= 0;

  const handleTypeChange = (type: FormType) => {
    setFormType(type);
    setCategory("");
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitDisabled) return;

    setEntries((prev) => [
      ...prev,
      {
        formType,
        category,
        month,
        year,
        amount,
      },
    ]);

    setAmount(null);
    setCategory("");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm sm:h-12 sm:w-12">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
              <span className="-mt-px text-[22px] leading-none text-slate-900">
                ✎
              </span>
            </div>
          </div>

          <h2 className="min-w-0 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Add transaction
          </h2>
        </div>

        <div className="relative grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1 sm:w-auto">
          <div
            className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg shadow-sm transition-all duration-300 ease-out ${
              isExpense
                ? "translate-x-0 bg-rose-500"
                : "translate-x-full bg-emerald-500"
            }`}
          />

          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`relative z-10 rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
              isExpense ? "text-white" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Expense
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`relative z-10 rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
              !isExpense ? "text-white" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid items-end gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
      >
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Amount
          </span>

          <div className="relative">
            <input
              type="number"
              value={amount ?? ""}
              placeholder="e.g. 250"
              onChange={(e) =>
                setAmount(e.target.value === "" ? null : Number(e.target.value))
              }
              className={`h-11 w-full rounded-lg border border-slate-300 px-3 pr-9 text-sm outline-none transition-all duration-300 focus:ring-2 ${accent.focus}`}
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              euro
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
            className={`h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition-all duration-300 focus:ring-2 ${accent.focus}`}
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
            className={`h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition-all duration-300 focus:ring-2 ${accent.focus}`}
          >
            <option value="">Choose month</option>

            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Year
          </span>

          <input
            type="number"
            value={year}
            placeholder="e.g. 2023"
            onChange={(e) => setYear(e.target.value)}
            className={`h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition-all duration-300 focus:ring-2 ${accent.focus}`}
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`h-11 rounded-lg px-8 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-300 ${
            isSubmitDisabled ? "" : accent.button
          }`}
        >
          Add
        </button>
      </form>
    </section>
  );
};
