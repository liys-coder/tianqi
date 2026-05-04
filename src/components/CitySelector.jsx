import { MapPin } from 'lucide-react';

const CITIES = [
  { id: 'chengdu', name: '成都', lat: 30.67, lon: 104.07 },
  { id: 'chongqing', name: '重庆', lat: 29.57, lon: 106.55 },
];

export default function CitySelector({ currentCity, onCityChange }) {
  return (
    <div className="flex items-center gap-2 mb-4 sm:mb-6">
      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0891B2]" />
      <div className="flex gap-1 sm:gap-2">
        {CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => onCityChange(city)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
              currentCity.id === city.id
                ? 'bg-[#0891B2] text-white shadow-md'
                : 'bg-white/50 text-[#64748B] hover:bg-white/70'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CITIES };
