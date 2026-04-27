export const calculateAverage = (values: number[]): number | null => {
  const filtered = values.filter((v) => v > 0);
  if (filtered.length === 0) return null;

  const sum = filtered.reduce((acc, val) => acc + val, 0);
  return sum / filtered.length;
};
