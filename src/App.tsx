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
    // 入场帷幕动画
    const tl = gsap.timeline()
    tl.set(curtainRef.current, { scaleY: 1, transformOrigin: 'top' })
    tl.to(curtainRef.current, {
      scaleY: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.3,
    })
  }, [])

  return (
    <BrowserRouter>
      {/* 入场帷幕 */}
      <div ref={curtainRef} className="curtain" />

      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  )
}
