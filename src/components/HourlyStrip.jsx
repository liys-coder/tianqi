import { ScrollReveal } from '../hooks/useScrollReveal';
import WeatherIcon from './WeatherIcon';
import { Umbrella } from 'lucide-react';
import { formatHour } from '../utils/formatters';

/**
 * HourlyStrip — 小时天气预报横向滑栏
 *
 * 功能：
 *  - 横向滚动，手机端可滑动，电脑端显示更多
 *  - 每个小时显示：时间、温度、天气图标、降水概率
 *  - 当前小时高亮（"现在" + 蓝色圆环）
 *  - 悬停微光效果（由 glass-card-sm 提供）
 *  - 滚动入场动画（ScrollReveal）
 *
 * @param {{ hourly: Array<{ time: string, temp: number, weatherCode: number, precipitationProbability: number }> }} props
 */
export default function HourlyStrip({ hourly }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <ScrollReveal delay={100}>
      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] mb-3 sm:mb-4">
          小时预报
        </h2>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {hourly.map((h, i) => (
            <HourlyCard key={h.time} data={h} index={i} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

/**
 * HourlyCard — 单个小时卡片
 */
function HourlyCard({ data }) {
  // 从 API 时间字符串中直接提取日期和小时（API 返回 Asia/Shanghai 时区）
  const cardDate = data.time.split('T')[0];
  const cardHour = data.time.split('T')[1].split(':')[0];

  // 获取 Asia/Shanghai 当前日期和小时，避免本地时区偏移
  const now = new Date();
  const shanghaiDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const shanghaiHour = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Shanghai',
    hour: 'numeric',
    hour12: false,
  }).format(now);

  const isCurrentHour = cardDate === shanghaiDate && cardHour === shanghaiHour;

  return (
    <div
      className={[
        'glass-card-sm rounded-xl p-3 flex-shrink-0 w-[85px] sm:w-[105px] text-center',
        'transition-all duration-300',
        isCurrentHour ? 'ring-2 ring-[#0284C7]/50 bg-[#0284C7]/5' : '',
      ].join(' ')}
    >
      {/* 时间 / "现在" */}
      <p className="text-xs text-[#64748B] font-medium mb-1.5 truncate">
        {isCurrentHour ? '现在' : formatHour(data.time)}
      </p>

      {/* 天气图标 */}
      <div className="flex justify-center mb-1.5">
        <WeatherIcon code={data.weatherCode} size={22} />
      </div>

      {/* 温度 */}
      <p className="text-sm sm:text-base font-semibold text-[#0C4A6E] leading-tight">
        {data.temp}°
      </p>

      {/* 降水概率 */}
      {data.precipitationProbability != null && (
        <div className="flex items-center justify-center gap-1 mt-1.5">
          <Umbrella size={10} className="text-[#0284C7] shrink-0" />
          <span className="text-[10px] text-[#64748B] font-medium">
            {data.precipitationProbability}%
          </span>
        </div>
      )}
    </div>
  );
}
