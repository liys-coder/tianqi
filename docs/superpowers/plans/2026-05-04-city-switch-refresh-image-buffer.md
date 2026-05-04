# 城市切换刷新 + 图片双缓冲实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 城市切换时刷新页面 + 双图缓冲渐进加载优化

**Architecture:** 
- WeatherProvider 维护双图缓冲队列，渐进加载：小图 → 大图 → 预加载下一张
- CitySelector 点击切换城市时触发页面刷新
- 使用 picsum.photos 作为图片源（已集成）

**Tech Stack:** React 18, Vite, Lucide Icons

---

### 任务 1: weatherBackground.js 新增工具函数

**Files:**
- Modify: `src/utils/weatherBackground.js`

- [ ] **Step 1: 添加 getNextCityId 函数**

在文件末尾添加：

```javascript
import { CITIES } from '../hooks/useWeather';

/**
 * 获取循环下一个城市
 * @param {string} currentId - 当前城市 ID
 * @returns {Object} 下一个城市对象
 */
export function getNextCityId(currentId) {
  const idx = CITIES.findIndex(c => c.id === currentId);
  const nextIdx = (idx + 1) % CITIES.length;
  return CITIES[nextIdx];
}
```

- [ ] **Step 2: 添加 preloadImage Promise 包装**

在文件末尾添加：

```javascript
/**
 * 预加载图片并返回 Promise
 * @param {string} url - 图片 URL
 * @returns {Promise<string>} 加载完成后的 URL
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
  });
}
```

- [ ] **Step 3: Run 验证**

Run: `npm run build`
Expected: BUILD SUCCESS

---

### 任务 2: WeatherProvider 双图缓冲逻辑

**Files:**
- Modify: `src/components/WeatherProvider.jsx`

- [ ] **Step 1: 添加新的 state 和 ref**

在现有 state 后面添加：
```javascript
const [nextImage, setNextImage] = useState('');        // 下一张缓存图片
const [imageStatus, setImageStatus] = useState('idle'); // 'idle' | 'loading-small' | 'loading-large' | 'done'
const bufferRef = useRef({ current: null, next: null }); // 图片缓冲
```

- [ ] **Step 2: 修改图片加载逻辑 useEffect**

替换现有的天气背景预加载 useEffect (lines 186-221):

```javascript
// 天气背景双图缓冲 - 渐进加载
useEffect(() => {
  if (!rawData) return;
  
  let active = true;
  const weatherCode = rawData.current.weather_code;
  const currentCityId = currentCity.id;
  const nextCity = getNextCityId(currentCityId);
  const bgLabel = getWeatherLabel(weatherCode);
  const fallbackUrl = getFallbackBackgroundUrl();
  
  // 获取当前城市和下一城市的图片 URL
  const currentBgUrl = getWeatherBackgroundUrl(weatherCode);
  const nextBgUrl = getWeatherBackgroundUrlFromCity(nextCity.id);
  
  // 小图 URL（快速显示）
  const smallUrl = currentBgUrl.replace('1920/1080', '640/360');
  
  async function loadImages() {
    try {
      // Step 1: 先加载小图快速显示
      setImageStatus('loading-small');
      const loadedSmall = await preloadImage(smallUrl);
      if (!active) return;
      
      setNextImage(loadedSmall); // 暂时先用 nextImage 显示小图
      setImageStatus('loading-large');
      
      // Step 2: 小图加载完成后再加载大图
      const largeImg = new Image();
      largeImg.src = currentBgUrl;
      await new Promise((resolve, reject) => {
        largeImg.onload = resolve;
        largeImg.onerror = reject;
      });
      if (!active) return;
      
      setBackgroundImage(currentBgUrl);
      bufferRef.current.current = currentBgUrl;
      setImageStatus('done');
      
      // Step 3: 后台预加载下一城市大图
      const nextImg = new Image();
      nextImg.src = nextBgUrl;
      bufferRef.current.next = nextBgUrl;
      
    } catch (e) {
      console.warn('图片加载失败，使用 fallback:', e);
      if (!active) return;
      setBackgroundImage(fallbackUrl);
    }
  }
  
  loadImages();
  
  return () => { active = false; };
}, [rawData, currentCity]);
```

- [ ] **Step 3: 添加 getWeatherBackgroundUrlFromCity 辅助函数**

在 WeatherProvider.jsx 顶部 import 后添加：

```javascript
import { CITIES } from '../hooks/useWeather';
import { getWeatherBackgroundUrl as getBgUrl, getNextCityId, preloadImage } from '../utils/weatherBackground';

/**
 * 根据城市 ID 获取天气背景图（需要先获取该城市的天气代码）
 * 这里复用现有的 getWeatherBackgroundUrl，传入静态 weatherCode
 * 由于我们需要根据城市 ID 生成固定图片，需要一个新函数
 */
```

等等，这个方案有问题。让我重新思考：由于需要根据城市 ID 生成背景图，但当前我们只有当前城市的数据。

