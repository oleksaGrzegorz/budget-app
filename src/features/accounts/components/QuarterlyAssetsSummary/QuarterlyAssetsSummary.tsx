import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AccountSnapshot } from "../../../../data/initialAccountSnapshots";
import {
  initialInvestmentCapitalEvents,
  type InvestedAssetId,
} from "../../../../data/initialInvestmentCapitalEvents";
import { formatChartValue, formatShortDate } from "../AccountsBalance/format";

type BalanceKey = keyof AccountSnapshot["balances"];

type AssetId = "stocks" | "bonds" | "crypto" | "cashPln" | "cashEur";

type ChartAssetId = "stocks" | "bonds" | "crypto" | "cash";

type AssetGroup = {
  id: AssetId;
  label: string;
  shortLabel: string;
  accountIds: BalanceKey[];
};

type AssetResult = {
  startValue: number;
  endValue: number;
  change: number;
  changePercent: number | null;
  portfolioShare: number;
};

type QuarterResult = {
  quarterNumber: number;
  quarterLabel: string;
  startDate: string;
  endDate: string;
  assets: Record<AssetId, AssetResult>;
  total: AssetResult;
};

type AllocationPoint = {
  id: ChartAssetId;
  name: string;
  value: number;
  share: number;
  capitalValue: number;
  capitalShare: number;
  gainValue: number;
  gainShare: number;
  lossValue: number;
  lossShare: number;
  labelPositionShare: number;
  change: number;
  changePercent: number | null;
  color: string;
  capitalColor: string;
  gainColor: string;
  lossColor: string;
  details?: string;
};

type ChartLabelProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  payload?: AllocationPoint;
};

const ASSET_GROUPS: AssetGroup[] = [
  {
    id: "stocks",
    label: "Akcje",
    shortLabel: "Akcje",
    accountIds: ["eur.broker"],
  },
  {
    id: "bonds",
    label: "Obligacje",
    shortLabel: "Oblig.",
    accountIds: ["pln.bonds"],
  },
  {
    id: "crypto",
    label: "Krypto",
    shortLabel: "Krypto",
    accountIds: ["eur.crypto"],
  },
  {
    id: "cashPln",
    label: "Gotówka PLN",
    shortLabel: "PLN",
    accountIds: ["pln.mBank", "pln.cash"],
  },
  {
    id: "cashEur",
    label: "Gotówka EUR",
    shortLabel: "EUR",
    accountIds: ["eur.mBank", "eur.ing", "eur.cash"],
  },
];

const ASSET_COLORS: Record<AssetId, string> = {
  stocks: "#0f766e",
  bonds: "#2563eb",
  crypto: "#9333ea",
  cashPln: "#ca8a04",
  cashEur: "#475569",
};

const LOSS_COLOR = "#e11d48";

const CHART_COLORS: Record<ChartAssetId, string> = {
  stocks: "#0f766e",
  bonds: "#2563eb",
  crypto: "#9333ea",
  cash: "#475569",
};

const CHART_CAPITAL_COLORS: Record<ChartAssetId, string> = {
  stocks: "#99f6e4",
  bonds: "#bfdbfe",
  crypto: "#e9d5ff",
  cash: "#cbd5e1",
};

const isInvestedAssetId = (id: ChartAssetId): id is InvestedAssetId =>
  id === "stocks" || id === "bonds" || id === "crypto";

const getInvestmentCapitalInEur = ({
  assetId,
  date,
  snapshot,
}: {
  assetId: InvestedAssetId;
  date: string;
  snapshot: AccountSnapshot;
}) =>
  initialInvestmentCapitalEvents
    .filter((event) => event.assetId === assetId)
    .filter((event) => event.date <= date)
    .reduce((total, event) => {
      const eventAmount =
        event.kind === "sell"
          ? event.soldCapitalAmount ?? event.amount
          : event.amount;

      const amountInEur =
        event.currency === "pln"
          ? eventAmount / snapshot.exchangeRate
          : eventAmount;

      if (event.kind === "sell") {
        return Math.max(0, total - amountInEur);
      }

      return total + amountInEur;
    }, 0);

const getBalance = (snapshot: AccountSnapshot, accountId: BalanceKey) =>
  snapshot.balances[accountId] ?? 0;

const toEur = (
  snapshot: AccountSnapshot,
  accountId: BalanceKey,
  value: number,
) => {
  if (String(accountId).startsWith("pln.")) {
    return snapshot.exchangeRate === 0 ? 0 : value / snapshot.exchangeRate;
  }

  return value;
};

