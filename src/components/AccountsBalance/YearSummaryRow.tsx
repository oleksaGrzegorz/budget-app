import type { YearSummary } from "./calculations";
import {
  formatEur,
  formatPercent,
  formatPln,
  formatSignedEur,
  formatSignedPln,
} from "./format";

const yearSummaryCellClass = "border-y-4 border-slate-300 bg-slate-50 p-0";

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

export const YearSummaryRow = ({ summary }: { summary: YearSummary }) => {
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