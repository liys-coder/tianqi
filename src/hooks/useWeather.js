export const CITIES = [
  { id: 'chengdu', name: '成都', lat: 30.67, lon: 104.07 },
  { id: 'chongqing', name: '重庆', lat: 29.57, lon: 106.55 },
  { id: 'guiyang', name: '贵阳', lat: 26.58, lon: 106.72 },
  { id: 'nanchong', name: '南充', lat: 30.84, lon: 106.11 },
];

const DEFAULT_CITY = CITIES[0];

export function buildApiUrl(city = DEFAULT_CITY) {
  const params = new URLSearchParams({
    latitude: city.lat,
    longitude: city.lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code,precipitation_probability,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,visibility_mean,cloud_cover_mean,surface_pressure_mean',
    timezone: 'Asia/Shanghai',
    forecast_days: '5', // 只请求 5 天预报，减少响应体积
    forecast_hours: '24',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}
