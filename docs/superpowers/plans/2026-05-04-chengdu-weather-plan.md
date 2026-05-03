# Chengdu Weather 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 React + Vite 天气展示单页，通过 Open-Meteo API 获取成都当前天气及 5 日预报，毛玻璃卡片 + 渐变背景 + 现代动效。

**Architecture:** WeatherProvider Context 管理数据获取与状态，纯展示组件消费数据。单一数据流向：fetch → context → components。所有组件无状态逻辑，仅负责渲染。

**Tech Stack:** React 18, Vite, Tailwind CSS v3 (JIT), Lucide React, Inter font (Google Fonts)

---

## 文件结构总览

```
src/
  main.jsx                          # Vite 入口
  App.jsx                           # 全局布局 + 渐变背景 + WeatherProvider
  index.css                         # Tailwind 指令 + 自定义动画 + Google Fonts
  components/
    WeatherProvider.jsx             # Context: fetch 天气数据，管理 loading/error/data
    WeatherPage.jsx                 # 组装 CityHeader + HeroCard + ForecastStrip
    CityHeader.jsx                  # 城市名 + 日期 + 更新时间
    HeroCard.jsx                    # 主卡片容器：图标 + 温度 + MetricsBar
    MetricsBar.jsx                  # 横向指标：体感/湿度/风速
    WeatherIcon.jsx                 # 天气代码 → Lucide SVG 图标
    ForecastStrip.jsx               # 5 日预报容器
    ForecastCard.jsx                # 单日预报卡片
    LoadingSkeleton.jsx             # Shimmer 加载占位
    ErrorDisplay.jsx                # 错误提示 + 重试按钮
  hooks/
    useWeather.js                   # fetch + state reducer hook
  utils/
    weatherMapping.js               # WMO code → 图标名 + 中文描述
    formatters.js                   # 日期格式化（星期几）
```

### 数据接口

```js
// useWeather 返回的状态结构
{
  data: {
    current: { temp, humidity, windSpeed, feelsLike, weatherCode },
    daily: [{ date, weatherCode, tempMax, tempMin }, ...]  // 5 条
  },
  loading: boolean,
  error: string | null,
  refresh: () => void
}
```

---

### Task 1: 项目脚手架

**Files:**
- Create: `E:\VS_projects\xm3\package.json`
- Create: `E:\VS_projects\xm3\vite.config.js`
- Create: `E:\VS_projects\xm3\tailwind.config.js`
- Create: `E:\VS_projects\xm3\postcss.config.js`
- Create: `E:\VS_projects\xm3\index.html`
- Create: `E:\VS_projects\xm3\src\main.jsx`
- Create: `E:\VS_projects\xm3\src\index.css`

- [ ] **Step 1: 初始化项目并安装依赖**

```bash
cd E:\VS_projects\xm3
npm create vite@latest . -- --template react
npm install
npm install tailwindcss@3 postcss autoprefixer lucide-react
npx tailwindcss init -p
```

- [ ] **Step 2: 配置 Tailwind**

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: 入口文件**

