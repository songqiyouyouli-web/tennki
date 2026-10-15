// 3時間ごとの降水量(mm)から、「どれくらい強い雨か」を判定するための設定。
// しきい値(threshold)を変えれば、強さの基準を自由に調整できる。
export type RainLevel = {
  label: string; // 画面に表示する短い言葉
  maxMm: number; // この値「未満」ならこのレベル (Infinityは上限なし)
  barColor: string; // 強さを表すバーの色 (Tailwindのクラス名)
  textColor: string; // 文字の色 (Tailwindのクラス名)
};

export const RAIN_LEVELS: RainLevel[] = [
  { label: "雨なし", maxMm: 0.1, barColor: "bg-zinc-200", textColor: "text-zinc-400" },
  { label: "小雨", maxMm: 1, barColor: "bg-sky-200", textColor: "text-sky-600" },
  { label: "弱い雨", maxMm: 5, barColor: "bg-sky-400", textColor: "text-sky-700" },
  { label: "やや強い雨", maxMm: 10, barColor: "bg-orange-400", textColor: "text-orange-700" },
  { label: "強い雨", maxMm: Infinity, barColor: "bg-red-500", textColor: "text-red-700" },
];

export function getRainLevel(mm: number): RainLevel {
  return RAIN_LEVELS.find((level) => mm < level.maxMm) ?? RAIN_LEVELS[RAIN_LEVELS.length - 1];
}
