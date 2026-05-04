import { useWeatherContext } from './WeatherProvider';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import CityHeader from './CityHeader';
import CitySelector from './CitySelector';
import HeroCard from './HeroCard';
import ForecastStrip from './ForecastStrip';
import DetailsGrid from './DetailsGrid';

export default function WeatherPage() {
  const { data, loading, error, refresh, currentCity, setCurrentCity } = useWeatherContext();

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} onRetry={refresh} />;
  if (!data) return null;

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-6 sm:py-8 md:py-12 max-w-4xl mx-auto">
      <CitySelector currentCity={currentCity} onCityChange={setCurrentCity} />
      <CityHeader />
      <HeroCard current={data.current} />
      <ForecastStrip daily={data.daily} />
      <DetailsGrid daily={data.daily} />
    </div>
  );
}
