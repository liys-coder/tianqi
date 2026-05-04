import { createContext, useContext, useState, useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import { getWeatherBackgroundUrl, getWeatherLabel } from '../utils/weatherBackground';

const WeatherContext = createContext(null);

const DEFAULT_CITY = { id: 'chengdu', name: '成都', lat: 30.67, lon: 104.07 };

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
  const { rawData, loading, error, refresh } = useWeather(currentCity);
  const data = rawData ? processData(rawData) : null;

  // 天气背景预加载 - 优化：同时发起多个分辨率请求
  useEffect(() => {
    if (!rawData) return;
    const weatherCode = rawData.current.weather_code;
    const bgUrl = getWeatherBackgroundUrl(weatherCode);
    const bgLabel = getWeatherLabel(weatherCode);

    // 预加载小图先显示，再加载大图
    const smallUrl = bgUrl.replace('1920/1080', '640/360');
    
    // 先加载小图快速显示
    const smallImg = new Image();
    smallImg.src = smallUrl;
    smallImg.onload = () => {
      setBackgroundImage(smallUrl); // 先显示小图
      setBackgroundLabel(bgLabel);
    };

    // 再加载大图替换
    const largeImg = new Image();
    largeImg.src = bgUrl;
    largeImg.onload = () => {
      setBackgroundImage(bgUrl); // 替换为大图
    };
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
