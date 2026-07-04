/**
 * 合并类名工具
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 缓动函数（与 GSAP 配合使用时的预设值参考）
 */
export const EASE = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  expo: 'power4.out',
} as const

/**
 * 滚动到指定元素
 */
export function scrollToElement(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
