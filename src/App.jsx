// xm3 - 成都天气应用 V3
import { lazy, Suspense } from 'react';
import { WeatherProvider, useWeatherContext } from './components/WeatherProvider';

// 懒加载页面组件
const WeatherPage = lazy(() => import('./components/WeatherPage'));

// 加载骨架屏
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-cyan-200 rounded-full"></div>
        <div className="w-32 h-4 bg-cyan-100 rounded"></div>
      </div>
    </div>
  );
}

function AppContent() {
  const { backgroundImage } = useWeatherContext();

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
      <Suspense fallback={<LoadingFallback />}>
        <WeatherPage />
      </Suspense>
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