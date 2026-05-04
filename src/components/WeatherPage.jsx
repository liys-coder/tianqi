import { useWeatherContext } from './WeatherProvider';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import CityHeader from './CityHeader';
import CitySelector from './CitySelector';
import HeroCard from './HeroCard';
import HourlyStrip from './HourlyStrip';
import ForecastStrip from './ForecastStrip';
import DetailsGrid from './DetailsGrid';

export default function WeatherPage() {
  const { data, loading, error, refresh, currentCity, setCurrentCity } = useWeatherContext();

  // 城市切换 - 使用 SPA 方式更新 Context，无整页刷新
  const handleCityChange = (city) => {
    setCurrentCity(city);
    // 可选：更新 URL 参数但不刷新页面
    const url = new URL(window.location.href);
    if (url.searchParams.get('city') !== city.id) {
      window.history.replaceState({}, '', `?city=${city.id}`);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} onRetry={refresh} />;
  if (!data) return null;

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-6 sm:py-8 md:py-12 max-w-4xl mx-auto">
      <CitySelector currentCity={currentCity} onCityChange={handleCityChange} />
      <CityHeader />
      <HeroCard current={data.current} />
      <HourlyStrip hourly={data.hourly} />
      <ForecastStrip daily={data.daily} />
      <DetailsGrid daily={data.daily} />
    </div>
  );
}