const getAccountsValue = (
  snapshot: AccountSnapshot,
  accountIds: BalanceKey[],
) =>
  accountIds.reduce(
    (total, accountId) =>
      total + toEur(snapshot, accountId, getBalance(snapshot, accountId)),
    0,
  );

const getYear = (date: string) => Number(date.slice(0, 4));

const getQuarter = (date: string) => {
  const month = Number(date.slice(5, 7));

  return Math.floor((month - 1) / 3) + 1;
};

const getQuarterStartDate = (year: number, quarter: number) => {
  const month = String((quarter - 1) * 3 + 1).padStart(2, "0");

  return `${year}-${month}-01`;
};

const getNextQuarterStartDate = (year: number, quarter: number) => {
  const nextQuarter = quarter === 4 ? 1 : quarter + 1;
  const nextYear = quarter === 4 ? year + 1 : year;

  return getQuarterStartDate(nextYear, nextQuarter);
};

const getChangePercent = (startValue: number, endValue: number) =>
  startValue === 0 ? null : ((endValue - startValue) / startValue) * 100;

const getAssetResult = ({
  startValue,
  endValue,
  totalEndValue,
}: {
  startValue: number;
  endValue: number;
  totalEndValue: number;
}): AssetResult => {
  const change = endValue - startValue;

  return {
    startValue,
    endValue,
    change,
    changePercent: getChangePercent(startValue, endValue),
    portfolioShare: totalEndValue === 0 ? 0 : (endValue / totalEndValue) * 100,
  };
};

const getCombinedResult = (
  quarter: QuarterResult,
  assetIds: AssetId[],
): AssetResult => {
  const startValue = assetIds.reduce(
    (total, assetId) => total + quarter.assets[assetId].startValue,
    0,
  );

  const endValue = assetIds.reduce(
    (total, assetId) => total + quarter.assets[assetId].endValue,
    0,
  );

  return getAssetResult({
    startValue,
    endValue,
    totalEndValue: quarter.total.endValue,
  });
};

const formatEur = (value: number) => formatChartValue(value, "EUR");

const formatSignedEur = (value: number) =>
  `${value >= 0 ? "+" : ""}${formatEur(value)}`;

const formatPercent = (value: number | null) =>
  value === null ? "—" : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const formatShare = (value: number) => `${value.toFixed(1)}%`;

const getToneClass = (value: number) => {
  if (Math.abs(value) < 0.01) {
    return "text-slate-500";
  }

  return value > 0 ? "text-emerald-600" : "text-rose-600";
};

const getToneBgClass = (value: number) => {
  if (Math.abs(value) < 0.01) {
    return "bg-slate-100 text-slate-600";
  }

  return value > 0
    ? "bg-emerald-50 text-emerald-700"
    : "bg-rose-50 text-rose-700";
};

const toNumber = (value: number | string | undefined) =>
  typeof value === "number" ? value : Number(value ?? 0);

const AllocationBarLabel = ({
  x,
  y,
  width,
  height,
  payload,
}: ChartLabelProps) => {
  if (!payload) {
    return null;
  }

  const labelX = toNumber(x) + toNumber(width) + 10;
  const labelY = toNumber(y) + toNumber(height) / 2 + 4;

  return (
    <text x={labelX} y={labelY} fill="#0f172a" fontSize={12} fontWeight={900}>
      {formatShare(payload.share)} · {formatEur(payload.value)}
    </text>
  );
};

const AllocationTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: AllocationPoint;
  }>;
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  if (!point) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
      <div className="text-xs font-black text-slate-900">{point.name}</div>

      <div className="mt-1 text-xs font-bold text-slate-500">
        {formatEur(point.value)} · {formatShare(point.share)}
      </div>

      <div className={`mt-1 text-xs font-black ${getToneClass(point.change)}`}>
        {formatSignedEur(point.change)} · {formatPercent(point.changePercent)}
      </div>

      {isInvestedAssetId(point.id) ? (
        <div className="mt-2 space-y-1 text-[11px] font-bold text-slate-500">
          <div>Kapitał: {formatEur(point.capitalValue + point.lossValue)}</div>

          <div className={getToneClass(point.gainValue - point.lossValue)}>
            Wynik: {formatSignedEur(point.gainValue - point.lossValue)}
          </div>

          {point.lossValue > 0 ? (
            <div className="text-rose-600">
              Strata: -{formatEur(point.lossValue)}
            </div>
          ) : null}
        </div>
      ) : null}

      {point.details ? (
        <div className="mt-1 text-[11px] font-bold text-slate-400">
          {point.details}
        </div>
      ) : null}
    </div>
  );
};

