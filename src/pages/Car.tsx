import { FadeUp } from '@/components/animation'

export default function Car() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <FadeUp>
          <h1 className="text-display-md font-black tracking-tighter">
            我们的<span className="primary-text">赛车</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-8 text-white/50 text-lg max-w-2xl leading-relaxed">
            从概念到实物——每一台赛车都是工程创新的结晶。
            这里将展示 3D 赛车模型、技术规格与各子系统设计解析。
          </p>
        </FadeUp>

        {/* 3D 查看器占位区域 */}
        <FadeUp delay={0.4}>
          <div className="mt-16 aspect-[16/7] bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 text-white/10">
            <span className="text-4xl">🏎️</span>
            <span className="text-sm">3D 赛车模型 — 使用 Three.js 交互查看（待接入）</span>
            <span className="text-xs text-white/5">支持 360° 旋转、缩放、热点标注</span>
          </div>
        </FadeUp>

        {/* 技术规格骨架 */}
        <FadeUp delay={0.5}>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: '发动机/电机', value: '待定' },
              { label: '0-100 km/h', value: '3.2s' },
              { label: '最高时速', value: '120+ km/h' },
              { label: '车重', value: '~220 kg' },
              { label: '车架', value: '钢管桁架' },
              { label: '悬架', value: '双叉臂推杆' },
              { label: '轮胎', value: 'Hoosier 18.0' },
              { label: '电控', value: '自研 ECU' },
            ].map((spec) => (
              <div
                key={spec.label}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">{spec.label}</p>
                <p className="mt-2 text-lg font-bold text-white/70">{spec.value}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
