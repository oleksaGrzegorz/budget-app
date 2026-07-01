export type TimeRange = "3m" | "6m" | "1y" | "3y" | "5y" | "all";

export const timeRanges: { id: TimeRange; label: string; months: number | null }[] = [
  { id: "3m", label: "3M", months: 3 },
  { id: "6m", label: "6M", months: 6 },
  { id: "1y", label: "1Y", months: 12 },
  { id: "3y", label: "3Y", months: 36 },
  { id: "5y", label: "5Y", months: 60 },
  { id: "all", label: "All", months: null },
];