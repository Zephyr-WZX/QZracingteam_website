import { Link } from 'react-router-dom'

const footerLinks = {
  导航: [
    { label: '首页', path: '/' },
    { label: '关于我们', path: '/about' },
    { label: '赛车', path: '/car' },
    { label: '队员', path: '/team' },
  ],
  更多: [
    { label: '赞助商', path: '/sponsors' },
    { label: '图库', path: '/gallery' },
    { label: '联系我们', path: '/contact' },
  ],
  关注我们: [
    { label: '微博', path: '#' },
    { label: 'Bilibili', path: '#' },
    { label: '微信公众号', path: '#' },
    { label: '抖音', path: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-black-deep border-t border-white/5">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              <span className="neon-text">QZ</span>
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
                      className="text-sm text-white/50 hover:text-neon transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} QZ Racing Team. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Designed with <span className="text-neon/50">▲</span> Speed & Passion
          </p>
        </div>
      </div>
    </footer>
  )
}
