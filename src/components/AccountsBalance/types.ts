import type { AccountId } from "../../data/initialAccountSnapshots";

export type ChartMetricId = AccountId | "pln.total" | "eur.total" | "total.eur";

export interface ChartMetric {
  id: ChartMetricId;
  label: string;
  currencyLabel: string;
}