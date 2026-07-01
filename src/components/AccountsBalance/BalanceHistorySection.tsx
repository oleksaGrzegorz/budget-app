import type { Dispatch, SetStateAction } from "react";

import type { ChartMetric, ChartMetricId } from "./types";

import type { AccountSnapshot } from "../../data/initialAccountSnapshots";
import { AccountsLineChart } from "./AccountsLineChart";
import type { TimeRange } from "./chartConfig";
import { timeRanges } from "./chartConfig";

interface Props {
  chartMetrics: ChartMetric[];
  selectedMetricId: ChartMetricId;
  selectedTimeRange: TimeRange;
  selectedMetric: ChartMetric;
  filteredSnapshots: AccountSnapshot[];
  onMetricChange: Dispatch<SetStateAction<ChartMetricId>>;
  onTimeRangeChange: Dispatch<SetStateAction<TimeRange>>;
}

export const BalanceHistorySection = ({
  chartMetrics,
  selectedMetricId,
  selectedTimeRange,
  selectedMetric,
  filteredSnapshots,
  onMetricChange,
  onTimeRangeChange,
}: Props) => {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900">Balance history</h3>

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
                onMetricChange(event.target.value as ChartMetricId)
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
                  onClick={() => onTimeRangeChange(range.id)}
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
  );
};
