"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"

interface Creature {
  name: string
  type: string
  description: string
  hp: number
  atk: number
  def: number
  art: string[]
}

const TYPE_COLORS: Record<string, string> = {
  fire: "text-orange-400",
  water: "text-blue-400",
  electric: "text-yellow-300",
  earth: "text-amber-600",
  shadow: "text-purple-400",
  light: "text-yellow-100",
  cyber: "text-[var(--term-cyan)]",
  void: "text-gray-400",
}

function c(n: string, t: string, d: string, hp: number, atk: number, def: number, art: string[]): Creature {
  return { name: n, type: t, description: d, hp, atk, def, art }
}

const CREATURES: readonly Creature[] = [
  c("Glitchfang", "cyber", "A corrupted data fragment that gained sentience. It feeds on broken packets and lurks in deprecated APIs.", 70, 85, 50,
    ["  ╔══╗  ", " ▓░██░▓ ", " ║●  ●║ ", " ║ ▓▓ ║ ", " ╚╗╔╗╚╝ ", "  ░▓░▓  "]),
  c("Pyrascale", "fire", "Born in volcanic server rooms. Its core runs at 9000K and it sheds molten silicon scales.", 80, 90, 60,
    ["   ◆◆   ", "  ◆██◆  ", " ░████░ ", " ▓█◆◆█▓ ", "  ▓██▓  ", "   ░░   "]),
  c("Tidecrawl", "water", "A deep-ocean automaton encrusted with bioluminescent barnacles. It maps the abyssal network cables.", 95, 55, 80,
    ["  ░▓▓░  ", " ╔════╗ ", " ║●░░●║ ", " ║░██░║ ", " ╚═╗╔═╝ ", " ░░║║░░ "]),
  c("Boltsprite", "electric", "A mischievous charge that nests inside capacitors. It sparks wildly when excited.", 50, 95, 35,
    ["  ░██░  ", " ░█◆◆█░ ", "  ▓●●▓  ", "   ██   ", "  ░▓▓░  ", "  ░  ░  "]),
  c("Terravore", "earth", "An ancient construct of compressed stone and root. It hibernates for centuries between meals.", 120, 70, 95,
    [" ▓████▓ ", " █●══●█ ", " ██▓▓██ ", " ▓████▓ ", "  █══█  ", " ██  ██ "]),
  c("Nullshade", "shadow", "A patch of absolute darkness that slipped through a null pointer. It consumes light and returns silence.", 65, 80, 70,
    ["  ░░░░  ", " ░▓▓▓▓░ ", " ▓●  ●▓ ", " ▓▓██▓▓ ", "  ▓▓▓▓  ", "   ░░   "]),
  c("Luxorbit", "light", "A radiant sphere that orbits dying stars. Scholars believe it carries memories of extinct civilizations.", 75, 65, 75,
    ["   ░░   ", "  ░██░  ", " ░█◆◆█░ ", " ░█◆◆█░ ", "  ░██░  ", "   ░░   "]),
  c("Hexweaver", "cyber", "A rogue compiler that writes its own bytecode. It structures the world into neat hexagonal grids.", 60, 75, 65,
    [" ╔═══╗  ", " ║▓░▓║  ", " ║●══●╗ ", " ╚═▓▓═╝ ", "  ░║║░  ", "  ░░░░  "]),
  c("Cindermaw", "fire", "A furnace beast that swallows ore and breathes alloy. Blacksmiths worship it as a minor deity.", 85, 100, 45,
    ["  ▓▓▓▓  ", " ▓●██●▓ ", " ███◆██ ", " ▓████▓ ", "  ▓██▓  ", "  ░░░░  "]),
  c("Abyssling", "void", "A tiny rift in spacetime that developed curiosity. It wanders between dimensions collecting trinkets.", 40, 60, 40,
    ["   ░░   ", "  ░▓▓░  ", " ░▓●●▓░ ", "  ░▓▓░  ", "   ░░   ", "   ◆◆   "]),
  c("Coralcore", "water", "A living reef compressed into a walking node. It broadcasts sonar pings to map the ocean floor.", 90, 50, 90,
    [" ░░██░░ ", " ▓████▓ ", " █●▓▓●█ ", " ▓████▓ ", "  ▓▓▓▓  ", " ░░  ░░ "]),
  c("Stormfray", "electric", "A tangled knot of perpetual lightning. It crackles through power grids like a living surge.", 55, 90, 40,
    ["  ░◆◆░  ", " ░█░░█░ ", "  █●●█  ", " ░████░ ", "  ░██░  ", "   ░░   "]),
  c("Rootwraith", "earth", "The ghost of an ancient tree preserved in silicon. It whispers in assembly language.", 100, 60, 85,
    ["  ░▓▓░  ", " ░▓██▓░ ", " ▓█●●█▓ ", "  ████  ", "  ║██║  ", " ░║  ║░ "]),
  c("Duskfold", "shadow", "A creature made of layered twilight. It can flatten itself to slip through any crack.", 70, 75, 60,
    [" ░░░░░░ ", " ░▓▓▓▓░ ", " ░▓●●▓░ ", " ░▓▓▓▓░ ", " ░░▓▓░░ ", "  ░░░░  "]),
  c("Prismoid", "light", "A crystalline entity that refracts thoughts into visible spectra. Philosophers find it unsettling.", 60, 70, 80,
    ["   ◆◆   ", "  ◆░░◆  ", " ◆░██░◆ ", "  ◆░░◆  ", "   ◆◆   ", "   ░░   "]),
  c("Voidmoth", "void", "A delicate insect that feeds on entropy. Its wings display patterns from uncomputable functions.", 45, 55, 50,
    [" ░▓  ▓░ ", " ▓█◆◆█▓ ", "  █●●█  ", " ▓█◆◆█▓ ", " ░▓  ▓░ ", "   ░░   "]),
  c("Ironbloom", "earth", "A flower forged from meteoric iron. It blooms once per solar cycle and emits gravitational pollen.", 85, 65, 100,
    ["  ░◆◆░  ", " ░◆██◆░ ", " ◆████◆ ", "  ░██░  ", "   ║║   ", "  ░░░░  "]),
  c("Netherflux", "shadow", "A swirling vortex of dark energy that occasionally coalesces into a face. It speaks in riddles.", 75, 85, 55,
    ["  ░▓▓░  ", " ▓░░░░▓ ", " ▓●░░●▓ ", " ░▓▓▓▓░ ", "  ░▓▓░  ", "   ░░   "]),
  c("Synthwave", "cyber", "A sentient audio waveform from the 80s that refuses to be deprecated. It attacks with retrowave pulses.", 65, 80, 55,
    [" ═══════ ", " ░▓█▓░▓░ ", " ▓█●●█▓ ", " ░▓▓▓▓░ ", " ═══════ ", "  ░░░░  "]),
  c("Emberwisp", "fire", "A tiny flame spirit that drifts through cold circuits to keep them warm. Beloved by overclocked CPUs.", 40, 70, 30,
    ["   ░░   ", "  ░▓▓░  ", "  ▓●●▓  ", "   ██   ", "   ▓▓   ", "   ░░   "]),
]

