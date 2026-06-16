import type { Forecast } from "../../data/initialForecast";
import { months } from "../../data/months";

interface MonthlyNotesProps {
  forecast: Forecast;
  setForecast: React.Dispatch<React.SetStateAction<Forecast>>;
}

export const MonthlyNotes = ({ forecast, setForecast }: MonthlyNotesProps) => {
  const updateNote = (month: string, value: string) => {
    setForecast((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [month]: value,
      },
    }));
  };
  return (
    <div>
      <h3 className="mb-3 text-sm font-black tracking-tight text-slate-900">
        Monthly notes
      </h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((month) => (
          <label
            key={month}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <span className="mb-2 block text-xs font-black text-slate-700">
              Month {month}
            </span>

            <textarea
              value={forecast.notes[month] ?? ""}
              onChange={(event) => updateNote(month, event.target.value)}
              className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        ))}
      </div>
    </div>
  );
};
