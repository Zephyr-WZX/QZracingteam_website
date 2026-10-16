# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概述

浙江大学启真车队（QZ Racing Team）官网。Vite 6 + React 18 + TypeScript + Tailwind CSS 3。深色主题，主色 `#004B91`，GSAP ScrollTrigger 驱动滚动动画。

**单页架构**：整站是一个长滚动页面，全部内容由 [src/pages/Home.tsx](src/pages/Home.tsx) 组合。React Router 已接入但只注册了 `/`，导航靠锚点滚动而非路由跳转。

---

## 命令

| 操作 | 命令 |
|---|---|
| 开发 | `npm run dev` |
| 构建 | `npm run build`（`tsc -b` 类型检查 + `vite build`） |
| 预览 | `npm run preview` |

无 lint / test / format 脚本。路径别名 `@` → `src`（[vite.config.ts](vite.config.ts) + [tsconfig.json](tsconfig.json)）。

---

## ⭐ 数据驱动 —— 内容维护入口

**这是最重要的架构约定**：所有可维护内容都抽到 [src/data/](src/data/) 下的纯数据文件，组件从中读取。改内容 = 改数据文件，不动组件。每个文件顶部有 `🛠️ 管理员在此维护` 注释和可复制的模板。

| 文件 | 导出 | 驱动的 UI |
|---|---|---|
| [src/data/race.ts](src/data/race.ts) | `ALL_RACES` + `getNearestUpcoming()` / `getRecentRaceIndex()` | Hero 右侧 NextRace 倒计时 + 赛程板块 RaceSchedule。`status: 'upcoming' \| 'completed'`，completed 填 `result[]` 战绩 |
| [src/data/cars.ts](src/data/cars.ts) | `ALL_CARS` | 赛车板块 CarShowcase。`specs[]` 逐行参数，`imagePath` 侧视图 |
| [src/data/sponsors.ts](src/data/sponsors.ts) | `MAIN_SPONSORS` / `PARTNERS` / `SPECIAL_THANKS` | 合作伙伴板块三层：静态大 logo / LogoLoop 滚动 / 静态小 logo |
| [src/data/awards.ts](src/data/awards.ts) | `AWARDS` | 成就板块 CircularGallery（WebGL）。`text` 支持 `\n` 换行 |
| [src/data/photos.ts](src/data/photos.ts) | `photoItems` | 照片墙 PhotoWall。**自动扫描** `public/images/photowall/` 下所有图片（`import.meta.glob`），无需手动列文件名 |

数据里的资源路径写成不带前导斜杠的相对路径（如 `icons/huahai-track.svg`、`images/E69.png`），组件渲染时统一 `/` 前缀。

---

## 资源与图标

**根目录已无 `icons/` 目录**（历史遗留说明作废）。所有静态资源在 [public/](public/) 下，`<img src>` 一律以 `/` 开头引用：

- `public/icons/` — 站点图标：`teamlogo.svg`（车队 logo，需 `filter: brightness(0) invert(1)` 或 `brightness-0 invert` 转白）、`teamlogo-white.svg`、`zju-qsy-outline.svg`（校徽白色轮廓，帷幕中央用）、`zju-qsy.svg`、`zju-icon.svg`、赛道图标 `huahai-track.svg` / `tongji-track.svg`、国旗 `flag-cn.svg`
- `public/icons/sponsors/` — 赞助商 logo（含中文文件名）
- `public/images/` — `hero-bg.png`（Hero 背景）、`nav-bg.jpg`（全屏菜单背景）、赛车侧视图（`E69.png` 等）、`tracks/`（赛道背景图）、`awards/`（证书）、`photowall/`（照片墙，放进去即自动出现）
- `public/fonts/` — 自托管字体，`@font-face` 在 [src/index.css](src/index.css)：`Noto Sans SC Black`（CJK 子集 woff2，标题用）、`Archivo Black`、`Russo One`、`Bebas Neue`

新增图标/图片直接放 `public/` 对应子目录即可，无需再在别处放副本。

---

## 主题与全局样式

Tailwind 自定义（[tailwind.config.ts](tailwind.config.ts)）：
- 颜色：`black` `#060B14` / `black-deep` `#030712`；`primary` `#004B91` / `primary-light` `#0066CC` / `primary-dim` `#003366`
- 字号：`display-xl`(10rem) / `display-lg`(7rem) / `display-md`(4.5rem) / `display-sm`(2.5rem)

`@layer components`（[src/index.css](src/index.css)）：
- `.section-container`（max-w 1800px 宽容器）/ `.section-container-narrow`（1100px）
- `.btn-glass`、`.nav-capsule`（毛玻璃按钮）
- `.primary-text` —— 注意实际值是 `#3388CC` + 蓝色 text-shadow，**不是** `primary` 变量
- `.curtain`（入场帷幕，`#004B91`）/ `.page-curtain`（路由切换帷幕）

---

## 关键架构

