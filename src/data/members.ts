import { feishuContent } from './feishu'

/* ================================================================
   队员配置 — 管理员面板数据源

   管理员操作指南：
   1. 在 TEAM_GROUPS 中按组维护成员
   2. 有组长的组填 leader（渲染在最左、更大卡、带头衔角标），
      其余成员放 members[]；平铺组（指导老师 / 赛车手）不填 leader
   3. avatar 为 public/ 下相对路径（如 'members/张三.jpeg'）；
      留空则显示姓名首字占位
   4. link 可选：个人主页等外链（指导老师用）
   5. 组的先后顺序即页面从上到下的行顺序
   ================================================================ */

export interface Member {
  /** 姓名 */
  name: string
  /** 职务 / 头衔（leader 显示为角标，组员显示在名字下方） */
  role?: string
  /** 头像：public/ 相对路径，可选 */
  avatar?: string
  /** 外链（个人主页等），可选 */
  link?: string
  /** 简介（指导老师用），可选 */
  desc?: string
}

export interface TeamGroup {
  /** 唯一键 */
  key: string
  /** 组名（每组一行的标题） */
  title: string
  /** 组长：填则渲染在最左；平铺组不填 */
  leader?: Member
  /** 组员 */
  members: Member[]
}

/** 临时统一占位头像（后续替换为各自照片） */
const PH = 'images/members/头哥.jpg'

/** 🛠️ 管理员在此维护全部队员（数组顺序 = 页面行顺序） */
const LOCAL_TEAM_GROUPS: TeamGroup[] = [
  {
    key: 'advisors',
    title: '指导老师',
    members: [
      {
        name: '朱绍鹏',
        avatar: 'images/members/朱老师.jpg',
        link: 'https://person.zju.edu.cn/zsp',
        desc: '浙江大学副教授、博导，日本千叶大学与庆应义塾大学硕博。著有《轮毂电机分布式驱动控制技术》，牵头制定分布式驱动控制系统技术规范，曾获浙江省科技进步二等奖等多项奖励。',
      },
      { name: '陈俊玄', 
        avatar: 'images/members/陈老师.jpg', 
        link: 'http://vehicle.zju.edu.cn/teacher_detail/id-28.html', 
        desc: '浙江大学动力机械及车辆研究所工程师，2021 中国大学生方程式大赛优秀指导老师' },
    ],
  },
  {
    key: 'management',
    title: '管理层',
    leader: { name: '孙行安', role: '队长', avatar: PH },
    members: [
      { name: '孟午阳', role: '副队长', avatar: PH },
      { name: '王亮', role: '技术总监', avatar: PH },
      { name: '潘埑睿', role: '经理', avatar: PH },
    ],
  },
  {
    key: 'chassis',
    title: '底盘组',
    leader: { name: '虞璟轩', role: '组长', avatar: PH },
    members: [
      { name: '周恒毅', avatar: PH },
      { name: '高美义', avatar: PH },
      { name: '宋浩源', avatar: PH },
      { name: '孙行安', avatar: PH },
      { name: '叶越行', avatar: PH },
      { name: '吴依倩', avatar: PH },
      { name: '陈敏祚', avatar: PH },
    ],
  },
  {
    key: 'electrical',
    title: '电气组',
    leader: { name: '郑子睿', role: '组长', avatar: PH },
    members: [
      { name: '金添', avatar: PH },
      { name: '陈学容', avatar: PH },
      { name: '潘埑睿', avatar: PH },
      { name: '胡悦玥', avatar: PH },
      { name: '孟午阳', avatar: PH },
      { name: '王亮', avatar: PH },
      { name: '黄唯展', avatar: PH },
      { name: '季奕舟', avatar: PH },
    ],
  },
  {
    key: 'aero',
    title: '空套组',
    leader: { name: '金旗', role: '组长', avatar: PH },
    members: [
      { name: '郑文柏', avatar: PH },
      { name: '刘星宇', avatar: PH },
      { name: '张雨童', avatar: PH },
      { name: '王子瑞', avatar: PH },
      { name: '白云飞', avatar: PH },
    ],
  },
  {
    key: 'operations',
    title: '运营组',
    leader: { name: '叶骏豪', role: '组长', avatar: PH },
    members: [
      { name: '潘埑睿', avatar: PH },
      { name: '杨紫涵', avatar: PH },
      { name: '李璐欣', avatar: PH },
    ],
  },
  {
    key: 'drivers',
    title: '赛车手',
    members: [
      { name: '潘埑睿', avatar: PH },
      { name: '戴弘毅', avatar: PH },
      { name: '黄唯展', avatar: PH },
      { name: '王亮', avatar: PH },
      { name: '孟午阳', avatar: PH },
    ],
  },
]

export const TEAM_GROUPS: TeamGroup[] = feishuContent?.groups ?? LOCAL_TEAM_GROUPS
