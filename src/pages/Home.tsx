import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FadeUp, CurtainReveal } from '@/components/animation'

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero 标题逐字动效
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 120 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          delay: 1,
        },
      )
      gsap.fromTo(
        '.hero-sub',
        { opacity: 0, y: 40 },
        {
          opacity: 0.6,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 1.4,
        },
      )
      gsap.fromTo(
        '.hero-cta',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 1.7,
        },
      )

      // 滚动指示器
      gsap.to('.scroll-indicator', {
        y: 10,
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ========== Hero Section ========== */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* 背景视频/图片区域（占位） */}
        <div
          ref={videoRef}
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,255,0,0.06)_0%,transparent_70%)]" />

        <div className="relative z-10 text-center section-container">
          <p className="hero-sub text-sm md:text-base uppercase tracking-[0.3em] text-white/60 mb-6">
            QZ Racing Team · Formula Student
          </p>
          <h1 className="hero-title text-display-md md:text-display-lg lg:text-display-xl font-black text-white tracking-tighter">
            速度<span className="neon-text">·</span>激情
          </h1>
          <p className="hero-sub mt-8 text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            以工程创新驱动极限，用团队协作征服赛道
          </p>

          <div className="hero-cta mt-12 flex items-center justify-center gap-6">
            <a
              href="#intro"
              className="px-8 py-3 bg-neon text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:bg-neon-dim transition-all duration-300 hover:scale-105"
            >
              了解更多
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border border-white/20 text-white/80 font-medium text-sm uppercase tracking-wider rounded-full hover:border-white/60 hover:text-white transition-all duration-300"
            >
              联系我们
            </a>
          </div>
        </div>

        {/* 底部滚动提示 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ========== Intro Section ========== */}
      <section id="intro" className="py-32 md:py-48 bg-black relative">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeUp>
              <h2 className="text-display-sm md:text-display-md font-black tracking-tighter leading-none">
                我们是<span className="neon-text">赛车</span>
                <br />
                工程师
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="space-y-6 text-white/50 text-base md:text-lg leading-relaxed">
                <p>
                  QZ Racing Team 是一支由大学生组成的方程式赛车队。
                  我们每年设计、制造并测试一台完整的方程式赛车，参加
                  中国大学生方程式系列赛事。
                </p>
                <p>
                  从碳纤维单体壳到自研电控系统，从空气动力学套件到
                  悬架几何调校——我们追逐每一个百分之一秒的提升。
                </p>
                <p className="text-white/80 font-medium">
                  工程不止于图纸。我们在实践中锤炼，在赛道上验证。
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ========== Stats Marquee ========== */}
      <CurtainReveal>
        <section className="py-20 border-y border-white/5">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '8+', label: '年参赛历史' },
                { value: '50+', label: '团队成员' },
                { value: '0-100', label: '加速 (km/h) — 3.2s' },
                { value: '120+', label: '最高时速 (km/h)' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl md:text-5xl font-black neon-text tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </CurtainReveal>

      {/* ========== Preview Cards ========== */}
      <section className="py-32 md:py-48 bg-black">
        <div className="section-container">
          <FadeUp className="mb-20">
            <h2 className="text-display-sm md:text-display-md font-black tracking-tighter">
              探索<span className="neon-text">更多</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '赛车技术', desc: '了解我们的工程创新与设计理念', href: '/car' },
              { title: '队员风采', desc: '认识每一位为速度痴狂的团队成员', href: '/team' },
              { title: '精彩图库', desc: '赛道与工坊的每一个高光时刻', href: '/gallery' },
            ].map((card, i) => (
              <FadeUp key={card.href} delay={i * 0.15}>
                <a
                  href={card.href}
                  className="group block p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-neon/20 transition-all duration-500"
                >
                  <h3 className="text-2xl font-bold tracking-tight group-hover:neon-text transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-white/40 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                  <span className="inline-block mt-6 text-neon text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    → 了解更多
                  </span>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
