/* ================================================================
   赞助商配置 — 管理员面板数据源

   管理员操作指南：
   1. 在对应数组中新增条目
   2. logo 路径指向 public/icons/sponsors/ 下的图片
   3. url 为赞助商官网链接（可选）
   ================================================================ */

export interface Sponsor {
  name: string
  logo: string // 相对于 public/ 的路径
  url?: string // 赞助商官网链接
}

/* ───────── 主要赞助商 ───────── */
export const MAIN_SPONSORS: Sponsor[] = [
  { name: '潍柴', logo: 'icons/sponsors/潍柴.png', url: 'https://www.weichaipower.com' },
  { name: '华海', logo: 'icons/sponsors/华海.png', url: 'http://www.ecucoder.com' },
  { name: '曼汇', logo: 'icons/sponsors/曼汇.png', url: 'http://zjmhst.com/' },
]

/* ───────── 合作伙伴 ───────── */
export const PARTNERS: Sponsor[] = [
  { name: '吉利', logo: 'icons/sponsors/吉利.png', url: 'https://www.geely.com' },
  { name: '极氪', logo: 'icons/sponsors/极氪.png', url: 'https://www.zeekrlife.com' },
  { name: '领克', logo: 'icons/sponsors/领克.png', url: 'https://www.lynkco.com.cn' },
  { name: '茅台', logo: 'icons/sponsors/茅台.png', url: 'https://www.moutai.com.cn' },
  { name: '郝式', logo: 'icons/sponsors/郝氏.png',url:'http://www.haoshicf.com/about/' },
  { name: 'Chroma', logo: 'icons/sponsors/Chroma.png', url: 'https://www.chroma.com.cn' },
  { name: 'RaceRoom', logo: 'icons/sponsors/raceroom.png', url: 'https://game.raceroom.com' },
  { name: '花海', logo: 'icons/sponsors/花海.png', url:'https://m.shijiachangdi.com/changdi/645.html'},
]

/* ───────── 特别鸣谢 ───────── */
export const SPECIAL_THANKS: Sponsor[] = [
  { name: 'SAE', logo: 'icons/sponsors/SAE.png', url: 'https://formulastudent.sae-china.org/' },
  { name: 'FSEC', logo: 'icons/sponsors/FSEC.png', url: 'https://formulastudent.sae-china.org/' },
]
