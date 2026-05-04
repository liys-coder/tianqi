import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllCitiesWeather, CITIES as CITIES_LIST, buildApiUrl } from '../hooks/useWeather';
import { getWeatherBackgroundUrl, getWeatherLabel, getFallbackBackgroundUrl } from '../utils/weatherBackground';

const WeatherContext = createContext(null);

const CITIES = CITIES_LIST;

const DEFAULT_CITY = CITIES[0];

function processData(data) {
  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      feelsLike: Math.round(data.current.apparent_temperature),
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
    },
    daily: data.daily.time.map((date, i) => ({
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
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundLabel, setBackgroundLabel] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const cacheRef = useRef({}); // 使用 ref 存储缓存，避免重渲染

  // 启动时预加载所有城市数据
  useEffect(() => {
    let cancelled = false;
    
    async function preloadAllCities() {
      try {
        const results = await fetchAllCitiesWeather(CITIES);
        if (!cancelled) {
          cacheRef.current = results;
          setIsInitialLoading(false);
        }
      } catch (e) {
        console.warn('预加载城市数据失败:', e);
        if (!cancelled) {
          setIsInitialLoading(false);
        }
      }
    }
    
    preloadAllCities();
    
    return () => { cancelled = true; };
  }, []);

  // 获取当前城市数据（优先使用缓存，后台刷新）
  const getCityData = useCallback(async () => {
    const cityId = currentCity.id;
    
    // 检查缓存
    if (cacheRef.current[cityId]) {
      return cacheRef.current[cityId];
    }
    
    // 缓存未命中，实时获取
    try {
      const res = await fetch(buildApiUrl(currentCity));
      if (res.ok) {
        const json = await res.json();
        if (json.current && json.daily) {
          cacheRef.current[cityId] = json;
          return json;
        }
      }
    } catch (e) {
      console.warn('获取天气数据失败:', e);
    }
    return null;
  }, [currentCity]);

  // 使用缓存数据或实时获取
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 城市切换时加载数据
  useEffect(() => {
    let cancelled = false;
    
    async function loadCityData() {
      setLoading(true);
      setError(null);
      
      // 优先使用缓存
      const cachedData = cacheRef.current[currentCity.id];
      if (cachedData && !cancelled) {
        setRawData(cachedData);
        setLoading(false);
      } else {
        // 缓存未命中，实时获取
        try {
          const res = await fetch(buildApiUrl(currentCity));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          
          if (!json.current || !json.daily) {
            throw new Error('API 返回数据格式异常');
          }
          
          if (!cancelled) {
            setRawData(json);
            cacheRef.current[currentCity.id] = json; // 存入缓存
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
      
      // 后台预刷其他城市数据（可选）
      if (!cancelled) {
        CITIES
          .filter(c => c.id !== currentCity.id)
          .forEach(city => {
            if (!cacheRef.current[city.id]) {
              fetch(buildApiUrl(city)).then(res => {
                if (res.ok) res.json().then(json => {
                  if (json.current && json.daily) {
                    cacheRef.current[city.id] = json;
                  }
                });
              });
            }
          });
      }
    }
    
    if (!isInitialLoading) {
      loadCityData();
    }
    
    return () => { cancelled = true; };
  }, [currentCity, isInitialLoading]);

  const data = rawData ? processData(rawData) : null;
  
  // 刷新函数
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
    } catch (err) {
      setError(err.message || '获取天气失败');
    }
    
    setLoading(false);
  }, [currentCity]);

  // 天气背景预加载 - 优化：同时发起多个分辨率请求，带错误处理
  useEffect(() => {
    if (!rawData) return;
    let active = true;
    const weatherCode = rawData.current.weather_code;
    const bgUrl = getWeatherBackgroundUrl(weatherCode);
    const bgLabel = getWeatherLabel(weatherCode);
    const fallbackUrl = getFallbackBackgroundUrl();

    // 预加载小图先显示，再加载大图
    const smallUrl = bgUrl.replace('1920/1080', '640/360');
    
    // 先加载小图快速显示
    const smallImg = new Image();
    smallImg.src = smallUrl;
    smallImg.onload = () => {
      if (active) setBackgroundImage(smallUrl);
      if (active) setBackgroundLabel(bgLabel);
    };
    smallImg.onerror = () => {
      // 小图加载失败，使用 fallback
      if (active) setBackgroundImage(fallbackUrl);
      if (active) setBackgroundLabel(bgLabel);
    };

    // 再加载大图替换
    const largeImg = new Image();
    largeImg.src = bgUrl;
    largeImg.onload = () => {
      if (active) setBackgroundImage(bgUrl);
    };
    largeImg.onerror = () => {
      // 大图加载失败，保持小图/fallback
    };

    return () => { active = false; };
  }, [rawData]);

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
