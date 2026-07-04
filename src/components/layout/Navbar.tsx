import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const NAV_ITEMS = [
  { path: '/', label: '首页' },
  { path: '/about', label: '关于我们' },
  { path: '/car', label: '赛车' },
  { path: '/team', label: '队员' },
  { path: '/sponsors', label: '赞助商' },
  { path: '/gallery', label: '图库' },
  { path: '/contact', label: '联系我们' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuItemsRef.current.filter(Boolean),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out' },
      )
    })
    return () => ctx.revert()
  }, [menuOpen])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter select-none"
        >
          <span className="neon-text">QZ</span>
          <span className="text-white/80 font-medium ml-1">RACING</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 neon-underline ${
                location.pathname === item.path
                  ? 'text-neon'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 w-7 h-5 justify-center relative z-[100]"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[2px] bg-white transition-all duration-300 origin-center ${
              menuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block h-[2px] bg-white transition-all duration-300 origin-center ${
              menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.path}
                to={item.path}
                ref={(el) => { menuItemsRef.current[i] = el }}
                className={`text-4xl font-display font-bold tracking-tight transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'neon-text'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
