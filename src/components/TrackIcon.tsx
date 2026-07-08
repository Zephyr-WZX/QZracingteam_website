import { useState, useEffect } from 'react'

/* ================================================================
   赛道 SVG 图标 — 根据 iconPath 动态加载 SVG 并注入 fill 颜色
   ================================================================ */

interface ParsedSvg {
  viewBox: string
  paths: { d: string; fill?: string }[]
}

const cache = new Map<string, ParsedSvg>()

function parseSvg(text: string): ParsedSvg {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  const viewBox = svg?.getAttribute('viewBox') ?? '0 0 100 100'
  const pathEls = svg?.querySelectorAll('path') ?? []
  const paths: ParsedSvg['paths'] = []
  pathEls.forEach((p) => {
    const d = p.getAttribute('d')
    const fill = p.getAttribute('fill')
    if (d) paths.push({ d, fill: fill ?? undefined })
  })
  return { viewBox, paths: paths.length ? paths : [{ d: '' }] }
}

export default function TrackIcon({
  className = '',
  fill,
  style,
  iconPath,
}: {
  className?: string
  fill: string
  style?: React.CSSProperties
  iconPath: string
}) {
  const [svgData, setSvgData] = useState<ParsedSvg | null>(() => cache.get(iconPath) ?? null)

  useEffect(() => {
    if (cache.has(iconPath)) {
      setSvgData(cache.get(iconPath)!)
      return
    }
    fetch(`/${iconPath}`)
      .then((r) => r.text())
      .then((text) => {
        const parsed = parseSvg(text)
        cache.set(iconPath, parsed)
        setSvgData(parsed)
      })
      .catch(() => setSvgData(null))
  }, [iconPath])

  if (!svgData) return null

  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox={svgData.viewBox} fill="none">
      {svgData.paths.map((p, i) => (
        <path key={i} d={p.d} fill={fill} />
      ))}
    </svg>
  )
}
