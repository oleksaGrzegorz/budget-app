import type { Dispatch, SetStateAction } from "react";
import { categories } from "../../data/categories";
import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import { months } from "../../data/months";
import type { Entry } from "../../types/entry";

interface FormProps {
  amount: number | null;
  setAmount: Dispatch<SetStateAction<number | null>>;
  setEntries: Dispatch<SetStateAction<Entry[]>>;
  setIncomes: Dispatch<SetStateAction<Record<string, Record<string, number>>>>;
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
  setIncomes,
  category,
  setCategory,
  month,
  setMonth,
  formType,
  setFormType,
}: FormProps) => {
  const categoriesToShow =
    formType === "expense" ? categories : incomeCategories;

  return (
    <>
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setFormType("expense")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            formType === "expense"
              ? "bg-rose-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Wydatki
        </button>

        <button
          onClick={() => setFormType("income")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            formType === "income"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Przychody
        </button>
      </div>

      <form
        className="max-w-md mx-auto space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!category || !month || amount === null || amount <= 0) return;

          setEntries((prev) => [
            ...prev,
            { formType, category, month, amount },
          ]);

          if (formType === "income") {
            setIncomes((prev) => ({
              ...prev,
              [category]: {
                ...prev[category],
                [month]: (prev[category]?.[month] || 0) + amount,
              },
            }));
          }

          setAmount(null);
          setCategory("");
          setMonth("");
        }}
      >
        <h2 className="text-lg font-semibold text-center text-slate-700">
          {formType === "expense" ? "Dodaj wydatek" : "Dodaj przychód"}
        </h2>

        <input
          type="number"
          placeholder="Kwota"
          value={amount ?? ""}
          onChange={(e) =>
            setAmount(e.target.value === "" ? null : Number(e.target.value))
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        >
          <option value="">-- wybierz kategorię --</option>
          {categoriesToShow.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        >
          <option value="">-- wybierz miesiąc --</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!category || !month || amount === null || amount <= 0}
          className={`w-full py-2 rounded-lg font-medium transition ${
            formType === "expense"
              ? "bg-rose-500 text-white"
              : "bg-emerald-500 text-white"
          } disabled:opacity-40`}
        >
          Dodaj
        </button>
      </form>
    </>
  );
};