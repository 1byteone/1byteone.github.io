"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DEFAULT_THEME_NAME, THEMES, type ThemeDef } from "@/components/theme-picker"
import TypingGame from "@/components/typing-game"
import StarMap from "@/components/star-map"
import WorldMap from "@/components/world-map"
import SnakeGame from "@/components/snake-game"
import Pokedex from "@/components/pokedex"
import TerminalDashboard from "@/components/terminal-dashboard"
import { siteConfig } from "@/content/site"

// ── Boot Lines ─────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "[sys] loading kernel modules...", color: "gray", delay: 0 },
  { text: "[sys] mounting /dev/strategy", color: "gray", delay: 200 },
  { text: "[ok]  ready", color: "green", delay: 500 },
  { text: "", color: "white", delay: 700 },
]

// ── Help Menu ──────────────────────────────────────────────────────
const COMMANDS: { cmd: string; desc: string; action: string; icon: string }[] = [
  { cmd: "about", desc: "open the dossier", action: "/about", icon: "📋" },
  { cmd: "blog", desc: "read the journal", action: "/blog", icon: "📝" },
  { cmd: "lab", desc: "browse public experiments", action: "/lab", icon: "⌁" },
  { cmd: "tools", desc: "open no-login tools", action: "/tools", icon: "▦" },
  { cmd: "split", desc: "split a bill", action: "/tools/splitter", icon: "÷" },
  { cmd: "short", desc: "shorten or clean a link", action: "/tools/short-link", icon: "↗" },
  { cmd: "qr", desc: "make a QR code", action: "/tools/qr", icon: "▣" },
  { cmd: "wa", desc: "make a WhatsApp link", action: "/tools/whatsapp", icon: "wa" },
  { cmd: "event", desc: "make a calendar file", action: "/tools/event", icon: "cal" },
  { cmd: "image", desc: "shrink an image", action: "/tools/image", icon: "img" },
  { cmd: "sharecard", desc: "make a share card", action: "/tools/share-card", icon: "▤" },
  { cmd: "card", desc: "open digital card", action: "/card", icon: "▣" },
  { cmd: "contact", desc: "book a conversation", action: "/contact", icon: "✉" },
  { cmd: "skills", desc: "cat skills.txt", action: "skills", icon: "⚡" },
  { cmd: "theme", desc: "switch color theme", action: "theme", icon: "🎨" },
  { cmd: "whoami", desc: "who is 1byteone?", action: "whoami", icon: "👤" },
  { cmd: "json", desc: "format & validate JSON", action: "json", icon: "{ }" },
  { cmd: "base64", desc: "encode/decode base64", action: "base64", icon: "🔐" },
  { cmd: "wordcount", desc: "count words in text", action: "wordcount", icon: "📊" },
  { cmd: "uuid", desc: "generate a UUID", action: "uuid", icon: "🆔" },
  { cmd: "epoch", desc: "timestamp converter", action: "epoch", icon: "⏱" },
  { cmd: "type", desc: "typing speed test", action: "type", icon: "⌨" },
  { cmd: "stars", desc: "constellation map", action: "stars", icon: "✦" },
  { cmd: "map", desc: "ASCII world map", action: "map", icon: "🗺" },
  { cmd: "snake", desc: "play snake game", action: "snake", icon: "🐍" },
  { cmd: "pokedex", desc: "browse creatures", action: "pokedex", icon: "📖" },
  { cmd: "dashboard", desc: "system dashboard", action: "dashboard", icon: "📊" },
  { cmd: "clear", desc: "clear terminal", action: "clear", icon: "🧹" },
]

const SKILLS_OUTPUT = siteConfig.terminalSkills

const WHOAMI_OUTPUT = [
  `name:     ${siteConfig.name}`,
  `handle:   ${siteConfig.handle}`,
  `location: ${siteConfig.location}`,
  `focus:    ${siteConfig.whoami.focus}`,
  `status:   ${siteConfig.whoami.status}`,
]

const COLOR_MAP: Record<string, string> = {
  green: "text-term-green",
  gray: "text-term-gray",
  cyan: "text-term-cyan",
  white: "text-term-white",
  amber: "text-[#E5C07B]",
}

