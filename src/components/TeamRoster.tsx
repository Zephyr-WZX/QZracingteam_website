import { useState, useEffect } from 'react'
import { TEAM_GROUPS, type Member, type TeamGroup } from '@/data/members'
import TiltedCard from '@/components/TiltedCard'

/* ================================================================
   队员名册 — 组索引 tab 切换 + TiltedCard 卡片
   顶部纯文字组索引，选中浅蓝高亮；点选显示对应组：
   有组长的组最左为组长（更大卡 + 角标），右侧组员单排 + 箭头翻页；
   平铺组（指导老师 / 车手）居中排列。
   移动端：卡片缩小、每页 3 张、两侧渐变遮盖 + 悬浮箭头；
           指导老师改纵向排布。
   数据源：src/data/members.ts
   ================================================================ */

/** 视口是否移动端（<640px） */
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

/** 无头像时用姓名首字生成占位图，避免 TiltedCard 碎图 */
function placeholder(name: string) {
  const ch = name.slice(0, 1)
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300'>` +
    `<rect width='100%' height='100%' fill='#0b1420'/>` +
    `<text x='50%' y='50%' font-size='120' fill='#22344a' text-anchor='middle' ` +
    `dominant-baseline='central' font-family='sans-serif' font-weight='900'>${ch}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function MemberCard({
  member,
  leader = false,
  mobile = false,
}: {
  member: Member
  leader?: boolean
  mobile?: boolean
}) {
  // 竖版 3:2（宽:高 = 2:3），移动端整体缩小
  const w = leader ? (mobile ? '150px' : '260px') : mobile ? '120px' : '210px'
  const h = leader ? (mobile ? '225px' : '390px') : mobile ? '180px' : '315px'
  const src = member.avatar
    ? member.avatar.startsWith('http')
      ? member.avatar
      : `/${member.avatar}`
    : placeholder(member.name)
  return (
    <TiltedCard
      imageSrc={src}
      altText={member.name}
      containerHeight={h}
      containerWidth={w}
      imageHeight={h}
      imageWidth={w}
      rotateAmplitude={10}
      scaleOnHover={1.06}
      showMobileWarning={false}
      showTooltip={false}
      displayOverlayContent
      overlayContent={
        <div className={`m-3 flex flex-col items-start gap-1 ${leader ? 'gap-1.5' : ''}`}>
          {member.role && (
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold tracking-wider ${
              leader
                ? 'bg-primary/80 text-white'
                : 'bg-white/10 text-white/50'
            }`}>
              {member.role}
            </span>
          )}
          <p className={`rounded-lg text-white font-semibold ${leader ? 'text-base sm:text-lg bg-black/50 px-3 py-1.5' : 'text-xs sm:text-sm bg-black/50 px-2 py-1'}`}>
            {member.name}
          </p>
        </div>
      }
    />
  )
}

function AdvisorCard({ member, mobile = false }: { member: Member; mobile?: boolean }) {
  return (
    <div className={`flex gap-5 sm:gap-6 ${mobile ? 'flex-col items-center text-center' : 'items-center'}`}>
      <MemberCard member={member} mobile={mobile} />
      <div className="max-w-[260px] sm:max-w-[300px]">
        <p className="text-xl sm:text-2xl font-black tracking-tight text-white">{member.name}</p>
        {member.role && <p className="mt-1 text-sm text-primary-light">{member.role}</p>}
        {member.desc && (
          <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed">{member.desc}</p>
        )}
        {member.link && (
          <a
            href={member.link}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-block text-sm text-white/60 hover:text-primary-light underline underline-offset-4 transition-colors"
          >
            个人主页 ↗
          </a>
        )}
      </div>
    </div>
  )
}

function ArrowBtn({
  dir,
  onClick,
  className = '',
}: {
  dir: 'left' | 'right'
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'left' ? '上一页' : '下一页'}
      className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.08] backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.16] transition-all duration-300 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  )
}

function PagedMembers({
  members,
  groupKey,
  mobile = false,
}: {
  members: Member[]
  groupKey: string
  mobile?: boolean
}) {
  const perPage = mobile ? 3 : 5
  const [page, setPage] = useState(0)
  const pages = Math.ceil(members.length / perPage)
  const start = page * perPage
  const shown = members.slice(start, start + perPage)
  const prev = () => setPage((p) => (p > 0 ? p - 1 : pages - 1))
  const next = () => setPage((p) => (p < pages - 1 ? p + 1 : 0))

  // 逐卡片错位入场（key 含 page 确保翻页时重播）
  const cardEls = shown.map((m, i) => (
    <div
      key={`${groupKey}-p${page}-${start + i}`}
      className="anim-slide-right"
      style={{ '--anim-delay': `${i * 0.07}s` } as React.CSSProperties}
    >
      <MemberCard member={m} mobile={mobile} />
    </div>
  ))

  // 移动端：两侧渐变遮盖 + 悬浮箭头
  if (mobile) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex justify-center gap-2">
          {cardEls}
        </div>
        {pages > 1 && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-[1] bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-[1] bg-gradient-to-l from-black to-transparent" />
            <ArrowBtn dir="left" onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 z-[2]" />
            <ArrowBtn dir="right" onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 z-[2]" />
          </>
        )}
      </div>
    )
  }

  // 桌面：箭头置于两侧
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {pages > 1 && <ArrowBtn dir="left" onClick={prev} />}
      <div className="flex gap-3 sm:gap-6">
        {cardEls}
      </div>
      {pages > 1 && <ArrowBtn dir="right" onClick={next} />}
    </div>
  )
}

function GroupBody({ group, mobile }: { group: TeamGroup; mobile: boolean }) {
  if (group.key === 'advisors') {
    return (
      <div className="flex flex-wrap justify-center gap-12 sm:gap-28">
        {group.members.map((m, i) => (
          <div
            key={`${group.key}-${i}`}
            className="anim-slide-right"
            style={{ '--anim-delay': `${i * 0.1}s` } as React.CSSProperties}
          >
            <AdvisorCard member={m} mobile={mobile} />
          </div>
        ))}
      </div>
    )
  }
  if (group.leader) {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
        <div className="anim-slide-right" style={{ '--anim-delay': '0s' } as React.CSSProperties}>
          <MemberCard member={group.leader} leader mobile={mobile} />
        </div>
        <div className="anim-slide-right" style={{ '--anim-delay': '0.05s' } as React.CSSProperties}>
          <PagedMembers members={group.members} groupKey={group.key} mobile={mobile} />
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center">
      <PagedMembers members={group.members} groupKey={group.key} mobile={mobile} />
    </div>
  )
}

export default function TeamRoster() {
  const [active, setActive] = useState(0)
  const mobile = useIsMobile()
  const group = TEAM_GROUPS[active]

  return (
    <div>
      {/* 组索引 — 选中标签毛玻璃胶囊 */}
      <div className="flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-3 mb-6 sm:mb-8">
        {TEAM_GROUPS.map((g, i) => (
          <button
            key={g.key}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 rounded-full text-sm sm:text-base tracking-wide transition-all duration-300 ${
              i === active
                ? 'primary-text font-semibold'
                : 'text-white/40 hover:text-white/70'
            }`}
            style={
              i === active
                ? {
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 0 20px rgba(0, 102, 204, 0.15)',
                  }
                : undefined
            }
          >
            {g.title}
          </button>
        ))}
      </div>

      {/* 当前组成员 — key 变化重播动画 */}
      <div key={group.key}>
        <GroupBody group={group} mobile={mobile} />
      </div>
    </div>
  )
}
