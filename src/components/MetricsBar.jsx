import { Droplets, Wind, Thermometer } from 'lucide-react';

export default function MetricsBar({ feelsLike, humidity, windSpeed }) {
  const metrics = [
    { icon: Thermometer, label: '体感', value: `${feelsLike}°` },
    { icon: Droplets, label: '湿度', value: `${humidity}%` },
    { icon: Wind, label: '风速', value: `${windSpeed}km/h` },
  ];

  return (
    <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4">
      {metrics.map((item, i) => (
        <div 
          key={i}
          className="flex items-center gap-2 bg-white/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px]"
        >
          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0891B2]" />
          <span className="text-xs sm:text-sm text-[#64748B]">{item.label}</span>
          <span className="text-sm sm:text-base text-[#0C4A6E] font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
