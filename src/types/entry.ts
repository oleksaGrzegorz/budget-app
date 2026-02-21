export type Entry = {
  type: "expense" | "income";
  category: string;
  month: string;
  amount: number;
};