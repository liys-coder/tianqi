import * as Icons from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherMapping';

export default function WeatherIcon({ code, size = 48, className = '' }) {
  const info = getWeatherInfo(code);
  const LucideIcon = Icons[info.icon] || Icons.Cloud;

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
