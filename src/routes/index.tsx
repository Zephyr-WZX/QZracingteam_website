import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Car from '@/pages/Car'
import Team from '@/pages/Team'
import Sponsors from '@/pages/Sponsors'
import Gallery from '@/pages/Gallery'
import Contact from '@/pages/Contact'

export default function AppRoutes() {
  const location = useLocation()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 页面切换：帷幕过渡 + 滚动到顶
    const ctx = gsap.context(() => {
      const curtain = document.querySelector('.page-curtain') as HTMLElement
      if (!curtain) return

      const tl = gsap.timeline()
      tl.set(curtain, { scaleY: 0, transformOrigin: 'bottom' })
      tl.to(curtain, {
        scaleY: 1,
        duration: 0.5,
        ease: 'power3.inOut',
      })
      tl.to(curtain, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.5,
        ease: 'power3.inOut',
      })

      window.scrollTo(0, 0)
    }, pageRef)

    return () => ctx.revert()
  }, [location.pathname])

  return (
    <div ref={pageRef}>
      {/* 页面切换帷幕 */}
      <div className="page-curtain fixed inset-0 z-[9998] bg-neon scale-y-0 pointer-events-none" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/car" element={<Car />} />
        <Route path="/team" element={<Team />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}
