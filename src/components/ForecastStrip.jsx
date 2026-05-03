import ForecastCard from './ForecastCard';

export default function ForecastStrip({ daily }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {daily.map((day, i) => (
        <ForecastCard key={day.date} data={day} index={i} />
      ))}
    </div>
  );
}
