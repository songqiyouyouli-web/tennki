type CalendarProps = {
  availableDates: string[]; // "YYYY-MM-DD", dates that have forecast data
  selectedDate: string | null;
  onSelect: (date: string) => void;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function Calendar({
  availableDates,
  selectedDate,
  onSelect,
}: CalendarProps) {
  const availableSet = new Set(availableDates);
  const base = availableDates[0] ? new Date(availableDates[0]) : new Date();
  const year = base.getFullYear();
  const month = base.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow dark:bg-zinc-900">
      <p className="mb-2 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {year}年{month + 1}月
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-400">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;
          const key = toDateKey(date);
          const isAvailable = availableSet.has(key);
          const isSelected = key === selectedDate;
          return (
            <button
              key={key}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(key)}
              className={[
                "aspect-square rounded-lg text-sm transition-colors",
                isAvailable
                  ? "cursor-pointer text-zinc-900 hover:bg-sky-100 dark:text-zinc-100 dark:hover:bg-sky-900"
                  : "cursor-default text-zinc-300 dark:text-zinc-700",
                isSelected ? "bg-sky-500 text-white hover:bg-sky-500" : "",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs text-zinc-400">
        予報データのある日だけ選択できます
      </p>
    </div>
  );
}
