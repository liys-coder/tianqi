import { formatDate } from '../utils/formatters';

export default function CityHeader() {
  const now = new Date();
  const dateStr = formatDate(now);

  return (
    <div className="mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0C4A6E]">
        天气预报
      </h1>
      <p className="text-sm sm:text-base text-[#64748B] mt-1">
        {dateStr}
      </p>
    </div>
  );
}
