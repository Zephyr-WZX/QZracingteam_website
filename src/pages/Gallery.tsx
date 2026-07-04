import { FadeUp } from '@/components/animation'

const GALLERY_ITEMS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  label: ['赛车特写', '赛道瞬间', '工坊日常', '团队合影', '技术检查', '练习赛', '颁奖台', '单体壳制造', '风洞测试'][i],
  wide: i === 0 || i === 4,
}))

export default function Gallery() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <FadeUp>
          <h1 className="text-display-md font-black tracking-tighter">
            精彩<span className="neon-text">图库</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-8 text-white/50 text-lg max-w-2xl leading-relaxed">
            记录每一个不可复制的高速瞬间——从工坊到赛道，
            从设计图纸到颁奖典礼。
          </p>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map((item, i) => (
            <FadeUp
              key={item.id}
              delay={i * 0.08}
              className={item.wide ? 'md:col-span-2' : ''}
            >
              <div className="group relative aspect-[4/3] rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden cursor-pointer hover:border-neon/20 transition-all duration-500">
                {/* 图片占位 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center">
                  <span className="text-white/10 text-3xl group-hover:scale-110 transition-transform duration-500">
                    📷
                  </span>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-6">
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-white/30 text-xs mt-1">点击查看大图</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  )
}
