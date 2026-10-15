"use client";

import { useState } from "react";

type SearchBarProps = {
  onSearchCity: (city: string) => void;
  onUseLocation: () => void;
  loading: boolean;
};

export default function SearchBar({
  onSearchCity,
  onUseLocation,
  loading,
}: SearchBarProps) {
  const [city, setCity] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (city.trim()) onSearchCity(city.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="都市名を入力 (例: Tokyo)"
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-sky-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
      >
        検索
      </button>
      <button
        type="button"
        onClick={onUseLocation}
        disabled={loading}
        title="現在地の天気を取得"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
      >
        現在地
      </button>
    </form>
  );
}
