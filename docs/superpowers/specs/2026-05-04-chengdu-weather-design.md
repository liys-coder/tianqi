# Chengdu Weather — 设计规格

**日期：** 2026-05-04
**状态：** 待审核
**技术栈：** React 18 + Vite + Tailwind CSS

---

## 1. 项目概述

一个中等体量、浅色调、简洁的成都天气展示单页应用。通过 Open-Meteo API 获取成都当前天气及 5 日预报，采用毛玻璃（Glassmorphism）卡片设计，渐变色背景，现代入场动效。

## 2. 数据来源

| 项目 | 值 |
|------|-----|
| API | Open-Meteo (免费，无需 Key) |
| 天气接口 | `https://api.open-meteo.com/v1/forecast` |
| 成都坐标 | lat=30.67, lon=104.07 |
| 数据字段 | `current`: temperature_2m, relative_humidity_2m, weather_code, wind_speed_10m, apparent_temperature |
| | `daily`: weather_code, temperature_2m_max, temperature_2m_min, precipitation_sum |
| | `timezone`: Asia/Shanghai, `forecast_days`: 6 |

## 3. 视觉设计

### 3.1 配色

| 角色 | Hex | 用途 |
|------|-----|------|
| Primary | #0891B2 | 强调色、链接、图标高亮 |
| Secondary | #22D3EE | 渐变过渡色 |
| Background | 渐变 `#ECFEFF → #A5F3FC → #67E8F9` | 页面全屏背景 |
| Text Dark | #164E63 | 主要文字（温度大字、标题） |
| Text Muted | #64748B / #94A3B8 | 次要文字（标签、日期） |
| Card BG | rgba(255,255,255,0.55) | 主卡片毛玻璃底色 |
| Card Border | rgba(255,255,255,0.7) | 卡片边框 |

### 3.2 字体

- 字体族：Inter，Google Fonts 加载
- 字重：300(温度大字) / 400(正文) / 500(标签) / 600(标题/最高温)
- 温度数字使用 `font-weight: 300`，大字号营造轻盈感

### 3.3 卡片样式

- **主卡片**：`bg-white/55 backdrop-blur-[20px] border border-white/70 rounded-3xl shadow-lg`
- **预报卡片**：`bg-white/45 backdrop-blur-[12px] border border-white/60 rounded-2xl`
- **hover**：`translateY(-4px)` + 阴影加深，`transition duration-200 ease-out`
- 不使用 scale transform（防止布局抖动）

### 3.4 动效

| 场景 | 效果 | 时长 |
|------|------|------|
| 页面加载 | 主卡片 fadeIn + slideUp(20px) | 400ms |
| 预报卡片入场 | staggered delay 各 0.05s | 400ms |
| 卡片 hover | translateY(-4px) + shadow | 200ms |
| 加载态 | shimmer skeleton 脉冲动画 | 持续 |
| refresher | 下拉刷新（可选） | - |

尊重 `prefers-reduced-motion` 媒体查询。

## 4. 组件架构

```
App
├── WeatherProvider (Context: 数据获取/缓存/刷新)
│   └── WeatherPage
│       ├── CityHeader (城市名 + 日期 + 更新时间)
│       ├── HeroCard (主卡片)
│       │   ├── WeatherIcon (Lucide SVG：Sun/Cloud/CloudRain/CloudSnow)
│       │   ├── TemperatureDisplay (温度大字)
│       │   └── MetricsBar (体感/湿度/风速/气压横向排列)
│       ├── ForecastStrip (5 日预报)
│       │   └── ForecastCard × 5
│       │       ├── DayLabel (星期几)
│       │       ├── WeatherIcon (小号)
│       │       └── TempRange (最高/最低)
│       └── LoadingSkeleton (shimmer 占位)
```

### 数据流

1. `WeatherProvider` 挂载时调用 `fetchWeather()`
2. 数据通过 React Context 向下传递
3. 各展示组件通过 `useContext` 消费数据
4. 错误 / 加载态由 Provider 统一管理，展示组件按状态渲染

```
fetchWeather()
  ├── pending  → LoadingSkeleton
  ├── resolved → 正常渲染卡片
  └── rejected → 错误提示（带重试按钮）
```

## 5. 天气代码映射

Open-Meteo weather_code (WMO) → 图标 + 中文描述：

| code | 图标 (Lucide) | 描述 | 渐变色调 |
|------|--------------|------|---------|
| 0 | Sun | 晴朗 | 暖黄渐变 |
| 1-3 | CloudSun | 少云/多云 | 蓝白渐变 |
| 45-48 | CloudFog | 雾/霾 | 灰白渐变 |
| 51-55 | CloudDrizzle | 小雨 | 淡蓝渐变 |
| 61-65 | CloudRain | 雨 | 深蓝渐变 |
| 71-77 | CloudSnow | 雪 | 纯白渐变 |
| 80-82 | CloudRain | 阵雨 | 蓝灰渐变 |
| 95-99 | CloudLightning | 雷暴 | 灰紫渐变 |

## 6. 布局规范

- 页面无 max-width 居中限制，内容靠 padding 留白
- 内容左对齐，视觉从左到右自然流动
- 主卡片撑满宽度（响应式 padding：`px-6 md:px-12 lg:px-24`）
- 预报卡片 `flex:1` 弹满，`min-width: 100px` 保证最小可读
- 响应式断点：375px / 768px / 1024px / 1440px
- 小屏（<768px）预报卡片换行 3+2 排列

## 7. 工程规范

- 构建工具：Vite + React 18
- 样式：Tailwind CSS（JIT 模式）
- 图标：Lucide React（`lucide-react`）
- HTTP：原生 fetch（无额外依赖）
- 目录结构：

```
src/
  components/
    WeatherProvider.jsx
    WeatherPage.jsx
    CityHeader.jsx
    HeroCard.jsx
    MetricsBar.jsx
    WeatherIcon.jsx
    ForecastStrip.jsx
    ForecastCard.jsx
    LoadingSkeleton.jsx
    ErrorDisplay.jsx
  hooks/
    useWeather.js
  utils/
    weatherMapping.js   (code → 图标/描述)
    formatters.js       (日期格式化)
  App.jsx
  main.jsx
  index.css
```

## 8. 非功能需求

- [ ] 无障碍：ARIA 标签、键盘导航、4.5:1 文字对比度
- [ ] 性能：首屏加载 < 2s，无阻塞请求
- [ ] 错误处理：API 失败时友好提示 + 重试
- [ ] 无 emoji 作为图标，统一使用 Lucide SVG
- [ ] 所有可点击元素 `cursor-pointer`
- [ ] 尊重 `prefers-reduced-motion`