type ModalType = "theme" | "json" | "base64" | "wordcount" | "typing" | "stars" | "map" | "snake" | "pokedex" | "dashboard" | null

interface OutputLine {
  text: string
  color: string
}

export default function BootTerminal() {
  const router = useRouter()
  const [bootDone, setBootDone] = useState(false)
  const [bootLines, setBootLines] = useState(0)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [input, setInput] = useState("")
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [themeIdx, setThemeIdx] = useState(() => {
    const idx = THEMES.findIndex((theme) => theme.name === DEFAULT_THEME_NAME)
    return idx >= 0 ? idx : 0
  })
  const [showHelp, setShowHelp] = useState(false)
  const [modalInput, setModalInput] = useState("")
  const [modalOutput, setModalOutput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalInputRef = useRef<HTMLTextAreaElement>(null)

  // ── Boot sequence ───────────────────────────────────────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setBootLines(i + 1), BOOT_LINES[i].delay))
    })
    timers.push(setTimeout(() => setBootDone(true), 900))
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Auto-scroll ─────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [output, bootLines, showHelp])

  // ── Focus input on click ────────────────────────────────────────
  const focusInput = useCallback(() => {
    if (bootDone && !activeModal) inputRef.current?.focus()
  }, [bootDone, activeModal])

  // ── Apply theme ─────────────────────────────────────────────────
  const applyTheme = useCallback((theme: ThemeDef) => {
    const root = document.documentElement
    root.style.setProperty("--term-black", theme.bg)
    root.style.setProperty("--term-white", theme.fg)
    root.style.setProperty("--term-gray", theme.gray)
    root.style.setProperty("--term-cyan", theme.accent)
    root.style.setProperty("--term-cyan-bright", theme.accentBright)
    root.style.setProperty("--term-green", theme.green)
    root.style.setProperty("--term-line", theme.line)
    root.style.setProperty("--term-darker", theme.darker)
    localStorage.setItem("site-theme", theme.name)
  }, [])

  // ── Close modal ─────────────────────────────────────────────────
  const closeModal = useCallback(() => {
    setActiveModal(null)
    setModalInput("")
    setModalOutput("")
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // ── Tool functions ──────────────────────────────────────────────
  const runJsonFormat = useCallback((text: string) => {
    try {
      const parsed = JSON.parse(text)
      setModalOutput(JSON.stringify(parsed, null, 2))
    } catch {
      setModalOutput("❌ Invalid JSON: " + (text ? "check syntax" : "paste JSON above"))
    }
  }, [])

  const runBase64 = useCallback((text: string, mode: "encode" | "decode") => {
    try {
      if (mode === "encode") {
        setModalOutput(btoa(unescape(encodeURIComponent(text))))
      } else {
        setModalOutput(decodeURIComponent(escape(atob(text))))
      }
    } catch {
      setModalOutput("❌ Invalid input for " + mode)
    }
  }, [])

  const runWordCount = useCallback((text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const chars = text.length
    const lines = text.split("\n").length
    const sentences = text.split(/[.!?]+/).filter(Boolean).length
    const readTime = Math.max(1, Math.ceil(words / 200))
    setModalOutput(
      `words:     ${words}\nchars:     ${chars}\nlines:     ${lines}\nsentences: ${sentences}\nread time: ~${readTime} min`
    )
  }, [])

  // ── Execute command ─────────────────────────────────────────────
  const execCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase()
    const prompt: OutputLine = { text: `$ ${raw}`, color: "green" }

    if (!cmd) return

    setOutput((prev) => [...prev, prompt])
    setInput("")
    setShowHelp(false)

    if (cmd === "help") { setShowHelp(true); return }
    if (cmd === "clear") { setOutput([]); return }
    if (cmd === "theme" || cmd === "themes") {
      setActiveModal("theme")
      const saved = localStorage.getItem("site-theme") ?? DEFAULT_THEME_NAME
      const idx = THEMES.findIndex((t) => t.name === saved)
      setThemeIdx(idx >= 0 ? idx : 0)
      return
    }
    if (cmd === "json") { setActiveModal("json"); setTimeout(() => modalInputRef.current?.focus(), 50); return }
    if (cmd === "base64") { setActiveModal("base64"); setTimeout(() => modalInputRef.current?.focus(), 50); return }
    if (cmd === "wordcount" || cmd === "wc") { setActiveModal("wordcount"); setTimeout(() => modalInputRef.current?.focus(), 50); return }
    if (cmd === "type" || cmd === "typing") { setActiveModal("typing"); return }
    if (cmd === "stars" || cmd === "starmap") { setActiveModal("stars"); return }
    if (cmd === "map" || cmd === "worldmap") { setActiveModal("map"); return }
    if (cmd === "snake") { setActiveModal("snake"); return }
    if (cmd === "pokedex" || cmd === "dex") { setActiveModal("pokedex"); return }
    if (cmd === "dashboard" || cmd === "dash") { setActiveModal("dashboard"); return }
    if (cmd === "uuid") {
      const uuid = crypto.randomUUID()
      setOutput((prev) => [...prev, { text: uuid, color: "cyan" }])
      navigator.clipboard?.writeText(uuid)
      setOutput((prev) => [...prev, { text: "(copied to clipboard)", color: "gray" }])
      return
    }
    if (cmd === "epoch") {
      const now = Date.now()
      const iso = new Date(now).toISOString()
      setOutput((prev) => [
        ...prev,
        { text: `unix:  ${Math.floor(now / 1000)}`, color: "white" },
        { text: `ms:    ${now}`, color: "white" },
        { text: `iso:   ${iso}`, color: "white" },
      ])
      return
    }
    if (cmd === "skills" || cmd === "cat skills.txt") {
      setOutput((prev) => [...prev, ...SKILLS_OUTPUT.map((text) => ({ text, color: "white" }))])
      return
    }
    if (cmd === "whoami") {
      setOutput((prev) => [...prev, ...WHOAMI_OUTPUT.map((text) => ({ text, color: "white" }))])
      return
    }
    const match = COMMANDS.find((c) => c.cmd === cmd)
    if (match && match.action.startsWith("/")) {
      setOutput((prev) => [...prev, { text: `navigating to ${match.action}...`, color: "cyan" }])
      setTimeout(() => router.push(match.action), 400)
      return
    }
    setOutput((prev) => [
      ...prev,
      { text: `command not found: ${cmd}. type 'help' for available commands.`, color: "amber" },
    ])
  }, [router])

  // ── Modal keyboard ──────────────────────────────────────────────
  const handleGlobalKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && activeModal) { e.preventDefault(); closeModal(); return }
      if (activeModal === "theme") {
        if (e.key === "ArrowDown") { e.preventDefault(); setThemeIdx((i) => Math.min(i + 1, THEMES.length - 1)) }
        else if (e.key === "ArrowUp") { e.preventDefault(); setThemeIdx((i) => Math.max(i - 1, 0)) }
        else if (e.key === "Enter") {
          e.preventDefault()
          applyTheme(THEMES[themeIdx])
          setOutput((prev) => [...prev, { text: `theme set to '${THEMES[themeIdx].label}'`, color: "cyan" }])
          closeModal()
        }
      }
    },
    [activeModal, themeIdx, applyTheme, closeModal]
  )

  // ── Render Modal ────────────────────────────────────────────────
  const renderModal = () => {
    if (!activeModal) return null

    if (activeModal === "theme") {
      return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-term-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-term-line bg-term-darker rounded-lg overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-term-line">
              <span className="text-term-white text-xs uppercase tracking-[0.14em]">🎨 select theme</span>
              <span className="text-term-gray text-[10px]">↑/↓ enter · esc close</span>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {THEMES.map((theme, idx) => {
                const active = (typeof window !== "undefined" && localStorage.getItem("site-theme")) === theme.name
                return (
                  <button
                    key={theme.name}
                    onClick={() => {
                      applyTheme(theme)
                      setOutput((prev) => [...prev, { text: `theme set to '${theme.label}'`, color: "cyan" }])
                      closeModal()
                    }}
                    className={`w-full text-left flex items-center gap-3 py-2 px-3 text-sm rounded transition-colors ${
                      idx === themeIdx ? "bg-term-line text-term-white" : "text-term-gray hover:text-term-white hover:bg-term-line/50"
                    }`}
                  >
                    <span className="inline-flex gap-1">
                      <span className="w-3 h-3 rounded-full border border-term-line" style={{ background: theme.bg }} />
                      <span className="w-3 h-3 rounded-full" style={{ background: theme.accent }} />
                      <span className="w-3 h-3 rounded-full" style={{ background: theme.green }} />
                    </span>
                    {active && <span className="text-term-green text-xs">●</span>}
                    <span>{theme.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    // Typing game modal
    if (activeModal === "typing") {
      return <TypingGame onClose={closeModal} />
    }

    // Star map modal
    if (activeModal === "stars") {
      return <StarMap onClose={closeModal} />
    }

    // World map modal
    if (activeModal === "map") {
      return <WorldMap onClose={closeModal} />
    }

    // Snake game modal
    if (activeModal === "snake") {
      return <SnakeGame onClose={closeModal} />
    }

    // Pokedex modal
    if (activeModal === "pokedex") {
      return <Pokedex onClose={closeModal} />
    }

    // Dashboard modal
    if (activeModal === "dashboard") {
      return (
        <TerminalDashboard
          onClose={closeModal}
          onCommand={(cmd) => {
            closeModal()
            setTimeout(() => execCommand(cmd), 50)
          }}
        />
      )
    }

    // Tool modals (JSON, Base64, Word Count)
    const titles: Record<string, string> = {
      json: "{ } JSON Formatter",
      base64: "🔐 Base64 Encode/Decode",
      wordcount: "📊 Word Counter",
    }

    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-term-black/80 backdrop-blur-sm">
        <div className="w-full max-w-lg border border-term-line bg-term-darker rounded-lg overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-term-line">
            <span className="text-term-white text-xs uppercase tracking-[0.14em]">{titles[activeModal] || activeModal}</span>
            <button onClick={closeModal} className="text-term-gray hover:text-term-white text-xs">[esc]</button>
          </div>
          <div className="p-4 space-y-3">
            <textarea
              ref={modalInputRef}
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              placeholder={
                activeModal === "json" ? '{"paste": "json here"}' :
                activeModal === "base64" ? "text to encode/decode" :
                "paste text to analyze..."
              }
              className="w-full h-28 bg-term-black border border-term-line rounded p-3 text-sm text-term-white font-mono resize-none outline-none focus:border-term-cyan transition-colors"
              spellCheck={false}
            />
            <div className="flex gap-2">
              {activeModal === "json" && (
                <button onClick={() => runJsonFormat(modalInput)} className="px-3 py-1.5 bg-term-line text-term-white text-xs rounded hover:bg-term-cyan/20 transition-colors">
                  format & validate
                </button>
              )}
              {activeModal === "base64" && (
                <>
                  <button onClick={() => runBase64(modalInput, "encode")} className="px-3 py-1.5 bg-term-line text-term-white text-xs rounded hover:bg-term-cyan/20 transition-colors">
                    encode
                  </button>
                  <button onClick={() => runBase64(modalInput, "decode")} className="px-3 py-1.5 bg-term-line text-term-white text-xs rounded hover:bg-term-cyan/20 transition-colors">
                    decode
                  </button>
                </>
              )}
              {activeModal === "wordcount" && (
                <button onClick={() => runWordCount(modalInput)} className="px-3 py-1.5 bg-term-line text-term-white text-xs rounded hover:bg-term-cyan/20 transition-colors">
                  analyze
                </button>
              )}
              {modalOutput && (
                <button
                  onClick={() => { navigator.clipboard?.writeText(modalOutput) }}
                  className="ml-auto px-3 py-1.5 text-term-gray text-xs hover:text-term-cyan transition-colors"
                >
                  [copy]
                </button>
              )}
            </div>
            {modalOutput && (
              <pre className="bg-term-black border border-term-line rounded p-3 text-sm text-term-green font-mono max-h-40 overflow-auto whitespace-pre-wrap">
                {modalOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="terminal-english cli-panel border border-term-line bg-term-darker overflow-hidden flex flex-col h-full cursor-text relative rounded-lg"
      onClick={focusInput}
      onKeyDown={handleGlobalKey}
      tabIndex={-1}
      dir="ltr"
      lang="en"
    >
      {/* ── Terminal Chrome ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-term-line bg-term-black text-xs uppercase tracking-[0.14em] text-term-gray">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="ml-2">{siteConfig.terminalPrompt}</span>
        </div>
        <span>/bin/sh</span>
      </div>

      {/* ── Terminal Body ───────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-5 font-mono text-sm leading-[1.8]"
      >
        {/* Boot Lines */}
        {BOOT_LINES.slice(0, bootLines).map((line, i) => (
          <div key={`boot-${i}`} className={COLOR_MAP[line.color] || "text-term-white"}>
            {line.text || "\u00A0"}
          </div>
        ))}

        {/* ASCII Art */}
        {bootDone && (
          <>
            <pre className="text-term-cyan text-[clamp(0.45rem,1.15vw,0.75rem)] leading-[1.15] my-3 whitespace-pre overflow-x-auto">
              {siteConfig.asciiArt.home.join("\n")}
            </pre>
            <div className="text-xs uppercase tracking-[0.2em] text-term-gray mb-3">
              {siteConfig.tagline}
            </div>
            <div className="text-term-gray text-xs mb-1">
              type{" "}
              <button onClick={() => execCommand("help")} className="text-term-cyan font-bold hover:underline cursor-pointer">help</button>
              {" "}for commands ·{" "}
              <button onClick={() => execCommand("theme")} className="text-term-cyan font-bold hover:underline cursor-pointer">theme</button>
              {" "}to switch colors
            </div>
            <div className="text-term-gray text-xs mb-1">
              site tools{" "}
              {["tools", "split", "short", "qr", "wa", "event", "image", "sharecard"].map((cmd, i) => (
                <span key={cmd}>
                  {i > 0 && " · "}
                  <button onClick={() => execCommand(cmd)} className="text-term-cyan hover:underline cursor-pointer">{cmd}</button>
                </span>
              ))}
            </div>
            <div className="text-term-gray text-xs mb-1">
              terminal tools{" "}
              {["json", "base64", "wordcount", "uuid", "epoch"].map((cmd, i) => (
                <span key={cmd}>
                  {i > 0 && " · "}
                  <button onClick={() => execCommand(cmd)} className="text-term-cyan hover:underline cursor-pointer">{cmd}</button>
                </span>
              ))}
            </div>
            <div className="text-term-gray text-xs mb-2">
              play{" "}
              {["type", "stars", "map", "snake", "pokedex", "dashboard"].map((cmd, i) => (
                <span key={cmd}>
                  {i > 0 && " · "}
                  <button onClick={() => execCommand(cmd)} className="text-term-cyan hover:underline cursor-pointer">{cmd}</button>
                </span>
              ))}
            </div>
          </>
        )}

        {/* Command Output */}
        {output.map((line, i) => (
          <div key={`out-${i}`} className={COLOR_MAP[line.color] || "text-term-white"}>
            {line.text || "\u00A0"}
          </div>
        ))}

        {/* Help Menu (pop-out) */}
        {showHelp && (
          <div className="my-2 border border-term-line bg-term-black rounded-lg p-4">
            <div className="text-term-white text-xs uppercase tracking-[0.14em] mb-3">available commands</div>
            <div className="grid gap-0.5">
              {COMMANDS.map((c) => (
                <button
                  key={c.cmd}
                  onClick={() => { setShowHelp(false); execCommand(c.cmd) }}
                  className="flex items-center gap-3 text-sm py-1 px-2 rounded hover:bg-term-line/50 transition-colors text-left"
                >
                  <span className="w-5 text-center">{c.icon}</span>
                  <span className="text-term-cyan w-20 font-bold">{c.cmd}</span>
                  <span className="text-term-gray">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Prompt */}
        {bootDone && !activeModal && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-term-green">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") execCommand(input) }}
              className="flex-1 bg-transparent text-term-white outline-none caret-term-white text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <span className="inline-block w-2 h-4 bg-term-white cursor-glow" />
          </div>
        )}
      </div>

      {/* ── Modal Overlay ──────────────────────────────────────── */}
      {renderModal()}
    </div>
  )
}
