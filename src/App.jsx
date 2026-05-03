import { WeatherProvider } from './components/WeatherProvider';
import WeatherPage from './components/WeatherPage';

export default function App() {
  return (
    <div className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #ECFEFF 0%, #A5F3FC 50%, #67E8F9 100%)',
      }}>
      <WeatherProvider>
        <WeatherPage />
      </WeatherProvider>
    </div>
  );
}
