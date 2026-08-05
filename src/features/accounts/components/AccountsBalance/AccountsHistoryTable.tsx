import { Fragment } from "react";

import type { AccountDefinition } from "./types";

import type { AccountSnapshot } from "../../../../data/initialAccountSnapshots";
import { isAccountActiveOnDate } from "../../../../data/initialAccountSnapshots";
import {
  getAccountPercentDiff,
  getDiff,
  getEurTotal,
  getIsLastSnapshotOfYear,
  getPlnTotal,
  getTotalEur,
  getTotalEurDiff,
  getTotalEurDiffPercent,
  getTotalPln,
  getYearStartIndex,
  getYearSummary,
  getYearSummaryEndIndex,
} from "./calculations";
import {
  formatEur,
  formatNumber,
  formatPercent,
  formatPln,
  formatSignedEur,
  formatSignedPln,
} from "./format";
import { accountPercentDiffColumns } from "./tableConfig";
import { YearSummaryRow } from "./YearSummaryRow";

interface Props {
  snapshots: AccountSnapshot[];
  plnAccounts: AccountDefinition[];
  eurAccounts: AccountDefinition[];
}

const headerClass =
  "border-b border-slate-200 bg-slate-50 px-2 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-500 whitespace-nowrap";

const dateHeaderClass =
  "border-b border-slate-200 bg-slate-50 px-2 py-2 text-left text-[11px] font-black uppercase tracking-wide text-slate-500 whitespace-nowrap";

const cellClass =
  "border-b border-slate-100 px-2 py-2 text-right text-xs text-slate-700 whitespace-nowrap";

const dateCellClass =
  "border-b border-slate-100 px-2 py-2 text-left text-xs font-bold text-slate-900 whitespace-nowrap";

const percentHeaderClass =
  "w-12 border-b border-slate-200 bg-slate-50 px-1 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-400 whitespace-nowrap";

const percentCellBaseClass =
  "w-12 border-b border-slate-100 px-1 py-2 text-right text-[11px] font-bold whitespace-nowrap";

const totalHeaderClass =
  "border-b border-slate-200 bg-slate-100 px-2 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-700 whitespace-nowrap";

const totalCellClass =
  "border-b border-slate-100 bg-slate-50 px-2 py-2 text-right text-xs font-black text-slate-900 whitespace-nowrap";

const sectionEndHeaderClass =
  "border-r border-r-slate-300 border-b border-slate-200 bg-slate-100 px-2 py-2 text-right text-[11px] font-black uppercase tracking-wide text-slate-700 whitespace-nowrap";

const sectionEndCellClass =
  "border-r border-r-slate-200 border-b border-slate-100 bg-slate-50 px-2 py-2 text-right text-xs font-bold whitespace-nowrap";

const getValueColorClass = (value: number | null) => {
  if (value === null) return "text-slate-400";
  return value >= 0 ? "text-emerald-600" : "text-rose-600";
};

const getDiffBadgeClass = (value: number | null) => {
  if (value === null) return "bg-slate-100 text-slate-400";
  return value >= 0
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
};

const getDiffCellClass = (value: number | null) => {
  if (value === null) return "";
  return value >= 0 ? "bg-emerald-50" : "bg-rose-50";
};

