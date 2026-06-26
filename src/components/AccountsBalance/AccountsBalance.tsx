import { Fragment, useMemo, useState } from "react";

import type {
  AccountId,
  AccountSnapshot,
  Currency,
} from "../../data/initialAccountSnapshots";
import {
  accountDefinitions,
  isAccountActiveOnDate,
} from "../../data/initialAccountSnapshots";

interface Props {
  snapshots: AccountSnapshot[];
}

type ChartMetricId = AccountId | "pln.total" | "eur.total" | "total.eur";
type TimeRange = "3m" | "6m" | "1y" | "3y" | "5y" | "all";

interface ChartMetric {
  id: ChartMetricId;
  label: string;
  currencyLabel: string;
}

interface YearSummary {
  year: string;
  baseDate: string;
  endDate: string;
  basePlnTotal: number;
  endPlnTotal: number;
  plnDiff: number;
  baseEurTotal: number;
  endEurTotal: number;
  eurDiff: number;
  baseTotalPln: number;
  endTotalPln: number;
  totalPlnDiff: number;
  baseTotalEur: number;
  endTotalEur: number;
  totalEurDiff: number;
  totalEurDiffPercent: number | null;
  averageRate: number;
  monthsCount: number;
}

const accountPercentDiffColumns: Partial<Record<AccountId, string>> = {
  "pln.bonds": "%",
  "eur.broker": "%",
};

const timeRanges: { id: TimeRange; label: string; months: number | null }[] = [
  { id: "3m", label: "3M", months: 3 },
  { id: "6m", label: "6M", months: 6 },
  { id: "1y", label: "1Y", months: 12 },
  { id: "3y", label: "3Y", months: 36 },
  { id: "5y", label: "5Y", months: 60 },
  { id: "all", label: "All", months: null },
];

const formatNumber = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatCompactNumber = (value: number) =>
  value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

const formatPln = (value: number) => `${formatCompactNumber(value)} zł`;
const formatEur = (value: number) => `${formatNumber(value)} €`;

const formatSignedPln = (value: number) =>
  `${value >= 0 ? "+" : ""}${formatPln(value)}`;

const formatSignedEur = (value: number) =>
  `${value >= 0 ? "+" : ""}${formatEur(value)}`;

const formatPercent = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const formatChartValue = (value: number, currencyLabel: string) =>
  currencyLabel === "EUR" ? formatEur(value) : formatPln(value);

const formatShortDate = (date: string) => {
  const parsed = new Date(date);

  return parsed.toLocaleString("en-US", {
    month: "short",
    year: "2-digit",
  });
};

const headerClass =
  "border-b border-slate-200 bg-slate-50 px-2 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-500 whitespace-nowrap";

const dateHeaderClass =
  "border-b border-slate-200 bg-slate-50 px-2 py-2 text-left text-[11px] font-black uppercase tracking-wide text-slate-500 whitespace-nowrap";

const cellClass =
  "border-b border-slate-100 px-2 py-2 text-right text-xs text-slate-700 whitespace-nowrap";

const dateCellClass =
  "border-b border-slate-100 px-2 py-2 text-left text-xs font-bold text-slate-900 whitespace-nowrap";

const percentHeaderClass =
  "w-12 border-b border-slate-200 bg-slate-50 px-1 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-400 whitespace-nowrap";

const percentCellBaseClass =
  "w-12 border-b border-slate-100 px-1 py-2 text-right text-[11px] font-bold whitespace-nowrap";

const totalHeaderClass =
  "border-b border-slate-200 bg-slate-100 px-2 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-700 whitespace-nowrap";

const totalCellClass =
  "border-b border-slate-100 bg-slate-50 px-2 py-2 text-right text-xs font-black text-slate-900 whitespace-nowrap";

const sectionEndHeaderClass =
  "border-r border-r-slate-300 border-b border-slate-200 bg-slate-100 px-2 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-700 whitespace-nowrap";

const sectionEndCellClass =
  "border-r border-r-slate-200 border-b border-slate-100 bg-slate-50 px-2 py-2 text-right text-xs font-bold whitespace-nowrap";

const yearSummaryCellClass = "border-y-4 border-slate-300 bg-slate-50 p-0";

