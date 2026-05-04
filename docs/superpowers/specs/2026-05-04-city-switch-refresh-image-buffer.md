# 城市切换刷新 + 图片双缓冲优化

## 需求概述

- 切换城市时刷新页面（重新请求 API）
- 图片双缓冲策略优化加载体验
- 渐进加载：先加载小图显示，再加载大图替换

## 当前实现

- 城市切换不刷新页面，直接用缓存数据
- 图片同时加载小图和大图（无先后顺序）
- 每次切换只显示当前城市图片

## 目标行为

### 初始化加载（第 1-2 张图）

```
时间线:
0ms     → 加载城市 A 小图 (640x360)              [快速显示]
???ms   → 城市 A 小图加载完成
         → 开始加载城市 B 大图 (1920x1080)         [后台]
         → 显示城市 A 大图
???ms   → 城市 B 大图加载完成
         → 后台同时预加载城市 C 大图
```

### 切换城市（第 2→3 张图）

```
用户点击: 城市 B
         → 立即刷新页面请求 API
         → 显示城市 B 缓存图片（第二张）
         → 后台预加载城市 C 大图
???ms   → 城市 C 大图加载完成
         → 后台预加载城市 D 大图
```

### 循环缓冲

- 始终保持 2 张图片缓存：当前城市、下一城市
- 切换时：当前 → 下一，预加载再下一张

## 实现方案

### 1. 数据层修改

**WeatherProvider.jsx**:
- 城市切换时强制刷新 API（移除缓存逻辑）
- 维护图片缓冲队列：`bufferRef = useRef({ current: null, next: null })`

### 2. 图片加载逻辑

**weatherBackground.js**:
- 新增 `getNextCityId(currentId)` - 获取循环下一个城市
- 新增 `preloadImage(url)` - Promise 包装的图片加载

**WeatherProvider.jsx**:
- 使用双图缓冲：`currentImage`, `nextImage`
- 渐进加载：小图 → 大图
- 状态管理：`imageLoadingState` = 'idle' | 'loading-small' | 'loading-large' | 'done'

### 3. 城市切换

**CitySelector.jsx**:
- 切换时触发页面刷新（通过 `window.location.reload()` 或路由跳转）

## 组件接口

```jsx
// WeatherProvider 新增
value={{
  data, loading, error, refresh,
  backgroundImage,    // 当前显示的图片
  backgroundNextImage, // 下一张图片（缓存）
  imageStatus,         // 'loading' | 'ready' | 'idle'
  currentCity, setCurrentCity
}}
```

## 文件修改

| 文件 | 修改内容 |
|------|---------|
| `src/utils/weatherBackground.js` | 新增 getNextCityId, preloadImage |
| `src/components/WeatherProvider.jsx` | 双图缓冲逻辑、渐进加载 |
| `src/components/CitySelector.jsx` | 切换时刷新页面 |

## 效果预期

- 初始加载：有小图快速显示，无白屏
- 切换城市：无缝切换，无需等待加载
- 体验：平滑循环的双图缓冲