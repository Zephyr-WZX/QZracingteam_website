import { useEffect, useCallback, useRef } from 'react'

/**
 * 使用 GSAP ScrollTrigger 的通用 section 入场动画 hook
 * 返回一个 ref 绑定到需要触发动画的容器上
 */
export function useScrollTrigger(options?: {
  start?: string
  end?: string
  scrub?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { start = 'top 85%', end = 'bottom top', scrub = false } = options ?? {}

  const getRef = useCallback(() => ref, [])

  useEffect(() => {
    // 返回 ref 供外部使用，由 ScrollReveal 组件统一管理
  }, [])

  return { ref, start, end, scrub, getRef }
}

/**
 * 节流 hook — 用于高频率的 scroll/resize 事件
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): T {
  const lastRun = useRef(0)

  return useCallback(
    (...args: unknown[]) => {
      const now = Date.now()
      if (now - lastRun.current >= delay) {
        lastRun.current = now
        fn(...args)
      }
    },
    [fn, delay],
  ) as unknown as T
}
