interface AnnualSavingsProgressProps {
  annualGoal: number;
  annualResult: number;
  forecastedYearEnd: number;
  forecastGap: number;
  actualProgress: number;
  forecastProgress: number;
  gapProgress: number;
  forecastedProgress: number;
  savedProgress: number;
  remainingForecast: number;
  averageMonthlyResult?: number | null;
  averageRating?: number | null;
}

const formatNumber = (value: number) =>
  value
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, " ");

const formatMoney = (value: number) => `${formatNumber(value)} euro`;

const getPercentOfGoal = (value: number, goal: number) => {
  if (goal <= 0) return 0;

  return Math.round((value / goal) * 100);
};

interface SummaryCardProps {
  icon: string;
  label: string;
  value: string;
  helper?: string;
  tone?: "slate" | "emerald" | "sky" | "rose" | "amber" | "violet";
}

const toneClasses = {
  slate: {
    icon: "bg-slate-100 text-slate-700",
    helper: "text-slate-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    helper: "text-emerald-700",
  },
  sky: {
    icon: "bg-sky-50 text-sky-700",
    helper: "text-sky-700",
  },
  rose: {
    icon: "bg-rose-50 text-rose-700",
    helper: "text-rose-700",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    helper: "text-amber-700",
  },
  violet: {
    icon: "bg-violet-50 text-violet-700",
    helper: "text-violet-700",
  },
};

const SummaryCard = ({
  icon,
  label,
  value,
  helper,
  tone = "slate",
}: SummaryCardProps) => {
  const classes = toneClasses[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-black ${classes.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-black text-slate-500">{label}</div>

          <div className="mt-0.5 text-lg font-black tracking-tight text-slate-900">
            {value}
          </div>

          {helper ? (
            <div className={`mt-0.5 text-[11px] font-black ${classes.helper}`}>
              {helper}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const AnnualSavingsProgress = ({
  annualGoal,
  annualResult,
  forecastedYearEnd,
  forecastGap,
  actualProgress,
  forecastProgress,
  gapProgress,
  forecastedProgress,
  savedProgress,
  remainingForecast,
  averageMonthlyResult,
  averageRating,
}: AnnualSavingsProgressProps) => {
  const gapPercent = Math.abs(getPercentOfGoal(forecastGap, annualGoal));

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="mb-4">
        <h3 className="text-sm font-black tracking-tight text-slate-900">
          Annual summary
        </h3>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard
          icon="◎"
          label="Annual goal"
          value={formatMoney(annualGoal)}
          tone="amber"
        />

        <SummaryCard
          icon="▣"
          label="Saved so far"
          value={formatMoney(annualResult)}
          helper={`${savedProgress.toFixed(0)}% of goal`}
          tone="emerald"
        />

        <SummaryCard
          icon="↗"
          label="Forecast year-end"
          value={formatMoney(forecastedYearEnd)}
          helper={`${forecastedProgress.toFixed(0)}% of goal`}
          tone="sky"
        />

        <SummaryCard
          icon="↔"
          label="Gap to goal"
          value={formatMoney(Math.abs(forecastGap))}
          helper={
            forecastGap < 0
              ? `${gapPercent}% missing`
              : `${gapPercent}% above goal`
          }
          tone={forecastGap < 0 ? "rose" : "emerald"}
        />

        {averageMonthlyResult !== undefined ? (
          <SummaryCard
            icon="⌁"
            label="Avg. monthly result"
            value={
              averageMonthlyResult !== null
                ? formatMoney(averageMonthlyResult)
                : "-"
            }
            tone="emerald"
          />
        ) : null}

        {averageRating !== undefined ? (
          <SummaryCard
            icon="☆"
            label="Avg. rating"
            value={
              averageRating !== null ? `${averageRating.toFixed(1)} / 5` : "-"
            }
            tone="violet"
          />
        ) : null}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span>Progress to annual goal</span>
          <span>{forecastedProgress.toFixed(0)}%</span>
        </div>

        <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${actualProgress}%` }}
            title="Saved YTD"
          />

          <div
            className="h-full bg-emerald-200 transition-all duration-500"
            style={{ width: `${forecastProgress}%` }}
            title="Remaining forecast"
          />

          <div
            className="h-full bg-rose-200 transition-all duration-500"
            style={{ width: `${gapProgress}%` }}
            title="Gap vs goal"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            Saved
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-200" />
            Forecast left: {formatMoney(remainingForecast)}
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-rose-200" />
            Gap
          </div>
        </div>
      </div>
    </div>
  );
};