**实际正确的方案：** 直接用城市 ID 生成背景图 URL，不需要 weatherCode。因为背景图只是装饰性的，可以根据城市 ID 固定生成。

- [ ] **Step 3 (修正): 添加城市背景图函数**

在 weatherBackground.js 添加：

```javascript
/**
 * 根据城市 ID 获取背景图 URL
 * @param {string} cityId - 城市 ID
 * @returns {string} 图片 URL
 */
export function getWeatherBackgroundUrlByCity(cityId) {
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  // 使用城市 ID + 年份生成固定 seed
  const seed = cityId + '-' + new Date().getFullYear();
  return `https://picsum.photos/seed/${seed}/1920/1080?blur=2`;
}
```

- [ ] **Step 4: 修改 WeatherProvider 的 useEffect 使用新函数**

```javascript
// 天气背景双图缓冲 - 渐进加载
useEffect(() => {
  if (!rawData) return;
  
  let active = true;
  const currentCityId = currentCity.id;
  const nextCity = getNextCityId(currentCityId);
  const bgLabel = getWeatherLabel(rawData.current.weather_code);
  const fallbackUrl = getFallbackBackgroundUrl();
  
  // 当前城市图片 URL
  const currentBgUrl = getWeatherBackgroundUrlByCity(currentCityId);
  const nextBgUrl = getWeatherBackgroundUrlByCity(nextCity.id);
  
  // 小图 URL（快速显示）
  const smallUrl = currentBgUrl.replace('1920/1080', '640/360');
  
  async function loadImages() {
    try {
      // Step 1: 先加载小图快速显示
      setImageStatus('loading-small');
      const loadedSmall = await preloadImage(smallUrl);
      if (!active) return;
      
      setNextImage(loadedSmall);
      setImageStatus('loading-large');
      
      // Step 2: 小图加载完成后再加载大图
      const largeImg = new Image();
      largeImg.src = currentBgUrl;
      await new Promise((resolve, reject) => {
        largeImg.onload = resolve;
        largeImg.onerror = reject;
      });
      if (!active) return;
      
      setBackgroundImage(currentBgUrl);
      bufferRef.current.current = currentBgUrl;
      setImageStatus('done');
      
      // Step 3: 后台预加载下一城市大图
      const nextImg = new Image();
      nextImg.src = nextBgUrl;
      bufferRef.current.next = nextBgUrl;
      
    } catch (e) {
      console.warn('图片加载失败，使用 fallback:', e);
      if (!active) return;
      setBackgroundImage(fallbackUrl);
    }
  }
  
  loadImages();
  
  return () => { active = false; };
}, [rawData, currentCity]);
```

- [ ] **Step 5: Run 验证**

Run: `npm run build`
Expected: BUILD SUCCESS

---

### 任务 3: CitySelector 城市切换刷新页面

**Files:**
- Modify: `src/components/CitySelector.jsx`

- [ ] **Step 1: 修改 onCityChange 回调**

修改 CitySelector.jsx 的 onClick 处理：

```javascript
export default function CitySelector({ currentCity, onCityChange }) {
  const handleCityChange = (city) => {
    if (city.id !== currentCity.id) {
      // 切换城市时刷新页面，重新请求 API
      window.location.reload();
    }
  };
  
  return (
    // ... existing JSX
    <button
      key={city.id}
      onClick={() => handleCityChange(city)}
      // ... existing className
    >
      {city.name}
    </button>
    // ...
  );
}
```

实际上，当前的 CitySelector 通过 onCityChange 传递给父组件，不需要在子组件里处理刷新。让 CitySelector.jsx 保持原样，在 WeatherPage 或者 App 层面处理刷新。

- [ ] **Step 1 (修正): 在 WeatherPage 处理城市切换刷新**

查看 WeatherPage.jsx:

- [ ] **Step 1 (修正): 查看 WeatherPage 结构**

Run: `Read src/components/WeatherPage.jsx`

- [ ] **Step 2: 添加城市切换处理**

在 WeatherPage.jsx 中，CitySelector 的 onCityChange 使用 window.location.reload():

```javascript
// src/components/WeatherPage.jsx 中
<CitySelector 
  currentCity={currentCity} 
  onCityChange={(city) => {
    setCurrentCity(city);
    // 城市切换时刷新页面
    window.location.reload();
  }} 
/>
```

- [ ] **Step 3: Run 验证**

Run: `npm run build`
Expected: BUILD SUCCESS

---

### 验证

- [ ] **Run: npm run build**

Expected: BUILD SUCCESS

- [ ] **Run: npm run dev** 并测试：
1. 初始加载：应该先显示小图背景，然后替换为大图
2. 点击切换城市：页面刷新，显示新城市的天气数据
3. 再次切换：应该能看到图片快速切换（因为有缓冲）

---

**Plan complete. 两个执行选项：**

1. **Subagent-Driven (recommended)** - 我为每个任务派遣 subagent，快速迭代
2. **Inline Execution** - 我在这个 session 里执行任务

选择哪个？