export const QuarterlyAssetsSummary = ({
  snapshots,
}: {
  snapshots: AccountSnapshot[];
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState(1);

  const sortedSnapshots = useMemo(
    () => [...snapshots].sort((a, b) => a.date.localeCompare(b.date)),
    [snapshots],
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(sortedSnapshots.map((snapshot) => getYear(snapshot.date))),
      ).sort((a, b) => b - a),
    [sortedSnapshots],
  );

  const activeYear = selectedYear ?? years[0];

  const quarterResults = useMemo(() => {
    if (!activeYear) {
      return [];
    }

    return [1, 2, 3, 4]
      .map((quarter): QuarterResult | null => {
        const startDate = getQuarterStartDate(activeYear, quarter);
        const endDate = getNextQuarterStartDate(activeYear, quarter);

        const startSnapshot =
          sortedSnapshots.find((snapshot) => snapshot.date === startDate) ??
          sortedSnapshots.find(
            (snapshot) =>
              getYear(snapshot.date) === activeYear &&
              getQuarter(snapshot.date) === quarter,
          );

        const endSnapshot =
          sortedSnapshots.find((snapshot) => snapshot.date === endDate) ??
          [...sortedSnapshots]
            .reverse()
            .find(
              (snapshot) =>
                getYear(snapshot.date) === activeYear &&
                getQuarter(snapshot.date) === quarter,
            );

        if (!startSnapshot || !endSnapshot) {
          return null;
        }

        const startValues = ASSET_GROUPS.reduce(
          (result, asset) => ({
            ...result,
            [asset.id]: getAccountsValue(startSnapshot, asset.accountIds),
          }),
          {} as Record<AssetId, number>,
        );

        const endValues = ASSET_GROUPS.reduce(
          (result, asset) => ({
            ...result,
            [asset.id]: getAccountsValue(endSnapshot, asset.accountIds),
          }),
          {} as Record<AssetId, number>,
        );

        const totalStartValue = ASSET_GROUPS.reduce(
          (total, asset) => total + startValues[asset.id],
          0,
        );

        const totalEndValue = ASSET_GROUPS.reduce(
          (total, asset) => total + endValues[asset.id],
          0,
        );

        const assets = ASSET_GROUPS.reduce(
          (result, asset) => ({
            ...result,
            [asset.id]: getAssetResult({
              startValue: startValues[asset.id],
              endValue: endValues[asset.id],
              totalEndValue,
            }),
          }),
          {} as Record<AssetId, AssetResult>,
        );

        return {
          quarterNumber: quarter,
          quarterLabel: `Q${quarter}`,
          startDate: startSnapshot.date,
          endDate: endSnapshot.date,
          assets,
          total: getAssetResult({
            startValue: totalStartValue,
            endValue: totalEndValue,
            totalEndValue,
          }),
        };
      })
      .filter((result): result is QuarterResult => result !== null);
  }, [activeYear, sortedSnapshots]);

  const activeQuarter =
    quarterResults.find((result) => result.quarterNumber === selectedQuarter) ??
    quarterResults.at(-1);

  const cashSummary = useMemo(() => {
    if (!activeQuarter) {
      return null;
    }

    return getCombinedResult(activeQuarter, ["cashPln", "cashEur"]);
  }, [activeQuarter]);

  const investedSummary = useMemo(() => {
    if (!activeQuarter) {
      return null;
    }

    return getCombinedResult(activeQuarter, ["stocks", "bonds", "crypto"]);
  }, [activeQuarter]);

  const allocationData: AllocationPoint[] = useMemo(() => {
    if (!activeQuarter || !cashSummary) {
      return [];
    }

    const endSnapshot = sortedSnapshots.find(
      (snapshot) => snapshot.date === activeQuarter.endDate,
    );

    if (!endSnapshot) {
      return [];
    }

    const cashPln = activeQuarter.assets.cashPln;
    const cashEur = activeQuarter.assets.cashEur;

    const totalPortfolioValue = activeQuarter.total.endValue;

    const createPoint = ({
      id,
      name,
      value,
      share,
      change,
      changePercent,
      details,
    }: {
      id: ChartAssetId;
      name: string;
      value: number;
      share: number;
      change: number;
      changePercent: number | null;
      details?: string;
    }): AllocationPoint => {
      const investedCapital = isInvestedAssetId(id)
        ? getInvestmentCapitalInEur({
            assetId: id,
            date: activeQuarter.endDate,
            snapshot: endSnapshot,
          })
        : value;

      const isInvestedAsset = isInvestedAssetId(id);
      const resultValue = isInvestedAsset ? value - investedCapital : 0;

      const visibleCapital = isInvestedAsset
        ? Math.min(value, investedCapital)
        : value;

      const gainValue = isInvestedAsset ? Math.max(resultValue, 0) : 0;
      const lossValue = isInvestedAsset ? Math.max(-resultValue, 0) : 0;

      const labelPositionValue = isInvestedAsset
        ? Math.max(value, investedCapital)
        : value;

      return {
        id,
        name,
        value,
        share,
        capitalValue: visibleCapital,
        capitalShare:
          totalPortfolioValue === 0
            ? 0
            : (visibleCapital / totalPortfolioValue) * 100,
        gainValue,
        gainShare:
          totalPortfolioValue === 0
            ? 0
            : (gainValue / totalPortfolioValue) * 100,
        lossValue,
        lossShare:
          totalPortfolioValue === 0
            ? 0
            : (lossValue / totalPortfolioValue) * 100,
        labelPositionShare:
          totalPortfolioValue === 0
            ? 0
            : (labelPositionValue / totalPortfolioValue) * 100,
        change,
        changePercent,
        color: CHART_COLORS[id],
        capitalColor: CHART_CAPITAL_COLORS[id],
        gainColor: CHART_COLORS[id],
        lossColor: LOSS_COLOR,
        details,
      };
    };

    const points: AllocationPoint[] = [
      createPoint({
        id: "stocks",
        name: "Akcje",
        value: activeQuarter.assets.stocks.endValue,
        share: activeQuarter.assets.stocks.portfolioShare,
        change: activeQuarter.assets.stocks.change,
        changePercent: activeQuarter.assets.stocks.changePercent,
      }),
      createPoint({
        id: "bonds",
        name: "Obligacje",
        value: activeQuarter.assets.bonds.endValue,
        share: activeQuarter.assets.bonds.portfolioShare,
        change: activeQuarter.assets.bonds.change,
        changePercent: activeQuarter.assets.bonds.changePercent,
      }),
      createPoint({
        id: "crypto",
        name: "Krypto",
        value: activeQuarter.assets.crypto.endValue,
        share: activeQuarter.assets.crypto.portfolioShare,
        change: activeQuarter.assets.crypto.change,
        changePercent: activeQuarter.assets.crypto.changePercent,
      }),
      createPoint({
        id: "cash",
        name: "Gotówka",
        value: cashSummary.endValue,
        share: cashSummary.portfolioShare,
        change: cashSummary.change,
        changePercent: cashSummary.changePercent,
        details: `PLN: ${formatEur(cashPln.endValue)} · EUR: ${formatEur(
          cashEur.endValue,
        )}`,
      }),
    ];

    return points.filter((point) => point.value > 0);
  }, [activeQuarter, cashSummary, sortedSnapshots]);

  if (
    !years.length ||
    !activeYear ||
    !quarterResults.length ||
    !activeQuarter
  ) {
    return null;
  }

  return (
    <section className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900">
            Quarterly portfolio summary
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Najważniejsze liczby: wynik, gotówka i struktura portfela
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={activeYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-slate-400"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={activeQuarter.quarterNumber}
            onChange={(event) => setSelectedQuarter(Number(event.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-slate-400"
          >
            {quarterResults.map((result) => (
              <option key={result.quarterNumber} value={result.quarterNumber}>
                {result.quarterLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-3">
          {quarterResults.map((quarter) => {
            const isSelected =
              quarter.quarterNumber === activeQuarter.quarterNumber;

            const quarterCash = getCombinedResult(quarter, [
              "cashPln",
              "cashEur",
            ]);

            const quarterMetrics = [
              {
                label: "Akcje",
                value: quarter.assets.stocks.change,
                color: ASSET_COLORS.stocks,
              },
              {
                label: "Obligacje",
                value: quarter.assets.bonds.change,
                color: ASSET_COLORS.bonds,
              },
              {
                label: "Gotówka",
                value: quarterCash.change,
                color: CHART_COLORS.cash,
              },
            ];

            return (
              <button
                key={quarter.quarterNumber}
                type="button"
                onClick={() => setSelectedQuarter(quarter.quarterNumber)}
                className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
                  isSelected
                    ? "border-slate-400 ring-2 ring-slate-200"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-black text-slate-900">
                      {quarter.quarterLabel}
                    </div>

                    <div className="mt-1 text-xs font-bold text-slate-400">
                      {formatShortDate(quarter.startDate)} →{" "}
                      {formatShortDate(quarter.endDate)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-black ${getToneClass(
                        quarter.total.change,
                      )}`}
                    >
                      {formatSignedEur(quarter.total.change)}
                    </div>

                    <div
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-black ${getToneBgClass(
                        quarter.total.change,
                      )}`}
                    >
                      {formatPercent(quarter.total.changePercent)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {quarterMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: metric.color }}
                        />

                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          {metric.label}
                        </span>
                      </div>

                      <div
                        className={`mt-1 text-sm font-black ${getToneClass(
                          metric.value,
                        )}`}
                      >
                        {formatSignedEur(metric.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                Portfolio snapshot
              </div>

              <div className="mt-1 text-lg font-black text-slate-900">
                {activeQuarter.quarterLabel} {activeYear}
              </div>

              <div className="mt-1 text-xs font-bold text-slate-400">
                End: {formatShortDate(activeQuarter.endDate)}
              </div>
            </div>

            <div
              className={`rounded-full px-3 py-1 text-xs font-black ${getToneBgClass(
                activeQuarter.total.change,
              )}`}
            >
              {formatSignedEur(activeQuarter.total.change)}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Wartość portfela
              </div>

              <div className="mt-1 text-lg font-black text-slate-900">
                {formatEur(activeQuarter.total.endValue)}
              </div>

              <div
                className={`mt-1 text-xs font-black ${getToneClass(
                  activeQuarter.total.change,
                )}`}
              >
                {formatSignedEur(activeQuarter.total.change)} ·{" "}
                {formatPercent(activeQuarter.total.changePercent)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Gotówka
              </div>

              <div className="mt-1 text-lg font-black text-slate-900">
                {cashSummary ? formatEur(cashSummary.endValue) : "—"}
              </div>

              <div
                className={`mt-1 text-xs font-black ${
                  cashSummary
                    ? getToneClass(cashSummary.change)
                    : "text-slate-500"
                }`}
              >
                {cashSummary
                  ? `${formatShare(cashSummary.portfolioShare)} portfela · ${formatSignedEur(
                      cashSummary.change,
                    )}`
                  : "—"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Zainwestowane
              </div>

              <div className="mt-1 text-lg font-black text-slate-900">
                {investedSummary ? formatEur(investedSummary.endValue) : "—"}
              </div>

              <div
                className={`mt-1 text-xs font-black ${
                  investedSummary
                    ? getToneClass(investedSummary.change)
                    : "text-slate-500"
                }`}
              >
                {investedSummary
                  ? `${formatShare(
                      investedSummary.portfolioShare,
                    )} portfela · ${formatSignedEur(investedSummary.change)}`
                  : "—"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-black text-slate-900">
                  Struktura portfela
                </div>

                <div className="mt-1 text-xs font-bold text-slate-400">
                  Udział procentowy i wartość końcowa
                </div>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={allocationData}
                  layout="vertical"
                  margin={{ top: 8, right: 135, bottom: 8, left: 12 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fontWeight: 700,
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fontWeight: 900,
                      fill: "#475569",
                    }}
                  />

                  <Tooltip content={<AllocationTooltip />} cursor={false} />

                  <Bar dataKey="capitalShare" stackId="value" barSize={18}>
                    {allocationData.map((point) => (
                      <Cell
                        key={`capital-${point.id}`}
                        fill={point.capitalColor}
                      />
                    ))}
                  </Bar>

                  <Bar
                    dataKey="lossShare"
                    stackId="value"
                    radius={[0, 8, 8, 0]}
                    barSize={18}
                  >
                    {allocationData.map((point) => (
                      <Cell key={`loss-${point.id}`} fill={point.lossColor} />
                    ))}
                  </Bar>

                  <Bar
                    dataKey="gainShare"
                    stackId="value"
                    radius={[0, 8, 8, 0]}
                    barSize={18}
                  >
                    {allocationData.map((point) => (
                      <Cell key={`gain-${point.id}`} fill={point.gainColor} />
                    ))}
                  </Bar>

                  <Bar
                    dataKey="labelPositionShare"
                    fill="transparent"
                    barSize={18}
                  >
                    <LabelList
                      dataKey="share"
                      position="right"
                      content={(props) => (
                        <AllocationBarLabel {...(props as ChartLabelProps)} />
                      )}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400">
            Jasny kolor = wpłacony kapitał. Ciemny kolor = zysk. Czerwony kolor
            = strata względem wpłaconego kapitału. Gotówka = PLN + EUR.
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-400">
        Wszystkie wartości są pokazane w EUR. Gotówka PLN i obligacje PLN są
        przeliczane po kursie z danego snapshotu.
      </p>
    </section>
  );
};
