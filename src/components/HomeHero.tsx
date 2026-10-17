import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ALL_CARS } from '@/data/cars'
import { assetPath } from '@/utils'
import NextRace from './NextRace'
import '../styles/home.css'

const car = ALL_CARS[0]

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-reveal', { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, stagger: 0.1, delay: 0.5, ease: 'power3.out',
      })
      gsap.fromTo('.hero-machine img', { x: 45, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1.25, delay: 0.6, ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="hero-section editorial-hero" ref={ref}>
      <div className="hero-blueprint" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-topline hero-reveal">
          <span><i /> ZHEJIANG UNIVERSITY</span>
          <span>FORMULA STUDENT TEAM <b> / </b> 杭州 · 中国</span>
        </div>

        <div className="hero-composition">
          <div className="hero-content">
            <p className="hero-identity hero-reveal">浙江大学启真车队 <span>始于热爱，成于工程。</span></p>
            <h1 className="hero-title hero-reveal" aria-label="QZ Racing 启真车队">
              <span>QZ</span><span className="hero-title-outline">RACING<span className="hero-period">.</span></span>
            </h1>
            <div className="hero-statement hero-reveal">
              <p>做难而正确的事情。</p>
              <span>DO THE HARD THING RIGHT.</span>
            </div>
            <div className="hero-cta hero-reveal">
              <a href="#cars" className="race-button race-button-primary">探索赛车 <span aria-hidden="true">↗</span></a>
              <a href="#team" className="race-button race-button-secondary">认识启真 <span aria-hidden="true">→</span></a>
            </div>
          </div>

          {car && <div className="hero-machine">
            <span className="hero-model-number" aria-hidden="true">{car.number}</span>
            <div className="hero-machine-label"><span>THE MACHINE</span><b>{car.name}</b></div>
            <div className="hero-floor" aria-hidden="true" />
            <img src={assetPath(car.heroImagePath ?? car.imagePath)} alt={`${car.name} 方程式赛车侧视图`} fetchPriority="high" decoding="async" width="2048" height="1080" />
            <div className="hero-machine-caption"><span>DESIGNED. BUILT. RACED.</span><span>自主设计 / 制造 / 验证</span></div>
          </div>}
        </div>

        <div className="hero-bottom hero-reveal">
          <div className="hero-telemetry">
            <div className="hero-telemetry-heading"><i /> ENGINEERING IN MOTION</div>
            <div className="hero-specifications">
              {car?.specs.slice(0, 3).map((spec) => <div key={spec.label}><strong>{spec.value}</strong><span>{spec.label}</span></div>)}
            </div>
            <span className="hero-spec-note">{car?.number} 赛车参数</span>
          </div>
          <div className="hero-race"><NextRace /></div>
        </div>
        <a className="hero-explore" href="#cars"><span>从这里，看见我们的热爱</span><span>SCROLL TO EXPLORE <b>↓</b></span></a>
      </div>
    </section>
  )
}
