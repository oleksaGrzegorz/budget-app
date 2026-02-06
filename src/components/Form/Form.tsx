import type { Dispatch, SetStateAction } from "react";
import { categories } from "../../data/categories";

interface FormProps {
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
  setExpenses: Dispatch<SetStateAction<Record<string, number>>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

export const Form = ({ amount, setAmount, setExpenses, category, setCategory }: FormProps) => (
  <form
    className="p-10 border border-black m-10"
    onSubmit={(e) => {
      e.preventDefault();
      setExpenses((prev) => ({ ...prev, [category]: (prev[category] || 0) + amount }));
      setAmount(0);
    }}
  >
    <input
      className="border border-red-400"
      type="number"
      placeholder="Kwota"
      value={amount}
      onChange={(e) => setAmount(Number(e.target.value))}
    />
    <select className="border border-red-400" name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">-- wybierz kategorię --</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
    <button className="bg-blue-500 border border-black">Dodaj</button>
  </form>
);
