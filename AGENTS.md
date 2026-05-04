# AGENTS.md — xm3（成都天气应用）

## 项目概述

React 18 + Vite + Tailwind CSS 开发的成都天气展示单页应用。使用 Open-Meteo API（免费，无需 API Key）。
- 模块系统：ESM (package.json `type: module`)
- 界面语言：中文，默认字体为 Inter（已通过 Google Fonts 引入）

## 命令

```bash
npm run dev      # 启动开发服务器（--host 模式，可局域网访问）
npm run build    # 生产构建（产物输出到 dist/ 目录）
npm run preview  # 预览生产构建
```

## 架构

- **入口：** `src/main.jsx` → `src/App.jsx`
- **数据流：** `WeatherProvider`（Context）从 Open-Meteo API 获取数据，传递给 `WeatherPage` 及子组件
- **组件：** `src/components/` — UI 组件
- **Hooks：** `src/hooks/useWeather.js` — 天气数据获取逻辑
- **Utils：** `src/utils/` — 天气代码映射、日期格式化

## 关键文件

| 文件 | 用途 |
|------|------|
| `src/components/WeatherProvider.jsx` | 数据获取、加载/错误状态 |
| `src/components/WeatherPage.jsx` | 主页面布局 |
| `src/utils/weatherMapping.js` | WMO 天气代码 → Lucide 图标 + 中文描述 |
| `tailwind.config.js` | Tailwind 配置（含自定义动画） |
| `docs/superpowers/specs/2026-05-04-chengdu-weather-design.md` | 设计规格 |

## API

- **接口：** `https://api.open-meteo.com/v1/forecast`
- **位置：** 成都（lat=30.67, lon=104.07）
- **时区：** Asia/Shanghai

## 注意事项

- 纯 JavaScript（JSX），无 TypeScript 编译（`@types/*` 仅供 IDE 智能提示）
- 未配置 linting 或测试
- 使用 Lucide React 图标（禁止 emoji）
- Tailwind 自定义动画：`shimmer`（加载）、`fade-up`（入场）
- 玻璃拟态设计：`backdrop-blur` + 半透明白色背景
- API 无需认证，环境变量未使用

## 文档

- 设计规格：`docs/superpowers/specs/2026-05-04-chengdu-weather-design.md`
- 开发计划：`docs/superpowers/plans/2026-05-04-chengdu-weather-plan.md`