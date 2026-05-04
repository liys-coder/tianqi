import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllCitiesWeather, CITIES as CITIES_LIST, buildApiUrl } from '../hooks/useWeather';
import { getWeatherBackgroundUrl, getWeatherLabel, getFallbackBackgroundUrl, getNextCityId, preloadImage, getWeatherBackgroundUrlByCity } from '../utils/weatherBackground';

const WeatherContext = createContext(null);

const CITIES = CITIES_LIST;

// 从 URL 参数读取当前城市，未指定时默认为第一个城市
function getInitialCity() {
  const params = new URLSearchParams(window.location.search);
  const cityId = params.get('city');
  return CITIES.find(c => c.id === cityId) || CITIES[0];
}

const DEFAULT_CITY = getInitialCity();

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
  const [nextImage, setNextImage] = useState('');        // 下一张缓存图片
  const [imageStatus, setImageStatus] = useState('idle'); // 'idle' | 'loading-small' | 'loading-large' | 'done'
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const cacheRef = useRef({}); // 使用 ref 存储缓存，避免重渲染
  const bufferRef = useRef({ current: null, next: null }); // 图片缓冲

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

  // 天气背景双图缓冲 - 渐进加载
  useEffect(() => {
    if (!rawData) return;
    
    let active = true;
    const currentCityId = currentCity.id;
    const nextCity = getNextCityId(currentCityId);
    const bgLabel = getWeatherLabel(rawData.current.weather_code);
    const fallbackUrl = getFallbackBackgroundUrl();
    
    // 当前城市图片 URL
    const currentBgUrl = getWeatherBackgroundUrlByCity(currentCityId);
    const nextBgUrl = getWeatherBackgroundUrlByCity(nextCity.id);
    
    // 小图 URL（快速显示）
    const smallUrl = currentBgUrl.replace('1920/1080', '640/360');
    
    async function loadImages() {
      try {
        // Step 1: 先加载小图快速显示
        setImageStatus('loading-small');
        const loadedSmall = await preloadImage(smallUrl);
        if (!active) return;
        
        setNextImage(loadedSmall);
        setBackgroundLabel(bgLabel);
        setImageStatus('loading-large');
        
        // Step 2: 小图加载完成后再加载大图
        const largeImg = new Image();
        largeImg.src = currentBgUrl;
        await new Promise((resolve, reject) => {
          largeImg.onload = resolve;
          largeImg.onerror = reject;
        });
        if (!active) return;
        
        setBackgroundImage(currentBgUrl);
        bufferRef.current.current = currentBgUrl;
        setImageStatus('done');
        
        // Step 3: 后台预加载下一城市大图
        const nextImg = new Image();
        nextImg.src = nextBgUrl;
        bufferRef.current.next = nextBgUrl;
        
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
    <WeatherContext.Provider value={{ data, loading, error, refresh, backgroundImage, backgroundLabel, nextImage, imageStatus, currentCity, setCurrentCity }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
}
