import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherMapping';
import { formatDay } from '../utils/formatters';

export default function ForecastCard({ data, index }) {
  const info = getWeatherInfo(data.weatherCode);
  const dayLabel = formatDay(data.date);

  return (
    <div 
      className="glass-card-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex-1 min-w-[100px] sm:min-w-[120px] text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <p className="text-xs sm:text-sm text-[#64748B] font-medium mb-2">{dayLabel}</p>
      <div className="flex justify-center mb-2">
        <WeatherIcon code={data.weatherCode} size={28} />
      </div>
      <div className="flex justify-center gap-2 text-sm">
        <span className="text-[#0C4A6E] font-semibold">{data.tempMax}°</span>
        <span className="text-[#94A3B8]">{data.tempMin}°</span>
      </div>
    </div>
  );
}
