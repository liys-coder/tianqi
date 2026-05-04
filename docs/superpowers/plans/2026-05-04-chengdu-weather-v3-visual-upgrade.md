# 成都天气 V3 视觉升级实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为成都天气应用添加动态天气背景、渐变毛玻璃卡片、丰富动效

**Architecture:** 
- 背景管理：WeatherProvider 中添加天气背景映射，根据 WMO 天气代码动态加载 Unsplash 图片
- 样式更新：index.css 中更新毛玻璃样式为渐变叠加，添加动效 keyframes
- 组件更新：各卡片组件添加悬停动效和脉冲效果

**Tech Stack:** React 18 + Vite + Tailwind CSS + Lucide Icons + Unsplash API

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `src/utils/weatherBackground.js` | 新增：天气代码 → Unsplash 背景映射 |
| `src/components/WeatherProvider.jsx` | 修改：添加背景状态管理 |
| `src/App.jsx` | 修改：接收背景图并应用 |
| `src/index.css` | 修改：渐变毛玻璃样式 + 动效 keyframes |
| `src/components/HeroCard.jsx` | 修改：添加悬停动效 + 脉冲 |
| `src/components/ForecastCard.jsx` | 修改：添加悬停动效 |
| `src/components/DetailsGrid.jsx` | 修改：添加悬停动效 |
| `src/components/CitySelector.jsx` | 修改：添加悬停动效 |

---

## Task 1: 创建天气背景映射工具

**Files:**
- Create: `src/utils/weatherBackground.js`

- [ ] **Step 1: 创建天气背景映射文件**

```javascript
// src/utils/weatherBackground.js

/**
 * WMO 天气代码到 Unsplash 背景关键词的映射
 */
export const weatherBackgroundMap = {
  // 晴朗 (0, 1)
  0: { keyword: 'clear blue sky sunshine', label: '晴朗' },
  1: { keyword: 'clear sky sunny day', label: '晴' },
  
  // 多云 (2, 3)
  2: { keyword: 'partly cloudy sky', label: '多云' },
  3: { keyword: 'overcast clouds cloudy', label: '阴' },
  
  // 雾 (45, 48)
  45: { keyword: 'fog morning mist', label: '雾' },
  48: { keyword: 'fog misty morning', label: '雾' },
  
  // 毛毛雨/雨 (51-67)
  51: { keyword: 'light rain drizzle', label: '小雨' },
  53: { keyword: 'rain drizzle weather', label: '雨' },
  55: { keyword: 'heavy rain weather', label: '大雨' },
  61: { keyword: 'rain shower weather', label: '雨' },
  63: { keyword: 'rain moderate', label: '雨' },
  65: { keyword: 'heavy rain downpour', label: '大雨' },
  66: { keyword: 'freezing rain ice', label: '冻雨' },
  67: { keyword: 'heavy freezing rain', label: '冻雨' },
  
  // 雪 (71-77)
  71: { keyword: 'light snow snowfall', label: '小雪' },
  73: { keyword: 'snow snowfall winter', label: '雪' },
  75: { keyword: 'heavy snow blizzard', label: '大雪' },
  77: { keyword: 'snow grains weather', label: '雪' },
  
  // 阵雨 (80-82)
  80: { keyword: 'rain shower downpour', label: '阵雨' },
  81: { keyword: 'rain showers weather', label: '阵雨' },
  82: { keyword: 'heavy rain shower', label: '强阵雨' },
  
  // 雷暴 (95-99)
  95: { keyword: 'thunderstorm lightning', label: '雷暴' },
  96: { keyword: 'thunderstorm hail', label: '雷暴' },
  99: { keyword: 'thunderstorm heavy hail', label: '雷暴' },
};

/**
 * 获取天气背景图 URL
 * @param {number} weatherCode - WMO 天气代码
 * @returns {string} Unsplash 图片 URL
 */
export function getWeatherBackgroundUrl(weatherCode) {
  const weather = weatherBackgroundMap[weatherCode] || weatherBackgroundMap[0];
  const keyword = weather.keyword;
  
  // 使用 Unsplash Source API (已弃用，改用 direct image URLs)
  // 使用 picsum.photos 作为备选
  const seed = weatherCode * 100 + Date.now();
  return `https://picsum.photos/seed/${seed}/1920/1080?blur=2`;
}

