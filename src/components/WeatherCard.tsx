import type { ForecastDay } from "@/lib/types";
import { getRainLevel } from "@/lib/rain";
import { getClothingAdvice } from "@/lib/clothing";

type WeatherCardProps = {
  locationName: string;
  day: ForecastDay | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export default function WeatherCard({
  locationName,
  day,
  isFavorite,
  onToggleFavorite,
}: WeatherCardProps) {
  if (!day) {
    return (
      <div className="flex w-full max-w-sm items-center justify-center rounded-2xl bg-white p-8 text-sm text-zinc-400 shadow">
        日付を選ぶと予報が表示されます
      </div>
    );
  }

  const { representative } = day;

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-zinc-500">
          {locationName} ・ {day.date}
        </p>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={
              isFavorite ? "お気に入りから削除" : "お気に入りに追加"
            }
            className={[
              "shrink-0 rounded-md px-2 py-1 text-xs font-medium",
              isFavorite
                ? "bg-amber-100 text-amber-700"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200",
            ].join(" ")}
          >
            {isFavorite ? "★ お気に入り" : "☆ お気に入りに追加"}
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://openweathermap.org/img/wn/${representative.icon}@2x.png`}
          alt={representative.description}
          width={64}
          height={64}
        />
        <div>
          <p className="text-4xl font-semibold text-zinc-900">
            {representative.temp}°C
          </p>
          <p className="text-sm text-zinc-600">
            {representative.description}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-zinc-400">湿度</p>
          <p className="text-lg font-medium text-zinc-900">
            {representative.humidity}%
          </p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <p className="text-zinc-400">降水確率</p>
          <p className="text-lg font-medium text-zinc-900">
            {representative.pop}%
          </p>
        </div>
      </div>

      <ClothingAdviceBox entry={representative} />

      <div className="mt-4 flex gap-2 overflow-x-auto text-xs text-zinc-500">
        {day.entries.map((e) => {
          if (e.precipitation === null) {
            return (
              <div
                key={e.time}
                className="flex min-w-[64px] flex-col items-center rounded-lg bg-zinc-50 px-2 py-2"
              >
                <span>{e.time}</span>
                <span className="font-medium text-zinc-700">{e.temp}°</span>
                <span className="mt-1 text-[10px] text-zinc-400">
                  雨量不明
                </span>
              </div>
            );
          }

          const level = getRainLevel(e.precipitation);
          return (
            <div
              key={e.time}
              className="flex min-w-[64px] flex-col items-center rounded-lg bg-zinc-50 px-2 py-2"
            >
              <span>{e.time}</span>
              <span className="font-medium text-zinc-700">{e.temp}°</span>
              {/* 雨の強さを色付きバーの長さでも表す。見た目で一目で伝わるように */}
              <div className="mt-1 h-1.5 w-10 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className={`h-full ${level.barColor}`}
                  style={{
                    width: `${Math.min(100, (e.precipitation / 10) * 100)}%`,
                  }}
                />
              </div>
              <span className={`mt-0.5 text-[10px] font-semibold ${level.textColor}`}>
                {level.label}
              </span>
              <span className="text-[10px] text-zinc-400">
                {e.precipitation.toFixed(1)}mm
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ClothingAdviceBoxProps = {
  entry: {
    temp: number;
    feelsLike: number | null;
    precipitation: number | null;
  };
};

function ClothingAdviceBox({ entry }: ClothingAdviceBoxProps) {
  const advice = getClothingAdvice(entry);
  return (
    <div className="mt-4 rounded-lg bg-sky-50 p-3 text-sm text-sky-800">
      <p className="mb-0.5 text-xs font-medium text-sky-500">
        服装の目安（参考情報）
      </p>
      <p>{advice.message}</p>
      {!advice.basedOnFeelsLike && (
        <p className="mt-1 text-[10px] text-sky-400">
          ※ 体感温度が取得できなかったため、気温のみを基準にしています。
        </p>
      )}
    </div>
  );
}
