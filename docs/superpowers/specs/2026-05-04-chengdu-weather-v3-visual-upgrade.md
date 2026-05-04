# 成都天气应用 V3 视觉升级设计

## 概述
为成都天气应用添加动态天气背景、渐变毛玻璃卡片、丰富动效。

## 设计系统
- **Pattern**: App Store Style Landing
- **Style**: Glassmorphism (毛玻璃)
- **Primary**: #0891B2 (cyan-600)
- **Secondary**: #22D3EE (cyan-400)
- **Typography**: Inter
- **Effects**: Backdrop blur 10-20px, subtle border, light reflection

## 1. 动态天气背景

### 实现方式
- 根据 Open-Meteo API 返回的 WMO 天气代码动态加载背景图
- 背景图来源：Unsplash 天气主题图库
- 切换时使用 cross-fade 过渡动画 (0.6s)
- 网络失败时回退到渐变背景

### 天气代码映射
| WMO Code | 天气类型 | 背景关键词 |
|----------|----------|------------|
| 0, 1     | 晴朗     | clear sky, blue sky, sunshine |
| 2, 3     | 多云     | clouds, overcast, cloudy sky |
| 45, 48   | 雾       | fog, mist, morning haze |
| 51-67    | 降水     | rain, drizzle, shower |
| 71-77    | 降雪     | snow, snowfall, winter |
| 80-82    | 阵雨     | rain, downpour, thunderstorm |
| 95-99    | 雷暴     | thunderstorm, lightning, storm |

### 背景加载策略
- 首次加载：显示渐变背景 → 加载背景图 → 淡入切换
- 天气变化：检测到天气代码变化 → 预加载新图 → cross-fade 切换
- 缓存：使用浏览器缓存，已加载的背景图不重复请求

## 2. 卡片渐变毛玻璃

### glass-card (主卡片)
```css
background: linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.55) 0%,
  rgba(255, 255, 255, 0.35) 100%
);
backdrop-filter: blur(28px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow:
  0 8px 32px rgba(2, 132, 199, 0.08),
  inset 0 1px 2px rgba(255, 255, 255, 0.6);
```

### glass-card-sm (小卡片)
```css
background: linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.5) 0%,
  rgba(255, 255, 255, 0.3) 100%
);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.45);
box-shadow:
  0 4px 24px rgba(2, 132, 199, 0.06),
  inset 0 1px 2px rgba(255, 255, 255, 0.5);
```

## 3. 组合动效

### 悬停微光 (Hover Glow)
```css
/* 悬停时 */
box-shadow:
  0 12px 48px rgba(2, 132, 199, 0.15),
  0 0 0 1px rgba(255, 255, 255, 0.3),
  inset 0 1px 2px rgba(255, 255, 255, 0.6);
```

### 3D 悬浮 (3D Lift)
```css
transform: translateY(-4px) rotateX(2deg);
transition: transform 0.3s ease, box-shadow 0.3s ease;
```

### 脉冲呼吸 (Pulse Breathing)
```css
@keyframes pulseCard {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}
animation: pulseCard 3s ease-in-out infinite;
```

### 动效时序
- 页面加载：卡片依次 fade-up 入场 (stagger 100ms)
- 背景切换：cross-fade 0.6s
- 悬停反馈：0.3s ease 过渡

## 4. 组件清单

| 组件 | 改动 |
|------|------|
| App.jsx | 添加背景图片状态管理 |
| index.css | 更新毛玻璃样式 + 动效 keyframes |
| HeroCard.jsx | 添加悬停动效 + 脉冲 |
| ForecastCard.jsx | 添加悬停动效 |
| DetailsGrid.jsx | 添加悬停动效 |
| CitySelector.jsx | 添加悬停动效 |

## 5. 验收标准

- [ ] 背景根据天气动态变化（晴/云/雨/雪）
- [ ] 卡片有渐变叠加层
- [ ] 悬停时有微光 + 3D 悬浮效果
- [ ] 卡片有轻微呼吸效果
- [ ] 页面加载有 fade-up 入场动画
- [ ] 背景切换有 cross-fade 过渡
- [ ] prefers-reduced-motion 正常工作
- [ ] 响应式布局正常 (375px-1440px)