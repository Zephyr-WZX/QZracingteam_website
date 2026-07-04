import { FadeUp } from '@/components/animation'

export default function About() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <FadeUp>
          <h1 className="text-display-md font-black tracking-tighter">
            关于<span className="neon-text">我们</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-8 text-white/50 text-lg max-w-2xl leading-relaxed">
            QZ Racing Team 的起源、使命与愿景。这里将展示车队的历史沿革、
            核心价值观以及我们在方程式赛事中的成长轨迹。
          </p>
        </FadeUp>

        {/* 占位骨架 */}
        <FadeUp delay={0.4}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-video bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-center text-white/10 text-sm">
              车队历史照片（待填充）
            </div>
            <div className="aspect-video bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-center text-white/10 text-sm">
              车队愿景照片（待填充）
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