### 入场帷幕（[src/App.tsx](src/App.tsx)）
页面加载时蓝色 `.curtain` 从 `height: 100vh → 0vh` 向上收起（GSAP，简单高度动画，非 clip-path）。帷幕中央并排两个白色图标（校徽轮廓 + 车队 logo），中间 `w-px` 竖线分隔（[src/App.tsx:36](src/App.tsx#L36)：`w-px` 粗细 / `h-20 sm:h-28 md:h-36` 高度 / `bg-white/40` 颜色）。

### 路由切换帷幕（[src/routes/index.tsx](src/routes/index.tsx)）
`.page-curtain` 在 `location.pathname` 变化时 scaleY 上→下扫过并归零，同时 `window.scrollTo(0,0)`。当前只有 `/` 一条路由，实际很少触发。

### Home 区块顺序与锚点
[src/pages/Home.tsx](src/pages/Home.tsx)（单文件承载整站）：
`#hero` → `#cars` 赛车 → `#races` 赛程 → `#photos` 照片墙 → `#feats` 成就 → `#team` 队员 → `#partners` 合作伙伴 → `#contact` 联系 → footer。
锚点与 [Navbar](src/components/layout/Navbar.tsx) 的 `MENU_ITEMS` 对应；跨页跳转用 `/#anchor`，同页用 `scrollIntoView`。

### Hero 滚动揭示
`useLayoutEffect` 里 `gsap.context` + `pin + scrub` 时间轴：黑遮罩 `.hero-veil` 变透（暗→亮）、图片 scale 拉近 + blur/saturate 滤镜清晰化、文字 `.hero-content` 左滑 / `.hero-race` 右滑退场。用 `requestAnimationFrame` 等 layout 完成再 `ScrollTrigger.refresh()` 保证 pin-spacer 正确。

### 全局入场动画
Home 内另有一个延迟 600ms 的 `useEffect`，扫描 `[data-anim]` 属性（`fadeup`/`curtain`/`stagger`/`parallax`）批量注册 ScrollTrigger。参数走 `data-*`（`data-delay` / `data-y` / `data-stagger` / `data-speed`）。

### 导航全屏菜单（[Navbar](src/components/layout/Navbar.tsx)）
右上胶囊按钮触发全屏 overlay，从按钮中心做 `circle()` clip-path 圆形展开，菜单项 stagger 入场；打开时锁 `html` 滚动并补偿滚动条宽度。背景 `nav-bg.jpg` + 主题色毛玻璃遮盖。

---

## 动画体系

- GSAP ScrollTrigger 在 [src/App.tsx](src/App.tsx)、[Home.tsx](src/pages/Home.tsx) 顶部各 `registerPlugin` 一次
- 复用组件 [src/components/animation/ScrollReveal.tsx](src/components/animation/ScrollReveal.tsx)：导出 `FadeUp` / `FadeUpStagger` / `CurtainReveal` / `ParallaxSection`（[index.ts](src/components/animation/index.ts) 统一导出），内部 `gsap.context()` 管生命周期
- 所有 GSAP effect 都在 `gsap.context(...)` 里创建、cleanup 时 `ctx.revert()`，避免 StrictMode 双挂载泄漏

---

## Reactbits / WebGL 组件

以下来自 [reactbits.dev](https://reactbits.dev)，集成说明在根目录 [components/](components/) 下的 `*.md`（`Gallery.md` / `Masonry.md` / `logo.md` / `Grid scan.md`）：

- [CircularGallery.tsx](src/components/CircularGallery.tsx) — **OGL** WebGL 3D 弧形画廊，成就板块用（依赖 `ogl`）
- [GridScan.tsx](src/components/GridScan.tsx) — Three.js + postprocessing 透视网格扫描背景
- [LogoLoop.tsx](src/components/LogoLoop.tsx) — 无缝滚动 logo 带，合作伙伴用
- [Masonry.tsx](src/components/Masonry.tsx) / [PhotoWall.tsx](src/components/PhotoWall.tsx) — 瀑布流照片墙

`@react-three/fiber` / `@react-three/drei` 已装但未使用，为将来 3D 赛车模型预留。CircularGallery 用的是轻量 `ogl` 而非 three。

---

## 业务组件速查

| 组件 | 作用 |
|---|---|
| [NextRace.tsx](src/components/NextRace.tsx) | Hero 右侧最近赛事倒计时，读 `getNearestUpcoming()` |
| [RaceSchedule.tsx](src/components/RaceSchedule.tsx) | 赛程板块，受控组件（`index`/`onChange`/`animDir` 由 Home 管理），上下切换赛事、倒计时/战绩双态 |
| [CarShowcase.tsx](src/components/CarShowcase.tsx) | 赛车轮播，读 `ALL_CARS` |
| [TrackIcon.tsx](src/components/TrackIcon.tsx) | 按 `iconPath` 加载并给赛道 SVG 上色（`fill`） |
