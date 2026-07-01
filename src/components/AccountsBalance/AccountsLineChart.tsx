import type { ChartMetric } from "./types";

import type { AccountSnapshot } from "../../data/initialAccountSnapshots";
import { getChartValue } from "./chartData";
import {
  formatChartValue,
  formatCompactNumber,
  formatShortDate,
} from "./format";

export const AccountsLineChart = ({
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
  const rawMinValue = values.length ? Math.min(...values) : 0;
  const rawMaxValue = values.length ? Math.max(...values) : 1;
  const rawRange = rawMaxValue - rawMinValue || 1;

  const yPadding = rawRange * 0.12;
  const minValue = rawMinValue - yPadding;
  const maxValue = rawMaxValue + yPadding;
  const range = maxValue - minValue || 1;

  const yAxisTicks = Array.from({ length: 5 }, (_, index) => {
    const value = maxValue - (range / 4) * index;

    return {
      value,
      y:
        height -
        paddingBottom -
        ((value - minValue) / range) * (height - paddingTop - paddingBottom),
    };
  });

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

          {yAxisTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={paddingX}
                y1={tick.y}
                x2={width - paddingX}
                y2={tick.y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />

              <text
                x={paddingX - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[11px] font-bold"
              >
                {formatCompactNumber(tick.value)}
              </text>
            </g>
          ))}

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