const DiffBadge = ({
  value,
  children,
}: {
  value: number | null;
  children: React.ReactNode;
}) => {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 font-black ${getDiffBadgeClass(
        value,
      )}`}
    >
      {value === null ? "-" : children}
    </span>
  );
};

export const AccountsHistoryTable = ({
  snapshots,
  plnAccounts,
  eurAccounts,
}: Props) => {
  const percentDiffColumnsCount = [...plnAccounts, ...eurAccounts].filter(
    (account) => accountPercentDiffColumns[account.id],
  ).length;

  const tableMinWidth =
    740 +
    (plnAccounts.length + eurAccounts.length) * 92 +
    percentDiffColumnsCount * 42;

  return (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse text-xs"
                style={{ minWidth: `${tableMinWidth}px` }}
              >
                <thead>
                  <tr>
                    <th className={dateHeaderClass}>Date</th>

                    {plnAccounts.flatMap((account) => {
                      const percentDiffLabel =
                        accountPercentDiffColumns[account.id];

                      return [
                        <th key={account.id} className={headerClass}>
                          {account.label}
                        </th>,
                        percentDiffLabel ? (
                          <th
                            key={`${account.id}.percentDiff`}
                            className={percentHeaderClass}
                          >
                            {percentDiffLabel}
                          </th>
                        ) : null,
                      ];
                    })}

                    <th className={totalHeaderClass}>PLN total</th>
                    <th className={sectionEndHeaderClass}>PLN diff</th>

                    {eurAccounts.flatMap((account) => {
                      const percentDiffLabel =
                        accountPercentDiffColumns[account.id];

                      return [
                        <th key={account.id} className={headerClass}>
                          {account.label}
                        </th>,
                        percentDiffLabel ? (
                          <th
                            key={`${account.id}.percentDiff`}
                            className={percentHeaderClass}
                          >
                            {percentDiffLabel}
                          </th>
                        ) : null,
                      ];
                    })}

                    <th className={totalHeaderClass}>EUR total</th>
                    <th className={totalHeaderClass}>EUR diff</th>
                    <th className={headerClass}>Rate</th>
                    <th className={totalHeaderClass}>Total PLN</th>
                    <th className={totalHeaderClass}>Total EUR</th>
                    <th className={totalHeaderClass}>Net worth diff</th>
                    <th className={totalHeaderClass}>Net worth %</th>
                  </tr>
                </thead>

                <tbody>
                  {snapshots.map((snapshot, index) => {
                    const plnDiff = getDiff(snapshots, index, "pln");
                    const eurDiff = getDiff(snapshots, index, "eur");
                    const totalEurDiff = getTotalEurDiff(snapshots, index);
                    const totalEurDiffPercent = getTotalEurDiffPercent(
                      snapshots,
                      index,
                    );

                    const currentYear = snapshot.date.slice(0, 4);
                    const previousYear =
                      index > 0 ? snapshots[index - 1].date.slice(0, 4) : null;
                    const showYearSeparator = currentYear !== previousYear;
                    const showYearSummary = getIsLastSnapshotOfYear(
                      snapshots,
                      index,
                    );

                    const yearStartIndex = getYearStartIndex(
                      snapshots,
                      currentYear,
                    );

                    const yearSummaryEndIndex = showYearSummary
                      ? getYearSummaryEndIndex(snapshots, currentYear, index)
                      : index;

                    const yearSummary = showYearSummary
                      ? getYearSummary(
                          snapshots,
                          yearStartIndex,
                          yearSummaryEndIndex,
                        )
                      : null;

                    return (
                      <Fragment key={snapshot.date}>
                        {showYearSeparator && (
                          <tr>
                            <td
                              colSpan={999}
                              className="border-y border-slate-300 bg-slate-100 px-3 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-700"
                            >
                              {currentYear}
                            </td>
                          </tr>
                        )}

                        <tr className="hover:bg-slate-50">
                          <td className={dateCellClass}>{snapshot.date}</td>

                          {plnAccounts.flatMap((account) => {
                            const isActive = isAccountActiveOnDate(
                              account,
                              snapshot.date,
                            );
                            const value = snapshot.balances[account.id];
                            const percentDiffLabel =
                              accountPercentDiffColumns[account.id];
                            const percentDiffValue = percentDiffLabel
                              ? getAccountPercentDiff(
                                  snapshots,
                                  index,
                                  account.id,
                                )
                              : null;

                            return [
                              <td key={account.id} className={cellClass}>
                                {isActive && value !== undefined
                                  ? formatNumber(value)
                                  : "-"}
                              </td>,
                              percentDiffLabel ? (
                                <td
                                  key={`${account.id}.percentDiff`}
                                  className={`${percentCellBaseClass} ${getValueColorClass(
                                    percentDiffValue,
                                  )}`}
                                >
                                  {percentDiffValue === null
                                    ? "-"
                                    : formatPercent(percentDiffValue)}
                                </td>
                              ) : null,
                            ];
                          })}

                          <td className={totalCellClass}>
                            {formatNumber(getPlnTotal(snapshot))}
                          </td>

                          <td
                            className={`${sectionEndCellClass} ${getDiffCellClass(
                              plnDiff,
                            )}`}
                          >
                            <DiffBadge value={plnDiff}>
                              {plnDiff === null
                                ? "-"
                                : formatSignedPln(plnDiff)}
                            </DiffBadge>
                          </td>

                          {eurAccounts.flatMap((account) => {
                            const isActive = isAccountActiveOnDate(
                              account,
                              snapshot.date,
                            );
                            const value = snapshot.balances[account.id];
                            const percentDiffLabel =
                              accountPercentDiffColumns[account.id];
                            const percentDiffValue = percentDiffLabel
                              ? getAccountPercentDiff(
                                  snapshots,
                                  index,
                                  account.id,
                                )
                              : null;

                            return [
                              <td key={account.id} className={cellClass}>
                                {isActive && value !== undefined
                                  ? formatNumber(value)
                                  : "-"}
                              </td>,
                              percentDiffLabel ? (
                                <td
                                  key={`${account.id}.percentDiff`}
                                  className={`${percentCellBaseClass} ${getValueColorClass(
                                    percentDiffValue,
                                  )}`}
                                >
                                  {percentDiffValue === null
                                    ? "-"
                                    : formatPercent(percentDiffValue)}
                                </td>
                              ) : null,
                            ];
                          })}

                          <td className={totalCellClass}>
                            {formatNumber(getEurTotal(snapshot))}
                          </td>

                          <td
                            className={`${totalCellClass} ${getDiffCellClass(
                              eurDiff,
                            )}`}
                          >
                            <DiffBadge value={eurDiff}>
                              {eurDiff === null
                                ? "-"
                                : formatSignedEur(eurDiff)}
                            </DiffBadge>
                          </td>

                          <td className={cellClass}>
                            {snapshot.exchangeRate.toFixed(2)}
                          </td>

                          <td className={totalCellClass}>
                            {formatPln(getTotalPln(snapshot))}
                          </td>

                          <td className={totalCellClass}>
                            {formatEur(getTotalEur(snapshot))}
                          </td>

                          <td
                            className={`${totalCellClass} ${getDiffCellClass(
                              totalEurDiff,
                            )}`}
                          >
                            <DiffBadge value={totalEurDiff}>
                              {totalEurDiff === null
                                ? "-"
                                : formatSignedEur(totalEurDiff)}
                            </DiffBadge>
                          </td>

                          <td
                            className={`${totalCellClass} ${getDiffCellClass(
                              totalEurDiffPercent,
                            )}`}
                          >
                            <DiffBadge value={totalEurDiffPercent}>
                              {totalEurDiffPercent === null
                                ? "-"
                                : formatPercent(totalEurDiffPercent)}
                            </DiffBadge>
                          </td>
                        </tr>

                        {yearSummary ? (
                          <YearSummaryRow summary={yearSummary} />
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
  );
};
