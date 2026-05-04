import { Sun, Sunset, Eye, Cloud, Gauge, SunMedium } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value, unit }) => (
  <div className="glass-card-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0284C7]/10 flex items-center justify-center">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0284C7]" />
    </div>
    <div>
      <p className="text-xs sm:text-sm text-[#64748B]">{label}</p>
      <p className="text-lg sm:text-xl font-semibold text-[#0F172A]">
        {value}<span className="text-sm font-normal text-[#64748B]">{unit}</span>
      </p>
    </div>
  </div>
);

export default function DetailsGrid({ daily }) {
  const today = daily[0] || {};

  const details = [
    { icon: SunMedium, label: '紫外线指数', value: today.uvIndex ?? '--', unit: '' },
    { icon: Eye, label: '能见度', value: today.visibility ?? '--', unit: ' km' },
    { icon: Gauge, label: '气压', value: today.pressure ?? '--', unit: ' hPa' },
    { icon: Sun, label: '日出', value: today.sunrise ?? '--:--', unit: '' },
    { icon: Sunset, label: '日落', value: today.sunset ?? '--:--', unit: '' },
    { icon: Cloud, label: '云量', value: today.cloudCover ?? '--', unit: '%' },
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] mb-3 sm:mb-4">
        详细数据
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {details.map((item, index) => (
          <div
            key={item.label}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <DetailItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
