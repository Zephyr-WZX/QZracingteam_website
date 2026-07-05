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
  /** 国旗 emoji（如 '🇨🇳'） */
  flag: string
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
//   flag: '🇨🇳',
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
    desc: '高海拔弯道赛道，考验制动系统与车手极限操控。',
    status: 'upcoming',
    flag: '🇨🇳',
  },
  {
    name: '青年工程师耐力赛',
    location: '广东·肇庆',
    date: '2026-10-22T09:00:00+08:00',
    iconPath: 'icons/huahai-track.svg',
    iconColor: '#ffffff',
    iconOpacity: 50,
    desc: '8小时耐力挑战，对赛车可靠性与团队策略的双重考验。',
    status: 'upcoming',
    flag: '🇨🇳',
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
    flag: '🇨🇳',
  },
  {
    name: '春季高校邀请赛',
    location: '上海',
    date: '2026-04-20T09:00:00+08:00',
    iconPath: 'icons/huahai-track.svg',
    iconColor: '#004B91',
    iconOpacity: 70,
    desc: '赛季揭幕战，新赛车首次公开亮相。',
    status: 'completed',
    result: ['总成绩第 5 名', '耐久赛单项第 3', '最佳新秀奖'],
    flag: '🇨🇳',
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
