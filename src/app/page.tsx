"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import type { WeatherResponse } from "@/lib/types";

export default function Home() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(params: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "エラーが発生しました。");
        setWeather(null);
        return;
      }
      setWeather(data as WeatherResponse);
      setSelectedDate(data.days[0]?.date ?? null);
    } catch {
      setError("通信に失敗しました。");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchCity(city: string) {
    fetchWeather(`city=${encodeURIComponent(city)}`);
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError("このブラウザは現在地取得に対応していません。");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
      },
      () => {
        setLoading(false);
        setError("現在地を取得できませんでした。位置情報の許可を確認してください。");
      }
    );
  }

  const selectedDay =
    weather?.days.find((d) => d.date === selectedDate) ?? null;

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 px-4 py-10 dark:bg-black">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        天気予報
      </h1>

      <SearchBar
        onSearchCity={handleSearchCity}
        onUseLocation={handleUseLocation}
        loading={loading}
      />

      {loading && (
        <p className="text-sm text-zinc-400">読み込み中...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {weather && (
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
          <Calendar
            availableDates={weather.days.map((d) => d.date)}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
          <WeatherCard
            locationName={`${weather.location.name}${
              weather.location.country ? ", " + weather.location.country : ""
            }`}
            day={selectedDay}
          />
        </div>
      )}
    </div>
  );
}
