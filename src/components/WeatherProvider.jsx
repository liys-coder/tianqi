import { createContext, useContext, useState } from 'react';
import { useWeather } from '../hooks/useWeather';

const WeatherContext = createContext(null);

const DEFAULT_CITY = { id: 'chengdu', name: '成都', lat: 30.67, lon: 104.07 };

export function WeatherProvider({ children }) {
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const weather = useWeather(currentCity);

  return (
    <WeatherContext.Provider value={{ ...weather, currentCity, setCurrentCity }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
}
