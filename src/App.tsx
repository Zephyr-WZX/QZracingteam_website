import { BrowserRouter } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppRoutes from './routes'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { assetPath } from '@/utils'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const curtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(curtainRef.current, { height: 0 })
      return
    }
    // 入场帷幕动画
    const tl = gsap.timeline()
    tl.set(curtainRef.current, { height: '100vh' })
    tl.to(curtainRef.current, {
      height: '0vh',
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.3,
    })
    return () => { tl.kill() }
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* 入场帷幕 */}
      <div ref={curtainRef} className="curtain">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5">
          <img
            src={assetPath('icons/zju-qsy-outline.svg')}
            alt="ZJU"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
          />
          <div className="w-px h-20 sm:h-28 md:h-36 bg-white/40" />
          <img
            src={assetPath('icons/teamlogo.svg')}
            alt="QZ Racing Team"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>

      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  )
}
