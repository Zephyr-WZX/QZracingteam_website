import { useRef, useEffect, useMemo, useState } from 'react'
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

function calcTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** 以当前 index 为中心取可见窗口（前后各 1 条） */
function visibleWindow(index: number, total: number) {
  const prev = index > 0 ? index - 1 : total - 1
  const next = index < total - 1 ? index + 1 : 0
  return [prev, index, next]
}

interface Props {
  index: number
  onChange: (index: number, dir: 'up' | 'down') => void
  animDir: 'up' | 'down'
}

export default function RaceSchedule({ index, onChange, animDir }: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const total = ALL_RACES.length

  const race = ALL_RACES[index]
  if (!race) return <p className="text-white/30 text-sm">暂无赛事数据</p>

  const isUpcoming = race.status === 'upcoming'
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calcTimeLeft>>(
    () => isUpcoming ? calcTimeLeft(race.date) : null,
  )

  useEffect(() => {
    setTimeLeft(isUpcoming ? calcTimeLeft(race.date) : null)
    if (!isUpcoming) return
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(race.date)), 1000)
    return () => clearInterval(timer)
  }, [race.date, isUpcoming])

  const prev = () => onChange(index > 0 ? index - 1 : total - 1, 'up')
  const next = () => onChange(index < total - 1 ? index + 1 : 0, 'down')

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
      <div className="grid min-w-0 grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-0">
        {/* ===== 左侧：滚动日期列表（下移） ===== */}
        <div className="flex min-w-0 items-center justify-between gap-2 md:flex-col md:justify-center md:pt-12 md:pr-6 lg:pr-10">
          {/* 上按钮 */}
          <button
            onClick={prev}
            className="h-11 w-11 shrink-0 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all duration-300 md:mb-4"
            aria-label="上一场"
          >
            <svg className="-rotate-90 md:rotate-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>

          {/* 可见日期列表（3 条：前 - 当前 - 后） */}
          <div ref={listRef} className="flex min-w-0 flex-1 items-center justify-center gap-1 md:my-3 md:flex-col md:gap-4">
            {visible.map((i) => {
              const r = ALL_RACES[i]
              const active = i === index
              return (
                <button
                  key={r.date}
                  onClick={() => onChange(i, i > index ? 'down' : 'up')}
                  className={`group flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-center md:flex-row md:gap-5 md:text-left ${
                    active ? 'opacity-100 scale-100' : 'opacity-70 hover:opacity-100 scale-90'
                  }`}
                >
                  <span
                    className={`text-2xl md:text-[4.2rem] font-black leading-none tabular-nums ${
                      active ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {fmtDay(r.date)}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <img src={`${import.meta.env.BASE_URL}${r.flagIconPath}`} alt="" className="hidden h-5 w-6 object-contain md:block" />
                    <span
                      className={`text-xs md:tracking-[0.12em] leading-none whitespace-nowrap ${
                        active ? 'text-white/70' : 'text-white/80'
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
            className="h-11 w-11 shrink-0 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.12] transition-all duration-300 md:mt-4"
            aria-label="下一场"
          >
            <svg className="-rotate-90 md:rotate-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* 页码 */}
          <span className="mt-4 hidden text-xs tracking-[0.3em] text-white/50 md:block">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* ===== 右侧：赛道图 + 赛事信息 ===== */}
        <div ref={rightRef} className="relative z-[1] flex min-w-0 flex-col items-center justify-center md:pl-6 lg:pl-10">
          {/* 赛道图标 */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ background: `radial-gradient(circle at center, ${race.iconColor}, transparent 60%)` }}
            />
            <TrackIcon
              className="h-28 w-44 md:h-40 md:w-52 lg:h-48 lg:w-64"
              fill={race.iconColor}
              style={{ opacity: race.iconOpacity / 100 }}
              iconPath={race.iconPath}
            />
          </div>

          {/* 赛事名称 */}
          <h3 className="mt-4 max-w-full text-3xl sm:text-4xl md:text-[3.5rem] lg:text-[5rem] font-black tracking-tighter text-white leading-[1.15] text-center">
            {race.name}
          </h3>

          {/* 地点 + 介绍 */}
          <div className="mt-1.5 sm:mt-3 lg:mt-4 flex flex-col items-center gap-0.5 sm:gap-1.5">
            <p className="text-base sm:text-xl lg:text-3xl tracking-[0.15em] text-[#3388CC] font-medium">{race.location}</p>
            <p className="text-sm lg:text-base text-white/65 leading-relaxed max-w-md text-center">{race.desc}</p>
          </div>

          {/* 状态标签 */}
          <span className="mt-4 inline-block text-xs tracking-[0.2em] rounded-full px-3 py-2 bg-white/[0.06] backdrop-blur-md border-none text-white/70">
            {race.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
          </span>

          {/* 倒计时 — 仅 upcoming 赛事 */}
          {isUpcoming && timeLeft && (
            <div className="mt-2 sm:mt-5">
              <div className="flex gap-3 lg:gap-5">
                {([
                  { value: timeLeft.days, label: '天' },
                  { value: timeLeft.hours, label: '时' },
                  { value: timeLeft.minutes, label: '分' },
                  { value: timeLeft.seconds, label: '秒' },
                ]).map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center min-w-[3rem] lg:min-w-[4rem]">
                    <span className="text-2xl lg:text-4xl font-black text-white tabular-nums tracking-tight">
                      {pad(unit.value)}
                    </span>
                    <span className="text-xs tracking-[0.15em] text-white/60 mt-1">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 战绩 */}
          {race.status === 'completed' && race.result && (
            <div className="mt-2 sm:mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {race.result.map((line, i) => (
                <span
                  key={i}
                  className="text-xs lg:text-sm font-bold tracking-wider text-primary-light bg-primary/10 rounded-full px-3 py-2"
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
