import type { Entry } from "../types/entry";

export type MonthlyCategoryMap = Record<string, Record<string, number>>;

export function sumExpenses(entries: Entry[]): MonthlyCategoryMap {
  const result: MonthlyCategoryMap = {};

  for (const entry of entries) {
    if (entry.formType !== "expense") continue;

    if (!result[entry.category]) {
      result[entry.category] = {};
    }

    result[entry.category][entry.month] =
      (result[entry.category][entry.month] || 0) + entry.amount;
  }

  return result;
}
