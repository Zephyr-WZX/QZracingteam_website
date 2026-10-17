import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FadeUp } from '@/components/animation'
import HomeHero from '@/components/HomeHero'
import RaceSchedule from '@/components/RaceSchedule'
import CarShowcase from '@/components/CarShowcase'
import PhotoWall from '@/components/PhotoWall'
import LogoLoop from '@/components/LogoLoop'
import CircularGallery from '@/components/CircularGallery'
import TeamRoster from '@/components/TeamRoster'
import { ALL_RACES } from '@/data/race'
import { MAIN_SPONSORS, PARTNERS, SPECIAL_THANKS } from '@/data/sponsors'
import { AWARDS } from '@/data/awards'
import { assetPath } from '@/utils'

const awardItems = AWARDS.map((award) => ({ ...award, image: assetPath(award.image) }))

gsap.registerPlugin(ScrollTrigger)

/* ================================================================
   首页 — 单页面滚动式布局
   区块顺序: Hero → 赛车 → 成就 → 队员 → 合作伙伴 → 联系我们
   ================================================================ */

export default function Home() {
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

  /* ================================================================
     全局入场动画 — 统一注册区块滚动入场
     ================================================================ */
  useEffect(() => {
    let localCtx: gsap.Context | null = null
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const compact = window.matchMedia('(max-width: 1023px)').matches

    const timer = setTimeout(() => {
      localCtx = gsap.context(() => {
        // FadeUp
        gsap.utils.toArray<HTMLElement>('[data-anim="fadeup"]').forEach((el) => {
          const delay = parseFloat(el.dataset.delay || '0')
          const y = compact ? 24 : parseFloat(el.dataset.y || '60')
          const dur = compact ? 0.5 : parseFloat(el.dataset.duration || '0.8')
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
    if (window.matchMedia('(max-width: 1023px), (prefers-reduced-motion: reduce)').matches) return
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
    <div className="site-home">
      <HomeHero />

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
              src={assetPath(ALL_RACES[raceIndex].trackImage!)}
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
           成就
           ================================================================ */}
      <section id="feats" className="pt-6 sm:pt-12 md:pt-16 pb-20 sm:pb-32 md:pb-48 bg-black">
        <div className="section-container">
          <FadeUp className="mb-2 sm:mb-4">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-primary-light/60 mb-4">
              04 — 成就
            </p>
            <h2 className="text-[2rem] sm:text-display-sm md:text-display-md font-black tracking-tighter">
              团队<span className="primary-text">成就</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-white/40 text-sm sm:text-base leading-relaxed max-w-md">
              多年征战，累累硕果。每一张证书都记录着车队的拼搏与成长。
            </p>
          </FadeUp>
        </div>

        {/* CircularGallery — 全宽 WebGL 3D 展示 */}
        <div className="mt-0 sm:mt-2 h-[420px] sm:h-[500px]" style={{ position: 'relative' }}>
          <CircularGallery
            items={awardItems}
            bend={2}
            textColor="#ffffff"
            borderRadius={0.1}
            scrollEase={0.02}
            font="bold 30px 'Noto Sans SC', sans-serif"
          />
        </div>
      </section>

      {/* ================================================================
           队员
           ================================================================ */}
      <section id="team" className="pt-8 sm:pt-12 md:pt-20 pb-20 sm:pb-32 md:pb-48 bg-black">
        <div className="section-container">
          <FadeUp className="mb-8 sm:mb-12">
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

          <TeamRoster />
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
                06 — 合作伙伴
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
              {MAIN_SPONSORS.map((s) => {
                const img = (
                  <img
                    src={assetPath(s.logo)}
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
                src: assetPath(s.logo),
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
                        src={assetPath(s.logo)}
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
      </section>

      {/* ================================================================
           联系我们
           ================================================================ */}
      <section id="contact" className="py-20 sm:py-32 md:py-48 bg-black">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
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
                  { label: '队长邮箱', value: '867682320@qq.com' },
                  { label: '车库地址', value: '浙江大学玉泉校区动力机械及车辆研究所' },
                ].map((info) => (
                  <div key={info.label}>
                    <p className="text-[10px] tracking-[0.2em] text-white/20">{info.label}</p>
                    <p className="mt-2 text-sm text-white/70">{info.value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-white/20 mb-3">社交媒体</p>
                  <div className="flex items-center gap-4">
                    {[
                      { label: 'Bilibili', icon: '/icons/media/bilibili.svg', url: 'https://b23.tv/wB9bBKg' },
                      { label: '小红书', icon: '/icons/media/小红书.svg', url: 'https://xhslink.com/m/1lrYvV8RIOT' },
                      { label: '微信公众号', icon: '/icons/media/微信公众号.svg', url: 'https://mp.weixin.qq.com/s/-dsM_FGY_mkirlu4JdsNJg' },
                      { label: '抖音', icon: '/icons/media/抖音.svg', url: 'https://www.douyin.com/user/MS4wLjABAAAAVykikE32q-6pblU0lnC_JhFtWyYtHyCkH9arvJr6fqo' },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        title={s.label}
                        className="flex h-11 w-11 items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
                      >
                        <img src={assetPath(s.icon)} alt={s.label} className="w-6 h-6 brightness-0 invert" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="rounded-2xl overflow-hidden border border-white/5 aspect-video">
                <iframe
                  src="//player.bilibili.com/player.html?bvid=BV1J1QZBbExS&page=1&autoplay=0"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>


    </div>
  )
}