`index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>成都天气</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body class="min-h-screen">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

`src/main.jsx`:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: 验证脚手架可运行**

Run: `npm run dev`
Expected: Vite dev server 启动，空白页面无报错。

- [ ] **Step 5: 提交**

```bash
git init
git add -A
git commit -m "chore: scaffold Vite + React + Tailwind project"
```

---

### Task 2: 工具函数

**Files:**
- Create: `E:\VS_projects\xm3\src\utils\weatherMapping.js`
- Create: `E:\VS_projects\xm3\src\utils\formatters.js`

- [ ] **Step 1: 天气代码映射**

`src/utils/weatherMapping.js`:
```js
// WMO Weather interpretation codes → Lucide icon name + Chinese description
const WEATHER_MAP = {
  0:  { icon: 'Sun',         description: '晴朗',   color: '#F59E0B' },
  1:  { icon: 'Sun',         description: '大部晴',   color: '#F59E0B' },
  2:  { icon: 'CloudSun',    description: '少云',   color: '#64748B' },
  3:  { icon: 'Cloud',       description: '多云',   color: '#94A3B8' },
  45: { icon: 'CloudFog',    description: '雾',     color: '#94A3B8' },
  48: { icon: 'CloudFog',    description: '雾凇',   color: '#94A3B8' },
  51: { icon: 'CloudDrizzle',description: '小毛毛雨', color: '#38BDF8' },
  53: { icon: 'CloudDrizzle',description: '毛毛雨',   color: '#38BDF8' },
  55: { icon: 'CloudDrizzle',description: '大毛毛雨', color: '#38BDF8' },
  61: { icon: 'CloudRain',   description: '小雨',   color: '#0284C7' },
  63: { icon: 'CloudRain',   description: '中雨',   color: '#0284C7' },
  65: { icon: 'CloudRain',   description: '大雨',   color: '#0369A1' },
  71: { icon: 'CloudSnow',   description: '小雪',   color: '#F1F5F9' },
  73: { icon: 'CloudSnow',   description: '中雪',   color: '#E2E8F0' },
  75: { icon: 'CloudSnow',   description: '大雪',   color: '#CBD5E1' },
  77: { icon: 'CloudSnow',   description: '雪粒',   color: '#F1F5F9' },
  80: { icon: 'CloudRain',   description: '阵雨',   color: '#38BDF8' },
  81: { icon: 'CloudRain',   description: '大阵雨',   color: '#0284C7' },
  82: { icon: 'CloudRain',   description: '暴阵雨',   color: '#0369A1' },
  85: { icon: 'CloudSnow',   description: '小阵雪',   color: '#F1F5F9' },
  86: { icon: 'CloudSnow',   description: '大阵雪',   color: '#E2E8F0' },
  95: { icon: 'CloudLightning', description: '雷暴',   color: '#6B21A8' },
  96: { icon: 'CloudLightning', description: '雷暴+小雹', color: '#7C3AED' },
  99: { icon: 'CloudLightning', description: '雷暴+大雹', color: '#581C87' },
};

export function getWeatherInfo(code) {
  return WEATHER_MAP[code] || { icon: 'Cloud', description: '未知', color: '#94A3B8' };
}
```

- [ ] **Step 2: 日期格式化**

`src/utils/formatters.js`:
```js
const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function getDayName(dateString) {
  const date = new Date(dateString);
  return DAY_NAMES[date.getDay()];
}

export function getTodayString() {
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${dayName} · ${month}月${day}日`;
}

export function getTimeString() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}
```

- [ ] **Step 3: 验证工具函数**

Run: `node -e "const {getWeatherInfo} = require('./src/utils/weatherMapping.js'); console.log(getWeatherInfo(0));"` (先做 ESM 转换或用 vite 间接测试)

- [ ] **Step 4: 提交**

```bash
git add src/utils/
git commit -m "feat: add weather mapping and date formatters"
```

---

### Task 3: useWeather Hook

**Files:**
- Create: `E:\VS_projects\xm3\src\hooks\useWeather.js`

- [ ] **Step 1: 编写 useWeather hook**

`src/hooks/useWeather.js`:
```js
import { useState, useEffect, useCallback } from 'react';

const LAT = 30.67;
const LON = 104.07;
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FShanghai&forecast_days=6`;

export function useWeather() {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const fetchWeather = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const data = {
        current: {
          temp: Math.round(json.current.temperature_2m),
          humidity: json.current.relative_humidity_2m,
          windSpeed: Math.round(json.current.wind_speed_10m),
          feelsLike: Math.round(json.current.apparent_temperature),
          weatherCode: json.current.weather_code,
        },
        daily: json.daily.time.slice(1, 6).map((date, i) => ({
          date,
          weatherCode: json.daily.weather_code[i + 1],
          tempMax: Math.round(json.daily.temperature_2m_max[i + 1]),
          tempMin: Math.round(json.daily.temperature_2m_min[i + 1]),
          precipSum: json.daily.precipitation_sum[i + 1],
        })),
        updatedAt: new Date().toISOString(),
      };

      setState({ data, loading: false, error: null });
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message || '获取天气失败' }));
    }
  }, []);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  return { ...state, refresh: fetchWeather };
}
```

- [ ] **Step 2: 提交**

```bash
git add src/hooks/
git commit -m "feat: add useWeather hook with Open-Meteo API"
```

---

### Task 4: 纯展示组件（一）：WeatherIcon, LoadingSkeleton, ErrorDisplay

**Files:**
- Create: `E:\VS_projects\xm3\src\components\WeatherIcon.jsx`
- Create: `E:\VS_projects\xm3\src\components\LoadingSkeleton.jsx`
- Create: `E:\VS_projects\xm3\src\components\ErrorDisplay.jsx`

- [ ] **Step 1: WeatherIcon 组件**

`src/components/WeatherIcon.jsx`:
```jsx
import * as Icons from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherMapping';