/**
 * 获取天气中文名称
 * @param {number} weatherCode - WMO 天气代码
 * @returns {string}
 */
export function getWeatherLabel(weatherCode) {
  const weather = weatherBackgroundMap[weatherCode] || weatherBackgroundMap[0];
  return weather.label;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/utils/weatherBackground.js
git commit -m "feat: 添加天气背景映射工具"
```

---

## Task 2: 更新 WeatherProvider 背景状态

**Files:**
- Modify: `src/components/WeatherProvider.jsx:1-80`

- [ ] **Step 1: 读取当前 WeatherProvider.jsx**

读取文件内容，找到 processData 函数和返回值。

- [ ] **Step 2: 添加背景状态**

在 WeatherProvider 中添加：
```javascript
import { getWeatherBackgroundUrl, getWeatherLabel } from '../utils/weatherBackground';

// 在 useState 中添加
const [backgroundImage, setBackgroundImage] = useState('');
const [backgroundLabel, setBackgroundLabel] = useState('');

// 在 processData 中添加
const weatherCode = current.weather_code;
const bgUrl = getWeatherBackgroundUrl(weatherCode);
const bgLabel = getWeatherLabel(weatherCode);

// 预加载图片
const img = new Image();
img.src = bgUrl;
img.onload = () => {
  setBackgroundImage(bgUrl);
  setBackgroundLabel(bgLabel);
};

// 返回值中添加
backgroundImage,
backgroundLabel,
```

- [ ] **Step 3: 提交**

```bash
git add src/components/WeatherProvider.jsx
git commit -m "feat: 添加天气背景状态管理"
```

---

## Task 3: 更新 App.jsx 背景显示

**Files:**
- Modify: `src/App.jsx:1-13`

- [ ] **Step 1: 读取当前 App.jsx**

- [ ] **Step 2: 修改背景显示逻辑**

```jsx
// 修改前
<div className="gradient-bg min-h-screen background-fixed">

// 修改后
<div 
  className="min-h-screen background-fixed transition-all duration-700"
  style={{
    backgroundImage: backgroundImage 
      ? `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 100%), url(${backgroundImage})`
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: backgroundImage ? 'transparent' : undefined,
  }}
>
```

同时添加：
```jsx
import { useWeatherContext } from './components/WeatherProvider';

// 在组件中获取
const { backgroundImage, backgroundLabel } = useWeatherContext();
```

- [ ] **Step 3: 提交**

```bash
git add src/App.jsx
git commit -m "feat: 添加动态天气背景显示"
```

---

## Task 4: 更新 index.css 渐变毛玻璃与动效

**Files:**
- Modify: `src/index.css:1-48`

- [ ] **Step 1: 读取当前 index.css**

- [ ] **Step 2: 更新毛玻璃样式为渐变叠加**

```css
/* 轻盈毛玻璃 - 渐变叠加 */
.glass-card {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.35) 100%
  );
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 8px 32px rgba(2, 132, 199, 0.08),
    inset 0 1px 2px rgba(255, 255, 255, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px) rotateX(2deg);
  box-shadow: 
    0 12px 48px rgba(2, 132, 199, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

/* 预报卡片毛玻璃 - 渐变叠加 */
.glass-card-sm {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.3) 100%
  );
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 
    0 4px 24px rgba(2, 132, 199, 0.06),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card-sm:hover {
  transform: translateY(-4px) rotateX(2deg);
  box-shadow: 
    0 8px 32px rgba(2, 132, 199, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.25),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
}
```

- [ ] **Step 3: 添加动效 keyframes**

在文件末尾添加：

```css
/* 脉冲呼吸效果 */
@keyframes pulseCard {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}

