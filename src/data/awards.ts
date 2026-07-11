/* ================================================================
   成就页配置 — 管理员面板数据源

   管理员操作指南：
   1. 在 arrays 中新增条目
   2. image 路径相对于 public/ 目录
   3. text 为展示在图片下方的文字标签
   ================================================================ */

export interface AwardItem {
  image: string
  text: string
}

/* ───────── 成就证书 ───────── */
export const AWARDS: AwardItem[] = [
  { image: 'images/awards/2012燃油经济性第一名 最佳新秀 绿色环保奖.jpg', text: '2012 燃油经济性第一名\n最佳新秀\n绿色环保奖' },
  { image: 'images/awards/2015轻量化第一名.png', text: '2015 轻量化第一名' },
  { image: 'images/awards/2016全国二等奖.jpg', text: '2016 全国二等奖' },
  { image: 'images/awards/2016营销报告第二名.jpg', text: '2016 营销报告第二名' },
  { image: 'images/awards/2017全国二等奖.jpg', text: '2017 全国二等奖' },
  { image: 'images/awards/2018全国三等奖.jpg', text: '2018 全国三等奖' },
  { image: 'images/awards/2021优秀指导老师.jpg', text: '2021 优秀指导老师' },
  { image: 'images/awards/2021全国三等奖.jpg', text: '2021 全国三等奖' },
  { image: 'images/awards/2024全国三等奖.png', text: '2024 全国三等奖' },
  { image: 'images/awards/2025全国三等奖.jpg', text: '2025 全国三等奖' },
]
