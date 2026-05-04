import { Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherMapping';

const iconMap = {
  Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning,
};

export default function WeatherIcon({ code, size = 48, className = '' }) {
  const info = getWeatherInfo(code);
  const LucideIcon = iconMap[info.icon] || Cloud;

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size + 16,
        height: size + 16,
        background: `radial-gradient(circle at 50% 40%, ${info.color}55, ${info.color}15)`,
      }}
    >
      <LucideIcon size={size} color={info.color} strokeWidth={1.5} aria-label={`${info.description}天气`} />
    </div>
  );
}
