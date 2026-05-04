# 天气应用 V2 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 升级毛玻璃效果、添加现代动效、增加重庆天气、完整手机适配

**Architecture:** 在现有 React + Vite + Tailwind 基础上进行增量开发，保持组件化架构

**Tech Stack:** React 18, Vite, Tailwind CSS, Lucide React

---

## 文件结构

| 文件 | 用途 |
|------|------|
| `src/App.jsx` | 主应用，添加城市切换状态 |
| `src/hooks/useWeather.js` | 修改支持多城市参数 |
| `src/components/CitySelector.jsx` | 新增城市选择器组件 |
| `src/components/WeatherPage.jsx` | 响应式布局调整 |
| `src/components/HeroCard.jsx` | 毛玻璃增强 + 动效 |
| `src/components/ForecastCard.jsx` | 动效增强 |
| `src/index.css` | 添加新动画 keyframes |
| `tailwind.config.js` | 扩展动画配置 |

---

## 实现任务

### Task 1: 视觉升级 — 毛玻璃增强 + 动效 + 主题

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`
- Modify: `src/components/HeroCard.jsx`
- Modify: `src/components/ForecastCard.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: 更新 Tailwind 配置，添加新动画**

```javascript
// tailwind.config.js 修改
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInScale: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseSubtle: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: 更新 index.css，添加背景动画和全局样式**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }

/* 背景渐变光晕动画 */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gradient-bg {
  background: linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%);
  background-size: 200% 200%;
  animation: gradientShift 20s ease infinite;
}

/* 毛玻璃增强 */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 8px 30px rgba(8, 145, 178, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

/* 预报卡片毛玻璃 */
.glass-card-sm {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 
    0 4px 20px rgba(8, 145, 178, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: 更新 App.jsx，使用新背景样式**

```jsx
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
```

- [ ] **Step 4: 更新 HeroCard，增强毛玻璃效果和动效**

```jsx
import WeatherIcon from './WeatherIcon';
import MetricsBar from './MetricsBar';
import { getWeatherInfo } from '../utils/weatherMapping';

export default function HeroCard({ current }) {
  const info = getWeatherInfo(current.weatherCode);

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 animate-fade-in-scale shadow-lg">
      <div className="flex items-center gap-3 sm:gap-5 md:gap-6 flex-wrap">
        <WeatherIcon code={current.weatherCode} size={48} sm:size={56} />
        <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
          <div className="text-5xl sm:text-6xl md:text-7xl font-light text-[#0C4A6E] leading-none tracking-tight animate-pulse-subtle">
            {current.temp}°
          </div>
          <p className="text-base md:text-lg text-[#0891B2] mt-1">{info.description}</p>
          <p className="text-sm text-[#64748B]">体感 {current.feelsLike}°</p>
        </div>
      </div>
      <MetricsBar
        feelsLike={current.feelsLike}
        humidity={current.humidity}
        windSpeed={current.windSpeed}
      />
    </div>
  );
}
```

- [ ] **Step 5: 更新 ForecastCard，添加动效**

```jsx
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherMapping';
import { formatDay } from '../utils/formatters';

