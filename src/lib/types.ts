export type ForecastEntry = {
  time: string; // "HH:mm"
  temp: number;
  feelsLike: number | null; // 体感温度。取得できない場合はnull
  humidity: number;
  pop: number; // 0-100 (%)
  precipitation: number | null; // mm (3h). null = データ取得不可, 0 = 降水なしと予想
  description: string;
  icon: string;
};

export type ForecastDay = {
  date: string; // "YYYY-MM-DD"
  representative: ForecastEntry;
  entries: ForecastEntry[];
};

export type WeatherResponse = {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  days: ForecastDay[];
};

export type WeatherErrorResponse = {
  error: string;
};
