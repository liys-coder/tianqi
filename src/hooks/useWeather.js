import { useState, useEffect, useCallback } from 'react';

const DEFAULT_CITY = { lat: 30.67, lon: 104.07 };

function buildApiUrl(city = DEFAULT_CITY) {
  const { lat, lon } = city;
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FShanghai&forecast_days=6`;
}

export function useWeather(city = DEFAULT_CITY) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetchWeather = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(buildApiUrl(city));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!json.current || !json.daily) {
        throw new Error('API 返回数据格式异常');
      }

      const data = {
        current: {
          temp: Math.round(json.current.temperature_2m ?? 0),
          humidity: json.current.relative_humidity_2m ?? 0,
          windSpeed: Math.round(json.current.wind_speed_10m ?? 0),
          feelsLike: Math.round(json.current.apparent_temperature ?? 0),
          weatherCode: json.current.weather_code ?? 0,
        },
        daily: (json.daily.time?.slice(1, 6) ?? []).map((date, i) => ({
          date,
          weatherCode: json.daily.weather_code?.[i + 1] ?? 0,
          tempMax: Math.round(json.daily.temperature_2m_max?.[i + 1] ?? 0),
          tempMin: Math.round(json.daily.temperature_2m_min?.[i + 1] ?? 0),
          precipSum: json.daily.precipitation_sum?.[i + 1] ?? 0,
        })),
        updatedAt: new Date().toISOString(),
        cityId: city.id,
      };

      setState({ data, loading: false, error: null });
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message || '获取天气失败' }));
    }
  }, [city]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  return { ...state, refresh: fetchWeather };
}
