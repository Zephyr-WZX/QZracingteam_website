import { FadeUp } from '@/components/animation'

const SPONSORS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: '赞助商名称',
  tier: (['铂金', '黄金', '白银'] as const)[i < 2 ? 0 : i < 4 ? 1 : 2],
}))

export default function Sponsors() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <FadeUp>
          <h1 className="text-display-md font-black tracking-tighter">
            合作<span className="primary-text">伙伴</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-8 text-white/50 text-lg max-w-2xl leading-relaxed">
            感谢每一位赞助商的支持。正是你们的信任与投入，
            让我们的工程梦想得以在赛道上驰骋。
          </p>
        </FadeUp>

        <div className="mt-16 space-y-14">
          {(['铂金', '黄金', '白银'] as const).map((tier) => {
            const tierSponsors = SPONSORS.filter((s) => s.tier === tier)
            if (tierSponsors.length === 0) return null

            return (
              <FadeUp key={tier}>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.3em] text-white/20 mb-6">
                    {tier}合作伙伴
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tierSponsors.map((sponsor) => (
                      <div
                        key={sponsor.id}
                        className="aspect-[3/2] bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center hover:border-primary/30 transition-all duration-500"
                      >
                        <span className="text-white/10 text-sm tracking-wider">
                          {sponsor.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>

        {/* CTA */}
        <FadeUp delay={0.3}>
          <div className="mt-24 text-center p-16 rounded-3xl bg-white/[0.02] border border-white/5">
            <h2 className="text-2xl font-bold tracking-tight">想成为合作伙伴？</h2>
            <p className="mt-3 text-white/40 text-sm max-w-md mx-auto">
              我们欢迎各类企业与机构以多种形式支持车队发展
            </p>
            <a
              href="/contact"
              className="btn-glass mt-8 px-8 py-3 text-sm tracking-wider rounded-full"
            >
              联系我们
            </a>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
