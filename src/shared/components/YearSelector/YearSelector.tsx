interface YearSelectorProps {
  year: string;
  onChange: (year: string) => void;
}

export const YearSelector = ({ year, onChange }: YearSelectorProps) => {
  return (
    <select
      value={year}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 px-3 py-2"
    >
      <option value="2025">2025</option>
      <option value="2026">2026</option>
      <option value="2027">2027</option>
    </select>
  );
};
