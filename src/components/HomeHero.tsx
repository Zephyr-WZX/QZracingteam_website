import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { assetPath } from '@/utils'
import '../styles/home.css'
import '../styles/hero.css'

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.automotive-hero__image', { scale: 1.035 }, {
        scale: 1, duration: 2.4, delay: 0.3, ease: 'power2.out',
      })
      gsap.fromTo('.automotive-hero__reveal', { y: 16, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.12, delay: 0.7, ease: 'power2.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="editorial-hero automotive-hero" ref={ref} aria-labelledby="hero-title">
      <div className="automotive-hero__photograph">
        <img
          className="automotive-hero__image"
          src={assetPath('images/hero-front.webp')}
          alt="启真 E69 方程式赛车正面，蓝色车身与碳纤维前翼"
          fetchPriority="high"
          decoding="async"
          width="1672"
          height="940"
        />
      </div>
      <div className="automotive-hero__shade" aria-hidden="true" />
      <div className="automotive-hero__content">
        <p className="automotive-hero__identity automotive-hero__reveal">浙江大学</p>
        <h1 id="hero-title" className="automotive-hero__title automotive-hero__reveal">启真车队</h1>
        <p className="automotive-hero__wordmark automotive-hero__reveal">QZ RACING</p>
        <p className="automotive-hero__slogan automotive-hero__reveal">做难而正确的事情</p>
        <div className="automotive-hero__actions automotive-hero__reveal">
          <a href="#cars" className="btn-glass min-h-11 px-5 py-3 md:px-8 text-white/85 font-semibold text-sm md:text-base tracking-wider rounded-full">探索赛车</a>
          <a href="#contact" className="btn-glass min-h-11 px-5 py-3 md:px-8 text-white/85 font-semibold text-sm md:text-base tracking-wider rounded-full">联系我们</a>
        </div>
      </div>
      <a className="automotive-hero__scroll" href="#cars" aria-label="向下浏览赛车">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6" /></svg>
      </a>
    </section>
  )
}
