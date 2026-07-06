'use client'

import { useRef } from 'react'

/**
 * 轻量动画标记组件 — 不创建自己的 ScrollTrigger。
 * 仅渲染一个带 data-anim-* 属性的 div，由全局 ST batch 统一触发。
 */

const defaultDelay = '0'
const defaultY = '60'
const defaultDur = '0.8'

export function FadeUp({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 60,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={className}
      data-anim="fadeup"
      data-delay={delay ?? defaultDelay}
      data-duration={duration ?? defaultDur}
      data-y={y ?? defaultY}
    >
      {children}
    </div>
  )
}

export function CurtainReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className={`overflow-hidden ${className}`} data-anim="curtain">
      {children}
    </div>
  )
}

export function FadeUpStagger({
  children,
  className = '',
  stagger = 0.06,
  duration = 0.6,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
  duration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={className}
      data-anim="stagger"
      data-stagger={stagger}
      data-duration={duration}
    >
      {children}
    </div>
  )
}

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
  return (
    <div ref={ref} className={className} data-anim="parallax" data-speed={speed}>
      {children}
    </div>
  )
}