export default function WeatherIcon({ code, size = 48, className = '' }) {
  const info = getWeatherInfo(code);
  const LucideIcon = Icons[info.icon] || Icons.Cloud;

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size + 16,
        height: size + 16,
        background: `radial-gradient(circle at 50% 40%, ${info.color}55, ${info.color}15)`,
      }}
    >
      <LucideIcon size={size} color={info.color} strokeWidth={1.5} />
    </div>
  );
}
```

- [ ] **Step 2: LoadingSkeleton 组件**

`src/components/LoadingSkeleton.jsx`:
```jsx
export default function LoadingSkeleton() {
  return (
    <div className="px-6 md:px-12 lg:px-24 py-12 space-y-6 animate-fade-up">
      {/* City header skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-32 rounded bg-white/40 animate-shimmer" style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
          backgroundSize: '200% 100%',
        }} />
        <div className="h-4 w-48 rounded bg-white/30 animate-shimmer" style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
          backgroundSize: '200% 100%',
        }} />
      </div>
      {/* Hero card skeleton */}
      <div className="rounded-3xl bg-white/30 backdrop-blur-[20px] border border-white/50 p-8 space-y-4">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/40 animate-shimmer" style={{
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
            backgroundSize: '200% 100%',
          }} />
          <div className="space-y-2">
            <div className="h-16 w-32 rounded bg-white/40 animate-shimmer" style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
              backgroundSize: '200% 100%',
            }} />
            <div className="h-5 w-24 rounded bg-white/30 animate-shimmer" style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
              backgroundSize: '200% 100%',
            }} />
          </div>
        </div>
      </div>
      {/* Forecast skeleton */}
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 min-w-[100px] rounded-2xl bg-white/30 backdrop-blur-[12px] border border-white/40 p-4 h-32 animate-shimmer" style={{
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
            backgroundSize: '200% 100%',
          }} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: ErrorDisplay 组件**

`src/components/ErrorDisplay.jsx`:
```jsx
export default function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-6">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p className="text-red-700 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 rounded-full bg-[#0891B2] text-white text-sm font-medium cursor-pointer
          hover:bg-[#0E7490] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/40"
      >
        重新获取
      </button>
    </div>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/WeatherIcon.jsx src/components/LoadingSkeleton.jsx src/components/ErrorDisplay.jsx
git commit -m "feat: add WeatherIcon, LoadingSkeleton, ErrorDisplay components"
```

---

### Task 5: 纯展示组件（二）：CityHeader, MetricsBar, ForecastCard

**Files:**
- Create: `E:\VS_projects\xm3\src\components\CityHeader.jsx`
- Create: `E:\VS_projects\xm3\src\components\MetricsBar.jsx`
- Create: `E:\VS_projects\xm3\src\components\ForecastCard.jsx`

- [ ] **Step 1: CityHeader 组件**

`src/components/CityHeader.jsx`:
```jsx
import { getTodayString } from '../utils/formatters';

export default function CityHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-[#0E7490] mb-1">
        成都 · Chengdu
      </h1>
      <p className="text-sm text-[#155E75]/70">{getTodayString()}</p>
    </div>
  );
}
```

- [ ] **Step 2: MetricsBar 组件**

`src/components/MetricsBar.jsx`:
```jsx
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
```

- [ ] **Step 3: ForecastCard 组件**