const getAccountsForCurrency = (
  currency: Currency,
  snapshots: AccountSnapshot[],
) =>
  accountDefinitions.filter(
    (account) =>
      account.currency === currency &&
      snapshots.some((snapshot) =>
        isAccountActiveOnDate(account, snapshot.date),
      ),
  );

const getCurrencyTotal = (snapshot: AccountSnapshot, currency: Currency) =>
  accountDefinitions
    .filter(
      (account) =>
        account.currency === currency &&
        isAccountActiveOnDate(account, snapshot.date),
    )
    .reduce((sum, account) => sum + (snapshot.balances[account.id] ?? 0), 0);

const getPlnTotal = (snapshot: AccountSnapshot) =>
  getCurrencyTotal(snapshot, "pln");

const getEurTotal = (snapshot: AccountSnapshot) =>
  getCurrencyTotal(snapshot, "eur");

const getTotalPln = (snapshot: AccountSnapshot) =>
  getPlnTotal(snapshot) + getEurTotal(snapshot) * snapshot.exchangeRate;

const getTotalEur = (snapshot: AccountSnapshot) =>
  snapshot.exchangeRate === 0
    ? 0
    : getTotalPln(snapshot) / snapshot.exchangeRate;

const getDiff = (
  snapshots: AccountSnapshot[],
  index: number,
  currency: Currency,
) => {
  if (index === 0) return null;

  const current = snapshots[index];
  const previous = snapshots[index - 1];

  return (
    getCurrencyTotal(current, currency) - getCurrencyTotal(previous, currency)
  );
};

const getTotalEurDiff = (snapshots: AccountSnapshot[], index: number) => {
  if (index === 0) return null;

  return getTotalEur(snapshots[index]) - getTotalEur(snapshots[index - 1]);
};

const getTotalEurDiffPercent = (
  snapshots: AccountSnapshot[],
  index: number,
) => {
  if (index === 0) return null;

  const previous = getTotalEur(snapshots[index - 1]);

  if (previous === 0) return null;

  return ((getTotalEur(snapshots[index]) - previous) / previous) * 100;
};

