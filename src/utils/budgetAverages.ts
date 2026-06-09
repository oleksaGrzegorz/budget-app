import { months } from "../data/months";
import type { CategoryAverageType } from "../data/categories";

export type MonthlyCategoryMap = Record<string, Record<string, number>>;
export type PeriodOption = "average" | string;

const hasMonthValue = (
  categoryValues: Record<string, number> | undefined,
  month: string,
) =>
  categoryValues
    ? Object.prototype.hasOwnProperty.call(categoryValues, month)
    : false;

export const getActiveMonths = (...maps: MonthlyCategoryMap[]) =>
  months.filter((month) =>
    maps.some((map) =>
      Object.values(map).some((categoryValues) =>
        hasMonthValue(categoryValues, month),
      ),
    ),
  );

export const getMonthTotal = (
  values: MonthlyCategoryMap,
  categories: string[],
  month: string,
) =>
  categories.reduce(
    (sum, category) => sum + (values[category]?.[month] ?? 0),
    0,
  );

export const getCategoryYearTotal = (
  values: MonthlyCategoryMap,
  category: string,
) =>
  months.reduce((sum, month) => sum + (values[category]?.[month] ?? 0), 0);

export const getCategoryAverage = (
  values: MonthlyCategoryMap,
  category: string,
  activeMonths: string[],
  categoryAverageTypes: Partial<Record<string, CategoryAverageType>> = {},
): number | null => {
  if (categoryAverageTypes[category] === "annual") {
    return getCategoryYearTotal(values, category) / 12;
  }

  if (activeMonths.length === 0) return null;

  const total = activeMonths.reduce(
    (sum, month) => sum + (values[category]?.[month] ?? 0),
    0,
  );

  return total / activeMonths.length;
};

export const getCategoriesAverageTotal = (
  values: MonthlyCategoryMap,
  categories: string[],
  activeMonths: string[],
  categoryAverageTypes: Partial<Record<string, CategoryAverageType>> = {},
): number | null => {
  if (activeMonths.length === 0) return null;

  return categories.reduce(
    (sum, category) =>
      sum +
      (getCategoryAverage(
        values,
        category,
        activeMonths,
        categoryAverageTypes,
      ) ?? 0),
    0,
  );
};