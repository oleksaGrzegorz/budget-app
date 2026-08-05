import type { ChartMetricId } from "./types";

import type { AccountSnapshot } from "../../../../data/initialAccountSnapshots";
import { getEurTotal, getPlnTotal, getTotalEur } from "./calculations";
import type { TimeRange } from "./chartConfig";
import { timeRanges } from "./chartConfig";

export const getChartValue = (
  snapshot: AccountSnapshot,
  metricId: ChartMetricId,
) => {
  if (metricId === "pln.total") return getPlnTotal(snapshot);
  if (metricId === "eur.total") return getEurTotal(snapshot);
  if (metricId === "total.eur") return getTotalEur(snapshot);

  return snapshot.balances[metricId] ?? 0;
};

export const getFilteredSnapshots = (
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