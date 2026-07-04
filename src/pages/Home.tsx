import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { FadeUp, CurtainReveal } from '@/components/animation'

/* ================================================================
   首页 — 单页面滚动式布局
   区块顺序: Hero → 赛车 → 成就 → 队员 → 合作伙伴 → 联系我们
   ================================================================ */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 120 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 1 },
      )
      gsap.fromTo(
        '.hero-sub',
        { opacity: 0, y: 40 },
        { opacity: 0.6, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.4 },
      )
      gsap.fromTo(
        '.hero-cta',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.7 },
      )
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
      {/* ================================================================
           Hero — 首页交互效果
           ================================================================ */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,75,145,0.12)_0%,transparent_70%)]" />

        <div className="relative z-10 text-center section-container">
          <p className="hero-sub text-sm md:text-base tracking-[0.3em] text-white/60 mb-6">
            QZ Racing Team &middot; Formula Student
          </p>
          <h1 className="hero-title text-display-md md:text-display-lg lg:text-display-xl font-black text-white tracking-tighter">
            速度<span className="primary-text">&middot;</span>激情
          </h1>
          <p className="hero-sub mt-8 text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            以工程创新驱动极限，用团队协作征服赛道
          </p>
          <div className="hero-cta mt-12 flex items-center justify-center gap-6">
            <a
              href="#cars"
              className="px-8 py-3 bg-primary text-white font-semibold text-sm tracking-wider rounded-full hover:bg-primary-light transition-all duration-300 hover:scale-105"
            >
              探索赛车
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-white/20 text-white/80 font-medium text-sm tracking-wider rounded-full hover:border-primary-light hover:text-primary-light transition-all duration-300"
            >
              联系我们
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
          <span className="text-[10px] tracking-[0.3em] text-white/30">滚动探索</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ================================================================
           赛车区域
           ================================================================ */}
      <section id="cars" className="py-32 md:py-48 bg-black relative">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeUp>
              <p className="text-[11px] tracking-[0.3em] text-primary-light/60 mb-4">
                01 — 赛车
              </p>
              <h2 className="text-display-sm md:text-display-md font-black tracking-tighter leading-none">
                我们的<span className="primary-text">赛车</span>
              </h2>
              <p className="mt-6 text-white/40 text-base leading-relaxed max-w-md">
                从概念设计到赛道验证——每一台赛车都是工程智慧的结晶。
                碳纤维车身、自研电控、空气动力学套件，只为极致的圈速。
              </p>
              <div className="mt-8 flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black primary-text">3.2<span className="text-sm">s</span></p>
                  <p className="text-[10px] tracking-wider text-white/20 mt-1">0-100 km/h</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl font-black primary-text">220<span className="text-sm">kg</span></p>
                  <p className="text-[10px] tracking-wider text-white/20 mt-1">车重</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl font-black primary-text">120<span className="text-sm">+</span></p>
                  <p className="text-[10px] tracking-wider text-white/20 mt-1">极速 km/h</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="aspect-[4/3] rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden">
                <span className="text-white/10 text-7xl">🏎️</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ================================================================
           成就 / 技术亮点
           ================================================================ */}
      <section id="feats" className="py-32 md:py-48 bg-black-deep">
        <div className="section-container">
          <FadeUp className="mb-20">
            <p className="text-[11px] tracking-[0.3em] text-primary-light/60 mb-4">
              02 — 成就
            </p>
            <h2 className="text-display-sm md:text-display-md font-black tracking-tighter">
              赛道<span className="primary-text">成就</span>
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
                <div key={stat.label} className="p-10 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-5xl md:text-6xl font-black primary-text tracking-tight">
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
                  className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500"
                >
                  <h3 className="text-xl font-bold tracking-tight">{feat.title}</h3>
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
      <section id="team" className="py-32 md:py-48 bg-black">
        <div className="section-container">
          <FadeUp className="mb-20">
            <p className="text-[11px] tracking-[0.3em] text-primary-light/60 mb-4">
              03 — 队员
            </p>
            <h2 className="text-display-sm md:text-display-md font-black tracking-tighter">
              我们的<span className="primary-text">队员</span>
            </h2>
            <p className="mt-6 text-white/40 text-base max-w-md leading-relaxed">
              每一位成员都是车队不可或缺的力量。从设计到制造，从测试到赛场，
              我们用专业和热情推动车队前进。
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '队长', role: '技术总监', dept: '管理部' },
              { name: '副队长', role: '底盘组长', dept: '技术部' },
              { name: '电控组长', role: 'ECU 开发', dept: '技术部' },
              { name: '空力组长', role: 'CFD 工程师', dept: '技术部' },
              { name: '车手', role: '测试 & 比赛', dept: '运营部' },
              { name: '运营组长', role: '赞助 & 宣传', dept: '运营部' },
              { name: '悬架工程师', role: '动力学仿真', dept: '技术部' },
              { name: '电控工程师', role: '线束 & PCB', dept: '技术部' },
            ].map((member, i) => (
              <FadeUp key={`${member.role}-${i}`} delay={i * 0.06}>
                <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500">
                  <div className="aspect-square rounded-xl bg-white/[0.03] flex items-center justify-center mb-5 overflow-hidden">
                    <span className="text-white/10 text-4xl group-hover:scale-110 transition-transform duration-500">
                      👤
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{member.name}</h3>
                  <p className="mt-1 text-sm text-primary-light/80">{member.role}</p>
                  <p className="mt-1 text-xs text-white/20">{member.dept}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
           合作伙伴
           ================================================================ */}
      <section id="partners" className="py-32 md:py-48 bg-black-deep">
        <div className="section-container">
          <FadeUp className="mb-20">
            <p className="text-[11px] tracking-[0.3em] text-primary-light/60 mb-4">
              04 — 合作伙伴
            </p>
            <h2 className="text-display-sm md:text-display-md font-black tracking-tighter">
              合作<span className="primary-text">伙伴</span>
            </h2>
            <p className="mt-6 text-white/40 text-base max-w-md leading-relaxed">
              感谢每一位赞助商的支持。正是你们的信任与投入，让工程梦想在赛道上驰骋。
            </p>
          </FadeUp>

          {(['铂金合作伙伴', '黄金合作伙伴', '白银合作伙伴'] as const).map((tier, tierI) => (
            <FadeUp key={tier} delay={tierI * 0.15}>
              <div className={tierI > 0 ? 'mt-14' : ''}>
                <h3 className="text-xs tracking-[0.3em] text-white/20 mb-6">{tier}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: tierI === 0 ? 2 : tierI === 1 ? 3 : 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="aspect-[3/2] bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center hover:border-primary/30 transition-all duration-500"
                    >
                      <span className="text-white/10 text-sm tracking-wider">赞助商</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}

          <FadeUp delay={0.5}>
            <div className="mt-20 text-center p-16 rounded-3xl bg-white/[0.02] border border-white/5">
              <h3 className="text-2xl font-bold tracking-tight">想成为合作伙伴？</h3>
              <p className="mt-3 text-white/40 text-sm max-w-md mx-auto">
                我们欢迎各类企业与机构以多种形式支持车队发展
              </p>
              <a
                href="#contact"
                className="inline-block mt-8 px-8 py-3 bg-primary text-white font-semibold text-sm tracking-wider rounded-full hover:bg-primary-light transition-all duration-300"
              >
                联系我们
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================
           联系我们
           ================================================================ */}
      <section id="contact" className="py-32 md:py-48 bg-black">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <FadeUp>
              <p className="text-[11px] tracking-[0.3em] text-primary-light/60 mb-4">
                05 — 联系我们
              </p>
              <h2 className="text-display-sm md:text-display-md font-black tracking-tighter leading-none">
                联系<span className="primary-text">我们</span>
              </h2>
              <p className="mt-6 text-white/40 text-base leading-relaxed max-w-md">
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
              <div className="p-10 rounded-2xl bg-white/[0.02] border border-white/5">
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
                    className="w-full py-3 bg-primary text-white font-semibold text-sm tracking-wider rounded-full hover:bg-primary-light transition-all duration-300"
                  >
                    发送
                  </button>
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  )
}
