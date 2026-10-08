export type ForecastEntry = {
  time: string; // "HH:mm"
  temp: number;
  humidity: number;
  pop: number; // 0-100 (%)
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
