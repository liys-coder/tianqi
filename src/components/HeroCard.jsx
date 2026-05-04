import WeatherIcon from './WeatherIcon';
import MetricsBar from './MetricsBar';
import { getWeatherInfo } from '../utils/weatherMapping';

export default function HeroCard({ current }) {
  const info = getWeatherInfo(current.weatherCode);

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 animate-fade-in-scale shadow-lg pulse-breathing">
      <div className="flex items-center gap-3 sm:gap-5 md:gap-6 flex-wrap">
        <WeatherIcon code={current.weatherCode} size={48} />
        <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
          <div className="text-5xl sm:text-6xl md:text-7xl font-light text-[#0C4A6E] leading-none tracking-tight animate-pulse-subtle">
            {current.temp}°
          </div>
          <p className="text-base md:text-lg text-[#0891B2] mt-1">{info.description}</p>
          <p className="text-sm text-[#64748B]">体感 {current.feelsLike}°</p>
        </div>
      </div>
      <MetricsBar
        feelsLike={current.feelsLike}
        humidity={current.humidity}
        windSpeed={current.windSpeed}
      />
    </div>
  );
}
