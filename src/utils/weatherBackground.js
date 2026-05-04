// src/utils/weatherBackground.js

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
  const keyword = weather.keyword;

  // 使用 Unsplash Source API (已弃用，改用 direct image URLs)
  // 使用 picsum.photos 作为备选
  const seed = weatherCode * 100 + Date.now();
  return `https://picsum.photos/seed/${seed}/1920/1080?blur=2`;
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
