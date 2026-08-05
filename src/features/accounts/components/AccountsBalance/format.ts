export const formatNumber = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatCompactNumber = (value: number) =>
  value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

export const formatPln = (value: number) => `${formatCompactNumber(value)} zł`;

export const formatEur = (value: number) => `${formatNumber(value)} €`;

export const formatSignedPln = (value: number) =>
  `${value >= 0 ? "+" : ""}${formatPln(value)}`;

export const formatSignedEur = (value: number) =>
  `${value >= 0 ? "+" : ""}${formatEur(value)}`;

export const formatPercent = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

export const formatChartValue = (value: number, currencyLabel: string) =>
  currencyLabel === "EUR" ? formatEur(value) : formatPln(value);

export const formatShortDate = (date: string) => {
  const parsed = new Date(date);

  return parsed.toLocaleString("en-US", {
    month: "short",
    year: "2-digit",
  });
};