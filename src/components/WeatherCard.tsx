import type { ForecastDay } from "@/lib/types";

type WeatherCardProps = {
  locationName: string;
  day: ForecastDay | null;
};

export default function WeatherCard({ locationName, day }: WeatherCardProps) {
  if (!day) {
    return (
      <div className="flex w-full max-w-sm items-center justify-center rounded-2xl bg-white p-8 text-sm text-zinc-400 shadow dark:bg-zinc-900">
        日付を選ぶと予報が表示されます
      </div>
    );
  }

  const { representative } = day;

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {locationName} ・ {day.date}
      </p>
      <div className="mt-2 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://openweathermap.org/img/wn/${representative.icon}@2x.png`}
          alt={representative.description}
          width={64}
          height={64}
        />
        <div>
          <p className="text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
            {representative.temp}°C
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {representative.description}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
          <p className="text-zinc-400">湿度</p>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {representative.humidity}%
          </p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
          <p className="text-zinc-400">降水確率</p>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {representative.pop}%
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto text-xs text-zinc-500 dark:text-zinc-400">
        {day.entries.map((e) => (
          <div
            key={e.time}
            className="flex min-w-[52px] flex-col items-center rounded-lg bg-zinc-50 px-2 py-1 dark:bg-zinc-800"
          >
            <span>{e.time}</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              {e.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
