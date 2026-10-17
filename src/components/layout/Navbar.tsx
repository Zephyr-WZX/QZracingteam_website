import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { assetPath } from '@/utils'
import '../../styles/navigation.css'

const MENU_ITEMS = [
  { label: '赛车', anchor: 'cars' },
  { label: '赛程', anchor: 'races' },
  { label: '照片', anchor: 'photos' },
  { label: '成就', anchor: 'feats' },
  { label: '队员', anchor: 'team' },
  { label: '合作伙伴', anchor: 'partners' },
  { label: '联系我们', anchor: 'contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // 路由变化时关闭菜单
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // 打开菜单时的滚动锁
  useEffect(() => {
    const html = document.documentElement
    const nav = navRef.current
    if (!nav) return

    if (menuOpen) {
      const scrollbarW = window.innerWidth - html.clientWidth
      html.style.overflow = 'hidden'
      html.style.paddingRight = `${scrollbarW}px`
      nav.style.paddingRight = `${scrollbarW}px`
    }

    return () => {
      html.style.overflow = ''
      html.style.paddingRight = ''
      nav.style.paddingRight = ''
    }
  }, [menuOpen])

  // 菜单入场动画：从菜单按钮位置做圆形裁剪展开
  useLayoutEffect(() => {
    if (!menuOpen) return

    const btn = menuBtnRef.current
    if (!btn) return

    // 计算圆形裁剪的原点（按钮中心相对于视口左上角）
    const btnRect = btn.getBoundingClientRect()
    const cx = btnRect.left + btnRect.width / 2
    const cy = btnRect.top + btnRect.height / 2
    // 展开到覆盖整个屏幕所需的最小半径
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    )

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // 圆形裁剪展开
      tl.fromTo(
        '.menu-overlay',
        {
          clipPath: `circle(20px at ${cx}px ${cy}px)`,
          opacity: 0.8,
        },
        { clipPath: `circle(${radius}px at ${cx}px ${cy}px)`, opacity: 1, duration: 0.65, ease: 'power3.inOut' },
      )

      // 菜单项入场
      tl.fromTo(
        menuItemsRef.current.filter(Boolean),
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' },
        '-=0.35',
      )
    })

    return () => ctx.revert()
  }, [menuOpen])

  // 关闭菜单的通用方法
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  // Logo 点击：已在首页则滚回顶部，否则导航到首页
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      closeMenu()
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
    },
    [location.pathname, navigate, closeMenu],
  )

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
    <>
      <nav
        ref={navRef}
        className={`site-nav fixed top-0 left-0 right-0 ${
          menuOpen ? 'z-[60]' : 'z-50'
        }`}
      >
        <div className="section-container flex items-center justify-between">
          {/* ===== 左侧：Logo（菜单打开时隐藏，点击回首页） ===== */}
          {!menuOpen && (
            <a
              href={import.meta.env.BASE_URL}
              className="nav-brand"
              onClick={handleLogoClick}
            >
              <img src={assetPath('icons/teamlogo.svg')} alt="QZ Racing" className="w-7 h-7 sm:w-8 sm:h-8 brightness-0 invert" />
              <span className="nav-wordmark">QZ RACING</span>
            </a>
          )}

          {/* ===== 右侧：胶囊按钮 ===== */}
          <div className="nav-actions">
            {/* 联系我们（菜单打开时隐藏） */}
            {!menuOpen && (
              <button
                onClick={() => handleMenuClick('contact')}
                className="nav-contact"
              >
                联系我们
              </button>
            )}

            {/* 菜单 / 关闭 */}
            <button
              ref={menuBtnRef}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="nav-menu-button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            >
              <span>{menuOpen ? '关闭' : '菜单'}</span>
              <svg className="nav-menu-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                {menuOpen
                  ? <path d="m6 6 12 12M6 18 18 6" />
                  : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== 全屏菜单 Overlay ===== */}
      {menuOpen && (
        <div
          ref={overlayRef}
          id="site-menu"
          className="menu-overlay fixed inset-0 z-[55] overflow-y-auto"
          style={{
            backgroundImage: `url(${assetPath('images/nav-bg.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeMenu()
            }
          }}
        >
          {/* 主题色虚化遮盖 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'rgba(0, 50, 100, 0.7)',
              backdropFilter: 'blur(24px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            }}
          />

          {/* 内容容器 */}
          <div className="section-container w-full py-24 md:py-0 md:h-full md:flex md:items-center relative z-[2]">
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
                  <span className="text-5xl md:text-8xl font-black tracking-tighter text-white/70 group-hover:text-primary-light transition-colors duration-300">
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
      )}
    </>
  )
}