const getAccountPercentDiff = (
  snapshots: AccountSnapshot[],
  index: number,
  accountId: AccountId,
) => {
  if (index === 0) return null;

  const current = snapshots[index].balances[accountId];
  const previous = snapshots[index - 1].balances[accountId];

  if (current === undefined || previous === undefined || previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
};

const getValueColorClass = (value: number | null) => {
  if (value === null) return "text-slate-400";
  return value >= 0 ? "text-emerald-600" : "text-rose-600";
};

const getDiffBadgeClass = (value: number | null) => {
  if (value === null) {
    return "bg-slate-100 text-slate-400";
  }

  return value >= 0
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
};

const getDiffCellClass = (value: number | null) => {
  if (value === null) {
    return "";
  }

  return value >= 0 ? "bg-emerald-50" : "bg-rose-50";
};

const getChartValue = (snapshot: AccountSnapshot, metricId: ChartMetricId) => {
  if (metricId === "pln.total") return getPlnTotal(snapshot);
  if (metricId === "eur.total") return getEurTotal(snapshot);
  if (metricId === "total.eur") return getTotalEur(snapshot);

  return snapshot.balances[metricId] ?? 0;
};

const getFilteredSnapshots = (
  snapshots: AccountSnapshot[],
  timeRange: TimeRange,
) => {
  const range = timeRanges.find((item) => item.id === timeRange);

  if (!range || range.months === null) {
    return snapshots;
  }

  const latest = snapshots.at(-1);

  if (!latest) {
    return snapshots;
  }

  const minDate = new Date(latest.date);
  minDate.setMonth(minDate.getMonth() - range.months);

  return snapshots.filter((snapshot) => new Date(snapshot.date) >= minDate);
};

const getSnapshotYear = (snapshot: AccountSnapshot) =>
  snapshot.date.slice(0, 4);

const getIsLastSnapshotOfYear = (
  snapshots: AccountSnapshot[],
  index: number,
) => {
  const currentYear = getSnapshotYear(snapshots[index]);
  const nextSnapshot = snapshots[index + 1];

  if (!nextSnapshot) return true;

  return getSnapshotYear(nextSnapshot) !== currentYear;
};

const getYearStartIndex = (snapshots: AccountSnapshot[], year: string) =>
  snapshots.findIndex((snapshot) => getSnapshotYear(snapshot) === year);

const getYearSummaryEndIndex = (
  snapshots: AccountSnapshot[],
  year: string,
  fallbackIndex: number,
) => {
  const nextYear = String(Number(year) + 1);
  const nextYearJanuaryIndex = snapshots.findIndex(
    (snapshot) => snapshot.date === `${nextYear}-01-01`,
  );

  if (nextYearJanuaryIndex !== -1) {
    return nextYearJanuaryIndex;
  }

  return fallbackIndex;
};

const getYearSummary = (
  snapshots: AccountSnapshot[],
  startIndex: number,
  endIndex: number,
): YearSummary => {
  const baseSnapshot = snapshots[startIndex];
  const endSnapshot = snapshots[endIndex];
  const yearSnapshots = snapshots.slice(startIndex, endIndex + 1);

  const basePlnTotal = getPlnTotal(baseSnapshot);
  const endPlnTotal = getPlnTotal(endSnapshot);
  const baseEurTotal = getEurTotal(baseSnapshot);
  const endEurTotal = getEurTotal(endSnapshot);
  const baseTotalPln = getTotalPln(baseSnapshot);
  const endTotalPln = getTotalPln(endSnapshot);
  const baseTotalEur = getTotalEur(baseSnapshot);
  const endTotalEur = getTotalEur(endSnapshot);
  const totalEurDiff = endTotalEur - baseTotalEur;

  return {
    year: getSnapshotYear(baseSnapshot),
    baseDate: baseSnapshot.date,
    endDate: endSnapshot.date,
    basePlnTotal,
    endPlnTotal,
    plnDiff: endPlnTotal - basePlnTotal,
    baseEurTotal,
    endEurTotal,
    eurDiff: endEurTotal - baseEurTotal,
    baseTotalPln,
    endTotalPln,
    totalPlnDiff: endTotalPln - baseTotalPln,
    baseTotalEur,
    endTotalEur,
    totalEurDiff,
    totalEurDiffPercent:
      baseTotalEur === 0 ? null : (totalEurDiff / baseTotalEur) * 100,
    averageRate:
      yearSnapshots.reduce((sum, snapshot) => sum + snapshot.exchangeRate, 0) /
      yearSnapshots.length,
    monthsCount: yearSnapshots.length,
  };
};

const DiffBadge = ({
  value,
  children,
}: {
  value: number | null;
  children: React.ReactNode;
}) => {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 font-black ${getDiffBadgeClass(
        value,
      )}`}
    >
      {value === null ? "-" : children}
    </span>
  );
};

const getLargeDiffBadgeClass = (value: number | null) => {
  if (value === null) {
    return "bg-slate-100 text-slate-400";
  }

  return value >= 0
    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
    : "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
};

const LargeDiffBadge = ({
  value,
  text,
}: {
  value: number | null;
  text: string;
}) => {
  return (
    <span
      className={`inline-flex min-w-[130px] justify-center rounded-xl px-3 py-2 text-sm font-black shadow-sm ${getLargeDiffBadgeClass(
        value,
      )}`}
    >
      {value === null ? "-" : text}
    </span>
  );
};

const getMetricValueClass = (value?: number | null) => {
  if (value === undefined) return "text-slate-900";
  if (value === null) return "text-slate-400";
  return value >= 0 ? "text-emerald-700" : "text-rose-700";
};

const YearSummaryMetricCard = ({
  label,
  value,
  helper,
  toneValue,
}: {
  label: string;
  value: string;
  helper?: string;
  toneValue?: number | null;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div
        className={`mt-1 text-base font-black ${getMetricValueClass(
          toneValue,
        )}`}
      >
        {value}
      </div>

      {helper ? (
        <div className="mt-1 text-[10px] font-bold text-slate-500">
          {helper}
        </div>
      ) : null}
    </div>
  );
};

const YearSummaryRow = ({
  summary,
}: {
  summary: YearSummary;
  plnColumnsCount?: number;
  eurColumnsCount?: number;
}) => {
  return (
    <tr>
      <td colSpan={999} className={yearSummaryCellClass}>
        <div className="p-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-white shadow-lg">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Year summary
                </div>

                <div className="mt-1 text-2xl font-black tracking-tight">
                  {summary.year}
                </div>

                <div className="mt-1 text-xs font-bold text-slate-300">
                  From {summary.baseDate} to {summary.endDate}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Months
                  </div>

                  <div className="mt-0.5 text-lg font-black text-white">
                    {summary.monthsCount}
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Avg rate
                  </div>

                  <div className="mt-0.5 text-lg font-black text-white">
                    {summary.averageRate.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <YearSummaryMetricCard
                label="PLN change"
                value={formatSignedPln(summary.plnDiff)}
                helper={`${formatPln(summary.basePlnTotal)} → ${formatPln(
                  summary.endPlnTotal,
                )}`}
                toneValue={summary.plnDiff}
              />

              <YearSummaryMetricCard
                label="EUR change"
                value={formatSignedEur(summary.eurDiff)}
                helper={`${formatEur(summary.baseEurTotal)} → ${formatEur(
                  summary.endEurTotal,
                )}`}
                toneValue={summary.eurDiff}
              />

              <YearSummaryMetricCard
                label="Total PLN"
                value={formatPln(summary.endTotalPln)}
                helper={`Change ${formatSignedPln(summary.totalPlnDiff)}`}
                toneValue={summary.totalPlnDiff}
              />

              <YearSummaryMetricCard
                label="Total EUR"
                value={formatEur(summary.endTotalEur)}
                helper={`${formatEur(summary.baseTotalEur)} → ${formatEur(
                  summary.endTotalEur,
                )}`}
                toneValue={summary.totalEurDiff}
              />

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Net worth diff
                </div>

                <div className="mt-2">
                  <LargeDiffBadge
                    value={summary.totalEurDiff}
                    text={formatSignedEur(summary.totalEurDiff)}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Net worth %
                </div>

                <div className="mt-2">
                  <LargeDiffBadge
                    value={summary.totalEurDiffPercent}
                    text={
                      summary.totalEurDiffPercent === null
                        ? "-"
                        : formatPercent(summary.totalEurDiffPercent)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

const AccountsLineChart = ({
  snapshots,
  metric,
}: {
  snapshots: AccountSnapshot[];
  metric: ChartMetric;
}) => {
  const width = 900;
  const height = 280;
  const paddingX = 54;
  const paddingTop = 34;
  const paddingBottom = 46;

  const values = snapshots.map((snapshot) =>
    getChartValue(snapshot, metric.id),
  );
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;
  const range = maxValue - minValue || 1;

  const firstValue = values[0] ?? 0;
  const lastValue = values.at(-1) ?? 0;
  const change = lastValue - firstValue;
  const changePercent = firstValue === 0 ? 0 : (change / firstValue) * 100;

  const getX = (index: number) =>
    paddingX +
    (index / Math.max(snapshots.length - 1, 1)) * (width - paddingX * 2);

  const getY = (value: number) =>
    height -
    paddingBottom -
    ((value - minValue) / range) * (height - paddingTop - paddingBottom);

  const points = snapshots
    .map((snapshot, index) => {
      const value = getChartValue(snapshot, metric.id);
      return `${getX(index)},${getY(value)}`;
    })
    .join(" ");

  const labelIndexes = snapshots
    .map((snapshot, index) => {
      const date = new Date(snapshot.date);

      return date.getMonth() === 0 ||
        index === 0 ||
        index === snapshots.length - 1
        ? index
        : null;
    })
    .filter((index): index is number => index !== null);

  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Current
          </div>

          <div className="mt-1 text-xl font-black text-slate-900">
            {formatChartValue(lastValue, metric.currencyLabel)}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Period change
          </div>

          <div
            className={`mt-1 text-xl font-black ${
              change >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {formatChartValue(change, metric.currencyLabel)}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Percent change
          </div>

          <div
            className={`mt-1 text-xl font-black ${
              changePercent >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-72 min-w-[720px] w-full"
        >
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          <line
            x1={paddingX}
            y1={paddingTop}
            x2={paddingX}
            y2={height - paddingBottom}
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          <text
            x={paddingX}
            y={paddingTop - 12}
            textAnchor="start"
            className="fill-slate-400 text-[11px] font-bold"
          >
            {formatCompactNumber(maxValue)}
          </text>

          <text
            x={paddingX}
            y={height - paddingBottom + 24}
            textAnchor="start"
            className="fill-slate-400 text-[11px] font-bold"
          >
            {formatCompactNumber(minValue)}
          </text>

          <polyline
            points={points}
            fill="none"
            stroke="#0f766e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {snapshots.map((snapshot, index) => {
            const value = getChartValue(snapshot, metric.id);

            return (
              <circle
                key={snapshot.date}
                cx={getX(index)}
                cy={getY(value)}
                r="4"
                fill="#0f766e"
              />
            );
          })}

          {labelIndexes.map((index) => {
            const snapshot = snapshots[index];

            return (
              <text
                key={snapshot.date}
                x={getX(index)}
                y={height - 12}
                textAnchor="middle"
                className="fill-slate-500 text-[11px] font-bold"
              >
                {formatShortDate(snapshot.date)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

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

  const percentDiffColumnsCount = [...plnAccounts, ...eurAccounts].filter(
    (account) => accountPercentDiffColumns[account.id],
  ).length;

  const plnColumnsCount =
    plnAccounts.length +
    plnAccounts.filter((account) => accountPercentDiffColumns[account.id])
      .length;

  const eurColumnsCount =
    eurAccounts.length +
    eurAccounts.filter((account) => accountPercentDiffColumns[account.id])
      .length;

  const tableMinWidth =
    740 +
    (plnAccounts.length + eurAccounts.length) * 92 +
    percentDiffColumnsCount * 42;

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
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse text-xs"
            style={{ minWidth: `${tableMinWidth}px` }}
          >
            <thead>
              <tr>
                <th className={dateHeaderClass}>Date</th>

                {plnAccounts.flatMap((account) => {
                  const percentDiffLabel =
                    accountPercentDiffColumns[account.id];

                  return [
                    <th key={account.id} className={headerClass}>
                      {account.label}
                    </th>,
                    percentDiffLabel ? (
                      <th
                        key={`${account.id}.percentDiff`}
                        className={percentHeaderClass}
                      >
                        {percentDiffLabel}
                      </th>
                    ) : null,
                  ];
                })}

                <th className={totalHeaderClass}>PLN total</th>
                <th className={sectionEndHeaderClass}>PLN diff</th>

                {eurAccounts.flatMap((account) => {
                  const percentDiffLabel =
                    accountPercentDiffColumns[account.id];

                  return [
                    <th key={account.id} className={headerClass}>
                      {account.label}
                    </th>,
                    percentDiffLabel ? (
                      <th
                        key={`${account.id}.percentDiff`}
                        className={percentHeaderClass}
                      >
                        {percentDiffLabel}
                      </th>
                    ) : null,
                  ];
                })}

                <th className={totalHeaderClass}>EUR total</th>
                <th className={totalHeaderClass}>EUR diff</th>
                <th className={headerClass}>Rate</th>
                <th className={totalHeaderClass}>Total PLN</th>
                <th className={totalHeaderClass}>Total EUR</th>
                <th className={totalHeaderClass}>Net worth diff</th>
                <th className={totalHeaderClass}>Net worth %</th>
              </tr>
            </thead>

            <tbody>
              {snapshots.map((snapshot, index) => {
                const plnDiff = getDiff(snapshots, index, "pln");
                const eurDiff = getDiff(snapshots, index, "eur");
                const totalEurDiff = getTotalEurDiff(snapshots, index);
                const totalEurDiffPercent = getTotalEurDiffPercent(
                  snapshots,
                  index,
                );

                const currentYear = snapshot.date.slice(0, 4);
                const previousYear =
                  index > 0 ? snapshots[index - 1].date.slice(0, 4) : null;
                const showYearSeparator = currentYear !== previousYear;
                const showYearSummary = getIsLastSnapshotOfYear(
                  snapshots,
                  index,
                );

                const yearStartIndex = getYearStartIndex(
                  snapshots,
                  currentYear,
                );

const yearSummaryEndIndex = showYearSummary
  ? getYearSummaryEndIndex(snapshots, currentYear, index)
  : index;

const yearSummary = showYearSummary
  ? getYearSummary(snapshots, yearStartIndex, yearSummaryEndIndex)
  : null;

                return (
                  <Fragment key={snapshot.date}>
                    {showYearSeparator && (
                      <tr>
                        <td
                          colSpan={999}
                          className="border-y border-slate-300 bg-slate-100 px-3 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-700"
                        >
                          {currentYear}
                        </td>
                      </tr>
                    )}

                    <tr className="hover:bg-slate-50">
                      <td className={dateCellClass}>{snapshot.date}</td>

                      {plnAccounts.flatMap((account) => {
                        const isActive = isAccountActiveOnDate(
                          account,
                          snapshot.date,
                        );
                        const value = snapshot.balances[account.id];
                        const percentDiffLabel =
                          accountPercentDiffColumns[account.id];
                        const percentDiffValue = percentDiffLabel
                          ? getAccountPercentDiff(snapshots, index, account.id)
                          : null;

                        return [
                          <td key={account.id} className={cellClass}>
                            {isActive && value !== undefined
                              ? formatNumber(value)
                              : "-"}
                          </td>,
                          percentDiffLabel ? (
                            <td
                              key={`${account.id}.percentDiff`}
                              className={`${percentCellBaseClass} ${getValueColorClass(
                                percentDiffValue,
                              )}`}
                            >
                              {percentDiffValue === null
                                ? "-"
                                : formatPercent(percentDiffValue)}
                            </td>
                          ) : null,
                        ];
                      })}

                      <td className={totalCellClass}>
                        {formatNumber(getPlnTotal(snapshot))}
                      </td>

                      <td
                        className={`${sectionEndCellClass} ${getDiffCellClass(
                          plnDiff,
                        )}`}
                      >
                        <DiffBadge value={plnDiff}>
                          {plnDiff === null ? "-" : formatSignedPln(plnDiff)}
                        </DiffBadge>
                      </td>

                      {eurAccounts.flatMap((account) => {
                        const isActive = isAccountActiveOnDate(
                          account,
                          snapshot.date,
                        );
                        const value = snapshot.balances[account.id];
                        const percentDiffLabel =
                          accountPercentDiffColumns[account.id];
                        const percentDiffValue = percentDiffLabel
                          ? getAccountPercentDiff(snapshots, index, account.id)
                          : null;

                        return [
                          <td key={account.id} className={cellClass}>
                            {isActive && value !== undefined
                              ? formatNumber(value)
                              : "-"}
                          </td>,
                          percentDiffLabel ? (
                            <td
                              key={`${account.id}.percentDiff`}
                              className={`${percentCellBaseClass} ${getValueColorClass(
                                percentDiffValue,
                              )}`}
                            >
                              {percentDiffValue === null
                                ? "-"
                                : formatPercent(percentDiffValue)}
                            </td>
                          ) : null,
                        ];
                      })}

                      <td className={totalCellClass}>
                        {formatNumber(getEurTotal(snapshot))}
                      </td>

                      <td
                        className={`${totalCellClass} ${getDiffCellClass(
                          eurDiff,
                        )}`}
                      >
                        <DiffBadge value={eurDiff}>
                          {eurDiff === null ? "-" : formatSignedEur(eurDiff)}
                        </DiffBadge>
                      </td>

                      <td className={cellClass}>
                        {snapshot.exchangeRate.toFixed(2)}
                      </td>

                      <td className={totalCellClass}>
                        {formatPln(getTotalPln(snapshot))}
                      </td>

                      <td className={totalCellClass}>
                        {formatEur(getTotalEur(snapshot))}
                      </td>

                      <td
                        className={`${totalCellClass} ${getDiffCellClass(
                          totalEurDiff,
                        )}`}
                      >
                        <DiffBadge value={totalEurDiff}>
                          {totalEurDiff === null
                            ? "-"
                            : formatSignedEur(totalEurDiff)}
                        </DiffBadge>
                      </td>

                      <td
                        className={`${totalCellClass} ${getDiffCellClass(
                          totalEurDiffPercent,
                        )}`}
                      >
                        <DiffBadge value={totalEurDiffPercent}>
                          {totalEurDiffPercent === null
                            ? "-"
                            : formatPercent(totalEurDiffPercent)}
                        </DiffBadge>
                      </td>
                    </tr>

                    {yearSummary ? (
                      <YearSummaryRow
                        summary={yearSummary}
                        plnColumnsCount={plnColumnsCount}
                        eurColumnsCount={eurColumnsCount}
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
