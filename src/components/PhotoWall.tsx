import { useState, useMemo, useCallback, useEffect } from 'react';
import Masonry from '@/components/Masonry';
import type { MasonryItem } from '@/components/Masonry';
import { photoItems } from '@/data/photos';

function getBatchSize() {
  if (typeof window === 'undefined') return 15;
  const w = window.innerWidth;
  if (w >= 1500) return 15;
  if (w >= 1000) return 12;
  if (w >= 600) return 8;
  return 6;
}

function getColumns() {
  if (typeof window === 'undefined') return 3;
  const w = window.innerWidth;
  if (w >= 1500) return 5;
  if (w >= 1000) return 4;
  if (w >= 600) return 3;
  if (w >= 400) return 2;
  return 1;
}

/** 模拟 Masonry 布局逻辑，返回所需总高度 */
function calcGridHeight(items: MasonryItem[], cols: number): number {
  if (!items.length) return 400;
  const colHeights = new Array(cols).fill(0);
  for (const item of items) {
    const col = colHeights.indexOf(Math.min(...colHeights));
    const h = item.height / 2; // Masonry 内部也用 /2
    colHeights[col] += h;
  }
  // 底部留白
  return Math.max(...colHeights) + 24;
}

export default function PhotoWall() {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(getBatchSize);
  const [cols, setCols] = useState(getColumns);
  useEffect(() => {
    const onResize = () => {
      setPerPage(getBatchSize());
      setCols(getColumns());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pages = useMemo<MasonryItem[][]>(() => {
    const result: MasonryItem[][] = [];
    for (let i = 0; i < photoItems.length; i += perPage) {
      result.push(photoItems.slice(i, i + perPage));
    }
    return result;
  }, [perPage]);

  const safePage = Math.min(page, Math.max(0, pages.length - 1));
  const currentItems = pages[safePage] ?? [];

  // 动态计算本页高度
  const gridHeight = useMemo(
    () => calcGridHeight(currentItems, cols),
    [currentItems, cols],
  );

  const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => Math.min(pages.length - 1, p + 1)), [pages.length]);

  return (
    <div className="relative">
      {!photoItems.length && <p className="text-sm text-white/40">暂无照片</p>}
      {/* 照片网格 */}
      <div className="relative w-full" style={{ height: gridHeight }}>
        <Masonry
          key={`${safePage}-${perPage}`}
          items={currentItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="left"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
          animateOnEnter={true}
        />
      </div>

      {/* 导航按钮 */}
      {pages.length > 1 && (
        <div className="flex items-center justify-center gap-6 mt-6 md:mt-8">
          <button
            onClick={goPrev}
            disabled={safePage === 0}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="上一页"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-xs tracking-[0.2em] text-white/30 min-w-[3rem] text-center">
            {safePage + 1} / {pages.length}
          </span>
          <button
            onClick={goNext}
            disabled={safePage >= pages.length - 1}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] backdrop-blur-md border-none flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="下一页"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
