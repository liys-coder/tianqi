import { useState, useEffect, useCallback, useRef } from 'react';

export const CITIES = [
  { id: 'chengdu', name: '成都', lat: 30.67, lon: 104.07 },
  { id: 'chongqing', name: '重庆', lat: 29.57, lon: 106.55 },
  { id: 'guiyang', name: '贵阳', lat: 26.58, lon: 106.72 },
];

const DEFAULT_CITY = CITIES[0];

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

export { buildApiUrl };

/**
 * 批量获取多个城市的天气数据
 * @param {Array} cities - 城市数组
 * @returns {Promise<Object>} cityId -> rawData 的映射
 */
export async function fetchAllCitiesWeather(cities) {
  const results = {};
  await Promise.all(
    cities.map(async (city) => {
      try {
        const res = await fetch(buildApiUrl(city));
        if (res.ok) {
          const json = await res.json();
          if (json.current && json.daily) {
            results[city.id] = json;
          }
        }
      } catch (e) {
        // 单个城市失败不影响其他城市
        console.warn(`Failed to fetch weather for ${city.name}:`, e);
      }
    })
  );
  return results;
}

export function useWeather(city = DEFAULT_CITY) {
  const [state, setState] = useState({
    rawData: null,
    loading: true,
    error: null,
  });

  // 获取天气数据的函数
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
