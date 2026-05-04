import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CITIES as CITIES_LIST, buildApiUrl } from '../hooks/useWeather';
import { getWeatherLabel, getFallbackBackgroundUrl, getNextCityId, preloadImage, getWeatherBackgroundUrlByCity } from '../utils/weatherBackground';

const WeatherContext = createContext(null);

const CITIES = CITIES_LIST;
const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟缓存

// 本地缓存 key
function getCacheKey(cityId) {
  return `weather_${cityId}`;
}

// 从 localStorage 读取缓存（带过期检查）
function getCachedData(cityId) {
  try {
    const cached = localStorage.getItem(getCacheKey(cityId));
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    // 忽略缓存读取错误
  }
  return null;
}

// 写入 localStorage 缓存
function setCachedData(cityId, data) {
  try {
    localStorage.setItem(getCacheKey(cityId), JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (e) {
    // 忽略缓存写入错误（可能是配额满）
  }
}

function processData(data) {
  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      feelsLike: Math.round(data.current.apparent_temperature),
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
    },
    hourly: (data.hourly?.time || []).slice(0, 24).map((time, i) => ({
      time,
      temp: Math.round(data.hourly?.temperature_2m?.[i] ?? 0),
      weatherCode: data.hourly?.weather_code?.[i] ?? 0,
      precipitationProbability: data.hourly?.precipitation_probability?.[i] ?? null,
    })),
    daily: (data.daily?.time || []).map((date, i) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      uvIndex: Math.round(data.daily.uv_index_max[i] * 10) / 10,
      sunrise: data.daily.sunrise[i]?.slice(11, 16) || '--:--',
      sunset: data.daily.sunset[i]?.slice(11, 16) || '--:--',
      visibility: Math.round(data.daily.visibility_mean[i] / 1000 * 10) / 10,
      cloudCover: data.daily.cloud_cover_mean[i],
      pressure: Math.round(data.daily.surface_pressure_mean[i]),
    })),
  };
}

export function WeatherProvider({ children }) {
  const [currentCity, setCurrentCity] = useState(() => {
    // 使用 useState 初始化函数，避免模块级执行 window.location
    const params = new URLSearchParams(window.location.search);
    const cityId = params.get('city');
    return CITIES.find(c => c.id === cityId) || CITIES[0];
  });
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundLabel, setBackgroundLabel] = useState('');
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef({}); // 内存缓存

  // 加载城市数据 - 合并初始加载 + 按需加载
  useEffect(() => {
    let cancelled = false;

    async function loadCityData() {
      setLoading(true);
      setError(null);

      const cityId = currentCity.id;

      // 1. 优先使用内存缓存
      if (cacheRef.current[cityId] && !cancelled) {
        setRawData(cacheRef.current[cityId]);
        setLoading(false);
        // 后台静默刷新（stale-while-revalidate）
        fetchAndUpdateCache(cityId, true);
        return;
      }

      // 2. 检查 localStorage 缓存
      const localCached = getCachedData(cityId);
      if (localCached && !cancelled) {
        setRawData(localCached);
        cacheRef.current[cityId] = localCached;
        setLoading(false);
        // 后台静默刷新
        fetchAndUpdateCache(cityId, true);
        return;
      }

      // 3. 无缓存，实时获取
      try {
        const res = await fetch(buildApiUrl(currentCity));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!json.current || !json.daily) {
          throw new Error('API 返回数据格式异常');
        }

        if (!cancelled) {
          setRawData(json);
          cacheRef.current[cityId] = json;
          setCachedData(cityId, json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || '获取天气失败');
        }
      }

      if (!cancelled) {
        setLoading(false);
      }
    }

    // 后台获取并更新缓存（静默刷新）
    async function fetchAndUpdateCache(cityId, silent = false) {
      try {
        const res = await fetch(buildApiUrl(CITIES.find(c => c.id === cityId) || currentCity));
        if (res.ok) {
          const json = await res.json();
          if (json.current && json.daily) {
            cacheRef.current[cityId] = json;
            setCachedData(cityId, json);
          }
        }
      } catch (e) {
        // 静默刷新失败不报错
      }
    }

    loadCityData();

    // 后台预加载其他城市数据
    CITIES.filter(c => c.id !== currentCity.id).forEach(city => {
      if (!cacheRef.current[city.id] && !getCachedData(city.id)) {
        fetchAndUpdateCache(city.id, true);
      }
    });

    return () => { cancelled = true; };
  }, [currentCity]);

  const data = rawData ? processData(rawData) : null;

  // 刷新函数 - 强制跳过缓存
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(currentCity));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!json.current || !json.daily) {
        throw new Error('API 返回数据格式异常');
      }

      setRawData(json);
      cacheRef.current[currentCity.id] = json;
      setCachedData(currentCity.id, json);
    } catch (err) {
      setError(err.message || '获取天气失败');
    }

    setLoading(false);
  }, [currentCity]);

  // 天气背景渐进加载
  useEffect(() => {
    if (!rawData) return;

    let active = true;
    const currentCityId = currentCity.id;
    const nextCity = getNextCityId(currentCityId);
    const bgLabel = getWeatherLabel(rawData.current.weather_code);
    const fallbackUrl = getFallbackBackgroundUrl();

    const currentWeatherCode = rawData.current.weather_code;
    // 当前城市图片 URL
    const currentBgUrl = getWeatherBackgroundUrlByCity(currentCityId, currentWeatherCode);
    const nextCityWeatherCode = cacheRef.current[nextCity.id]?.current?.weather_code ?? currentWeatherCode;
    const nextBgUrl = getWeatherBackgroundUrlByCity(nextCity.id, nextCityWeatherCode);

    // 小图 URL（快速显示）
    const smallUrl = currentBgUrl.replace('1920/1080', '640/360');

    async function loadImages() {
      try {
        // Step 1: 先加载小图快速显示
        const loadedSmall = await preloadImage(smallUrl);
        if (!active) return;

        setBackgroundLabel(bgLabel);

        // Step 2: 小图加载完成后再加载大图
        const largeImg = new Image();
        largeImg.src = currentBgUrl;
        await new Promise((resolve, reject) => {
          largeImg.onload = resolve;
          largeImg.onerror = reject;
        });
        if (!active) return;

        setBackgroundImage(currentBgUrl);

        // Step 3: 后台预加载下一城市大图
        const nextImg = new Image();
        nextImg.src = nextBgUrl;

      } catch (e) {
        console.warn('图片加载失败，使用 fallback:', e);
        if (!active) return;
        setBackgroundImage(fallbackUrl);
        setBackgroundLabel(bgLabel);
      }
    }

    loadImages();

    return () => { active = false; };
  }, [rawData, currentCity]);

  return (
    <WeatherContext.Provider value={{ data, loading, error, refresh, backgroundImage, backgroundLabel, currentCity, setCurrentCity }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
}
