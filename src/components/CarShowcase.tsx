import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ALL_CARS } from '@/data/cars'
import { FadeUp } from '@/components/animation'
import { assetPath } from '@/utils'

export default function CarShowcase() {
  const [index, setIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const total = ALL_CARS.length

  const car = ALL_CARS[index]
  if (!car) return <p className="text-white/30 text-sm">暂无赛车数据</p>

  const numMatch = car.number.match(/^([A-Za-z]*)(\d+)$/)
  const letters = numMatch?.[1] ?? ''
  const digits = numMatch?.[2] ?? car.number

  const prevIdx = index > 0 ? index - 1 : total - 1
  const nextIdx = index < total - 1 ? index + 1 : 0
  const prevNumber = ALL_CARS[prevIdx].number
  const nextNumber = ALL_CARS[nextIdx].number

  const prev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : total - 1)), [total])
  const next = useCallback(() => setIndex((i) => (i < total - 1 ? i + 1 : 0)), [total])

  // 翻页时：左侧编号/图片淡入
  useEffect(() => {
    if (!listRef.current) return
    gsap.fromTo(listRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
  }, [index])

  // 翻页时：右侧参数面板从右滑入
  useEffect(() => {
    if (!rightRef.current) return
    gsap.fromTo(rightRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' })
  }, [index])

  return (
    <FadeUp>
      <div ref={sectionRef} className="grid min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-0 lg:min-h-[600px]">
        {/* ===== 左侧：赛车编号 + 侧视图 ===== */}
        <div className="flex min-h-[300px] min-w-0 flex-col sm:min-h-[420px] lg:min-h-[600px] lg:pr-10">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-300 shrink-0"
              aria-label="上一台"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
            <span className="text-sm sm:text-base font-bold tracking-[0.1em] text-white/25">{prevNumber}</span>
          </div>

          <div ref={listRef} className="relative flex items-center justify-center w-full flex-1 mt-4 sm:mt-8">
            <span
              className="text-[clamp(5rem,28vw,14rem)] lg:text-[18rem] xl:text-[22rem] tracking-tighter leading-none tabular-nums select-none pointer-events-none absolute inset-0 flex items-center justify-center -translate-y-8 sm:-translate-y-16 lg:-translate-y-24"
              style={{ fontFamily: "'Archivo Black', 'Russo One', sans-serif" }}
            >
              {letters && <span style={{ color: car.letterColor ?? '#ffffff', opacity: 0.6 }}>{letters}</span>}
              <span style={{ color: car.numberColor ?? '#3388CC', opacity: 0.8 }}>{digits}</span>
            </span>
            <img
              src={assetPath(car.imagePath)}
              alt={car.name}
              className="relative z-10 w-full max-w-[640px] sm:max-w-[840px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-300 shrink-0"
              aria-label="下一台"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <span className="text-sm sm:text-base font-bold tracking-[0.1em] text-white/25">{nextNumber}</span>
          </div>

          <span className="mt-3 text-[10px] tracking-[0.3em] text-white/15 self-center">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* ===== 右侧：描述 + 技术参数 ===== */}
        <div ref={rightRef} className="flex min-w-0 flex-col items-center justify-center lg:pl-10">
          <p className="text-2xl sm:text-4xl lg:text-6xl text-white mb-6 sm:mb-10 lg:mb-20 text-center leading-relaxed font-black tracking-tighter">
            {car.desc}
          </p>
          <div className="grid w-full max-w-xl grid-cols-2 sm:grid-cols-3 gap-x-5 sm:gap-x-10 gap-y-5 sm:gap-y-6">
            {car.specs.map((s) => (
              <div key={s.label} className="flex min-w-0 flex-col items-center text-center">
                <span className="max-w-full break-words text-xl sm:text-3xl font-black text-white tabular-nums">{s.value}</span>
                <span className="text-xs tracking-[0.12em] text-white/60 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeUp>
  )
}
