"use client"

import { useEffect, useState, useCallback, useRef } from "react"

// ── ASCII digit definitions (5 lines tall, 6 chars wide) ───────────
const DIGITS: Record<string, string[]> = {
  "0": [
    " ████ ",
    "██  ██",
    "██  ██",
    "██  ██",
    " ████ ",
  ],
  "1": [
    "  ██  ",
    " ███  ",
    "  ██  ",
    "  ██  ",
    " ████ ",
  ],
  "2": [
    " ████ ",
    "██  ██",
    "   ██ ",
    "  ██  ",
    "██████",
  ],
  "3": [
    " ████ ",
    "██  ██",
    "   ██ ",
    "██  ██",
    " ████ ",
  ],
  "4": [
    "██  ██",
    "██  ██",
    "██████",
    "    ██",
    "    ██",
  ],
  "5": [
    "██████",
    "██    ",
    "█████ ",
    "    ██",
    "█████ ",
  ],
  "6": [
    " ████ ",
    "██    ",
    "█████ ",
    "██  ██",
    " ████ ",
  ],
  "7": [
    "██████",
    "    ██",
    "   ██ ",
    "  ██  ",
    "  ██  ",
  ],
  "8": [
    " ████ ",
    "██  ██",
    " ████ ",
    "██  ██",
    " ████ ",
  ],
  "9": [
    " ████ ",
    "██  ██",
    " █████",
    "    ██",
    " ████ ",
  ],
  ":": [
    "      ",
    "  ██  ",
    "      ",
    "  ██  ",
    "      ",
  ],
}

// ── Helpers ─────────────────────────────────────────────────────────
function padTwo(n: number): string {
  return n.toString().padStart(2, "0")
}

function formatUptime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${padTwo(m)}:${padTwo(s)}`
}

function parseBrowser(ua: string): string {
  if (ua.includes("Firefox")) return "Firefox"
  if (ua.includes("Edg")) return "Edge"
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera"
  if (ua.includes("Chrome")) return "Chrome"
  if (ua.includes("Safari")) return "Safari"
  return "Unknown"
}

function buildClockLines(time: string): string[] {
  const chars = time.split("")
  const lines: string[] = ["", "", "", "", ""]
  for (const ch of chars) {
    const glyph = DIGITS[ch]
    if (!glyph) continue
    for (let row = 0; row < 5; row++) {
      lines[row] += (lines[row].length > 0 ? " " : "") + glyph[row]
    }
  }
  return lines
}

// ── Quick-link commands ─────────────────────────────────────────────
const COMMANDS = [
  { label: "about", desc: "dossier" },
  { label: "blog", desc: "journal" },
  { label: "contact", desc: "reach out" },
  { label: "type", desc: "typing game" },
  { label: "stars", desc: "star map" },
  { label: "json", desc: "data view" },
  { label: "help", desc: "all commands" },
  { label: "theme", desc: "change theme" },
] as const

// ── Component ───────────────────────────────────────────────────────
interface TerminalDashboardProps {
  onClose: () => void
  onCommand?: (cmd: string) => void
}

export default function TerminalDashboard({ onClose, onCommand }: TerminalDashboardProps) {
  const [now, setNow] = useState(new Date())
  const [uptime, setUptime] = useState(0)
  const [visits, setVisits] = useState(0)
  const [theme, setTheme] = useState("default")
  const [browser, setBrowser] = useState("--")
  const [colonVisible, setColonVisible] = useState(true)
  const mountTime = useRef(Date.now())

  // Increment visitor count and read localStorage values on mount
  useEffect(() => {
    const stored = localStorage.getItem("visitor-count")
    const count = stored ? parseInt(stored, 10) + 1 : 1
    localStorage.setItem("visitor-count", String(count))
    setVisits(count)

    const savedTheme = localStorage.getItem("site-theme") ?? "default"
    setTheme(savedTheme)

    setBrowser(parseBrowser(navigator.userAgent))
  }, [])

  // Tick clock and uptime every second
  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date())
      setUptime(Math.floor((Date.now() - mountTime.current) / 1000))
      setColonVisible((prev) => !prev)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  // Escape key handler
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  // Build the ASCII clock string
  const timeStr = `${padTwo(now.getHours())}:${padTwo(now.getMinutes())}:${padTwo(now.getSeconds())}`
  const displayStr = colonVisible
    ? timeStr
    : timeStr.replace(/:/g, " ")
  const clockLines = buildClockLines(displayStr)

  const route =
    typeof window !== "undefined" ? window.location.pathname : "/"

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--term-black)]/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl border border-[var(--term-line)] bg-[var(--term-darker)] rounded-xl overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--term-line)]">
          <span className="text-[var(--term-white)] text-xs uppercase tracking-[0.14em]">
            System Dashboard
          </span>
          <button
            onClick={onClose}
            className="text-[var(--term-gray)] hover:text-[var(--term-white)] text-xs"
          >
            [esc]
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* ASCII Clock */}
          <div className="flex justify-center">
            <pre
              className="text-[var(--term-cyan)] text-[10px] sm:text-xs md:text-sm leading-tight font-mono select-none"
              aria-label={`Current time: ${timeStr}`}
            >
              {clockLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {"\n"}
                </span>
              ))}
            </pre>
          </div>

          {/* Status line */}
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--term-gray)]">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--term-green)]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            <span>live</span>
            <span className="text-[var(--term-line)]">|</span>
            <span>{route}</span>
          </div>

          {/* Info cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoCard label="Session Uptime" value={formatUptime(uptime)} accent />
            <InfoCard label="Visits" value={String(visits)} />
            <InfoCard label="Theme" value={theme} />
            <InfoCard label="Browser" value={browser} />
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--term-gray)]">
              Quick Commands
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMANDS.map((cmd) => (
                <button
                  key={cmd.label}
                  type="button"
                  className="border border-[var(--term-line)] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--term-gray)] transition-colors hover:border-[var(--term-cyan)]/40 hover:text-[var(--term-white)] rounded"
                  title={cmd.desc}
                  onClick={() => {
                    onClose()
                    onCommand?.(cmd.label)
                  }}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-[var(--term-line)] text-[10px] uppercase tracking-widest text-[var(--term-gray)]">
          <span>
            uptime {formatUptime(uptime)}
          </span>
          <span>
            {now.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Blinking pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

// ── Info Card sub-component ─────────────────────────────────────────
function InfoCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="border border-[var(--term-line)] rounded-lg px-3 py-2.5 space-y-1">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--term-gray)]">
        {label}
      </p>
      <p
        className={`text-sm font-mono ${
          accent
            ? "text-[var(--term-cyan)]"
            : "text-[var(--term-white)]"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
