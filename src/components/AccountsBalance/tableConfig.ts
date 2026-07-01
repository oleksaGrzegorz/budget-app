import type { AccountId } from "../../data/initialAccountSnapshots";

export const accountPercentDiffColumns: Partial<Record<AccountId, string>> = {
  "pln.bonds": "%",
  "eur.broker": "%",
};