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

export const Form = ({amount,setAmount,setExpenses,category,setCategory,month,setMonth,type,}: FormProps) => {
  const categoriesToShow = type === "expense" ? categories : incomeCategories;

  const bgColor = type === "expense" ? "bg-red-50" : "bg-green-50";
  const btnColor = type === "expense" ? "bg-red-500" : "bg-green-500";

  return (
    <form
      className={`p-4 border border-gray-300 rounded-md space-y-2 w-64 mx-auto ${bgColor}`}
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
      <h2 className="text-md font-semibold text-gray-700 text-center">
        {type === "expense" ? "Dodaj wydatek" : "Dodaj przychód"}
      </h2>

      <input
        className="border border-gray-300 rounded p-1 text-sm w-full"
        type="number"
        placeholder="Kwota"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <select
        className="border border-gray-300 rounded p-1 text-sm w-full"
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
        className="border border-gray-300 rounded p-1 text-sm w-full"
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
        className={`${btnColor} text-white rounded p-1 w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Dodaj
      </button>
    </form>
  );
};
