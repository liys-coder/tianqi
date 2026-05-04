import { useState, useEffect, useCallback } from 'react';

const DEFAULT_CITY = { lat: 30.67, lon: 104.07 };

function buildApiUrl(city = DEFAULT_CITY) {
  const params = new URLSearchParams({
    latitude: city.lat,
    longitude: city.lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,visibility_mean,cloud_cover_mean,surface_pressure_mean',
    timezone: 'Asia/Shanghai',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

export function useWeather(city = DEFAULT_CITY) {
  const [state, setState] = useState({
    rawData: null,
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

      setState({ rawData: json, loading: false, error: null });
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message || '获取天气失败' }));
    }
  }, [city]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  return { ...state, refresh: fetchWeather };
}
