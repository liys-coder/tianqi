import WeatherIcon from './WeatherIcon';
import MetricsBar from './MetricsBar';
import { getWeatherInfo } from '../utils/weatherMapping';

export default function HeroCard({ current }) {
  const info = getWeatherInfo(current.weatherCode);

  return (
    <div className="rounded-3xl p-6 md:p-8 mb-6 animate-fade-up
      bg-white/55 backdrop-blur-[20px] border border-white/70 shadow-lg shadow-[#0891B2]/8">
      <div className="flex items-center gap-5 md:gap-6 flex-wrap">
        <WeatherIcon code={current.weatherCode} size={56} />
        <div className="flex-1 min-w-[140px]">
          <div className="text-6xl md:text-7xl font-light text-[#164E63] leading-none tracking-tight">
            {current.temp}°
          </div>
          <p className="text-base md:text-lg text-[#0E7490] mt-1">{info.description}</p>
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
