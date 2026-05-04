// xm3 - 成都天气应用 V3
import { WeatherProvider, useWeatherContext } from './components/WeatherProvider';
import WeatherPage from './components/WeatherPage';

function AppContent() {
  const { backgroundImage, backgroundLabel } = useWeatherContext();

  return (
    <div
      className="min-h-screen background-fixed transition-all duration-700"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 100%), url(${backgroundImage})`
          : 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <WeatherPage />
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}
