import { Link } from 'react-router-dom'
import { assetPath } from '@/utils'

const footerLinks = {
  导航: [
    { label: '首页', path: '/' },
    { label: '赛车', path: '/#cars' },
    { label: '成就', path: '/#feats' },
    { label: '队员', path: '/#team' },
  ],
  更多: [
    { label: '合作伙伴', path: '/#partners' },
    { label: '联系我们', path: '/#contact' },
  ],
}

const SOCIAL_LINKS = [
  { label: 'Bilibili', icon: '/icons/media/bilibili.svg', url: 'https://b23.tv/wB9bBKg' },
  { label: '小红书', icon: '/icons/media/小红书.svg', url: 'https://xhslink.com/m/1lrYvV8RIOT' },
  { label: '微信公众号', icon: '/icons/media/微信公众号.svg', url: 'https://mp.weixin.qq.com/s/-dsM_FGY_mkirlu4JdsNJg' },
  { label: '抖音', icon: '/icons/media/抖音.svg', url: 'https://www.douyin.com/user/MS4wLjABAAAAVykikE32q-6pblU0lnC_JhFtWyYtHyCkH9arvJr6fqo' },
]

export default function Footer() {
  return (
    <footer className="bg-black-deep border-t border-white/5">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              <span className="primary-text">QZ</span>
              <span className="text-white/80 font-medium ml-1">RACING</span>
            </Link>
            <p className="mt-4 text-sm text-white/40 leading-relaxed">
              大学生方程式车队 — 以工程创新和团队协作为核心，
              在赛道上追求卓越。
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/50 hover:text-primary-light transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 关注我们 — 社交媒体图标 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">
              关注我们
            </h4>
            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={s.label}
                  className="opacity-50 hover:opacity-100 transition-opacity duration-300"
                >
                  <img src={assetPath(s.icon)} alt={s.label} className="w-5 h-5 brightness-0 invert" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} QZ Racing Team. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Designed with <span className="text-primary-light/50">▲</span> Speed & Passion
          </p>
        </div>
      </div>
    </footer>
  )
}
