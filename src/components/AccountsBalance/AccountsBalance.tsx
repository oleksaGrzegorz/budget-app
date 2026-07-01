import { useMemo, useState } from "react";

import type { ChartMetric, ChartMetricId } from "./types";

import type { AccountSnapshot } from "../../data/initialAccountSnapshots";
import { AccountsHistoryTable } from "./AccountsHistoryTable";
import { AccountsLineChart } from "./AccountsLineChart";
import {
  getAccountsForCurrency,
  getEurTotal,
  getPlnTotal,
  getTotalEur,
} from "./calculations";
import type { TimeRange } from "./chartConfig";
import { timeRanges } from "./chartConfig";
import { getFilteredSnapshots } from "./chartData";
import { formatEur, formatPln } from "./format";

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
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Accounts balance
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Monthly bank accounts, cash and investments snapshot
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total net worth
          </div>

          <div className="mt-1 text-3xl font-black text-slate-900">
            {formatEur(getTotalEur(latest))}
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            PLN total
          </div>

          <div className="mt-1 text-xl font-black text-slate-900">
            {formatPln(getPlnTotal(latest))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            EUR total
          </div>

          <div className="mt-1 text-xl font-black text-slate-900">
            {formatEur(getEurTotal(latest))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Exchange rate
          </div>

          <div className="mt-1 text-xl font-black text-slate-900">
            {latest.exchangeRate.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Balance history
            </h3>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Track one account or total over a selected period
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">
                Show
              </span>

              <select
                value={selectedMetricId}
                onChange={(event) =>
                  setSelectedMetricId(event.target.value as ChartMetricId)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm outline-none transition focus:border-slate-400"
              >
                {chartMetrics.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">
                Period
              </span>

              <div className="flex rounded-lg bg-white p-1 shadow-sm">
                {timeRanges.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setSelectedTimeRange(range.id)}
                    className={`rounded-md px-3 py-2 text-xs font-black transition ${
                      selectedTimeRange === range.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AccountsLineChart
          snapshots={filteredSnapshots}
          metric={selectedMetric}
        />

        <AccountsHistoryTable
          snapshots={snapshots}
          plnAccounts={plnAccounts}
          eurAccounts={eurAccounts}
        />
      </div>
    </section>
  );
};
