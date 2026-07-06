/* ================================================================
   赛车配置 — 管理员面板数据源

   管理员操作指南：
   1. 在 ALL_CARS 数组中复制模板新增赛车
   2. specs 数组中每个条目为一个技术参数行（label + value）
   3. imagePath 指向侧视图图片
   ================================================================ */

export interface CarSpec {
  label: string
  value: string
}

export interface Car {
  /** 赛车编号（如 "E26"） */
  number: string
  /** 赛车名称 */
  name: string
  /** 侧视图图片路径（public/images/ 下） */
  imagePath: string
  /** 技术参数 */
  specs: CarSpec[]
  /** 描述 */
  desc: string
  /** 编号数字部分颜色（tailwind 色值，默认 '#004B91'） */
  numberColor?: string
  /** 编号字母部分颜色（默认 '#ffffff'） */
  letterColor?: string
}

/* ───────── 模板（复制此对象新增赛车） ───────── */
// {
//   number: 'E00',
//   name: '',
//   imagePath: 'images/E00侧视图.png',
//   specs: [
//     { label: '0-100 km/h', value: '0.0s' },
//     { label: '车重', value: '0kg' },
//     { label: '极速', value: '0km/h' },
//   ],
//   desc: '',
//   numberColor: '#3388CC',
//   letterColor: '#ffffff',
// },

/** 🛠️ 管理员在此维护全部赛车（按编号从新到旧排列） */
export const ALL_CARS: Car[] = [
  {
    number: 'E26',
    name: '启真·E26',
    imagePath: 'images/E26侧视图.png',
    specs: [
      { label: '0-100 km/h', value: '3.2s' },
      { label: '车重', value: '220kg' },
      { label: '极速', value: '120km/h+' },
      { label: '电机功率', value: '80kW' },
      { label: '车身结构', value: '碳纤维单体壳' },
      { label: '悬架形式', value: '双叉臂推杆' },
    ],
    desc: '碳纤维单体壳车身、自研电控系统、空气动力学套件，只为极致的圈速与操控。',
    numberColor: '#3388CC',
    letterColor: '#ffffff',
  },
  {
    number: 'E25',
    name: '启真·E25',
    imagePath: 'images/E26侧视图.png',
    specs: [
      { label: '0-100 km/h', value: '3.8s' },
      { label: '车重', value: '235kg' },
      { label: '极速', value: '110km/h+' },
      { label: '电机功率', value: '70kW' },
      { label: '车身结构', value: '钢管桁架' },
      { label: '悬架形式', value: '双叉臂推杆' },
    ],
    desc: '首台自制赛车，为后续车型奠定了底盘与电控基础。',
    numberColor: '#3388CC',
    letterColor: '#ffffff',
  },
]