`src/components/ForecastCard.jsx`:
```jsx
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherMapping';
import { getDayName } from '../utils/formatters';

export default function ForecastCard({ data, index }) {
  const info = getWeatherInfo(data.weatherCode);

  return (
    <div
      className="flex-1 min-w-[100px] rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3 cursor-pointer
        bg-white/45 backdrop-blur-[12px] border border-white/60
        hover:-translate-y-1 hover:shadow-lg hover:bg-white/55
        transition-all duration-200 ease-out animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'backwards' }}
    >
      <span className="text-xs font-semibold text-[#0E7490]">{getDayName(data.date)}</span>
      <WeatherIcon code={data.weatherCode} size={28} />
      <div className="flex gap-2 items-baseline">
        <span className="text-base font-semibold text-[#164E63]">{data.tempMax}°</span>
        <span className="text-xs text-[#94A3B8]">{data.tempMin}°</span>
      </div>
      <span className="text-[0.65rem] text-[#94A3B8] -mt-1">{info.description}</span>
    </div>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/CityHeader.jsx src/components/MetricsBar.jsx src/components/ForecastCard.jsx
git commit -m "feat: add CityHeader, MetricsBar, ForecastCard components"
```

---

### Task 6: 组合组件：HeroCard, ForecastStrip, WeatherProvider, WeatherPage

**Files:**
- Create: `E:\VS_projects\xm3\src\components\HeroCard.jsx`
- Create: `E:\VS_projects\xm3\src\components\ForecastStrip.jsx`
- Create: `E:\VS_projects\xm3\src\components\WeatherProvider.jsx`
- Create: `E:\VS_projects\xm3\src\components\WeatherPage.jsx`

- [ ] **Step 1: HeroCard 组件**

`src/components/HeroCard.jsx`:
```jsx
import WeatherIcon from './WeatherIcon';
import MetricsBar from './MetricsBar';
import { getWeatherInfo } from '../utils/weatherMapping';

export default function HeroCard({ current }) {
  const info = getWeatherInfo(current.weatherCode);

  return (
    <div className="rounded-3xl p-6 md:p-8 mb-6 animate-fade-up
      bg-white/55 backdrop-blur-[20px] border border-white/70 shadow-lg shadow-[#0891B2]/8">
      <div className="flex items-center gap-5 md:gap-6 flex-wrap">
        <WeatherIcon code={current.weatherCode} size={56} />
        <div className="flex-1 min-w-[140px]">
          <div className="text-6xl md:text-7xl font-light text-[#164E63] leading-none tracking-tight">
            {current.temp}°
          </div>
          <p className="text-base md:text-lg text-[#0E7490] mt-1">{info.description}</p>
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

- [ ] **Step 2: ForecastStrip 组件**

`src/components/ForecastStrip.jsx`:
```jsx
import ForecastCard from './ForecastCard';

export default function ForecastStrip({ daily }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {daily.map((day, i) => (
        <ForecastCard key={day.date} data={day} index={i} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: WeatherProvider 组件**

`src/components/WeatherProvider.jsx`:
```jsx
import { createContext, useContext } from 'react';
import { useWeather } from '../hooks/useWeather';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const weather = useWeather();
  return (
    <WeatherContext.Provider value={weather}>
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

- [ ] **Step 4: WeatherPage 组件**

`src/components/WeatherPage.jsx`:
```jsx
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
```

- [ ] **Step 5: 提交**

```bash
git add src/components/HeroCard.jsx src/components/ForecastStrip.jsx src/components/WeatherProvider.jsx src/components/WeatherPage.jsx
git commit -m "feat: add composite components: HeroCard, ForecastStrip, WeatherProvider, WeatherPage"
```

---

### Task 7: App 入口 + 全局样式 + 验证

**Files:**
- Create: `E:\VS_projects\xm3\src\App.jsx`
- Modify: `E:\VS_projects\xm3\src\index.css` (追加全局样式)

- [ ] **Step 1: App 组件**

`src/App.jsx`:
```jsx
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
```

- [ ] **Step 2: 追加全局样式到 index.css**

在 `src/index.css` 末尾追加：
```css
/* Shimmer animation for skeletons */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

- [ ] **Step 3: 运行项目验证**

Run: `npm run dev`
Expected: 浏览器打开显示成都天气，毛玻璃卡片 + 渐变背景 + 5 日预报。

检查项：
- [x] 渐变背景可见 (#ECFEFF → #67E8F9)
- [x] 主卡片毛玻璃效果 (backdrop-blur)
- [x] 温度大字 Inter font-weight 300
- [x] 5 日预报卡片横向排列
- [x] 加载时 shimmer 效果
- [x] 卡片 hover 上浮 4px
- [x] 入场 fade-up 动画
- [x] 响应式：移动端预报换行

- [ ] **Step 4: 提交**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: integrate App entry and finalize global styles"
```
