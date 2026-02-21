export type Entry = {
  formType: "expense" | "income";
  category: string;
  month: string;
  amount: number;
};