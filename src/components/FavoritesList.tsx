import type { FavoriteCity } from "@/lib/favorites";

type FavoritesListProps = {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (id: string) => void;
};

export default function FavoritesList({
  favorites,
  onSelect,
  onRemove,
}: FavoritesListProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow">
      <p className="mb-2 text-sm font-medium text-zinc-600">お気に入り都市</p>
      {favorites.length === 0 ? (
        <p className="text-sm text-zinc-400">
          お気に入りはまだありません。都市を検索して「お気に入りに追加」を押すと、ここに表示されます。
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {favorites.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm"
            >
              <button
                type="button"
                onClick={() => onSelect(f)}
                className="flex-1 text-left text-zinc-800 hover:text-sky-600"
              >
                {f.name}
                {f.country ? `, ${f.country}` : ""}
              </button>
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                aria-label={`${f.name}をお気に入りから削除`}
                className="text-xs text-zinc-400 hover:text-red-500"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
