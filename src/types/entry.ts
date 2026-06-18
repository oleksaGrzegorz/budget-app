export type Entry = {
  id: string;
  formType: "expense" | "income";
  category: string;
  year: string;
  month: string;
  amount: number;

};