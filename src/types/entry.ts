export type Entry = {
  formType: "expense" | "income";
  category: string;
  year: string;
  month: string;
  amount: number;
};