import { NextRequest, NextResponse } from "next/server";
import type { ForecastDay, ForecastEntry, WeatherResponse } from "@/lib/types";

const GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

type OwmForecastItem = {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  pop: number;
};

function pickRepresentative(entries: ForecastEntry[]): ForecastEntry {
  const noonish = entries.find((e) => e.time === "12:00");
  return noonish ?? entries[Math.floor(entries.length / 2)];
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "サーバーに OPENWEATHER_API_KEY が設定されていません。" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  let lat = searchParams.get("lat");
  let lon = searchParams.get("lon");
  let locationName = city ?? "";
  let country = "";

  try {
    if (city) {
      const geoRes = await fetch(
        `${GEOCODING_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
      );
      if (!geoRes.ok) {
        return NextResponse.json(
          { error: "都市情報の取得に失敗しました。" },
          { status: 502 }
        );
      }
      const geoData = await geoRes.json();
      if (!Array.isArray(geoData) || geoData.length === 0) {
        return NextResponse.json(
          { error: `「${city}」が見つかりませんでした。都市名を確認してください。` },
          { status: 404 }
        );
      }
      lat = String(geoData[0].lat);
      lon = String(geoData[0].lon);
      locationName = geoData[0].local_names?.ja ?? geoData[0].name;
      country = geoData[0].country ?? "";
    }

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "city か lat/lon のいずれかを指定してください。" },
        { status: 400 }
      );
    }

    const forecastRes = await fetch(
      `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${apiKey}`
    );
    if (!forecastRes.ok) {
      return NextResponse.json(
        { error: "天気予報の取得に失敗しました。" },
        { status: 502 }
      );
    }
    const forecastData = await forecastRes.json();

    if (!city) {
      locationName = forecastData.city?.name ?? "現在地";
      country = forecastData.city?.country ?? "";
    }

    const byDate = new Map<string, ForecastEntry[]>();
    for (const item of forecastData.list as OwmForecastItem[]) {
      const dateObj = new Date(item.dt * 1000);
      const date = dateObj.toISOString().slice(0, 10);
      const time = dateObj.toTimeString().slice(0, 5);
      const entry: ForecastEntry = {
        time,
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        pop: Math.round((item.pop ?? 0) * 100),
        description: item.weather[0]?.description ?? "",
        icon: item.weather[0]?.icon ?? "01d",
      };
      const list = byDate.get(date) ?? [];
      list.push(entry);
      byDate.set(date, list);
    }

    const days: ForecastDay[] = Array.from(byDate.entries()).map(
      ([date, entries]) => ({
        date,
        entries,
        representative: pickRepresentative(entries),
      })
    );

    const response: WeatherResponse = {
      location: {
        name: locationName,
        country,
        lat: Number(lat),
        lon: Number(lon),
      },
      days,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }
}
