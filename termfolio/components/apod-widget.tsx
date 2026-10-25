/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"

interface ApodData {
  title: string
  explanation: string
  url: string
  hdurl?: string
  date: string
  media_type: string
  copyright?: string
}

export default function ApodWidget() {
  const [apod, setApod] = useState<ApodData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const res = await fetch("/api/apod")
        if (!res.ok) throw new Error("Failed to fetch APOD")
        const data = await res.json()
        setApod(data)
      } catch (err) {
        console.error("APOD fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchApod()
  }, [])

  if (loading) {
    return (
      <div className="border border-term-line bg-term-darker overflow-hidden rounded-lg">
        <div className="flex items-center justify-between px-4 py-2 border-b border-term-line text-xs uppercase tracking-[0.14em] text-term-gray">
          <span className="animate-pulse">fetching signal from deep space...</span>
        </div>
        <div className="aspect-[21/9] bg-term-black animate-pulse" />
        <div className="px-4 py-3 space-y-2">
          <div className="h-4 w-2/3 bg-term-dark rounded animate-pulse" />
          <div className="h-3 w-full bg-term-dark rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-term-dark rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!apod || apod.media_type !== "image") return null

  return (
    <div className="border border-term-line bg-term-darker overflow-hidden rounded-lg">
      {/* Terminal chrome */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-term-line text-xs uppercase tracking-[0.14em] text-term-gray">
        <span>
          <span className="text-term-cyan">★</span> nasa/apod — astronomy picture of the day
        </span>
        <span>{apod.date}</span>
      </div>

      {/* Image */}
      <div className="relative group">
        <img
          src={apod.hdurl || apod.url}
          alt={apod.title}
          className="w-full object-cover transition-all duration-500"
          style={{ maxHeight: expanded ? "none" : 360 }}
          loading="lazy"
        />
        {/* Gradient overlay at bottom */}
        {!expanded && (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--term-black)] to-transparent" />
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="text-term-white text-lg font-semibold">{apod.title}</h3>
          {apod.copyright && (
            <span className="text-term-gray text-xs">© {apod.copyright}</span>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="px-4 py-3 text-sm leading-7 text-term-gray">
        <p className={expanded ? "" : "line-clamp-2"}>{apod.explanation}</p>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 text-xs text-term-cyan hover:text-term-white transition-colors"
        >
          {expanded ? "[collapse]" : "[expand]"}
        </button>
      </div>
    </div>
  )
}
