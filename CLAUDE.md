# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概述

浙江大学启真车队（QZ Racing Team）官网，Vite + React 18 + TypeScript + Tailwind CSS 3 构建的单页面网站。深色主题，蓝色主色调 `#004B91`，GSAP ScrollTrigger 驱动的滚动动画。

---

## 命令

| 操作 | 命令 | 说明 |
|---|---|---|
| 开发 | `npm run dev` | Vite dev server |
| 构建 | `npm run build` | tsc 类型检查 + vite build |
| 预览 | `npm run preview` | 预览生产构建 |

无 lint / test / format 脚本配置。

---

## 主题系统

Tailwind 自定义颜色定义在 [tailwind.config.ts](tailwind.config.ts)：
- `black` `#060B14` / `black-deep` `#030712`
- `primary` `#004B91` / `primary-light` `#0066CC` / `primary-dim` `#003366`

自定义字体大小：`display-xl` (10rem), `display-lg` (7rem), `display-md` (4.5rem), `display-sm` (2.5rem)。

全局组件类 `.section-container` / `.btn-glass` / `.primary-text` / `.primary-underline` 定义在 [src/index.css](src/index.css) 的 `@layer components`。

---

## 重要架构

### 入场帷幕（App.tsx）
[src/App.tsx](src/App.tsx) — 页面加载时蓝色背景（`#004B91` 与主题色一致）从顶部收起。GSAP 控制 `height: 100vh → 0vh` + `--curve` CSS 变量驱动 parabola clip-path 底部弧线。帷幕中央显示两个白色图标，之间用竖线分隔。

### 图标文件路径
- 源图标目录：`icons/`（项目根目录，**Vite 无法直接访问**）
- 浏览器可访问：`public/icons/`
- 可用图标：
  - `icons/zju-qsy.svg` — ZJU 校徽（实心蓝色，viewBox 125×104）
  - `public/icons/zju-qsy-outline.svg` — ZJU 校徽白色轮廓版（`stroke="white" stroke-width="2.7"`），**在帷幕中央使用**
  - `icons/teamlogo.svg` — 车队 logo（超大 viewBox 3680×4096，路径数据约 26000 字符），**在帷幕中央使用**，`<img>` 标签需 `filter: brightness(0) invert(1)` 转为白色
  - `icons/huahai-track.svg` — 花海赛道图标（viewBox 1710×1278），**在 NextRace 组件中内联渲染**，通过 `fill` prop 控制颜色

**新增图标须知**：放入 `icons/` 后在 `public/icons/` 放一份副本，浏览器 `<img>` 标签只能访问 `public/` 下的文件。

### Hero 区退场动画
[src/pages/Home.tsx](src/pages/Home.tsx) — 滚动驱动：左侧 `.hero-content` 向左滑出 `x: -80`，右侧 `.hero-race` 向右滑出 `x: 80`，配合 opacity 渐隐。

### 管理员数据修改入口
**NEXT RACE 赛事信息**：[src/data/race.ts](src/data/race.ts) — 修改 `nextRace` 对象即可更新 Hero 右侧的倒计时模块：
- `name`: 赛事名称
- `location`: 赛事地点
- `date`: ISO 8601 时间字符串（倒计时目标时刻）
- `iconPath`: 赛道 SVG 图标路径
- `iconColor`: 图标填充颜色（如 `#ffffff`）
- `iconOpacity`: 透明度 0-100

**QZ RACING 位置调整**：[src/pages/Home.tsx:190-191](src/pages/Home.tsx#L190-L191) — `self-end` / `translate-y-*` / `-translate-x-*` / `marginBottom`

### 幕布分割线
[src/App.tsx:40](src/App.tsx#L40) — `w-px` 控制粗细，`h-32 md:h-36` 控制高度，`bg-white/40` 控制颜色透明度。

---

## 动画体系

- GSAP ScrollTrigger 全局注册于 [src/App.tsx](src/App.tsx)
- 可复用组件 [src/components/animation/ScrollReveal.tsx](src/components/animation/ScrollReveal.tsx)：`FadeUp` / `CurtainReveal` / `ParallaxSection`，通过 `gsap.context()` 管理生命周期
- Hero pin + scrub 动画（暗→亮 + 镜头拉近）在 [src/pages/Home.tsx](src/pages/Home.tsx) 的 `useLayoutEffect` 中构建，使用 `gsap.context` + `requestAnimationFrame` 保证布局就绪

---

## 路由

React Router v6，定义在 [src/routes/index.tsx](src/routes/index.tsx)。当前只有首页 `/` 有效，其他页面组件（About / Car / Contact / Gallery / Sponsors / Team）存在但未注册路由。

---

## 3D 相关

- [src/components/GridScan.tsx](src/components/GridScan.tsx) — 独立 Three.js + postprocessing 背景（透视网格 + 扫描光束）
- `@react-three/drei` / `@react-three/fiber` 已安装但未使用，为将来 3D 赛车模型预留
