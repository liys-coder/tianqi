import ForecastCard from './ForecastCard';

export default function ForecastStrip({ daily }) {
  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-lg sm:text-xl font-semibold text-[#0C4A6E] mb-3 sm:mb-4">
        5 日预报
      </h2>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {daily.map((day, i) => (
          <ForecastCard key={day.date} data={day} index={i} />
        ))}
      </div>
    </div>
  );
}
