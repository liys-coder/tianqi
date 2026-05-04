# 成都天气应用 V3 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 升级天气应用为现代极简风格，增强毛玻璃效果，添加丰富动效，增加详细数据指标网格

**Architecture:** 
- 扩展 API 获取 UV、气压、日出日落、能见度、云量数据
- 新增 DetailsGrid 组件展示详细指标
- 优化 CSS 动效和毛玻璃质感

**Tech Stack:** React 18 + Vite + Tailwind CSS + Lucide Icons

---

### Task 1: 扩展 API 数据获取

**Files:**
- Modify: `src/hooks/useWeather.js:1-30`
- Modify: `src/components/WeatherProvider.jsx:1-50`

- [ ] **Step 1: 更新 useWeather.js API 参数**

读取 `src/hooks/useWeather.js`，在 API URL 中添加额外参数：

```javascript
const params = new URLSearchParams({
  latitude: city.lat,
  longitude: city.lon,
  current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
  daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,visibility_mean,cloud_cover_mean,surface_pressure_mean',
  timezone: 'Asia/Shanghai',
});
```

- [ ] **Step 2: 更新 WeatherProvider 数据处理**

读取 `src/components/WeatherProvider.jsx`，在 `processData` 函数中添加：

```javascript
const processed = {
  current: {
    temp: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    feelsLike: Math.round(data.current.apparent_temperature),
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
  },
  daily: data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    uvIndex: Math.round(data.daily.uv_index_max[i] * 10) / 10,
    sunrise: data.daily.sunrise[i]?.slice(11, 16) || '--:--',
    sunset: data.daily.sunset[i]?.slice(11, 16) || '--:--',
    visibility: Math.round(data.daily.visibility_mean[i] / 1000 * 10) / 10,
    cloudCover: data.daily.cloud_cover_mean[i],
    pressure: Math.round(data.daily.surface_pressure_mean[i]),
  })),
};
```

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useWeather.js src/components/WeatherProvider.jsx
git commit -m "feat: 扩展 API 获取 UV、气压、日出日落、能见度、云量数据"
```

---

### Task 2: 创建详细指标网格组件

**Files:**
- Create: `src/components/DetailsGrid.jsx`
- Modify: `src/components/WeatherPage.jsx:1-24`

- [ ] **Step 1: 创建 DetailsGrid.jsx**

创建 `src/components/DetailsGrid.jsx`：

```jsx
import { Sun, Sunset, Eye, Cloud, Gauge, SunMedium } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value, unit }) => (
  <div className="glass-card-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0284C7]/10 flex items-center justify-center">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0284C7]" />
    </div>
    <div>
      <p className="text-xs sm:text-sm text-[#64748B]">{label}</p>
      <p className="text-lg sm:text-xl font-semibold text-[#0F172A]">
        {value}<span className="text-sm font-normal text-[#64748B]">{unit}</span>
      </p>
    </div>
  </div>
);

export default function DetailsGrid({ daily }) {
  const today = daily[0] || {};
  
  const details = [
    { icon: SunMedium, label: '紫外线指数', value: today.uvIndex || '--', unit: '' },
    { icon: Eye, label: '能见度', value: today.visibility || '--', unit: ' km' },
    { icon: Gauge, label: '气压', value: today.pressure || '--', unit: ' hPa' },
    { icon: Sun, label: '日出', value: today.sunrise || '--:--', unit: '' },
    { icon: Sunset, label: '日落', value: today.sunset || '--:--', unit: '' },
    { icon: Cloud, label: '云量', value: today.cloudCover || '--', unit: '%' },
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] mb-3 sm:mb-4">
        详细数据
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {details.map((item, index) => (
          <div 
            key={item.label} 
            className="animate-fade-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <DetailItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 更新 WeatherPage 引入组件**

读取 `src/components/WeatherPage.jsx`，在 import 中添加：

```jsx
import DetailsGrid from './DetailsGrid';
```

在组件 return 中添加：

```jsx
<DetailsGrid daily={data.daily} />
```

- [ ] **Step 3: 提交**

```bash
git add src/components/DetailsGrid.jsx src/components/WeatherPage.jsx
git commit -m "feat: 添加详细数据指标网格组件"
```

---

### Task 3: 优化毛玻璃样式与动效

**Files:**
- Modify: `src/index.css:1-48`
- Modify: `tailwind.config.js:1-24`

- [ ] **Step 1: 更新 index.css 轻盈毛玻璃**

读取 `src/index.css`，替换毛玻璃样式：

```css
/* 轻盈毛玻璃 */
.glass-card {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 8px 32px rgba(2, 132, 199, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.6);
}

/* 预报卡片毛玻璃 */
.glass-card-sm {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 
    0 4px 24px rgba(2, 132, 199, 0.06),
    inset 0 1px 1px rgba(255, 255, 255, 0.5);
}
```

- [ ] **Step 2: 更新 tailwind.config.js 动效**

读取 `tailwind.config.js`，添加 stagger 动画：

```javascript
animation: {
  'shimmer': 'shimmer 1.5s ease-in-out infinite',
  'fade-up': 'fadeUp 0.4s ease-out forwards',
  'fade-in-scale': 'fadeInScale 0.5s ease-out forwards',
  'float': 'float 6s ease-in-out infinite',
  'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
  'fade-up': 'fadeUp 0.5s ease-out forwards',
},
keyframes: {
  shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
  fadeUp: { 
    '0%': { opacity: '0', transform: 'translateY(20px)' }, 
    '100%': { opacity: '1', transform: 'translateY(0)' } 
  },
  fadeInScale: { 
    '0%': { opacity: '0', transform: 'scale(0.95)' }, 
    '100%': { opacity: '1', transform: 'scale(1)' } 
  },
  float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
  pulseSubtle: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
},
```

- [ ] **Step 3: 提交**

```bash
git add src/index.css tailwind.config.js
git commit -m "style: 优化轻盈毛玻璃效果与动效"
```

---

### Task 4: 构建验证

**Files:**
- (none)

- [ ] **Step 1: 运行构建**

```bash
npm run build
```

- [ ] **Step 2: 启动开发服务器验证**

```bash
npm run dev -- --host
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "chore: V3 视觉与功能升级完成"
```

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-04-chengdu-weather-v3-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**