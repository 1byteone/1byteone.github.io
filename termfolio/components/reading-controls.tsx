"use client"

import { useState, useEffect } from "react"
import type { PostHeading } from "@/lib/posts"
import { localeCopy, type Locale } from "@/content/locale"

type FontSize = "sm" | "md" | "lg"
type ReadingTheme = "terminal" | "sepia" | "light"
type LineSpacing = "compact" | "comfortable" | "spacious"

interface ReadingControlsProps {
  headings: PostHeading[]
  wordCount: number
  locale?: Locale
}

const FONT_SIZES: Record<FontSize, { label: string; px: string }> = {
  sm: { label: "S", px: "16px" },
  md: { label: "M", px: "18px" },
  lg: { label: "L", px: "22px" },
}

const READING_THEMES: { key: ReadingTheme }[] = [
  { key: "terminal" },
  { key: "sepia" },
  { key: "light" },
]

const LINE_SPACINGS: { key: LineSpacing }[] = [
  { key: "compact" },
  { key: "comfortable" },
  { key: "spacious" },
]

export default function ReadingControls({ headings, wordCount, locale = "en" }: ReadingControlsProps) {
  const [fontSize, setFontSize] = useState<FontSize>("md")
  const [readingMode, setReadingMode] = useState(false)
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("terminal")
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>("comfortable")
  const [progress, setProgress] = useState(0)

  // Load preferences
  useEffect(() => {
    const savedSize = localStorage.getItem("reading-font-size") as FontSize
    if (savedSize && FONT_SIZES[savedSize]) setFontSize(savedSize)
    const savedTheme = localStorage.getItem("reading-theme") as ReadingTheme
    if (savedTheme) setReadingTheme(savedTheme)
    const savedSpacing = localStorage.getItem("reading-spacing") as LineSpacing
    if (savedSpacing) setLineSpacing(savedSpacing)
  }, [])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Apply font size to post content
  useEffect(() => {
    localStorage.setItem("reading-font-size", fontSize)
    const el = document.querySelector(".post-content") as HTMLElement
    if (el) {
      el.style.fontSize = FONT_SIZES[fontSize].px
    }
  }, [fontSize])

  // Apply reading theme
  useEffect(() => {
    localStorage.setItem("reading-theme", readingTheme)
    const article = document.querySelector("article") || document.querySelector(".cli-frame")
    if (!article) return
    article.classList.remove("reading-theme-terminal", "reading-theme-sepia", "reading-theme-light")
    if (readingTheme !== "terminal") {
      article.classList.add(`reading-theme-${readingTheme}`)
    }
  }, [readingTheme])

  // Apply line spacing
  useEffect(() => {
    localStorage.setItem("reading-spacing", lineSpacing)
    const article = document.querySelector("article") || document.querySelector(".cli-frame")
    if (!article) return
    article.classList.remove("reading-spacing-compact", "reading-spacing-comfortable", "reading-spacing-spacious")
    article.classList.add(`reading-spacing-${lineSpacing}`)
  }, [lineSpacing])

  // Apply reading mode
  useEffect(() => {
    const frame = document.querySelector(".cli-frame") as HTMLElement
    const content = document.querySelector(".post-content") as HTMLElement
    if (readingMode) {
      frame?.classList.add("reading-focus")
      content?.classList.add("reading-focus-body")
      document.body.classList.add("reading-focus-active")
    } else {
      frame?.classList.remove("reading-focus")
      content?.classList.remove("reading-focus-body")
      document.body.classList.remove("reading-focus-active")
    }
    return () => {
      document.body.classList.remove("reading-focus-active")
    }
  }, [readingMode])

  const headingCount = headings.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const copy = localeCopy[locale].reading

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-[var(--term-gray)]">
          <span>{copy.progress}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 rounded-full bg-[var(--term-line)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--term-cyan)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Reading Time */}
      <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] p-3 text-center">
        <div className="text-lg font-bold text-[var(--term-cyan)]">~{readingTime} min</div>
        <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mt-0.5">{copy.readingTime}</div>
      </div>

      {/* Font Size */}
      <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] p-3 space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">{copy.fontSize}</div>
        <div className="flex gap-1">
          {(["sm", "md", "lg"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                fontSize === size
                  ? "bg-[var(--term-cyan)] text-[var(--term-black)]"
                  : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
              }`}
            >
              {FONT_SIZES[size].label}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-center text-[var(--term-gray)]">{FONT_SIZES[fontSize].px}</div>
      </div>

      {/* Reading Theme */}
      <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] p-3 space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">{copy.readingTheme}</div>
        <div className="flex gap-1">
          {READING_THEMES.map((theme) => (
            <button
              key={theme.key}
              onClick={() => setReadingTheme(theme.key)}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                readingTheme === theme.key
                  ? "bg-[var(--term-cyan)] text-[var(--term-black)]"
                  : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
              }`}
            >
              {copy.themes[theme.key]}
            </button>
          ))}
        </div>
      </div>

      {/* Line Spacing */}
      <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] p-3 space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">{copy.spacing}</div>
        <div className="flex gap-1">
          {LINE_SPACINGS.map((spacing) => (
            <button
              key={spacing.key}
              onClick={() => setLineSpacing(spacing.key)}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                lineSpacing === spacing.key
                  ? "bg-[var(--term-cyan)] text-[var(--term-black)]"
                  : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
              }`}
            >
              {copy.spacings[spacing.key]}
            </button>
          ))}
        </div>
      </div>

      {/* Reading Mode */}
      <button
        onClick={() => setReadingMode(!readingMode)}
        className={`w-full rounded-lg border p-3 text-left transition-all ${
          readingMode
            ? "border-[var(--term-cyan)] bg-[var(--term-cyan)]/10"
            : "border-[var(--term-line)] bg-[var(--term-darker)] hover:border-[var(--term-gray)]"
        }`}
      >
        <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">
          {readingMode ? copy.focusOn : copy.focus}
        </div>
        <div className="text-xs text-[var(--term-gray)]">
          {readingMode ? copy.focusOnCopy : copy.focusCopy}
        </div>
      </button>

      {/* Stats */}
      <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] p-3 space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">{copy.info}</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span className="text-[var(--term-gray)]">{copy.sections}</span>
          <span className="text-[var(--term-white)] text-right">{headingCount}</span>
          <span className="text-[var(--term-gray)]">{copy.words}</span>
          <span className="text-[var(--term-white)] text-right">{wordCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
