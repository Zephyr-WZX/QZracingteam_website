import { FadeUp } from '@/components/animation'

export default function Contact() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* 左侧信息 */}
          <div>
            <FadeUp>
              <h1 className="text-display-md font-black tracking-tighter">
                联系<span className="neon-text">我们</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mt-8 text-white/50 text-base leading-relaxed max-w-md">
                不论你是想了解车队详情、洽谈合作，还是有意加入我们——
                欢迎通过以下方式联系。
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="mt-12 space-y-8">
                {[
                  { label: '邮箱', value: 'qzracing@example.com' },
                  { label: '地址', value: '某某大学工程训练中心' },
                  { label: '社交媒体', value: '微博 / B站 / 抖音 @QZRacing' },
                ].map((info) => (
                  <div key={info.label}>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                      {info.label}
                    </p>
                    <p className="mt-2 text-sm text-white/70">{info.value}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* 右侧表单 */}
          <FadeUp delay={0.4}>
            <div className="p-10 rounded-2xl bg-white/[0.02] border border-white/5">
              <h2 className="text-xl font-bold tracking-tight mb-8">发送消息</h2>
              <form className="space-y-5">
                {[
                  { label: '姓名', type: 'text', placeholder: '你的姓名' },
                  { label: '邮箱', type: 'email', placeholder: 'your@email.com' },
                  { label: '主题', type: 'text', placeholder: '消息主题' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-neon/50 transition-colors duration-300"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                    消息
                  </label>
                  <textarea
                    rows={5}
                    placeholder="写下你想说的话..."
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-neon/50 transition-colors duration-300 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-neon text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:bg-neon-dim transition-all duration-300"
                >
                  发送
                </button>
              </form>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