export default function ForecastCard({ data, index }) {
  const info = getWeatherInfo(data.weatherCode);
  const dayLabel = formatDay(data.date);

  return (
    <div 
      className="glass-card-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex-1 min-w-[100px] sm:min-w-[120px] text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <p className="text-xs sm:text-sm text-[#64748B] font-medium mb-2">{dayLabel}</p>
      <div className="flex justify-center mb-2">
        <WeatherIcon code={data.weatherCode} size={28} sm:size={32} />
      </div>
      <div className="flex justify-center gap-2 text-sm">
        <span className="text-[#0C4A6E] font-semibold">{data.tempMax}°</span>
        <span className="text-[#94A3B8]">{data.tempMin}°</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 提交更改**

```bash
git add src/index.css tailwind.config.js src/App.jsx src/components/HeroCard.jsx src/components/ForecastCard.jsx
git commit -m "feat: 升级毛玻璃效果和动效"
```

---

### Task 2: 城市切换 — 添加城市选择器 + 多城市支持

**Files:**
- Create: `src/components/CitySelector.jsx`
- Modify: `src/hooks/useWeather.js`
- Modify: `src/components/WeatherPage.jsx`

- [ ] **Step 1: 创建城市选择器组件**

```jsx
import { MapPin } from 'lucide-react';

const CITIES = [
  { id: 'chengdu', name: '成都', lat: 30.67, lon: 104.07 },
  { id: 'chongqing', name: '重庆', lat: 29.57, lon: 106.55 },
];

export default function CitySelector({ currentCity, onCityChange }) {
  return (
    <div className="flex items-center gap-2 mb-4 sm:mb-6">
      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0891B2]" />
      <div className="flex gap-1 sm:gap-2">
        {CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => onCityChange(city)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
              currentCity.id === city.id
                ? 'bg-[#0891B2] text-white shadow-md'
                : 'bg-white/50 text-[#64748B] hover:bg-white/70'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CITIES };
```

- [ ] **Step 2: 更新 useWeather hook 支持城市参数**

```jsx
import { useState, useEffect, useCallback } from 'react';

const DEFAULT_CITY = { lat: 30.67, lon: 104.07 };

function buildApiUrl(city = DEFAULT_CITY) {
  const { lat, lon } = city;
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FShanghai&forecast_days=6`;
}

export function useWeather(city = DEFAULT_CITY) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetchWeather = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(buildApiUrl(city));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!json.current || !json.daily) {
        throw new Error('API 返回数据格式异常');
      }

      const data = {
        current: {
          temp: Math.round(json.current.temperature_2m ?? 0),
          humidity: json.current.relative_humidity_2m ?? 0,
          windSpeed: Math.round(json.current.wind_speed_10m ?? 0),
          feelsLike: Math.round(json.current.apparent_temperature ?? 0),
          weatherCode: json.current.weather_code ?? 0,
        },
        daily: (json.daily.time?.slice(1, 6) ?? []).map((date, i) => ({
          date,
          weatherCode: json.daily.weather_code?.[i + 1] ?? 0,
          tempMax: Math.round(json.daily.temperature_2m_max?.[i + 1] ?? 0),
          tempMin: Math.round(json.daily.temperature_2m_min?.[i + 1] ?? 0),
          precipSum: json.daily.precipitation_sum?.[i + 1] ?? 0,
        })),
        updatedAt: new Date().toISOString(),
        cityId: city.id,
      };

      setState({ data, loading: false, error: null });
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message || '获取天气失败' }));
    }
  }, [city]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  return { ...state, refresh: fetchWeather };
}
```

- [ ] **Step 3: 更新 WeatherProvider 支持城市参数**

```jsx
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
```

- [ ] **Step 4: 更新 WeatherPage 添加城市选择器**

```jsx
import { useWeatherContext } from './WeatherProvider';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import CityHeader from './CityHeader';
import CitySelector from './CitySelector';
import HeroCard from './HeroCard';
import ForecastStrip from './ForecastStrip';

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
    </div>
  );
}
```

- [ ] **Step 5: 提交更改**

```bash
git add src/components/CitySelector.jsx src/hooks/useWeather.js src/components/WeatherProvider.jsx src/components/WeatherPage.jsx
git commit -m "feat: 添加城市切换功能（成都/重庆）"
```

---

### Task 3: 手机适配 — 完整响应式 + 触摸优化

**Files:**
- Modify: `src/components/CitySelector.jsx`
- Modify: `src/components/CityHeader.jsx`
- Modify: `src/components/MetricsBar.jsx`
- Modify: `src/components/ForecastStrip.jsx`

- [ ] **Step 1: 优化 CityHeader 响应式**

```jsx
import { formatDate } from '../utils/formatters';

export default function CityHeader() {
  const now = new Date();
  const dateStr = formatDate(now);

  return (
    <div className="mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0C4A6E]">
        天气预报
      </h1>
      <p className="text-sm sm:text-base text-[#64748B] mt-1">
        {dateStr}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: 优化 MetricsBar 响应式**

```jsx
import { Droplets, Wind, Thermometer } from 'lucide-react';

export default function MetricsBar({ feelsLike, humidity, windSpeed }) {
  const metrics = [
    { icon: Thermometer, label: '体感', value: `${feelsLike}°` },
    { icon: Droplets, label: '湿度', value: `${humidity}%` },
    { icon: Wind, label: '风速', value: `${windSpeed}km/h` },
  ];

  return (
    <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4">
      {metrics.map((item, i) => (
        <div 
          key={i}
          className="flex items-center gap-2 bg-white/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px]"
        >
          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0891B2]" />
          <span className="text-xs sm:text-sm text-[#64748B]">{item.label}</span>
          <span className="text-sm sm:text-base text-[#0C4A6E] font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: 优化 ForecastStrip 移动端滚动**

```jsx
import ForecastCard from './ForecastCard';

export default function ForecastStrip({ daily }) {
  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-lg sm:text-xl font-semibold text-[#0C4A6E] mb-3 sm:mb-4">
        5 日预报
      </h2>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {daily.map((day, i) => (
          <ForecastCard key={day.date} data={day} index={i} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 提交更改**

```bash
git add src/components/CityHeader.jsx src/components/MetricsBar.jsx src/components/ForecastStrip.jsx
git commit -m "feat: 优化手机端响应式适配"
```

---

### Task 4: 整合测试

**Files:**
- Run: `npm run build`
- Test: 浏览器测试

- [ ] **Step 1: 运行构建检查**

```bash
npm run build
```

Expected: 构建成功，无错误

- [ ] **Step 2: 启动开发服务器测试**

```bash
npm run dev
```

Expected: 页面正常加载，城市切换功能正常

- [ ] **Step 3: 提交最终更改**

```bash
git add -A
git commit -m "feat: V2 升级 - 毛玻璃增强、动效、重庆天气、手机适配"
```

---

## 计划完成

**Plan complete and saved to `docs/superpowers/plans/2026-05-04-weather-v2-plan.md`.**

**两个执行选项：**

1. **Subagent-Driven (推荐)** — 每个任务由独立子代理执行，快速迭代
2. **Inline Execution** — 在当前会话中执行任务，带检查点

您想选择哪种方式？