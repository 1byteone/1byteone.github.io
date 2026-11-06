"use client"

import Image from "next/image"
import { useState } from "react"
import catalog from "@/lib/bitmap-catalog.json"

const BITMAP_SOURCE = "https://icons8.com/illustrations/illustration/bitmap-planet-earth"

const illustrations = [
  {
    src: "/images/blog/bitmap/bitmap-paper-ship.png",
    title: "Paper ship",
    label: "原型与交付",
    className: "aspect-[4/3]",
    source: "https://icons8.com/illustrations/illustration/bitmap-paper-ship",
  },
  {
    src: "/images/blog/bitmap/bitmap-city-silhouette.png",
    title: "City silhouette",
    label: "系统与架构",
    className: "aspect-[4/3]",
    source: "https://icons8.com/illustrations/illustration/bitmap-city-silhouette",
  },
  {
    src: "/images/blog/bitmap/bitmap-disco-ball.png",
    title: "Disco ball",
    label: "实验与交互",
    className: "aspect-square",
    source: "https://icons8.com/illustrations/illustration/bitmap-disco-ball",
  },
  {
    src: "/images/blog/bitmap/bitmap-clover.png",
    title: "Clover",
    label: "工具与方法",
    className: "aspect-square",
    source: "https://icons8.com/illustrations/illustration/bitmap-clover",
  },
  {
    src: "/images/blog/bitmap/bitmap-planet-earth.png",
    title: "Planet earth",
    label: "开放视野",
    className: "aspect-square",
    source: BITMAP_SOURCE,
  },
] as const

const catalogIllustrations = catalog.map((item) => ({
  ...item,
  label: "Bitmap catalog",
  className: "aspect-square",
}))

const allIllustrations = [
  ...illustrations,
  ...catalogIllustrations.filter((item) => !illustrations.some((base) => base.src === item.src)),
]

interface BitmapIllustrationsProps {
  compact?: boolean
}

/** A local, reusable shelf inspired by Icons8's related Bitmap illustrations. */
export default function BitmapIllustrations({ compact = false }: BitmapIllustrationsProps) {
  const items = compact ? allIllustrations.slice(0, 8) : allIllustrations.slice(0, 25)
  const [selected, setSelected] = useState<(typeof allIllustrations)[number] | null>(null)

  return (
    <section className="space-y-4" aria-labelledby="bitmap-illustrations-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--term-green)]">related-illustrations</p>
          <h2 id="bitmap-illustrations-title" className="mt-1 text-lg font-semibold text-[var(--term-white)]">
            Bitmap style / 相关插画
          </h2>
          <p className="mt-1 text-xs leading-6 text-[var(--term-gray)]">
            用同一套黑白点阵语言标记文章、实验和工程记录。已整理 {catalog.length} 个本地素材。
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--term-gray)]">
          local assets / Icons8 Bitmap
        </span>
      </div>

      <div className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
        {items.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setSelected(item)}
            aria-label={`查看 ${item.title} 本地大图`}
            className="group overflow-hidden rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] transition-colors hover:border-[var(--term-cyan)]"
          >
            <div className={`${item.className} relative overflow-hidden bg-[var(--term-black)] p-3`}>
              <Image
                src={item.src}
                alt={`${item.title} Bitmap illustration`}
                fill
                sizes={compact ? "(max-width: 640px) 50vw, 160px" : "(max-width: 1024px) 33vw, 190px"}
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="border-t border-[var(--term-line)] px-3 py-2">
              <p className="truncate text-[11px] font-medium text-[var(--term-white)]">{item.title}</p>
              <p className="mt-0.5 truncate text-[10px] text-[var(--term-gray)]">{item.label}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bitmap-preview-title"
            className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-[var(--term-line)] bg-[var(--term-darker)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--term-line)] px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--term-green)]">local bitmap preview</p>
                <h3 id="bitmap-preview-title" className="mt-1 text-sm font-semibold text-[var(--term-white)]">{selected.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded border border-[var(--term-line)] px-2 py-1 text-xs text-[var(--term-gray)] hover:border-[var(--term-cyan)] hover:text-[var(--term-white)]"
              >
                关闭
              </button>
            </div>
            <div className="relative aspect-[16/10] bg-[var(--term-black)] p-8">
              <Image src={selected.src} alt={`${selected.title} Bitmap illustration`} fill sizes="(max-width: 768px) 100vw, 768px" className="object-contain p-8" />
            </div>
            <div className="border-t border-[var(--term-line)] px-4 py-3 text-xs text-[var(--term-gray)]">
              {selected.label} · 本地素材预览，不跳转外部站点
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
