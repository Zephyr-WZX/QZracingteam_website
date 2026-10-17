import { useState, useEffect } from 'react'
import { getNearestUpcoming } from '@/data/race'
import TrackIcon from '@/components/TrackIcon'

/* ================================================================
   NEXT RACE 倒计时 — 精确到秒
   自动选取最近一场 upcoming 赛事
   ================================================================ */

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: string): TimeLeft | null {
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

export default function NextRace() {
  const race = getNearestUpcoming()
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    () => race && calcTimeLeft(race.date),
  )

  useEffect(() => {
    if (!race) return
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(race.date))
    }, 1000)
    return () => clearInterval(timer)
  }, [race?.date])

  if (!race) {
    return (
      <div className="flex flex-col items-start gap-5 lg:items-end">
        <p className="text-sm tracking-wider text-white/30">暂无赛事</p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-start gap-4 lg:items-end lg:gap-5">
      {/* 赛道图标 */}
      <TrackIcon
        className="absolute right-0 top-0 h-20 w-20 lg:relative lg:h-60 lg:w-60 xl:h-80 xl:w-80"
        fill={race.iconColor}
        style={{ opacity: race.iconOpacity / 100 }}
        iconPath={race.iconPath}
      />

      {/* NEXT RACE 标签 */}
      <div className="max-w-[calc(100%_-_6rem)] text-left lg:max-w-none lg:text-right">
        <p className="text-xs sm:text-sm lg:text-lg text-white/60 mb-1 lg:mb-3 flex items-center gap-[0.35em] sm:gap-[0.45em] lg:justify-end">
          <span className="tracking-[0.15em]">NEXT</span>
          <span
            className="inline-block transition-opacity duration-75"
            style={{
              opacity: timeLeft && timeLeft.seconds % 2 === 0 ? 1 : 0.15,
            }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" className="w-[0.6em] h-[0.6em]">
              <circle cx="3" cy="3" r="3" fill="#004B91" />
            </svg>
          </span>
          <span className="tracking-[0.15em]">RACE</span>
        </p>
        <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-wider text-white/85">
          {race.name}
        </p>
        <p className="text-xs md:text-sm tracking-[0.15em] text-white/65 mt-0.5 md:mt-1.5">
          {race.location}
        </p>
      </div>

      {/* 倒计时 — 窄屏允许自然换行 */}
      {timeLeft ? (
        <div className="flex flex-wrap items-start gap-3 lg:items-end lg:gap-5">
          <div className="flex gap-1.5 sm:gap-4 md:gap-5">
            {([
              { value: timeLeft.days, label: '天' },
              { value: timeLeft.hours, label: '时' },
            ] as const).map((unit) => (
              <div key={unit.label} className="flex flex-col items-center min-w-[2.5rem] sm:min-w-[3.5rem] md:min-w-[4.5rem]">
                <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tight">
                  {pad(unit.value)}
                </span>
                <span className="text-xs md:text-sm tracking-[0.15em] text-white/60 mt-0.5 md:mt-1.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 sm:gap-4 md:gap-5">
            {([
              { value: timeLeft.minutes, label: '分' },
              { value: timeLeft.seconds, label: '秒' },
            ] as const).map((unit) => (
              <div key={unit.label} className="flex flex-col items-center min-w-[2.5rem] sm:min-w-[3.5rem] md:min-w-[4.5rem]">
                <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tight">
                  {pad(unit.value)}
                </span>
                <span className="text-xs md:text-sm tracking-[0.15em] text-white/60 mt-0.5 md:mt-1.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm md:text-base tracking-wider text-primary-light/60">比赛进行中</p>
      )}

      {/* 跳转赛程板块 */}
      <button
        onClick={() => {
          const el = document.getElementById('races')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
        className="min-h-11 text-xs tracking-[0.2em] text-white/60 hover:text-primary-light/80 transition-colors duration-300"
      >
        VIEW ALL RACES →
      </button>
    </div>
  )
}
