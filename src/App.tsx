import { BrowserRouter } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppRoutes from './routes'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const curtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 入场帷幕动画 — height 收缩 + 底部抛物线曲率从 0 变大
    const tl = gsap.timeline()
    tl.set(curtainRef.current, {
      height: '100vh',
      '--curve': 0,
    })
    tl.to(curtainRef.current, {
      height: '0vh',
      '--curve': 1,
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.3,
    })
  }, [])

  return (
    <BrowserRouter>
      {/* 入场帷幕 */}
      <div ref={curtainRef} className="curtain">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5">
          <img
            src="/icons/zju-qsy-outline.svg"
            alt="ZJU"
            className="w-40 h-40 md:w-35 md:h-35"
          />
          <div className="w-0.5 px h-32 md:h-36 bg-white/40" />
          <img
            src="/icons/teamlogo.svg"
            alt="QZ Racing Team"
            className="w-40 h-40 md:w-48 md:h-48"
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
