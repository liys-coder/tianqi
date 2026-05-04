// src/utils/weatherBackground.js

import { CITIES } from '../hooks/useWeather';

/**
 * WMO 天气代码到 Unsplash 背景关键词的映射
 */
export const weatherBackgroundMap = {
  // 晴朗 (0, 1)
  0: { keyword: 'clear blue sky sunshine', label: '晴朗' },
  1: { keyword: 'clear sky sunny day', label: '晴' },

  // 多云 (2, 3)
  2: { keyword: 'partly cloudy sky', label: '多云' },
  3: { keyword: 'overcast clouds cloudy', label: '阴' },

  // 雾 (45, 48)
  45: { keyword: 'fog morning mist', label: '雾' },
  48: { keyword: 'fog misty morning', label: '雾' },

  // 毛毛雨/雨 (51-67)
  51: { keyword: 'light rain drizzle', label: '小雨' },
  53: { keyword: 'rain drizzle weather', label: '雨' },
  55: { keyword: 'heavy rain weather', label: '大雨' },
  61: { keyword: 'rain shower weather', label: '雨' },
  63: { keyword: 'rain moderate', label: '雨' },
  65: { keyword: 'heavy rain downpour', label: '大雨' },
  66: { keyword: 'freezing rain ice', label: '冻雨' },
  67: { keyword: 'heavy freezing rain', label: '冻雨' },

  // 雪 (71-77)
  71: { keyword: 'light snow snowfall', label: '小雪' },
  73: { keyword: 'snow snowfall winter', label: '雪' },
  75: { keyword: 'heavy snow blizzard', label: '大雪' },
  77: { keyword: 'snow grains weather', label: '雪' },

  // 阵雨 (80-82)
  80: { keyword: 'rain shower downpour', label: '阵雨' },
  81: { keyword: 'rain showers weather', label: '阵雨' },
  82: { keyword: 'heavy rain shower', label: '强阵雨' },

  // 雷暴 (95-99)
  95: { keyword: 'thunderstorm lightning', label: '雷暴' },
  96: { keyword: 'thunderstorm hail', label: '雷暴' },
  99: { keyword: 'thunderstorm heavy hail', label: '雷暴' },
};

/**
 * 获取天气背景图 URL
 * @param {number} weatherCode - WMO 天气代码
 * @returns {string} Unsplash 图片 URL
 */
export function getWeatherBackgroundUrl(weatherCode) {
  const weather = weatherBackgroundMap[weatherCode] || weatherBackgroundMap[0];
  
  // 使用固定 seed，避免每次刷新 URL 变化
  // weatherCode * 100 确保不同天气有不同图片
  const seed = weatherCode * 100 + 2024; // 固定年份作为 salt
  return `https://picsum.photos/seed/${seed}/1920/1080?blur=2`;
}

/**
 * 获取备用背景图 URL（用于加载失败时）
 * @returns {string}
 */
export function getFallbackBackgroundUrl() {
  return 'https://picsum.photos/seed/weather-fallback/1920/1080?blur=2';
}

/**
 * 获取天气中文名称
 * @param {number} weatherCode - WMO 天气代码
 * @returns {string}
 */
export function getWeatherLabel(weatherCode) {
  const weather = weatherBackgroundMap[weatherCode] || weatherBackgroundMap[0];
  return weather.label;
}

/**
 * 获取循环下一个城市
 * @param {string} currentId - 当前城市 ID
 * @returns {Object} 下一个城市对象
 */
export function getNextCityId(currentId) {
  const idx = CITIES.findIndex(c => c.id === currentId);
  const nextIdx = (idx + 1) % CITIES.length;
  return CITIES[nextIdx];
}

/**
 * 预加载图片并返回 Promise
 * @param {string} url - 图片 URL
 * @returns {Promise<string>} 加载完成后的 URL
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
  });
}

/**
 * 根据城市 ID + 天气代码 + 日期获取背景图 URL
 * 策略：城市(3) * 天气(约30种) * 日期(每天变) = 每天不同的新鲜感
 * 但同一天内复用，利于浏览器缓存
 *
 * @param {string} cityId - 城市 ID
 * @param {number} weatherCode - WMO 天气代码
 * @returns {string} 图片 URL
 */
export function getWeatherBackgroundUrlByCity(cityId, weatherCode = 0) {
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  // 获取"天"级别的日期数（每天0点变化）
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  // 组合 seed：城市 + 天气 + 日期
  const seed = `${cityId}-w${weatherCode}-d${dayNumber}`;
  return `https://picsum.photos/seed/${seed}/1920/1080?blur=2`;
}
