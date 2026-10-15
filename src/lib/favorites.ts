export type FavoriteCity = {
  id: string; // 緯度・経度から作る、都市ごとに重複しない識別子
  name: string;
  country: string;
  lat: number;
  lon: number;
};

const STORAGE_KEY = "tennki:favorites";

function makeId(lat: number, lon: number): string {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

export function loadFavorites(): FavoriteCity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavoriteCity[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteCity[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(
  favorites: FavoriteCity[],
  lat: number,
  lon: number
): boolean {
  const id = makeId(lat, lon);
  return favorites.some((f) => f.id === id);
}

export function addFavorite(
  favorites: FavoriteCity[],
  city: { name: string; country: string; lat: number; lon: number }
): FavoriteCity[] {
  const id = makeId(city.lat, city.lon);
  if (favorites.some((f) => f.id === id)) return favorites;
  return [...favorites, { id, ...city }];
}

export function removeFavorite(
  favorites: FavoriteCity[],
  id: string
): FavoriteCity[] {
  return favorites.filter((f) => f.id !== id);
}
