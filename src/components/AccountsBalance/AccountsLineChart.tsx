import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartMetric } from "./types";

import type { AccountSnapshot } from "../../data/initialAccountSnapshots";
import { getChartValue } from "./chartData";
import {
  formatChartValue,
  formatCompactNumber,
  formatShortDate,
} from "./format";

type Tone = "positive" | "negative" | "neutral";

type ChartPoint = {
  date: string;
  value: number;
  previousValue: number | null;
};

const getChangePrefix = (value: number) => (value >= 0 ? "+" : "");

const getTone = (value: number): Tone => {
  if (Math.abs(value) < 0.01) {
    return "neutral";
  }

  return value > 0 ? "positive" : "negative";
};

const MetricCard = ({
  title,
  value,
  tone = "neutral",
  subtext,
}: {
  title: string;
  value: string;
  tone?: Tone;
  subtext?: string;
}) => {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-rose-600"
        : "text-slate-950";

  const accentClass =
    tone === "positive"
      ? "bg-emerald-500"
      : tone === "negative"
        ? "bg-rose-500"
        : "bg-slate-400";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${accentClass}`} />

        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          {title}
        </div>
      </div>

      <div
        className={`mt-2 text-xl font-black tracking-tight sm:text-2xl ${toneClass}`}
      >
        {value}
      </div>

      {subtext ? (
        <div className="mt-1 text-xs font-bold text-slate-400">{subtext}</div>
      ) : null}
    </div>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
  currencyLabel,
  firstValue,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    payload?: ChartPoint;
  }>;
  label?: string;
  currencyLabel?: string;
  firstValue: number;
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;
  const value = Number(payload[0]?.value ?? 0);
  const previousValue = point?.previousValue ?? null;

  const changeFromStart = value - firstValue;
  const changeFromStartPercent =
    firstValue === 0 ? 0 : (changeFromStart / firstValue) * 100;

  const previousChange = previousValue === null ? null : value - previousValue;

  const previousChangePercent =
    previousValue === null || previousValue === 0 || previousChange === null
      ? null
      : (previousChange / previousValue) * 100;

  const startTone = getTone(changeFromStart);
  const previousTone =
    previousChange === null ? "neutral" : getTone(previousChange);

  const getToneClass = (tone: Tone) =>
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-rose-600"
        : "text-slate-500";

  return (
    <div className="max-w-[calc(100vw-32px)] rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur sm:w-56">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          {formatShortDate(String(label))}
        </div>

        <div className={`text-[11px] font-black ${getToneClass(startTone)}`}>
          {getChangePrefix(changeFromStartPercent)}
          {changeFromStartPercent.toFixed(1)}%
        </div>
      </div>

      <div className="mt-1 text-lg font-black tracking-tight text-slate-950">
        {formatChartValue(value, currencyLabel)}
      </div>

      <div className="mt-2 grid gap-1.5 text-[11px] font-bold">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Since start</span>

          <span className={getToneClass(startTone)}>
            {getChangePrefix(changeFromStart)}
            {formatChartValue(changeFromStart, currencyLabel)}
          </span>
        </div>

        {previousChange !== null && previousChangePercent !== null ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Previous</span>

            <span className={getToneClass(previousTone)}>
              {getChangePrefix(previousChange)}
              {formatChartValue(previousChange, currencyLabel)} ·{" "}
              {getChangePrefix(previousChangePercent)}
              {previousChangePercent.toFixed(1)}%
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const AccountsLineChart = ({
  snapshots,
  metric,
}: {
  snapshots: AccountSnapshot[];
  metric: ChartMetric;
}) => {
  const gradientId = useId().replace(/:/g, "");

  const values = snapshots.map((snapshot) =>
    getChartValue(snapshot, metric.id),
  );

  const chartData: ChartPoint[] = snapshots.map((snapshot, index) => ({
    date: snapshot.date,
    value: values[index] ?? 0,
    previousValue: index > 0 ? (values[index - 1] ?? null) : null,
  }));

  const rawMinValue = values.length ? Math.min(...values) : 0;
  const rawMaxValue = values.length ? Math.max(...values) : 1;
  const rawRange = rawMaxValue - rawMinValue;

  const fallbackRange = Math.max(Math.abs(rawMaxValue) * 0.08, 1);
  const yPadding = (rawRange || fallbackRange) * 0.16;
  const minValue = rawMinValue - yPadding;
  const maxValue = rawMaxValue + yPadding;

  const firstValue = values[0] ?? 0;
  const lastValue = values.at(-1) ?? 0;
  const change = lastValue - firstValue;
  const changePercent = firstValue === 0 ? 0 : (change / firstValue) * 100;

  const averageValue =
    values.length > 0
      ? values.reduce((total, value) => total + value, 0) / values.length
      : 0;

  const rangeValue = rawMaxValue - rawMinValue;
  const trendTone = getTone(change);
  const isFlat = trendTone === "neutral";

  const trendColor =
    trendTone === "positive"
      ? "#059669"
      : trendTone === "negative"
        ? "#e11d48"
        : "#475569";

  const trendFill =
    trendTone === "positive"
      ? "#10b981"
      : trendTone === "negative"
        ? "#f43f5e"
        : "#64748b";

  const trendLabel = isFlat
    ? "Stable"
    : trendTone === "positive"
      ? "Uptrend"
      : "Downtrend";

  const tickIndexes = (() => {
    if (chartData.length <= 6) {
      return chartData.map((_, index) => index);
    }

    const yearIndexes = chartData
      .map((point, index) => {
        const date = new Date(point.date);
        return date.getMonth() === 0 ? index : null;
      })
      .filter((index): index is number => index !== null);

    if (yearIndexes.length >= 2 && yearIndexes.length <= 6) {
      return Array.from(new Set([0, ...yearIndexes, chartData.length - 1]));
    }

    return Array.from({ length: 5 }, (_, index) =>
      Math.round((index * (chartData.length - 1)) / 4),
    );
  })();

  const xTicks = Array.from(new Set(tickIndexes))
    .sort((a, b) => a - b)
    .map((index) => chartData[index]?.date)
    .filter((date): date is string => Boolean(date));

  const showDots = chartData.length <= 36;

  return (
    <div className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Budget analytics
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <div className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {formatChartValue(lastValue, metric.currencyLabel)}
              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  trendTone === "positive"
                    ? "bg-emerald-50 text-emerald-700"
                    : trendTone === "negative"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {trendLabel}
              </div>
            </div>
          </div>

          <div
            className={`text-sm font-black ${
              trendTone === "positive"
                ? "text-emerald-600"
                : trendTone === "negative"
                  ? "text-rose-600"
                  : "text-slate-500"
            }`}
          >
            {getChangePrefix(change)}
            {formatChartValue(change, metric.currencyLabel)} ·{" "}
            {getChangePrefix(changePercent)}
            {changePercent.toFixed(2)}%
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Current"
            value={formatChartValue(lastValue, metric.currencyLabel)}
            subtext="Latest value"
          />

          <MetricCard
            title="Change"
            value={`${getChangePrefix(change)}${formatChartValue(
              change,
              metric.currencyLabel,
            )}`}
            tone={trendTone}
            subtext="Start to now"
          />

          <MetricCard
            title="Average"
            value={formatChartValue(averageValue, metric.currencyLabel)}
            subtext="Period average"
          />

          <MetricCard
            title="Range"
            value={formatChartValue(rangeValue, metric.currencyLabel)}
            subtext="High minus low"
          />
        </div>
      </div>

      <div className="bg-slate-50/80 p-3 sm:p-4 lg:p-5">
        <div className="h-[380px] w-full rounded-3xl border border-slate-200 bg-white p-2 shadow-sm sm:h-[460px] sm:p-4 lg:h-[520px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 24, right: 12, bottom: 18, left: 0 }}
            >
              <defs>
                <linearGradient
                  id={`accountsChartFill-${gradientId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={trendFill} stopOpacity={0.24} />
                  <stop offset="50%" stopColor={trendFill} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={trendFill} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeWidth={1}
              />

              <XAxis
                dataKey="date"
                ticks={xTicks}
                tickFormatter={formatShortDate}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 800 }}
                axisLine={false}
                tickLine={false}
                dy={12}
                minTickGap={16}
                interval={0}
              />

              <YAxis
                domain={[minValue, maxValue]}
                tickFormatter={formatCompactNumber}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 800 }}
                axisLine={false}
                tickLine={false}
                width={58}
                tickCount={6}
              />

              <ReferenceLine
                y={averageValue}
                stroke="#cbd5e1"
                strokeDasharray="6 6"
                strokeWidth={1.5}
              />

              <Tooltip
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 20, outline: "none" }}
                cursor={{
                  stroke: "#94a3b8",
                  strokeWidth: 1.5,
                  strokeDasharray: "6 6",
                }}
                content={
                  <CustomTooltip
                    currencyLabel={metric.currencyLabel}
                    firstValue={firstValue}
                  />
                }
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={trendColor}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={`url(#accountsChartFill-${gradientId})`}
                fillOpacity={1}
                dot={
                  showDots
                    ? {
                        r: 3.8,
                        fill: trendColor,
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }
                    : false
                }
                activeDot={{
                  r: 8,
                  fill: trendColor,
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
                isAnimationActive={chartData.length <= 80}
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
