import { useWeatherContext } from './WeatherProvider';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import CityHeader from './CityHeader';
import HeroCard from './HeroCard';
import ForecastStrip from './ForecastStrip';

export default function WeatherPage() {
  const { data, loading, error, refresh } = useWeatherContext();

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} onRetry={refresh} />;
  if (!data) return null;

  return (
    <div className="px-6 md:px-12 lg:px-24 py-12">
      <CityHeader />
      <HeroCard current={data.current} />
      <ForecastStrip daily={data.daily} />
    </div>
  );
}
