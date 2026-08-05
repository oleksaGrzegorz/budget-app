import type {
  AccountId,
  AccountSnapshot,
  Currency,
} from "../../../../data/initialAccountSnapshots";
import {
  accountDefinitions,
  isAccountActiveOnDate,
} from "../../../../data/initialAccountSnapshots";

export interface YearSummary {
  year: string;
  baseDate: string;
  endDate: string;
  basePlnTotal: number;
  endPlnTotal: number;
  plnDiff: number;
  baseEurTotal: number;
  endEurTotal: number;
  eurDiff: number;
  baseTotalPln: number;
  endTotalPln: number;
  totalPlnDiff: number;
  baseTotalEur: number;
  endTotalEur: number;
  totalEurDiff: number;
  totalEurDiffPercent: number | null;
  averageRate: number;
  monthsCount: number;
}

export const getAccountsForCurrency = (
  currency: Currency,
  snapshots: AccountSnapshot[],
) =>
  accountDefinitions.filter(
    (account) =>
      account.currency === currency &&
      snapshots.some((snapshot) =>
        isAccountActiveOnDate(account, snapshot.date),
      ),
  );

export const getCurrencyTotal = (snapshot: AccountSnapshot, currency: Currency) =>
  accountDefinitions
    .filter(
      (account) =>
        account.currency === currency &&
        isAccountActiveOnDate(account, snapshot.date),
    )
    .reduce((sum, account) => sum + (snapshot.balances[account.id] ?? 0), 0);

export const getPlnTotal = (snapshot: AccountSnapshot) =>
  getCurrencyTotal(snapshot, "pln");

export const getEurTotal = (snapshot: AccountSnapshot) =>
  getCurrencyTotal(snapshot, "eur");

export const getTotalPln = (snapshot: AccountSnapshot) =>
  getPlnTotal(snapshot) + getEurTotal(snapshot) * snapshot.exchangeRate;

export const getTotalEur = (snapshot: AccountSnapshot) =>
  snapshot.exchangeRate === 0
    ? 0
    : getTotalPln(snapshot) / snapshot.exchangeRate;

export const getDiff = (
  snapshots: AccountSnapshot[],
  index: number,
  currency: Currency,
) => {
  if (index === 0) return null;

  const current = snapshots[index];
  const previous = snapshots[index - 1];

  return (
    getCurrencyTotal(current, currency) - getCurrencyTotal(previous, currency)
  );
};

export const getTotalEurDiff = (snapshots: AccountSnapshot[], index: number) => {
  if (index === 0) return null;

  return getTotalEur(snapshots[index]) - getTotalEur(snapshots[index - 1]);
};

export const getTotalEurDiffPercent = (
  snapshots: AccountSnapshot[],
  index: number,
) => {
  if (index === 0) return null;

  const previous = getTotalEur(snapshots[index - 1]);

  if (previous === 0) return null;

  return ((getTotalEur(snapshots[index]) - previous) / previous) * 100;
};

export const getAccountPercentDiff = (
  snapshots: AccountSnapshot[],
  index: number,
  accountId: AccountId,
) => {
  if (index === 0) return null;

  const current = snapshots[index].balances[accountId];
  const previous = snapshots[index - 1].balances[accountId];

  if (current === undefined || previous === undefined || previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
};

const getSnapshotYear = (snapshot: AccountSnapshot) =>
  snapshot.date.slice(0, 4);

export const getIsLastSnapshotOfYear = (
  snapshots: AccountSnapshot[],
  index: number,
) => {
  const currentYear = getSnapshotYear(snapshots[index]);
  const nextSnapshot = snapshots[index + 1];

  if (!nextSnapshot) return true;

  return getSnapshotYear(nextSnapshot) !== currentYear;
};

export const getYearStartIndex = (snapshots: AccountSnapshot[], year: string) =>
  snapshots.findIndex((snapshot) => getSnapshotYear(snapshot) === year);

export const getYearSummaryEndIndex = (
  snapshots: AccountSnapshot[],
  year: string,
  fallbackIndex: number,
) => {
  const nextYear = String(Number(year) + 1);
  const nextYearJanuaryIndex = snapshots.findIndex(
    (snapshot) => snapshot.date === `${nextYear}-01-01`,
  );

  if (nextYearJanuaryIndex !== -1) {
    return nextYearJanuaryIndex;
  }

  return fallbackIndex;
};

export const getYearSummary = (
  snapshots: AccountSnapshot[],
  startIndex: number,
  endIndex: number,
): YearSummary => {
  const baseSnapshot = snapshots[startIndex];
  const endSnapshot = snapshots[endIndex];
  const yearSnapshots = snapshots.slice(startIndex, endIndex + 1);

  const basePlnTotal = getPlnTotal(baseSnapshot);
  const endPlnTotal = getPlnTotal(endSnapshot);
  const baseEurTotal = getEurTotal(baseSnapshot);
  const endEurTotal = getEurTotal(endSnapshot);
  const baseTotalPln = getTotalPln(baseSnapshot);
  const endTotalPln = getTotalPln(endSnapshot);
  const baseTotalEur = getTotalEur(baseSnapshot);
  const endTotalEur = getTotalEur(endSnapshot);
  const totalEurDiff = endTotalEur - baseTotalEur;

  return {
    year: getSnapshotYear(baseSnapshot),
    baseDate: baseSnapshot.date,
    endDate: endSnapshot.date,
    basePlnTotal,
    endPlnTotal,
    plnDiff: endPlnTotal - basePlnTotal,
    baseEurTotal,
    endEurTotal,
    eurDiff: endEurTotal - baseEurTotal,
    baseTotalPln,
    endTotalPln,
    totalPlnDiff: endTotalPln - baseTotalPln,
    baseTotalEur,
    endTotalEur,
    totalEurDiff,
    totalEurDiffPercent:
      baseTotalEur === 0 ? null : (totalEurDiff / baseTotalEur) * 100,
    averageRate:
      yearSnapshots.reduce((sum, snapshot) => sum + snapshot.exchangeRate, 0) /
      yearSnapshots.length,
    monthsCount: yearSnapshots.length,
  };
};
