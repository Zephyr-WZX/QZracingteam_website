import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Home from '@/pages/Home'

export default function AppRoutes() {
  const location = useLocation()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
      <div className="page-curtain fixed inset-0 z-[9998] bg-primary scale-y-0 pointer-events-none" />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}