function statBar(value: number): string {
  const filled = Math.round(value / 10)
  const empty = 10 - filled
  return "█".repeat(filled) + "░".repeat(empty)
}

interface PokedexProps {
  onClose: () => void
}

export default function Pokedex({ onClose }: PokedexProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [search, setSearch] = useState("")
  const listRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return [...CREATURES]
    const q = search.toLowerCase()
    return CREATURES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
    )
  }, [search])

  const selected = filtered[selectedIndex] ?? filtered[0]

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      }
    },
    [onClose, filtered.length]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!listRef.current) return
    const active = listRef.current.querySelector("[data-active='true']")
    active?.scrollIntoView({ block: "nearest" })
  }, [selectedIndex])

  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 100)
  }, [])

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--term-black)]/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl border border-[var(--term-line)] bg-[var(--term-darker)] rounded-xl overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--term-line)]">
          <span className="text-[var(--term-white)] text-xs uppercase tracking-[0.14em]">
            CREATURE CATALOG // {filtered.length} ENTRIES
          </span>
          <button
            onClick={onClose}
            className="text-[var(--term-gray)] hover:text-[var(--term-white)] text-xs"
          >
            [esc]
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-2.5 border-b border-[var(--term-line)]">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--term-black)] border border-[var(--term-line)] rounded-lg px-3 py-2 text-xs text-[var(--term-white)] font-mono outline-none focus:border-[var(--term-cyan)] transition-colors placeholder:text-[var(--term-gray)]/50"
            placeholder="search by name or type..."
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Body */}
        <div className="flex" style={{ height: "380px" }}>
          {/* Left: Creature List */}
          <div
            ref={listRef}
            className="w-[200px] min-w-[200px] border-r border-[var(--term-line)] overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-xs text-[var(--term-gray)] text-center">
                no creatures found
              </div>
            ) : (
              filtered.map((creature, i) => (
                <button
                  key={creature.name}
                  data-active={i === selectedIndex}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors ${
                    i === selectedIndex
                      ? "bg-[var(--term-cyan)]/10 text-[var(--term-cyan)] border-l-2 border-[var(--term-cyan)]"
                      : "text-[var(--term-gray)] hover:text-[var(--term-white)] hover:bg-[var(--term-line)]/30 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{creature.name}</span>
                    <span className={`text-[10px] ${TYPE_COLORS[creature.type] ?? "text-[var(--term-gray)]"}`}>
                      {creature.type}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Right: Creature Detail */}
          <div className="flex-1 overflow-y-auto p-5">
            {selected ? (
              <div className="space-y-4">
                {/* ASCII Art */}
                <div className="flex justify-center">
                  <pre className="text-[var(--term-cyan)] text-sm leading-tight font-mono select-none">
                    {selected.art.join("\n")}
                  </pre>
                </div>

                {/* Name and Type */}
                <div className="text-center">
                  <div className="text-[var(--term-white)] text-sm font-bold uppercase tracking-wider">
                    {selected.name}
                  </div>
                  <div
                    className={`text-[10px] uppercase tracking-[0.2em] mt-0.5 ${
                      TYPE_COLORS[selected.type] ?? "text-[var(--term-gray)]"
                    }`}
                  >
                    {selected.type}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--term-gray)] w-8 text-right">HP</span>
                    <span className="text-[var(--term-green)]">{statBar(selected.hp)}</span>
                    <span className="text-[var(--term-white)] tabular-nums w-7 text-right">
                      {selected.hp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--term-gray)] w-8 text-right">ATK</span>
                    <span className="text-orange-400">{statBar(selected.atk)}</span>
                    <span className="text-[var(--term-white)] tabular-nums w-7 text-right">
                      {selected.atk}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--term-gray)] w-8 text-right">DEF</span>
                    <span className="text-blue-400">{statBar(selected.def)}</span>
                    <span className="text-[var(--term-white)] tabular-nums w-7 text-right">
                      {selected.def}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[var(--term-gray)] text-xs leading-relaxed">
                  {selected.description}
                </p>

                {/* Footer hint */}
                <div className="text-[var(--term-gray)]/50 text-[10px] text-center pt-2">
                  arrow keys to navigate // type to search
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--term-gray)] text-xs">
                no creature selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
