// xm3 - 成都天气应用 V2
import { WeatherProvider } from './components/WeatherProvider';
import WeatherPage from './components/WeatherPage';

export default function App() {
  return (
    <div className="gradient-bg min-h-screen background-fixed">
      <WeatherProvider>
        <WeatherPage />
      </WeatherProvider>
    </div>
  );
}
