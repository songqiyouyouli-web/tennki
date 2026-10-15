type CalendarProps = {
  availableDates: string[]; // "YYYY-MM-DD", dates that have forecast data
  selectedDate: string | null;
  onSelect: (date: string) => void;
  icons?: Record<string, string>; // date -> OpenWeatherMap icon code
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function Calendar({
  availableDates,
  selectedDate,
  onSelect,
  icons,
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
    <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow">
      <p className="mb-2 text-center text-sm font-medium text-zinc-600">
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
          const icon = icons?.[key];
          return (
            <button
              key={key}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(key)}
              className={[
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-sm transition-colors",
                isAvailable
                  ? "cursor-pointer text-zinc-900 hover:bg-sky-100"
                  : "cursor-default text-zinc-300",
                isSelected ? "bg-sky-500 text-white hover:bg-sky-500" : "",
              ].join(" ")}
            >
              <span>{date.getDate()}</span>
              {icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://openweathermap.org/img/wn/${icon}.png`}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              )}
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
