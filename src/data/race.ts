/* ================================================================
   赛事配置 — 管理员面板数据源
   修改此文件即可更新 Hero 区域的 NEXT RACE 信息
   ================================================================ */

export interface RaceConfig {
  /** 赛事名称 */
  name: string
  /** 赛事地点 */
  location: string
  /** 比赛日期 (ISO 8601) — 倒计时以此为准 */
  date: string
  /** 赛道图标路径 (相对于 public/ 或 icons/ 目录) */
  iconPath: string
  /** 赛道图标填充颜色 (#hex) */
  iconColor: string
  /** 赛道图标透明度 (0-100) */
  iconOpacity: number
}

/** 🛠️ 管理员在此修改下一场比赛信息 */
export const nextRace: RaceConfig = {
  name: '花海跑动测试',
  location: '杭州·萧山',
  date: '2026-09-15T09:00:00+08:00',
  iconPath: 'icons/huahai-track.svg',
  iconColor: '#ffffff53',
  iconOpacity: 50,
}
