'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FadeUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}

/** 滚动触发淡入上移动画 */
export function FadeUp({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 60,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [delay, duration, y])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** 入场帷幕组件（用于页面 section 切换） */
export function CurtainReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

/** 水平视差滚动容器 */
export function ParallaxSection({
  children,
  speed = 0.3,
  className = '',
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: `${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
