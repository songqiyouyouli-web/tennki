import { getRainLevel } from "@/lib/rain";

// 「この基準温度より低ければ、このメッセージ」という表。
// 温度や文章を変えたいときは、この配列を書き換えるだけでよい。
export type ClothingLevel = {
  minTemp: number; // この値「以上」ならこのレベル (-Infinityは下限なし)
  message: string;
};

export const CLOTHING_LEVELS: ClothingLevel[] = [
  { minTemp: 28, message: "半袖で過ごせる暑さです。涼しい服装がおすすめです。" },
  { minTemp: 23, message: "半袖や薄手の服で快適に過ごせそうです。" },
  { minTemp: 18, message: "長袖に、薄手の羽織りものがあると便利です。" },
  { minTemp: 12, message: "長袖に、カーディガンやジャケットがあると安心です。" },
  { minTemp: 6, message: "暖かい上着（コートなど）があると安心です。" },
  { minTemp: -Infinity, message: "しっかりした防寒着がおすすめです。" },
];

export type ClothingAdvice = {
  message: string;
  basedOnFeelsLike: boolean; // 体感温度を使えたかどうか
};

export function getClothingAdvice(entry: {
  temp: number;
  feelsLike: number | null;
  precipitation: number | null;
}): ClothingAdvice {
  const basedOnFeelsLike = entry.feelsLike !== null;
  const baseTemp = entry.feelsLike ?? entry.temp;

  const level =
    CLOTHING_LEVELS.find((l) => baseTemp >= l.minTemp) ??
    CLOTHING_LEVELS[CLOTHING_LEVELS.length - 1];

  let message = level.message;

  if (entry.precipitation !== null) {
    const rainLevel = getRainLevel(entry.precipitation);
    if (rainLevel.label !== "雨なし") {
      message += " 雨が予想されるので、傘があると安心です。";
    }
  }

  return { message, basedOnFeelsLike };
}
