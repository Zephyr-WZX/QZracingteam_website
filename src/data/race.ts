/* ================================================================
   赛事配置 — 管理员面板数据源

   管理员操作指南：
   1. 在 ALL_RACES 数组中复制模板新增赛事
   2. status: 'upcoming'（未开始）| 'completed'（已完赛）
   3. 已完成赛事填写 result 字段（战绩摘要）
   4. Hero 区域和赛程板块均自动从此数据源读取
   ================================================================ */

export interface Race {
  /** 赛事名称 */
  name: string
  /** 赛事地点 */
  location: string
  /** 比赛日期 (ISO 8601) */
  date: string
  /** 赛道图标路径 */
  iconPath: string
  /** 赛道图标填充颜色 (#hex) */
  iconColor: string
  /** 赛道图标透明度 (0-100) */
  iconOpacity: number
  /** 赛事描述 */
  desc: string
  /** 状态 */
  status: 'upcoming' | 'completed'
  /** 战绩（仅 completed 有效，支持多行） */
  result?: string[]
  /** 国旗 SVG 图标路径（如 'icons/flag-cn.svg'） */
  flagIconPath: string
  /** 赛道照片路径（public/images/tracks/ 下），用于赛程板块背景 */
  trackImage?: string
}

/* ───────── 模板（复制此对象新增赛事） ───────── */
// {
//   name: '',
//   location: '',
//   date: 'YYYY-MM-DDTHH:mm:ss+08:00',
//   iconPath: 'icons/huahai-track.svg',
//   iconColor: '#ffffff',
//   iconOpacity: 50,
//   desc: '',
//   status: 'upcoming',
//   flagIconPath: 'icons/flag-cn.svg',
// },

/** 🛠️ 管理员在此维护全部赛事（按日期从近到远排列） */
export const ALL_RACES: Race[] = [
  {
    name: '花海跑动测试',
    location: '杭州·萧山',
    date: '2026-09-15T09:00:00+08:00',
    iconPath: 'icons/huahai-track.svg',
    iconColor: '#ffffff',
    iconOpacity: 50,
    desc: '新车落地后首测，收集数据',
    status: 'upcoming',
    flagIconPath: 'icons/flag-cn.svg',
    trackImage: 'images/tracks/HKC.png',
  },
  {
    name: '全国大学生方程式',
    location: '安徽·合肥',
    date: '2026-11-10T09:00:00+08:00',
    iconPath: 'icons/huahai-track.svg',
    iconColor: '#ffffff',
    iconOpacity: 50,
    desc: '年度最高规格赛事，全国高校车队同场竞技。',
    status: 'upcoming',
    flagIconPath: 'icons/flag-cn.svg',
  },
  {
    name: '同济赛',
    location: '上海',
    date: '2026-03-20T09:00:00+08:00',
    iconPath: 'icons/tongji-track.svg',
    iconColor: '#ffffff',
    iconOpacity: 50,
    desc: '油电同场竞技 究竟谁将称王',
    status: 'completed',
    result: ['高速避障第 3 名', '直线加速第 3'],
    flagIconPath: 'icons/flag-cn.svg',
    trackImage: 'images/tracks/tongji.jpg',
  },
]

/* ───────── 辅助函数 ───────── */

/** 获取距离当前最近的 upcoming 赛事 */
export function getNearestUpcoming(): Race | null {
  const now = Date.now()
  const upcoming = ALL_RACES
    .filter((r) => r.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming.find((r) => new Date(r.date).getTime() > now) ?? null
}

/** 获取最近的赛事（无论状态），用于赛程板块默认选中 */
export function getRecentRaceIndex(): number {
  const now = Date.now()
  let closest = 0
  let closestDiff = Infinity
  ALL_RACES.forEach((r, i) => {
    const diff = Math.abs(new Date(r.date).getTime() - now)
    if (diff < closestDiff) {
      closestDiff = diff
      closest = i
    }
  })
  return closest
}
