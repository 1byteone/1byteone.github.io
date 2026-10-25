"use client"

import { useMemo, useState } from "react"

interface Post {
  id: string
  date: string
  title: string
}

interface WritingHeatmapProps {
  posts: Post[]
}

export default function WritingHeatmap({ posts }: WritingHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string
    count: number
    titles: string[]
    x: number
    y: number
  } | null>(null)

  const { weeks, monthLabels, dateMap, maxCount } = useMemo(() => {
    const dateMap = new Map<string, { count: number; titles: string[] }>()
    posts.forEach((p) => {
      const d = p.date.slice(0, 10)
      const existing = dateMap.get(d)
      if (existing) {
        existing.count++
        existing.titles.push(p.title)
      } else {
        dateMap.set(d, { count: 1, titles: [p.title] })
      }
    })

    let maxCount = 0
    dateMap.forEach((v) => {
      if (v.count > maxCount) maxCount = v.count
    })

    // Last 26 weeks (~6 months), each week = 1 row of 7 cells
    const today = new Date()
    const weeks: string[][] = []
    const startDay = new Date(today)
    startDay.setDate(today.getDate() - 26 * 7)
    // Align to Sunday
    startDay.setDate(startDay.getDate() - startDay.getDay())

    let current = new Date(startDay)
    while (current <= today) {
      const week: string[] = []
      for (let d = 0; d < 7; d++) {
        if (current <= today) {
          week.push(current.toISOString().slice(0, 10))
        }
        current.setDate(current.getDate() + 1)
      }
      weeks.push(week)
    }

    // Build month labels — mark first week of each month
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthLabels: { label: string; row: number }[] = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const firstDay = new Date(week[0])
      const month = firstDay.getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], row: wi })
        lastMonth = month
      }
    })

    return { weeks, monthLabels, dateMap, maxCount }
  }, [posts])

  const getLevel = (count: number): number => {
    if (count === 0) return 0
    if (maxCount <= 1) return count > 0 ? 4 : 0
    const ratio = count / maxCount
    if (ratio > 0.75) return 4
    if (ratio > 0.5) return 3
    if (ratio > 0.25) return 2
    return 1
  }

  const levelBg = (level: number) =>
    level === 0
      ? "var(--term-line, #2C313A)"
      : level === 1
        ? "color-mix(in srgb, var(--term-green) 30%, var(--term-line))"
        : level === 2
          ? "color-mix(in srgb, var(--term-green) 55%, var(--term-line))"
          : level === 3
            ? "color-mix(in srgb, var(--term-green) 80%, var(--term-line))"
            : "var(--term-green, #98C379)"

  const DAYS = ["S", "M", "T", "W", "T", "F", "S"]
  const totalPosts = posts.length

  return (
    <div className="border border-term-line bg-term-darker p-3 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.14em] text-term-gray">
          writing activity
        </div>
        <div className="text-[10px] text-term-gray">
          {totalPosts} post{totalPosts !== 1 ? "s" : ""} · 6 months
        </div>
      </div>

      {/* Vertical heatmap: weeks as rows, days as columns */}
      <div className="flex gap-[2px]">
        {/* Month labels column */}
        <div className="flex flex-col gap-[2px] mr-[2px]" style={{ flexShrink: 0 }}>
          {/* Spacer for day header row */}
          <div style={{ height: 12 }} />
          {weeks.map((_, wi) => {
            const monthLabel = monthLabels.find((m) => m.row === wi)
            return (
              <div
                key={wi}
                className="text-[8px] text-term-gray flex items-center justify-end"
                style={{ width: 24, height: 10 }}
              >
                {monthLabel ? monthLabel.label : ""}
              </div>
            )
          })}
        </div>

        {/* Grid area: day labels + cells */}
        <div className="flex-1 overflow-hidden">
          {/* Day labels row (S M T W T F S) */}
          <div
            className="grid mb-[2px]"
            style={{
              gridTemplateColumns: "repeat(7, 10px)",
              gap: "2px",
              height: 12,
            }}
          >
            {DAYS.map((d, i) => (
              <div
                key={i}
                className="text-[8px] text-term-gray flex items-center justify-center"
                style={{ width: 10 }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Heatmap grid: rows = weeks (top-to-bottom), columns = 7 days */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(7, 10px)",
              gridAutoFlow: "row",
              gap: "2px",
            }}
          >
            {weeks.map((week, wi) =>
              // Pad incomplete weeks so grid stays aligned
              Array.from({ length: 7 }, (_, di) => {
                const day = week[di]
                if (!day) {
                  return (
                    <div
                      key={`empty-${wi}-${di}`}
                      style={{ width: 10, height: 10 }}
                    />
                  )
                }
                const info = dateMap.get(day)
                const count = info?.count || 0
                const level = getLevel(count)

                return (
                  <div
                    key={day}
                    className="transition-colors duration-150 rounded-[2px]"
                    style={{
                      width: 10,
                      height: 10,
                      background: levelBg(level),
                      cursor: count > 0 ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setHoveredDay({
                        date: day,
                        count,
                        titles: info?.titles || [],
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      })
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-term-black border border-term-line px-3 py-2 text-xs text-term-white pointer-events-none rounded"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-term-gray">{hoveredDay.date}</div>
          {hoveredDay.count > 0 ? (
            <div className="text-term-green">
              {hoveredDay.count} post{hoveredDay.count > 1 ? "s" : ""}:{" "}
              {hoveredDay.titles.join(", ")}
            </div>
          ) : (
            <div className="text-term-gray">no posts</div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 text-[8px] text-term-gray">
        <span>less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: levelBg(level),
            }}
          />
        ))}
        <span>more</span>
      </div>
    </div>
  )
}
