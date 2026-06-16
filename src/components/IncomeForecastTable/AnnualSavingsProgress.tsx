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
}

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
}: AnnualSavingsProgressProps) => {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black tracking-tight text-slate-900">
            Annual savings progress
          </h3>

          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Saved so far, expected savings and gap to your full-year goal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
              Saved
            </div>

            <div className="text-lg font-black text-emerald-700">
              {savedProgress.toFixed(0)}%
            </div>
          </div>

          <div className="rounded-lg bg-sky-50 px-3 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wide text-sky-600">
              Forecast
            </div>

            <div className="text-lg font-black text-sky-700">
              {forecastedProgress.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-3 overflow-hidden rounded-full bg-white">
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

      <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <div className="mt-3 rounded-xl bg-white p-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-500" />
          Saved
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-200" />
          Forecast
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-rose-200" />
          Gap
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-white p-5">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Expected year end
          </div>

          <div className="mt-1 text-3xl font-black text-slate-900">
            {formatMoney(forecastedYearEnd)}
          </div>
        </div>

        <div className="my-5 h-px bg-slate-100" />

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <div className="text-xs font-bold text-emerald-600">Saved</div>

            <div className="mt-1 text-xl font-black text-emerald-700">
              {formatMoney(annualResult)}
            </div>
          </div>

          <div className="rounded-lg bg-sky-50 p-3 text-center">
            <div className="text-xs font-bold text-sky-600">Planned</div>

            <div className="mt-1 text-xl font-black text-sky-700">
              {formatMoney(remainingForecast)}
            </div>
          </div>
        </div>

        <div className="my-5 h-px bg-slate-100" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">Goal</div>

            <div className="text-lg font-black text-slate-900">
              {formatMoney(annualGoal)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-500">
              {forecastGap < 0 ? "Missing" : "Above goal"}
            </div>

            <div
              className={`text-lg font-black ${
                forecastGap < 0 ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {formatMoney(Math.abs(forecastGap))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
