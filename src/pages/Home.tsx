import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeUp, CurtainReveal, FadeUpStagger } from '@/components/animation'
import NextRace from '@/components/NextRace'
import RaceSchedule from '@/components/RaceSchedule'
import CarShowcase from '@/components/CarShowcase'
import PhotoWall from '@/components/PhotoWall'
import LogoLoop from '@/components/LogoLoop'
import { ALL_RACES } from '@/data/race'
import { MAIN_SPONSORS, PARTNERS, SPECIAL_THANKS } from '@/data/sponsors'

gsap.registerPlugin(ScrollTrigger)

/* ================================================================
   首页 — 单页面滚动式布局
   区块顺序: Hero → 赛车 → 成就 → 队员 → 合作伙伴 → 联系我们
   ================================================================ */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const [raceIndex, setRaceIndex] = useState(0)
  const [raceAnimDir, setRaceAnimDir] = useState<'up' | 'down'>('down')
  const sponsorRef = useRef<HTMLDivElement>(null)

  // 处理从其他页面跳转过来的锚点定位
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [location.hash])

  // Hero: 滚动揭示动画（暗→亮 + 镜头拉近）
  useLayoutEffect(() => {
    const section = heroRef.current
    if (!section) return

    // 先用 rAF 让浏览器完成 layout，再初始化 ScrollTrigger
    let ctx: gsap.Context | null = null

    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // 文字入场（不受 scroll 影响）
        gsap.fromTo(
          '.hero-title',
          { opacity: 0, y: 120 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.6 },
        )
        gsap.fromTo(
          '.hero-sub',
          { opacity: 0, y: 40 },
          { opacity: 0.6, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 },
        )
        gsap.fromTo(
          '.hero-cta',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.1 },
        )
        // 右侧赛事倒计时入场
        gsap.fromTo(
          '.hero-race',
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 1, ease: 'power4.out', delay: 0.8 },
        )

        // === 核心：pin + scrub ===
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=150%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        // 黑色遮罩：0.9 → 0.02（主变亮层）
        tl.fromTo(
          '.hero-veil',
          { opacity: 0.8 },
          { opacity: 0.02, ease: 'power2.inOut', duration: 1 },
          0,
        )

        // 图片缩放：1.05 → 1.18
        tl.fromTo(
          '.hero-image img',
          { scale: 1.05 },
          { scale: 1.18, ease: 'power3.inOut', duration: 1 },
          0,
        )

        // 图片滤镜：blur 6px + 低饱和 → 清晰 + 高饱和
        tl.fromTo(
          '.hero-image img',
          { filter: 'blur(6px) saturate(0.1)' },
          { filter: 'blur(0px) saturate(1.1)', ease: 'power2.inOut', duration: 1 },
          0,
        )

        // 暗角
        tl.fromTo('.hero-vignette', { opacity: 0.75 }, { opacity: 0.18, ease: 'power2.in', duration: 1 }, 0)

        // 文字 & 赛事倒计时 向两侧退场
        tl.to('.hero-content', { opacity: 0, x: -80, ease: 'power2.in', duration: 0.5 }, 0.15)
        tl.to('.hero-race', { opacity: 0, x: 80, ease: 'power2.in', duration: 0.5 }, 0.15)

        // 滚动指示器
        tl.to('.scroll-indicator', { opacity: 0, duration: 0.25 }, 0.03)
      }, section)

      // 再等一帧让 pin-spacer 生效后刷新
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => {
      cancelAnimationFrame(raf)
      ctx?.revert()
    }
  }, [])

  /* ================================================================
     全局入场动画 — 延迟 500ms 等 Hero pin-spacer 完成后统一注册
     ================================================================ */
  useEffect(() => {
    let localCtx: gsap.Context | null = null

    const timer = setTimeout(() => {
      localCtx = gsap.context(() => {
        // FadeUp
        gsap.utils.toArray<HTMLElement>('[data-anim="fadeup"]').forEach((el) => {
          const delay = parseFloat(el.dataset.delay || '0')
          const y = parseFloat(el.dataset.y || '60')
          const dur = parseFloat(el.dataset.duration || '0.8')
          gsap.fromTo(
            el,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: dur,
              delay,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 105%', once: true },
            },
          )
        })

        // CurtainReveal
        gsap.utils.toArray<HTMLElement>('[data-anim="curtain"]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.2,
              ease: 'power4.inOut',
              scrollTrigger: { trigger: el, start: 'top 80%', once: true },
            },
          )
        })

        // FadeUpStagger — 子元素交错
        gsap.utils.toArray<HTMLElement>('[data-anim="stagger"]').forEach((el) => {
          const stagger = parseFloat(el.dataset.stagger || '0.06')
          const dur = parseFloat(el.dataset.duration || '0.6')
          gsap.fromTo(
            el.children,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              stagger,
              duration: dur,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 105%', once: true },
            },
          )
        })

        // Parallax
        gsap.utils.toArray<HTMLElement>('[data-anim="parallax"]').forEach((el) => {
          const speed = parseFloat(el.dataset.speed || '0.3')
          gsap.to(el, {
            y: `${speed * 100}%`,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })

      ScrollTrigger.refresh()
    }, 600)

    return () => {
      clearTimeout(timer)
      localCtx?.revert()
    }
  }, [])

  // 主要赞助商标识逐个凸显动画
  useEffect(() => {
    const container = sponsorRef.current
    if (!container) return
    const items = container.querySelectorAll('.sponsor-item')
    if (items.length === 0) return

    let ctx: gsap.Context | null = null
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
        items.forEach((item) => {
          tl.to(item, { scale: 1.05, duration: 0.6, ease: 'power2.out' }, '+=1')
            .to(item, { scale: 1, duration: 0.5, ease: 'power2.in' })
        })
      }, container)
    }, 1200)

    return () => {
      clearTimeout(timer)
      ctx?.revert()
    }
  }, [])

  return (
    <>
      {/* ================================================================
           Hero — 赛车图片滚动揭示
           初始: 极暗 + 正常缩放
           滚动: 逐渐变亮 + 镜头拉近
           ================================================================ */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-screen flex items-center justify-between bg-black"
      >
        {/* 赛车背景图 — overflow-hidden 裁剪缩放溢出 */}
        <div className="hero-image absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/hero-bg.png"
            alt="QZ Racing 赛车"
            className="w-full h-full object-cover"
            style={{ scale: '1.05', filter: 'blur(6px) saturate(0.1)' }}
          />
        </div>

        {/* 暗色遮罩 — 从 0.9 → 0.02，核心"变亮"层 */}
        <div className="hero-veil absolute inset-0 z-[1] bg-black" style={{ opacity: 0.8 }} />



        {/* 暗角 — 边缘氛围 */}
        <div
          className="hero-vignette absolute inset-0 z-[3] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.85) 100%)',
            opacity: 0.75,
          }}
        />

        {/* 底部渐变过渡 */}
        <div className="absolute inset-x-0 bottom-0 z-[5] h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        {/* 文字内容 — 中英混合，不对称排版 */}
        <div className="hero-content relative z-10 pl-8 sm:pl-16 md:pl-32 lg:pl-40">
          {/* 顶部标签行 */}
          <div className="mb-5 sm:mb-8 md:mb-12">
            <p className="hero-sub text-xs sm:text-sm tracking-[0.35em] text-white/40">
              ZHEJIANG UNIVERSITY
            </p>
            <p className="hero-sub text-xs sm:text-sm tracking-[0.25em] text-white/25 mt-1.5">
              FORMULA STUDENT TEAM
            </p>
          </div>

          {/* 主标题 — 两行不对称 */}
          <h1 className="hero-title font-black text-white leading-none">
            <div className="flex flex-wrap items-baseline gap-x-4 md:gap-x-8">
              <span className="text-[5rem] sm:text-[6rem] md:text-display-xl lg:text-[12rem] tracking-tight"
                style={{ fontFamily: "'Noto Sans SC Black', sans-serif" }}>
                启真
              </span>
              <span className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] text-white/20 font-light tracking-[0.15em] italic"
                style={{ fontFamily: 'Georgia, serif' }}>
                ×
              </span>
            </div>
            <div className="relative inline-flex items-baseline -mt-2 md:-mt-4">
              <span className="relative z-10 text-[5rem] sm:text-[6rem] md:text-display-xl lg:text-[12rem] primary-text tracking-tight"
                style={{ fontFamily: "'Noto Sans SC Black', sans-serif" }}>
                车队
              </span>
              <span
                className="hero-title absolute right-0 text-sm sm:text-lg md:text-2xl lg:text-3xl text-white/30 tracking-[0.2em] font-bold whitespace-nowrap"
                style={{ bottom: '-1.2em' }}
              >
                QZ RACING
              </span>
            </div>
          </h1>

          {/* 标语 — 中英双行左对齐 */}
          <div className="mt-8 sm:mt-10 md:mt-14 flex flex-col items-start">
            <p className="hero-sub text-lg sm:text-xl md:text-2xl text-white/50 font-light tracking-[0.15em] leading-relaxed">
              做难而正确的事情
            </p>
            <p className="hero-sub text-xs sm:text-sm text-white/20 tracking-[0.3em] mt-2">
              DO THE HARD THING RIGHT
            </p>
          </div>
          <div className="hero-cta mt-10 sm:mt-10 md:mt-12 flex items-center gap-3 md:gap-6">
            <a
              href="#cars"
              className="btn-glass px-6 py-3 md:px-8 md:py-3 text-white/85 font-semibold text-sm md:text-base tracking-wider rounded-full"
            >
              探索赛车
            </a>
            <a
              href="#contact"
              className="btn-glass px-6 py-3 md:px-8 md:py-3 text-white/85 font-semibold text-sm md:text-base tracking-wider rounded-full"
            >
              联系我们
            </a>
          </div>
        </div>

        {/* 右侧 — NEXT RACE 倒计时 */}
        <div className="hero-race relative z-10 pr-8 sm:pr-16 md:pr-32 lg:pr-40">
          <NextRace />
        </div>

        {/* 底部滚动提示 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 scroll-indicator">
          <span className="text-[10px] tracking-[0.3em] text-white/30">滚动探索</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ================================================================
           赛车
           ================================================================ */}
      <section id="cars" className="py-20 sm:py-28 md:py-36 bg-black">
        <div className="section-container">
          <FadeUp className="mb-10">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
              01 — 赛车
            </p>
            <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter">
              我们的<span className="primary-text">赛车</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-white/40 text-sm sm:text-base leading-relaxed max-w-md">
              从概念设计到赛道验证——每一台赛车都是工程智慧的结晶。
            </p>
          </FadeUp>

          <CarShowcase />
        </div>
      </section>

      {/* ================================================================
           赛程
           ================================================================ */}
      <section id="races" className="relative overflow-hidden py-16 sm:py-20 md:py-24 bg-black">
        {/* 赛道照片背景 — 紧贴左边缘，从左到右渐变至透明 */}
        {ALL_RACES[raceIndex]?.trackImage && (
          <div
            className="absolute inset-y-0 left-0 z-0 pointer-events-none translate-y-48 sm:translate-y-64"
            style={{
              width: '60%',
              maskImage: 'linear-gradient(to right, black 25%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 25%, transparent 100%)',
            }}
          >
            <img
              src={`/${ALL_RACES[raceIndex].trackImage}`}
              alt=""
              className="w-full h-auto object-contain object-left"
              style={{ scale: '1.2' }}
            />
          </div>
        )}
        {/* 上下渐变遮罩 — 让图片上下边缘融入背景 */}
        <div
          className="absolute left-0 right-0 top-0 z-[1] h-24 sm:h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #060B14 0%, transparent 100%)' }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 z-[1] h-24 sm:h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #060B14 0%, transparent 100%)' }}
        />
        <div className="section-container relative z-[2]">
          <FadeUp className="mb-10">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
              02 — 赛程
            </p>
            <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter">
              赛事<span className="primary-text">日程</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-white/40 text-sm sm:text-base leading-relaxed max-w-md">
              整装待发，驰骋每一站。
            </p>
          </FadeUp>

          <RaceSchedule
            index={raceIndex}
            animDir={raceAnimDir}
            onChange={(i, dir) => { setRaceIndex(i); setRaceAnimDir(dir) }}
          />
        </div>
      </section>

      {/* ================================================================
           照片墙
           ================================================================ */}
      <section id="photos" className="py-14 sm:py-16 md:py-20 bg-black">
        <div className="section-container">
          <FadeUp className="mb-8 md:mb-12">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
              03 — 照片
            </p>
            <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter">
              照片<span className="primary-text">墙</span>
            </h2>
            <p className="mt-4 text-white/40 text-sm sm:text-base leading-relaxed max-w-md">
              每一个瞬间，都是速度与激情的见证。
            </p>
          </FadeUp>

          <PhotoWall />
        </div>
      </section>

      {/* ================================================================
           成就 / 技术亮点
           ================================================================ */}
      <section id="feats" className="py-20 sm:py-32 md:py-48 bg-black">
        <div className="section-container">
          <FadeUp className="mb-20">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
              04 — 成就
            </p>
            <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter">
              团队<span className="primary-text">成就</span>
            </h2>
          </FadeUp>

          {/* 数据大字报 */}
          <CurtainReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { value: '8+', label: '年参赛历史' },
                { value: '50+', label: '团队成员' },
                { value: 'Top 10', label: '全国排名' },
                { value: '3', label: '技术奖项' },
              ].map((stat) => (
                <div key={stat.label} className="p-6 sm:p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-3xl sm:text-5xl md:text-6xl font-black primary-text tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-xs tracking-[0.2em] text-white/30">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </CurtainReveal>

          {/* 技术方格 */}
          <FadeUp delay={0.3}>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: '空气动力学',
                  desc: 'CFD 优化 + 风洞验证，全碳纤维空力套件，下压力媲美 F4 级别。',
                },
                {
                  title: '电控系统',
                  desc: '自研 ECU + 数据采集系统，实时遥测，毫秒级响应。',
                },
                {
                  title: '底盘与悬架',
                  desc: '钢管桁架车身，双叉臂推杆悬架，Öhlins 可调减震。',
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="p-5 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500"
                >
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">{feat.title}</h3>
                  <p className="mt-3 text-white/40 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================
           队员
           ================================================================ */}
      <section id="team" className="py-20 sm:py-32 md:py-48 bg-black">
        <div className="section-container">
          <FadeUp className="mb-20">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
              05 — 队员
            </p>
            <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter">
              我们的<span className="primary-text">队员</span>
            </h2>
            <p className="mt-6 text-white/40 text-base max-w-md leading-relaxed">
              每一位成员都是车队不可或缺的力量。从设计到制造，从测试到赛场，
              我们用专业和热情推动车队前进。
            </p>
          </FadeUp>

          <FadeUpStagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '队长', role: '技术总监', dept: '管理部' },
              { name: '副队长', role: '底盘组长', dept: '技术部' },
              { name: '电控组长', role: 'ECU 开发', dept: '技术部' },
              { name: '空力组长', role: 'CFD 工程师', dept: '技术部' },
              { name: '车手', role: '测试 & 比赛', dept: '运营部' },
              { name: '运营组长', role: '赞助 & 宣传', dept: '运营部' },
              { name: '悬架工程师', role: '动力学仿真', dept: '技术部' },
              { name: '电控工程师', role: '线束 & PCB', dept: '技术部' },
            ].map((member) => (
              <div key={member.role} className="group p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500">
                <div className="aspect-square rounded-xl bg-white/[0.03] flex items-center justify-center mb-5 overflow-hidden">
                  <span className="text-white/10 text-4xl group-hover:scale-110 transition-transform duration-500">
                    👤
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight">{member.name}</h3>
                <p className="mt-1 text-sm text-primary-light/80">{member.role}</p>
                <p className="mt-1 text-xs text-white/20">{member.dept}</p>
              </div>
            ))}
          </FadeUpStagger>
        </div>
      </section>

      {/* ================================================================
           合作伙伴
           三层过渡底色：主要赞助商 → 合作伙伴 → 特别鸣谢
           ================================================================ */}
      <section id="partners" className="bg-black">
        {/* ───── 区块标题 ───── */}
        <div className="pt-16 sm:pt-20 md:pt-28 pb-0 mb-8 sm:mb-14">
          <div className="section-container">
            <FadeUp>
              <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
                05 — 合作伙伴
              </p>
              <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter">
                合作<span className="primary-text">伙伴</span>
              </h2>
              <p className="mt-4 sm:mt-6 text-white/40 text-sm sm:text-base max-w-md leading-relaxed">
                感谢每一位赞助商的支持。正是你们的信任与投入，让工程梦想在赛道上驰骋。
              </p>
            </FadeUp>
          </div>
        </div>

        {/* ───── 主要赞助商 ───── */}
        <div className="bg-[#151F2D] pt-10 sm:pt-14 pb-10 sm:pb-14">
          <div className="section-container mb-8 sm:mb-12">
            <FadeUp>
              <h3 className="text-xs sm:text-sm tracking-[0.3em] text-white/25">主要赞助商</h3>
            </FadeUp>
          </div>
          <FadeUp>
            <div ref={sponsorRef} className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-24 px-4">
              {MAIN_SPONSORS.map((s, i) => {
                const img = (
                  <img
                    src={`/${s.logo}`}
                    alt={s.name}
                    className="h-14 sm:h-20 md:h-28 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                )
                return s.url ? (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer noopener" title={s.name} className="sponsor-item">
                    {img}
                  </a>
                ) : (
                  <span key={s.name} className="sponsor-item">{img}</span>
                )
              })}
            </div>
          </FadeUp>
        </div>

        {/* ───── 合作伙伴  LogoLoop 滚动 ───── */}
        <div className="bg-[#111A26] pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
          <div className="section-container mb-8 sm:mb-12">
            <FadeUp>
              <h3 className="text-xs sm:text-sm tracking-[0.3em] text-white/25">合作伙伴</h3>
            </FadeUp>
          </div>
          <FadeUp>
            <LogoLoop
              logos={PARTNERS.map((s) => ({
                src: `/${s.logo}`,
                alt: s.name,
                ...(s.url ? { href: s.url } : {}),
              }))}
              speed={80}
              direction="left"
              logoHeight={52}
              gap={64}
              pauseOnHover
              fadeOut
              fadeOutColor="#111A26"
              ariaLabel="合作伙伴"
            />
          </FadeUp>
        </div>

        {/* ───── 特别鸣谢 ───── */}
        <div className="py-16 sm:py-24">
          <div className="section-container">
            <FadeUp>
              <h3 className="text-xs sm:text-sm tracking-[0.3em] text-white/25 mb-8 sm:mb-12">特别鸣谢</h3>
            </FadeUp>
            {SPECIAL_THANKS.length > 0 ? (
              <FadeUp>
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                  {SPECIAL_THANKS.map((s) => {
                    const img = (
                      <img
                        src={`/${s.logo}`}
                        alt={s.name}
                        className="h-10 sm:h-14 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                      />
                    )
                    return s.url ? (
                      <a key={s.name} href={s.url} target="_blank" rel="noreferrer noopener" title={s.name}>
                        {img}
                      </a>
                    ) : (
                      <span key={s.name}>{img}</span>
                    )
                  })}
                </div>
              </FadeUp>
            ) : (
              <FadeUp>
                <p className="text-white/20 text-sm sm:text-base leading-relaxed max-w-md">
                  感谢所有关心和支持浙江大学启真车队发展的个人与组织。
                </p>
              </FadeUp>
            )}
          </div>
        </div>

        {/* ───── CTA ───── */}
        <div className="pb-20 sm:pb-28 md:pb-40">
          <div className="section-container">
            <FadeUp delay={0.3}>
              <div className="text-center p-8 sm:p-12 md:p-16 rounded-3xl bg-white/[0.02] border border-white/5">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">想成为合作伙伴？</h3>
                <p className="mt-3 text-white/40 text-sm max-w-md mx-auto">
                  我们欢迎各类企业与机构以多种形式支持车队发展
                </p>
                <a
                  href="#contact"
                  className="btn-glass mt-8 px-8 py-3 text-sm tracking-wider rounded-full"
                >
                  联系我们
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ================================================================
           联系我们
           ================================================================ */}
      <section id="contact" className="py-20 sm:py-32 md:py-48 bg-black">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <FadeUp>
              <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
                07 — 联系我们
              </p>
              <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter leading-none">
                联系<span className="primary-text">我们</span>
              </h2>
              <p className="mt-4 sm:mt-6 text-white/40 text-sm sm:text-base leading-relaxed max-w-md">
                不论你是想了解车队详情、洽谈合作，还是有意加入我们——欢迎联系。
              </p>
              <div className="mt-12 space-y-8">
                {[
                  { label: '邮箱', value: 'qzracing@example.com' },
                  { label: '地址', value: '某某大学工程训练中心' },
                  { label: '社交媒体', value: '微博 / B站 / 抖音 @QZRacing' },
                ].map((info) => (
                  <div key={info.label}>
                    <p className="text-[10px] tracking-[0.2em] text-white/20">{info.label}</p>
                    <p className="mt-2 text-sm text-white/70">{info.value}</p>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-xl font-bold tracking-tight mb-8">发送消息</h3>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {[
                    { label: '姓名', type: 'text', placeholder: '你的姓名' },
                    { label: '邮箱', type: 'email', placeholder: 'your@email.com' },
                    { label: '主题', type: 'text', placeholder: '消息主题' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs tracking-[0.2em] text-white/30 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs tracking-[0.2em] text-white/30 mb-2">
                      消息
                    </label>
                    <textarea
                      rows={5}
                      placeholder="写下你想说的话..."
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-primary/50 transition-colors duration-300 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-glass w-full py-3 font-semibold text-sm tracking-wider rounded-full"
                  >
                    发送
                  </button>
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ================================================================
           页脚
           ================================================================ */}
      <footer className="py-16 sm:py-20 bg-black">
        <FadeUp>
          <div className="section-container flex flex-col items-center gap-6">
            <img src="/icons/teamlogo.svg" alt="QZ Racing Team" className="w-16 h-16 sm:w-20 sm:h-20 brightness-0 invert opacity-50" />
            <p className="text-[10px] sm:text-xs tracking-[0.2em] text-white/20">
              &copy; {new Date().getFullYear()} QZ RACING TEAM. ALL RIGHTS RESERVED.
            </p>
          </div>
        </FadeUp>
      </footer>
    </>
  )
}
