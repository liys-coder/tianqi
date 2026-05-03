import { getTodayString } from '../utils/formatters';

export default function CityHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-[#0E7490] mb-1">
        成都 · Chengdu
      </h1>
      <p className="text-sm text-[#155E75]/70">{getTodayString()}</p>
    </div>
  );
}
