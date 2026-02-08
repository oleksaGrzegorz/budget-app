import type { Dispatch, SetStateAction } from "react";
import { categories } from "../../data/categories";
import { budgetSummaryLabels as incomeCategories } from "../../data/budgetSummaryLabels";
import { months } from "../../data/months";

interface FormProps {
  amount: number | "";
  setAmount: Dispatch<SetStateAction<number | "">>;
  setExpenses: Dispatch<SetStateAction<Record<string, Record<string, number>>>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  type: "expense" | "income";
}

export const Form = ({
  amount,
  setAmount,
  setExpenses,
  category,
  setCategory,
  month,
  setMonth,
  type,
}: FormProps) => {
  const categoriesToShow = type === "expense" ? categories : incomeCategories;

  return (
    <form
      className="p-10 border border-black m-10"
      onSubmit={(e) => {
        e.preventDefault();
        if (!category || !month || amount === "" || amount <= 0) return;

        setExpenses((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [month]: (prev[category]?.[month] || 0) + amount,
          },
        }));

        setAmount("");
        setCategory("");
        setMonth("");
      }}
    >
      <h2 className="text-lg font-bold mb-4">
        {type === "expense" ? "Dodaj wydatek" : "Dodaj przychód"}
      </h2>

      <input
        className="border border-red-400 mb-2 p-1 w-full"
        type="number"
        placeholder="Kwota"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <select
        className="border border-red-400 mb-2 p-1 w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">-- wybierz kategorię --</option>
        {categoriesToShow.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        className="border border-red-400 mb-2 p-1 w-full"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">-- wybierz miesiąc --</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={!category || !month || amount === "" || amount <= 0}
        className="bg-blue-500 border border-black disabled:opacity-50 disabled:cursor-not-allowed p-2 w-full"
      >
        Dodaj
      </button>
    </form>
  );
};
