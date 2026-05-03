export default function MetricsBar({ feelsLike, humidity, windSpeed }) {
  const metrics = [
    { label: '体感', value: `${feelsLike}°`, unit: '' },
    { label: '湿度', value: `${humidity}`, unit: '%' },
    { label: '风速', value: `${windSpeed}`, unit: 'km/h' },
  ];

  return (
    <div className="flex gap-6 mt-6 pt-5 border-t border-[#0891B2]/12 flex-wrap">
      {metrics.map(m => (
        <div key={m.label}>
          <div className="text-[0.65rem] md:text-xs uppercase tracking-wider text-[#64748B] mb-1">
            {m.label}
          </div>
          <div className="text-lg font-medium text-[#164E63]">
            {m.value}<span className="text-sm font-normal">{m.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
