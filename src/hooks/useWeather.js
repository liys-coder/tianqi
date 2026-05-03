import { useState, useEffect, useCallback } from 'react';

const LAT = 30.67;
const LON = 104.07;
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FShanghai&forecast_days=6`;

export function useWeather() {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetchWeather = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const data = {
        current: {
          temp: Math.round(json.current.temperature_2m),
          humidity: json.current.relative_humidity_2m,
          windSpeed: Math.round(json.current.wind_speed_10m),
          feelsLike: Math.round(json.current.apparent_temperature),
          weatherCode: json.current.weather_code,
        },
        daily: json.daily.time.slice(1, 6).map((date, i) => ({
          date,
          weatherCode: json.daily.weather_code[i + 1],
          tempMax: Math.round(json.daily.temperature_2m_max[i + 1]),
          tempMin: Math.round(json.daily.temperature_2m_min[i + 1]),
          precipSum: json.daily.precipitation_sum[i + 1],
        })),
        updatedAt: new Date().toISOString(),
      };

      setState({ data, loading: false, error: null });
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message || '获取天气失败' }));
    }
  }, []);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  return { ...state, refresh: fetchWeather };
}