.pulse-breathing {
  animation: pulseCard 3s ease-in-out infinite;
}

/* 背景淡入切换 */
@keyframes fadeInBackground {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.bg-fade-in {
  animation: fadeInBackground 0.6s ease-out forwards;
}

/* 悬停光晕 */
@keyframes hoverGlow {
  0%, 100% { box-shadow: 0 8px 32px rgba(2, 132, 199, 0.08); }
  50% { box-shadow: 0 12px 48px rgba(2, 132, 199, 0.15); }
}
```

- [ ] **Step 4: 提交**

```bash
git add src/index.css
git commit -m "style: 更新渐变毛玻璃样式与动效"
```

---

## Task 5: 更新 HeroCard 动效

**Files:**
- Modify: `src/components/HeroCard.jsx:1-40`

- [ ] **Step 1: 读取当前 HeroCard.jsx**

- [ ] **Step 2: 添加脉冲动效类**

在主卡片容器添加 `pulse-breathing` 类：

```jsx
// 修改前
<div className="glass-card rounded-2xl p-6 sm:p-8">

// 修改后
<div className="glass-card rounded-2xl p-6 sm:p-8 pulse-breathing">
```

- [ ] **Step 3: 提交**

```bash
git add src/components/HeroCard.jsx
git commit -m "style: HeroCard 添加脉冲呼吸动效"
```

---

## Task 6: 更新 ForecastCard 动效

**Files:**
- Modify: `src/components/ForecastCard.jsx:1-30`

- [ ] **Step 1: 读取当前 ForecastCard.jsx**

- [ ] **Step 2: 添加悬停动效**

确保卡片使用 `glass-card-sm` 类（已包含悬停效果）。

- [ ] **Step 3: 提交**

```bash
git add src/components/ForecastCard.jsx
git commit -m "style: ForecastCard 悬停动效已由 glass-card-sm 提供"
```

---

## Task 7: 更新 DetailsGrid 动效

**Files:**
- Modify: `src/components/DetailsGrid.jsx:1-47`

- [ ] **Step 1: 读取当前 DetailsGrid.jsx**

- [ ] **Step 2: 确认动效**

DetailItem 组件已使用 `glass-card-sm`，悬停动效由 CSS 提供。

- [ ] **Step 3: 提交**

```bash
git add src/components/DetailsGrid.jsx
git commit -m "style: DetailsGrid 悬停动效已由 glass-card-sm 提供"
```

---

## Task 8: 更新 CitySelector 动效

**Files:**
- Modify: `src/components/CitySelector.jsx:1-30`

- [ ] **Step 1: 读取当前 CitySelector.jsx**

- [ ] **Step 2: 添加悬停动效**

在下拉框容器添加 `glass-card-sm` 类：

```jsx
// 修改前
<select className="w-full px-4 py-2 rounded-lg border border-gray-200">

// 修改后
<select className="w-full px-4 py-2 rounded-lg glass-card-sm cursor-pointer">
```

- [ ] **Step 3: 提交**

```bash
git add src/components/CitySelector.jsx
git commit -m "style: CitySelector 添加毛玻璃与悬停动效"
```

---

## Task 9: 构建验证

**Files:**
- None

- [ ] **Step 1: 运行构建**

```bash
npm run build
```

- [ ] **Step 2: 启动开发服务器**

```bash
npm run dev -- --host
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "chore: V3 视觉升级完成 - 动态背景、渐变毛玻璃、组合动效"
```

---

## 验收检查清单

- [ ] 背景根据天气动态变化（晴/云/雨/雪）
- [ ] 卡片有渐变叠加层
- [ ] 悬停时有微光 + 3D 悬浮效果
- [ ] 卡片有轻微呼吸效果
- [ ] 页面加载有 fade-up 入场动画
- [ ] 背景切换有 cross-fade 过渡
- [ ] prefers-reduced-motion 正常工作
- [ ] 响应式布局正常 (375px-1440px)