import { useMemo, useState } from "react";

interface CashScenarioProps {
  remainingIncome: number;
  remainingExpenses: number;
  remainingMonths: number;
}

const formatNumber = (value: number) =>
  value
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, " ");

const formatMoney = (value: number) => `${formatNumber(value)} euro`;

const parseNumber = (value: string) => {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const CashScenario = ({
  remainingIncome,
  remainingExpenses,
  remainingMonths,
}: CashScenarioProps) => {
  const [currentCash, setCurrentCash] = useState("0");
  const [incomePercent, setIncomePercent] = useState(100);
  const [expensePercent, setExpensePercent] = useState(100);
  const [oneOffAdjustment, setOneOffAdjustment] = useState("0");

  const result = useMemo(() => {
    const cash = parseNumber(currentCash);
    const adjustment = parseNumber(oneOffAdjustment);

    const adjustedIncome = remainingIncome * (incomePercent / 100);
    const adjustedExpenses = remainingExpenses * (expensePercent / 100);

    const remainingResult =
      adjustedIncome - adjustedExpenses + adjustment;

    const endOfYearCash = cash + remainingResult;

    const averageMonthlyResult =
      remainingMonths > 0 ? remainingResult / remainingMonths : 0;

    const monthlyBurn =
      remainingMonths > 0
        ? Math.max(0, -averageMonthlyResult)
        : 0;

    const runway =
      monthlyBurn > 0 ? cash / monthlyBurn : null;

    return {
      adjustedIncome,
      adjustedExpenses,
      remainingResult,
      endOfYearCash,
      averageMonthlyResult,
      runway,
    };
  }, [
    currentCash,
    incomePercent,
    expensePercent,
    oneOffAdjustment,
    remainingIncome,
    remainingExpenses,
    remainingMonths,
  ]);

  const resetScenario = () => {
    setIncomePercent(100);
    setExpensePercent(100);
    setOneOffAdjustment("0");
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black tracking-tight text-slate-900">
            Cash scenario
          </h3>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Check how changes in future income and expenses affect your cash.
          </p>
        </div>

        <button
          type="button"
          onClick={resetScenario}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          Reset scenario
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="block">
          <span className="text-[11px] font-black text-slate-500">
            Cash available now
          </span>

          <div className="mt-1 flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-sky-400">
            <input
              type="number"
              value={currentCash}
              onChange={(event) => setCurrentCash(event.target.value)}
              className="min-w-0 flex-1 px-3 py-2 text-sm font-bold text-slate-900 outline-none"
            />

            <span className="flex items-center bg-slate-50 px-3 text-xs font-bold text-slate-500">
              euro
            </span>
          </div>
        </label>

        <label className="block">
          <span className="text-[11px] font-black text-slate-500">
            Future income
          </span>

          <div className="mt-1 flex overflow-hidden rounded-xl border border-slate-200 bg-white">
            <input
              type="number"
              min={0}
              max={200}
              value={incomePercent}
              onChange={(event) =>
                setIncomePercent(Number(event.target.value))
              }
              className="min-w-0 flex-1 px-3 py-2 text-sm font-bold text-slate-900 outline-none"
            />

            <span className="flex items-center bg-slate-50 px-3 text-xs font-bold text-slate-500">
              %
            </span>
          </div>
        </label>

        <label className="block">
          <span className="text-[11px] font-black text-slate-500">
            Future expenses
          </span>

          <div className="mt-1 flex overflow-hidden rounded-xl border border-slate-200 bg-white">
            <input
              type="number"
              min={0}
              max={300}
              value={expensePercent}
              onChange={(event) =>
                setExpensePercent(Number(event.target.value))
              }
              className="min-w-0 flex-1 px-3 py-2 text-sm font-bold text-slate-900 outline-none"
            />

            <span className="flex items-center bg-slate-50 px-3 text-xs font-bold text-slate-500">
              %
            </span>
          </div>
        </label>

        <label className="block">
          <span className="text-[11px] font-black text-slate-500">
            One-off adjustment
          </span>

          <div className="mt-1 flex overflow-hidden rounded-xl border border-slate-200 bg-white">
            <input
              type="number"
              value={oneOffAdjustment}
              onChange={(event) =>
                setOneOffAdjustment(event.target.value)
              }
              className="min-w-0 flex-1 px-3 py-2 text-sm font-bold text-slate-900 outline-none"
            />

            <span className="flex items-center bg-slate-50 px-3 text-xs font-bold text-slate-500">
              euro
            </span>
          </div>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIncomePercent(0)}
          className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700 hover:bg-rose-100"
        >
          No future income
        </button>

        <button
          type="button"
          onClick={() => setIncomePercent(50)}
          className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 hover:bg-amber-100"
        >
          Income reduced by 50%
        </button>

        <button
          type="button"
          onClick={() => setExpensePercent(120)}
          className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 hover:bg-violet-100"
        >
          Expenses increased by 20%
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          label="Remaining income"
          value={formatMoney(result.adjustedIncome)}
        />

        <ResultCard
          label="Remaining expenses"
          value={formatMoney(result.adjustedExpenses)}
        />

        <ResultCard
          label="Result until year-end"
          value={formatMoney(result.remainingResult)}
          negative={result.remainingResult < 0}
        />

        <ResultCard
          label="Cash at year-end"
          value={formatMoney(result.endOfYearCash)}
          negative={result.endOfYearCash < 0}
          highlighted
        />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600">
        Average monthly cash change:{" "}
        <span
          className={
            result.averageMonthlyResult < 0
              ? "text-rose-700"
              : "text-emerald-700"
          }
        >
          {formatMoney(result.averageMonthlyResult)}
        </span>

        {result.runway !== null ? (
          <>
            {" · "}Estimated cash runway:{" "}
            <span className="text-slate-900">
              {result.runway.toFixed(1)} months
            </span>
          </>
        ) : (
          <>
            {" · "}
            <span className="text-emerald-700">
              No projected cash burn
            </span>
          </>
        )}
      </div>
    </div>
  );
};

interface ResultCardProps {
  label: string;
  value: string;
  negative?: boolean;
  highlighted?: boolean;
}

const ResultCard = ({
  label,
  value,
  negative = false,
  highlighted = false,
}: ResultCardProps) => (
  <div
    className={[
      "rounded-xl border p-3",
      highlighted
        ? negative
          ? "border-rose-200 bg-rose-50"
          : "border-emerald-200 bg-emerald-50"
        : "border-slate-200 bg-white",
    ].join(" ")}
  >
    <div className="text-[11px] font-black text-slate-500">
      {label}
    </div>

    <div
      className={[
        "mt-1 text-base font-black",
        negative ? "text-rose-700" : "text-slate-900",
      ].join(" ")}
    >
      {value}
    </div>
  </div>
);