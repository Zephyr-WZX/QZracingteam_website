import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'

const MENU_ITEMS = [
  { label: '赛车', anchor: 'cars' },
  { label: '成就', anchor: 'feats' },
  { label: '队员', anchor: 'team' },
  { label: '合作伙伴', anchor: 'partners' },
  { label: '联系我们', anchor: 'contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)

  // 滚动检测
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 路由变化时关闭菜单
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // 打开/关闭菜单时的 body 滚动锁 & 动画
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      const ctx = gsap.context(() => {
        gsap.set(overlayRef.current, { display: 'flex' })
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power3.out' },
        )
        gsap.fromTo(
          menuItemsRef.current.filter(Boolean),
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, stagger: 0.07, duration: 0.6, ease: 'power3.out', delay: 0.15 },
        )
      })
      return () => {
        document.body.style.overflow = ''
        ctx.revert()
      }
    }
  }, [menuOpen])

  // 关闭菜单的通用方法
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  // 点击菜单项：锚点跳转
  const handleMenuClick = useCallback(
    (anchor: string) => {
      closeMenu()
      if (location.pathname !== '/') {
        navigate(`/#${anchor}`)
      } else {
        // 延迟等 menu 关闭动画后再滚动
        setTimeout(() => {
          const el = document.getElementById(anchor)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    },
    [location.pathname, navigate, closeMenu],
  )

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* ===== 左侧：Logo ===== */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter select-none"
          onClick={closeMenu}
        >
          <span className="primary-text">QZ</span>
          <span className="text-white/80 font-medium ml-1">RACING</span>
        </Link>

        {/* ===== 右侧：联系我们 胶囊 + 菜单 ===== */}
        <div className="flex items-center gap-4">
          {/* 联系我们 胶囊按钮 */}
          <button
            onClick={() => handleMenuClick('contact')}
            className="px-5 py-2 rounded-full border border-white/20 text-white/80 text-sm font-medium tracking-wider hover:border-primary-light hover:text-primary-light transition-all duration-300"
          >
            联系我们
          </button>

          {/* 菜单 汉堡 */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium tracking-wider text-white/80 hover:text-primary-light transition-colors duration-300"
            aria-label="切换菜单"
          >
            <span>{menuOpen ? '关闭' : '菜单'}</span>
            <div className="flex flex-col gap-1.5 w-5 h-4 justify-center">
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-[5px] w-5' : 'w-5'
                }`}
              />
              <span
                className={`block h-[1.5px] bg-current transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-[5px] w-5' : 'w-3 ml-auto'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ===== 全屏菜单 Overlay ===== */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black z-40 flex items-center"
        style={{ display: 'none' }}
        onClick={(e) => {
          // 点击 overlay 背景（非菜单项）关闭菜单
          if (e.target === e.currentTarget) {
            closeMenu()
          }
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={closeMenu}
          className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300"
          aria-label="关闭菜单"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        <div className="section-container w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-6">
            {MENU_ITEMS.map((item, i) => (
              <button
                key={item.anchor}
                ref={(el) => {
                  menuItemsRef.current[i] = el
                }}
                onClick={() => handleMenuClick(item.anchor)}
                className="text-left group flex items-center gap-6 py-3"
              >
                <span className="text-[10px] tracking-[0.3em] text-white/20 w-8">
                  0{i + 1}
                </span>
                <span className="text-5xl md:text-7xl font-black tracking-tighter text-white/70 group-hover:text-primary-light transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-primary-light text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  &#8599;
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
