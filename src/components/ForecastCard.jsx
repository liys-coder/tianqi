import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherMapping';
import { getDayName } from '../utils/formatters';

export default function ForecastCard({ data, index }) {
  const info = getWeatherInfo(data.weatherCode);

  return (
    <div
      className="flex-1 min-w-[100px] rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3
        bg-white/45 backdrop-blur-[12px] border border-white/60
        hover:-translate-y-1 hover:shadow-lg hover:bg-white/55
        transition-all duration-200 ease-out animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'backwards' }}
    >
      <span className="text-xs font-semibold text-[#0E7490]">{getDayName(data.date)}</span>
      <WeatherIcon code={data.weatherCode} size={28} />
      <div className="flex gap-2 items-baseline">
        <span className="text-base font-semibold text-[#164E63]">{data.tempMax}°</span>
        <span className="text-xs text-[#94A3B8]">{data.tempMin}°</span>
      </div>
      <span className="text-[0.65rem] text-[#94A3B8] -mt-1">{info.description}</span>
    </div>
  );
}
