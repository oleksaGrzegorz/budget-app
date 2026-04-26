export const useIncomesMetrics = (
  incomes: Record<string, Record<string, number>>,
) => {
  const getAverageIncomeForCategory = (category: string) => {
    const monthsData = incomes[category];
    if (!monthsData) return null;

    const values = Object.values(monthsData).filter((v) => v > 0);
    if (values.length === 0) return null;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  return {
    getAverageIncomeForCategory,
  };
};