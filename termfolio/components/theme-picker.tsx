"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"

// ── Theme definitions ──────────────────────────────────────────────
export interface ThemeDef {
  name: string
  label: string
  bg: string
  fg: string
  gray: string
  accent: string
  accentBright: string
  green: string
  line: string
  darker: string
}

export const THEMES: ThemeDef[] = [
  {
    name: "default",
    label: "default",
    bg: "#0b0b0f",
    fg: "#f3eadb",
    gray: "#6b7280",
    accent: "#7dd3fc",
    accentBright: "#bae6fd",
    green: "#4ade80",
    line: "#23232b",
    darker: "#111117",
  },
  {
    name: "tokyonight",
    label: "tokyonight",
    bg: "#1a1b26",
    fg: "#c0caf5",
    gray: "#565f89",
    accent: "#7aa2f7",
    accentBright: "#b4f9f8",
    green: "#9ece6a",
    line: "#292e42",
    darker: "#16161e",
  },
  {
    name: "rosepine",
    label: "rosé pine",
    bg: "#191724",
    fg: "#e0def4",
    gray: "#6e6a86",
    accent: "#c4a7e7",
    accentBright: "#ebbcba",
    green: "#31748f",
    line: "#26233a",
    darker: "#1f1d2e",
  },
  {
    name: "solarized",
    label: "solarized",
    bg: "#002b36",
    fg: "#839496",
    gray: "#586e75",
    accent: "#2aa198",
    accentBright: "#93a1a1",
    green: "#859900",
    line: "#073642",
    darker: "#001e26",
  },
  {
    name: "synthwave84",
    label: "synthwave '84",
    bg: "#262335",
    fg: "#f0e3ff",
    gray: "#848bbd",
    accent: "#ff7edb",
    accentBright: "#fede5d",
    green: "#72f1b8",
    line: "#34294f",
    darker: "#1e1a2e",
  },
  {
    name: "palenight",
    label: "palenight",
    bg: "#292d3e",
    fg: "#a6accd",
    gray: "#676e95",
    accent: "#82aaff",
    accentBright: "#c3e88d",
    green: "#c3e88d",
    line: "#3a3f58",
    darker: "#1f2233",
  },
  {
    name: "vercel",
    label: "vercel",
    bg: "#000000",
    fg: "#ededed",
    gray: "#666666",
    accent: "#ededed",
    accentBright: "#ffffff",
    green: "#50e3c2",
    line: "#1a1a1a",
    darker: "#0a0a0a",
  },
  {
    name: "osakajade",
    label: "osaka-jade",
    bg: "#0d1117",
    fg: "#b5cea8",
    gray: "#4b6043",
    accent: "#7ec699",
    accentBright: "#a8d8a8",
    green: "#98c379",
    line: "#1b2a1b",
    darker: "#060d06",
  },
  {
    name: "matrix",
    label: "matrix",
    bg: "#050505",
    fg: "#00ff00",
    gray: "#00cc00",
    accent: "#00ff66",
    accentBright: "#33ff99",
    green: "#33ff33",
    line: "#004400",
    darker: "#020202",
  },
  {
    name: "paper",
    label: "paper (light)",
    bg: "#FAF8F5",
    fg: "#1a1a1a",
    gray: "#8c8c8c",
    accent: "#c05621",
    accentBright: "#dd6b20",
    green: "#2f855a",
    line: "#e8e4df",
    darker: "#f0ece7",
  },
  {
    name: "daylight",
    label: "daylight (light)",
    bg: "#ffffff",
    fg: "#111111",
    gray: "#6b7280",
    accent: "#2563eb",
    accentBright: "#3b82f6",
    green: "#059669",
    line: "#e5e7eb",
    darker: "#f9fafb",
  },
]

export const DEFAULT_THEME_NAME = "vercel"
export const DEFAULT_THEME = THEMES.find((theme) => theme.name === DEFAULT_THEME_NAME) ?? THEMES[0]

// ── Apply theme by setting CSS variables on <html> ─────────────────
function applyTheme(theme: ThemeDef) {
  const root = document.documentElement
  const termVar = (name: string) => `--term-${name}`
  root.style.setProperty(termVar("black"), theme.bg)
  root.style.setProperty(termVar("white"), theme.fg)
  root.style.setProperty(termVar("gray"), theme.gray)
  root.style.setProperty(termVar("cyan"), theme.accent)
  root.style.setProperty(termVar("cyan-bright"), theme.accentBright)
  root.style.setProperty(termVar("green"), theme.green)
  root.style.setProperty(termVar("line"), theme.line)
  root.style.setProperty(termVar("darker"), theme.darker)
  // Persist selection
  localStorage.setItem("site-theme", theme.name)
}

// ── Theme Picker Component ─────────────────────────────────────────
export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState(DEFAULT_THEME_NAME)
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [highlightIdx, setHighlightIdx] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("site-theme")
    const found = saved ? THEMES.find((theme) => theme.name === saved) : DEFAULT_THEME
    const theme = found ?? DEFAULT_THEME
    setActiveTheme(theme.name)
    applyTheme(theme)
  }, [])

  // Focus search when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50)
      setSearch("")
      setHighlightIdx(0)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  const filtered = THEMES.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectTheme = useCallback((theme: ThemeDef) => {
    setActiveTheme(theme.name)
    applyTheme(theme)
    setIsOpen(false)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlightIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filtered[highlightIdx]) selectTheme(filtered[highlightIdx])
      }
    },
    [filtered, highlightIdx, selectTheme]
  )

  const pickerModal = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      data-testid="theme-picker-backdrop"
    >
      <div
        ref={modalRef}
        data-testid="theme-picker-panel"
        className="flex w-[min(360px,calc(100vw-2rem))] max-h-[min(560px,calc(100dvh-2rem))] flex-col overflow-hidden border border-term-line bg-term-black font-mono text-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        onKeyDown={handleKeyDown}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-term-line px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-term-white">Themes</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs uppercase tracking-[0.16em] text-term-gray hover:text-term-white"
          >
            esc
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-term-line px-4 py-2">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setHighlightIdx(0)
            }}
            className="w-full bg-transparent text-sm text-term-white outline-none placeholder:text-term-gray"
          />
        </div>

        {/* Theme List */}
        <div className="min-h-0 flex-1 overflow-y-auto" data-testid="theme-picker-list">
          {filtered.map((theme, idx) => (
            <button
              key={theme.name}
              onClick={() => selectTheme(theme)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                idx === highlightIdx
                  ? "bg-term-line text-term-white"
                  : "text-term-gray hover:bg-term-line/50 hover:text-term-white"
              }`}
            >
              {/* Color Preview Swatch */}
              <span className="inline-flex flex-shrink-0 gap-0.5">
                <span className="h-2 w-2 rounded-full" style={{ background: theme.accent }} />
                <span className="h-2 w-2 rounded-full" style={{ background: theme.green }} />
                <span className="h-2 w-2 rounded-full" style={{ background: theme.fg }} />
              </span>

              {/* Active Indicator */}
              {activeTheme === theme.name ? (
                <span className="text-xs text-term-green">●</span>
              ) : (
                <span className="w-3" />
              )}

              <span>{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-term-gray transition-colors hover:text-term-cyan"
        aria-label="Open theme picker"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className="inline-block h-2 w-2 rounded-full border border-current" />
        <span className="hidden sm:inline">themes</span>
      </button>

      {/* Modal Backdrop + Panel */}
      {mounted && isOpen ? createPortal(pickerModal, document.body) : null}
    </>
  )
}
