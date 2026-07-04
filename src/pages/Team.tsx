import { FadeUp } from '@/components/animation'

const TEAM_MEMBERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: '队员姓名',
  role: ['队长 / 技术总监', '副队长', '底盘组长', '电控组长', '空力组长', '悬架工程师', '电控工程师', '车手'][i],
  dept: '技术部',
}))

export default function Team() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <FadeUp>
          <h1 className="text-display-md font-black tracking-tighter">
            我们的<span className="neon-text">队员</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-8 text-white/50 text-lg max-w-2xl leading-relaxed">
            每一位成员都是车队不可或缺的力量。从设计到制造，从测试到赛场，
            我们用专业和热情推动车队前进。
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, i) => (
            <FadeUp key={member.id} delay={i * 0.08}>
              <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-neon/20 transition-all duration-500">
                {/* 头像占位 */}
                <div className="aspect-square rounded-xl bg-white/[0.03] flex items-center justify-center mb-5 overflow-hidden">
                  <span className="text-white/10 text-4xl group-hover:scale-110 transition-transform duration-500">
                    👤
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight">{member.name}</h3>
                <p className="mt-1 text-sm text-neon/80">{member.role}</p>
                <p className="mt-1 text-xs text-white/20">{member.dept}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  )
}
