import type { Currency } from "./initialAccountSnapshots";

export type InvestedAssetId = "stocks" | "bonds" | "crypto";

export type InvestmentCapitalEventKind = "opening" | "buy" | "sell";

export type InvestmentCapitalEvent = {
  date: string;
  assetId: InvestedAssetId;
  amount: number;
  currency: Currency;
  kind: InvestmentCapitalEventKind;
  soldCapitalAmount?: number;
  note?: string;
};

export const initialInvestmentCapitalEvents: InvestmentCapitalEvent[] = [
  {
    date: "2023-01-01",
    assetId: "stocks",
    amount: 8080.15,
    currency: "eur",
    kind: "opening",
    note: "Initial stock investment",
  },
  {
    date: "2022-08-09",
    assetId: "bonds",
    amount: 20000,
    currency: "pln",
    kind: "opening",
    note: "Initial bond investment",
  },
  {
    date: "2022-08-16",
    assetId: "bonds",
    amount: 10000,
    currency: "pln",
    kind: "buy",
    note: "Additional bond purchase",
  },
  {
    date: "2023-01-01",
    assetId: "crypto",
    amount: 0,
    currency: "eur",
    kind: "opening",
    note: "Initial crypto investment",
  },
  {
    date: "2023-12-20",
    assetId: "crypto",
    amount: 1017.01,
    currency: "eur",
    kind: "buy",
    note: "Crypto purchase",
  },
  {
    date: "2023-12-22",
    assetId: "crypto",
    amount: 974.89,
    currency: "eur",
    kind: "buy",
    note: "Crypto purchase",
  },
  {
    date: "2025-05-22",
    assetId: "crypto",
    amount: 4519.42,
    currency: "eur",
    kind: "sell",
    soldCapitalAmount: 1991.9,
    note: "Sold most of the crypto position",
  },
];