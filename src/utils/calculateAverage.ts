export const calculateAverage = (
  values: number[],
  currentMonthIndex = new Date().getMonth(), // maj = 4
): number | null => {
  const monthsUntilNow = values.slice(0, currentMonthIndex + 1);

  if (monthsUntilNow.length === 0) return null;

  const sum = monthsUntilNow.reduce((acc, val) => acc + (val || 0), 0);

  return sum / monthsUntilNow.length;
};
