import type { Dispatch, SetStateAction } from "react";
import { categories } from "../../data/categories";
import { months } from "../../data/months";

interface FormProps {
  amount: number | "";
  setAmount: Dispatch<SetStateAction<number | "">>;
  setExpenses: Dispatch<SetStateAction<Record<string, Record<string, number>>>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
}

export const Form = ({
  amount,
  setAmount,
  setExpenses,
  category,
  setCategory,
  month,
  setMonth,
}: FormProps) => {
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
      <input
        className="border border-red-400"
        type="number"
        placeholder="Kwota"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        className="border border-red-400"
        name="category"
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">-- wybierz kategorię --</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        className="border border-red-400"
        name="month"
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">-- wybierz miesiąc --</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!category || !month || amount === "" || amount <= 0}
        className="bg-blue-500 border border-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Dodaj
      </button>
    </form>
  );
};
