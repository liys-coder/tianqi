// WMO Weather interpretation codes → Lucide icon name + Chinese description
const WEATHER_MAP = {
  0:  { icon: 'Sun',         description: '晴朗',   color: '#F59E0B' },
  1:  { icon: 'Sun',         description: '大部晴',   color: '#F59E0B' },
  2:  { icon: 'CloudSun',    description: '少云',   color: '#64748B' },
  3:  { icon: 'Cloud',       description: '多云',   color: '#94A3B8' },
  45: { icon: 'CloudFog',    description: '雾',     color: '#94A3B8' },
  48: { icon: 'CloudFog',    description: '雾凇',   color: '#94A3B8' },
  51: { icon: 'CloudDrizzle',description: '小毛毛雨', color: '#38BDF8' },
  53: { icon: 'CloudDrizzle',description: '毛毛雨',   color: '#38BDF8' },
  55: { icon: 'CloudDrizzle',description: '大毛毛雨', color: '#38BDF8' },
  61: { icon: 'CloudRain',   description: '小雨',   color: '#0284C7' },
  63: { icon: 'CloudRain',   description: '中雨',   color: '#0284C7' },
  65: { icon: 'CloudRain',   description: '大雨',   color: '#0369A1' },
  71: { icon: 'CloudSnow',   description: '小雪',   color: '#F1F5F9' },
  73: { icon: 'CloudSnow',   description: '中雪',   color: '#E2E8F0' },
  75: { icon: 'CloudSnow',   description: '大雪',   color: '#CBD5E1' },
  77: { icon: 'CloudSnow',   description: '雪粒',   color: '#F1F5F9' },
  80: { icon: 'CloudRain',   description: '阵雨',   color: '#38BDF8' },
  81: { icon: 'CloudRain',   description: '大阵雨',   color: '#0284C7' },
  82: { icon: 'CloudRain',   description: '暴阵雨',   color: '#0369A1' },
  85: { icon: 'CloudSnow',   description: '小阵雪',   color: '#F1F5F9' },
  86: { icon: 'CloudSnow',   description: '大阵雪',   color: '#E2E8F0' },
  95: { icon: 'CloudLightning', description: '雷暴',   color: '#6B21A8' },
  96: { icon: 'CloudLightning', description: '雷暴+小雹', color: '#7C3AED' },
  99: { icon: 'CloudLightning', description: '雷暴+大雹', color: '#581C87' },
};

export function getWeatherInfo(code) {
  return WEATHER_MAP[code] || { icon: 'Cloud', description: '未知', color: '#94A3B8' };
}
