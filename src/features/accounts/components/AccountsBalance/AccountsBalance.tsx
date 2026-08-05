import { useMemo, useState } from "react";

import type { ChartMetric, ChartMetricId } from "./types";

import type { AccountSnapshot } from "../../../../data/initialAccountSnapshots";
import { QuarterlyAssetsSummary } from "../QuarterlyAssetsSummary/QuarterlyAssetsSummary";
import { AccountsHistoryTable } from "./AccountsHistoryTable";
import { AccountsOverview } from "./AccountsOverview";
import { BalanceHistorySection } from "./BalanceHistorySection";
import { getAccountsForCurrency } from "./calculations";
import type { TimeRange } from "./chartConfig";
import { getFilteredSnapshots } from "./chartData";

interface Props {
  snapshots: AccountSnapshot[];
}

export const AccountsBalance = ({ snapshots }: Props) => {
  const latest = snapshots.at(-1);

  const [selectedMetricId, setSelectedMetricId] =
    useState<ChartMetricId>("total.eur");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("3y");

  const plnAccounts = getAccountsForCurrency("pln", snapshots);
  const eurAccounts = getAccountsForCurrency("eur", snapshots);

  const chartMetrics: ChartMetric[] = useMemo(
    () => [
      {
        id: "total.eur",
        label: "Total net worth",
        currencyLabel: "EUR",
      },
      {
        id: "pln.total",
        label: "PLN total",
        currencyLabel: "PLN",
      },
      {
        id: "eur.total",
        label: "EUR total",
        currencyLabel: "EUR",
      },
      ...plnAccounts.map((account) => ({
        id: account.id,
        label: account.label,
        currencyLabel: account.currency === "pln" ? "PLN" : "EUR",
      })),
      ...eurAccounts.map((account) => ({
        id: account.id,
        label: account.label,
        currencyLabel: account.currency === "pln" ? "PLN" : "EUR",
      })),
    ],
    [plnAccounts, eurAccounts],
  );

  if (!latest) return null;

  const selectedMetric =
    chartMetrics.find((metric) => metric.id === selectedMetricId) ??
    chartMetrics[0];

  const filteredSnapshots = getFilteredSnapshots(snapshots, selectedTimeRange);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <AccountsOverview latest={latest} />

      <BalanceHistorySection
        chartMetrics={chartMetrics}
        selectedMetricId={selectedMetricId}
        selectedTimeRange={selectedTimeRange}
        selectedMetric={selectedMetric}
        filteredSnapshots={filteredSnapshots}
        onMetricChange={setSelectedMetricId}
        onTimeRangeChange={setSelectedTimeRange}
      />

      <QuarterlyAssetsSummary snapshots={snapshots} />

      <AccountsHistoryTable
        snapshots={snapshots}
        plnAccounts={plnAccounts}
        eurAccounts={eurAccounts}
      />
    </section>
  );
};
