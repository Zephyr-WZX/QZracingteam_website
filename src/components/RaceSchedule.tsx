import { useState, useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ALL_RACES } from '@/data/race'
import TrackIcon from '@/components/TrackIcon'
import { FadeUp } from '@/components/animation'

function fmtDay(iso: string) {
  return String(new Date(iso).getDate()).padStart(2, '0')
}
function fmtMY(iso: string) {
  const d = new Date(iso)
  return `${String(d.getMonth() + 1).padStart(2, '0')} · ${d.getFullYear()}`
}

/** 以当前 index 为中心取可见窗口（前后各 1 条） */
function visibleWindow(index: number, total: number) {
  const prev = index > 0 ? index - 1 : total - 1
  const next = index < total - 1 ? index + 1 : 0
  return [prev, index, next]
}

export default function RaceSchedule() {
  const [index, setIndex] = useState(0)
  const [animDir, setAnimDir] = useState<'up' | 'down'>('down')
  const listRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const total = ALL_RACES.length

  const race = ALL_RACES[index]
  if (!race) return <p className="text-white/30 text-sm">暂无赛事数据</p>

  const prev = () => {
    setAnimDir('up')
    setIndex((i) => (i > 0 ? i - 1 : total - 1))
  }
  const next = () => {
    setAnimDir('down')
    setIndex((i) => (i < total - 1 ? i + 1 : 0))
  }

  const visible = useMemo(() => visibleWindow(index, total), [index, total])

  /* 左侧列表动画 */
  useEffect(() => {
    if (!listRef.current) return
    gsap.fromTo(
      listRef.current,
      { opacity: 0, y: animDir === 'down' ? 20 : -20 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
    )
  }, [index])

  /* 右侧入场动画 */
  useEffect(() => {
    if (!rightRef.current) return
    gsap.fromTo(rightRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' })
  }, [index])

  return (
    <FadeUp>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 items-center">
        {/* ===== 左侧：滚动日期列表（下移） ===== */}
        <div className="flex flex-col items-center justify-center pt-12 sm:pt-16 pr-6 lg:pr-10">
          {/* 上按钮 */}
          <button
            onClick={prev}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-300 mb-4"
            aria-label="上一场"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>

          {/* 可见日期列表（3 条：前 - 当前 - 后） */}
          <div ref={listRef} className="flex flex-col items-center gap-3 sm:gap-4 my-3">
            {visible.map((i) => {
              const r = ALL_RACES[i]
              const active = i === index
              return (
                <button
                  key={r.date}
                  onClick={() => {
                    setAnimDir(i > index ? 'down' : 'up')
                    setIndex(i)
                  }}
                  className={`group flex items-center gap-4 sm:gap-5 text-left ${
                    active ? 'opacity-100 scale-100' : 'opacity-20 hover:opacity-40 scale-90'
                  }`}
                >
                  <span
                    className={`text-[2.8rem] sm:text-[3.5rem] md:text-[4.2rem] font-black leading-none tabular-nums ${
                      active ? 'text-white' : 'text-white/30'
                    }`}
                  >
                    {fmtDay(r.date)}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <img src={`/${r.flagIconPath}`} alt="" className="w-5 h-4 sm:w-6 sm:h-5 object-contain" />
                    <span
                      className={`text-[10px] sm:text-xs tracking-[0.12em] leading-none whitespace-nowrap ${
                        active ? 'text-white/50' : 'text-white/15'
                      }`}
                    >
                      {fmtMY(r.date)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 下按钮 */}
          <button
            onClick={next}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-300 mt-4"
            aria-label="下一场"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* 页码 */}
          <span className="mt-4 text-[10px] tracking-[0.3em] text-white/15">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* 中间：装饰横线 */}
        <div className="hidden lg:flex flex-col items-center justify-center self-stretch pl-0 pr-8">
          <div className="w-20 sm:w-28 h-1 bg-white/40 -translate-x-[150%] translate-y-2" />
        </div>

        {/* ===== 右侧：赛道图 + 赛事信息 ===== */}
        <div ref={rightRef} className="flex flex-col items-center justify-start -mt-8 lg:-mt-12 pl-6 lg:pl-10">
          {/* 赛道图标 */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ background: `radial-gradient(circle at center, ${race.iconColor}, transparent 60%)` }}
            />
            <TrackIcon
              className="w-full max-w-[200px] sm:max-w-[260px] h-auto"
              fill={race.iconColor}
              style={{ opacity: race.iconOpacity / 100 }}
            />
          </div>

          {/* 赛事名称 */}
          <h3 className="mt-4 sm:mt-5 text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-black tracking-tighter text-white leading-[1.05] text-center">
            {race.name}
          </h3>

          {/* 地点 + 介绍 */}
          <div className="mt-3 sm:mt-4 flex flex-col items-center gap-1.5">
            <p className="text-xl sm:text-3xl tracking-[0.15em] text-[#3388CC] font-medium">{race.location}</p>
            <p className="text-sm sm:text-base text-white/35 leading-relaxed max-w-md text-center">{race.desc}</p>
          </div>

          {/* 状态标签 */}
          <span className="mt-4 inline-block text-[10px] tracking-[0.3em] rounded-full px-3 py-1.5 bg-white/[0.06] backdrop-blur-md border-none text-white/60">
            {race.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
          </span>

          {/* 战绩 */}
          {race.status === 'completed' && race.result && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {race.result.map((line, i) => (
                <span
                  key={i}
                  className="text-xs sm:text-sm font-bold tracking-wider text-primary bg-primary/10 rounded-full px-4 py-1.5"
                >
                  {line}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeUp>
  )
}
