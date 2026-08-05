import type { AccountId } from "../../../../data/initialAccountSnapshots";
import type { accountDefinitions } from "../../../../data/initialAccountSnapshots";

export type AccountDefinition = (typeof accountDefinitions)[number];

export type ChartMetricId = AccountId | "pln.total" | "eur.total" | "total.eur";

export interface ChartMetric {
  id: ChartMetricId;
  label: string;
  currencyLabel: string;
}
