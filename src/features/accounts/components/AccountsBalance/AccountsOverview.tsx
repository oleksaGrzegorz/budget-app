import type { AccountSnapshot } from "../../../../data/initialAccountSnapshots";
import { getEurTotal, getPlnTotal, getTotalEur } from "./calculations";
import { formatEur, formatPln } from "./format";

interface Props {
  latest: AccountSnapshot;
}

export const AccountsOverview = ({ latest }: Props) => {
  return (
    <>
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
    </>
  );
};