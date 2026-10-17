import { useState, useEffect } from 'react'
import { getNearestUpcoming } from '@/data/race'

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
    return <div className="race-live-panel"><div><p className="race-live-eyebrow">NEXT ON THE CALENDAR</p><p className="race-live-name">下一场，蓄势待发。</p><p className="race-live-location">赛事安排即将公布</p></div><a href="#races" className="race-live-link">查看赛程 →</a></div>
  }

  return (
    <div className="race-live-panel">
      <div>
        <p className="race-live-eyebrow"><span className="race-live-dot" /> NEXT ON THE CALENDAR</p>
        <p className="race-live-name">{race.name}</p>
        <p className="race-live-location">{race.location}</p>
        <a href="#races" className="race-live-link">查看完整赛程 <span aria-hidden="true">↗</span></a>
      </div>
      {timeLeft ? <div className="race-clock" aria-label="距离下场赛事的时间">
        {([
          { value: timeLeft.days, label: '天' },
          { value: timeLeft.hours, label: '时' },
          { value: timeLeft.minutes, label: '分' },
          { value: timeLeft.seconds, label: '秒' },
        ]).map((unit) => <div key={unit.label}><strong>{pad(unit.value)}</strong><span>{unit.label}</span></div>)}
      </div> : <p className="race-live-location">比赛进行中</p>}
    </div>
  )
}
