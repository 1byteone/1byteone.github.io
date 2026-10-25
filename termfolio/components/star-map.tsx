"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { siteConfig } from "@/content/site"

const CONSTELLATIONS = [
  {
    name: "Orion",
    stars: [
      { x: 0.35, y: 0.38, mag: 2.2 }, { x: 0.42, y: 0.38, mag: 1.8 },
      { x: 0.38, y: 0.44, mag: 1.4 }, { x: 0.40, y: 0.445, mag: 1.4 },
      { x: 0.42, y: 0.45, mag: 1.4 }, { x: 0.36, y: 0.52, mag: 1.8 },
      { x: 0.44, y: 0.52, mag: 2.2 },
    ],
    edges: [[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]],
    labelPos: { x: 0.39, y: 0.34 },
  },
  {
    name: "Ursa Major",
    stars: [
      { x: 0.55, y: 0.18, mag: 1.8 }, { x: 0.59, y: 0.16, mag: 1.5 },
      { x: 0.63, y: 0.17, mag: 1.5 }, { x: 0.65, y: 0.20, mag: 1.8 },
      { x: 0.66, y: 0.24, mag: 1.5 }, { x: 0.62, y: 0.25, mag: 1.5 },
      { x: 0.58, y: 0.22, mag: 1.8 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]],
    labelPos: { x: 0.60, y: 0.13 },
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 0.72, y: 0.10, mag: 1.5 }, { x: 0.75, y: 0.07, mag: 1.8 },
      { x: 0.78, y: 0.09, mag: 1.5 }, { x: 0.81, y: 0.06, mag: 1.8 },
      { x: 0.84, y: 0.08, mag: 1.5 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4]],
    labelPos: { x: 0.78, y: 0.03 },
  },
  {
    name: "Leo",
    stars: [
      { x: 0.15, y: 0.25, mag: 2 }, { x: 0.18, y: 0.22, mag: 1.5 },
      { x: 0.21, y: 0.18, mag: 1.5 }, { x: 0.24, y: 0.20, mag: 1.2 },
      { x: 0.22, y: 0.24, mag: 1.5 }, { x: 0.26, y: 0.25, mag: 1.8 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,1],[3,5]],
    labelPos: { x: 0.20, y: 0.15 },
  },
  {
    name: "Scorpius",
    stars: [
      { x: 0.68, y: 0.60, mag: 2.2 }, { x: 0.72, y: 0.58, mag: 1.2 },
      { x: 0.64, y: 0.58, mag: 1.2 }, { x: 0.75, y: 0.63, mag: 1 },
      { x: 0.78, y: 0.68, mag: 1 }, { x: 0.80, y: 0.73, mag: 1.2 },
      { x: 0.78, y: 0.77, mag: 1.5 },
    ],
    edges: [[2,0],[0,1],[1,3],[3,4],[4,5],[5,6]],
    labelPos: { x: 0.68, y: 0.55 },
  },
  {
    name: "Cygnus",
    stars: [
      { x: 0.48, y: 0.65, mag: 2 }, { x: 0.50, y: 0.70, mag: 1.2 },
      { x: 0.52, y: 0.75, mag: 1.5 }, { x: 0.47, y: 0.72, mag: 1 },
      { x: 0.55, y: 0.72, mag: 1 },
    ],
    edges: [[0,1],[1,2],[1,3],[1,4]],
    labelPos: { x: 0.48, y: 0.62 },
  },
  {
    name: "Lyra",
    stars: [
      { x: 0.30, y: 0.68, mag: 2.4 }, { x: 0.32, y: 0.72, mag: 0.8 },
      { x: 0.28, y: 0.72, mag: 0.8 }, { x: 0.33, y: 0.76, mag: 0.8 },
      { x: 0.27, y: 0.76, mag: 0.8 },
    ],
    edges: [[0,1],[0,2],[1,3],[2,4],[3,4]],
    labelPos: { x: 0.30, y: 0.65 },
  },
  {
    name: "Gemini",
    stars: [
      { x: 0.12, y: 0.42, mag: 2 }, { x: 0.10, y: 0.40, mag: 2 },
      { x: 0.14, y: 0.48, mag: 1 }, { x: 0.11, y: 0.47, mag: 1 },
      { x: 0.15, y: 0.53, mag: 1 }, { x: 0.12, y: 0.52, mag: 1 },
    ],
    edges: [[0,2],[1,3],[2,4],[3,5],[0,1]],
    labelPos: { x: 0.11, y: 0.37 },
  },
  {
    name: "Taurus",
    stars: [
      { x: 0.27, y: 0.36, mag: 2.2 }, { x: 0.30, y: 0.34, mag: 1.2 },
      { x: 0.33, y: 0.33, mag: 1.0 }, { x: 0.25, y: 0.33, mag: 1.0 },
      { x: 0.23, y: 0.31, mag: 1.0 }, { x: 0.29, y: 0.31, mag: 1.5 },
    ],
    edges: [[0,1],[1,2],[0,3],[3,4],[1,5]],
    labelPos: { x: 0.28, y: 0.28 },
  },
  {
    name: "Pegasus",
    stars: [
      { x: 0.82, y: 0.28, mag: 1.8 }, { x: 0.88, y: 0.28, mag: 1.8 },
      { x: 0.88, y: 0.35, mag: 1.8 }, { x: 0.82, y: 0.35, mag: 1.8 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,0]],
    labelPos: { x: 0.84, y: 0.25 },
  },
  {
    name: "Andromeda",
    stars: [
      { x: 0.82, y: 0.35, mag: 1.8 }, { x: 0.78, y: 0.32, mag: 1.5 },
      { x: 0.74, y: 0.30, mag: 1.5 }, { x: 0.70, y: 0.28, mag: 1.2 },
    ],
    edges: [[0,1],[1,2],[2,3]],
    labelPos: { x: 0.74, y: 0.26 },
  },
  {
    name: "Canis Major",
    stars: [
      { x: 0.38, y: 0.62, mag: 2.8 }, { x: 0.36, y: 0.58, mag: 1.2 },
      { x: 0.40, y: 0.66, mag: 1.2 }, { x: 0.34, y: 0.64, mag: 1.0 },
      { x: 0.42, y: 0.70, mag: 1.0 },
    ],
    edges: [[1,0],[0,2],[0,3],[2,4]],
    labelPos: { x: 0.37, y: 0.55 },
  },
  {
    name: "Sagittarius",
    stars: [
      { x: 0.78, y: 0.52, mag: 1.5 }, { x: 0.80, y: 0.48, mag: 1.5 },
      { x: 0.82, y: 0.52, mag: 1.2 }, { x: 0.76, y: 0.48, mag: 1.2 },
      { x: 0.84, y: 0.48, mag: 1.0 }, { x: 0.80, y: 0.55, mag: 1.0 },
    ],
    edges: [[3,0],[0,1],[1,2],[1,4],[0,5]],
    labelPos: { x: 0.79, y: 0.44 },
  },
  {
    name: "Draco",
    stars: [
      { x: 0.50, y: 0.08, mag: 1.5 }, { x: 0.47, y: 0.05, mag: 1.2 },
      { x: 0.44, y: 0.08, mag: 1.2 }, { x: 0.42, y: 0.12, mag: 1.0 },
      { x: 0.45, y: 0.14, mag: 1.0 }, { x: 0.48, y: 0.12, mag: 1.0 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
    labelPos: { x: 0.46, y: 0.02 },
  },
]

interface ShootingStar {
  x: number
  y: number
  angle: number
  speed: number
  length: number
  life: number
  maxLife: number
}

function generateBackground(count: number) {
  const stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.2,
      twinkleSpeed: Math.random() * 2 + 0.5,
      twinkleOffset: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.8 ? (Math.random() > 0.5 ? 220 : 30) : 0,
    })
  }
  return stars
}

interface StarMapProps {
  onClose: () => void
}

export default function StarMap({ onClose }: StarMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgStars = useRef(generateBackground(1200))
  const frameRef = useRef(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const lastShootRef = useRef(0)

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2
    const radius = Math.min(cx, cy) - 30

    const cs = getComputedStyle(canvas)
    const bgCol = cs.getPropertyValue("--term-black").trim() || "#0b0b0f"
    const cyanCol = cs.getPropertyValue("--term-cyan").trim() || "#7dd3fc"
    const grayCol = cs.getPropertyValue("--term-gray").trim() || "#6b7280"
    const whiteCol = cs.getPropertyValue("--term-white").trim() || "#f3eadb"
    const lineCol = cs.getPropertyValue("--term-line").trim() || "#2C313A"

    // Dark gradient background
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5)
    bgGrad.addColorStop(0, "#0d0d18")
    bgGrad.addColorStop(0.6, "#080812")
    bgGrad.addColorStop(1, bgCol)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Subtle nebula glow patches
    const drawNebula = (nx: number, ny: number, nr: number, hue: number, alpha: number) => {
      const neb = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr)
      neb.addColorStop(0, `hsla(${hue}, 60%, 40%, ${alpha})`)
      neb.addColorStop(0.5, `hsla(${hue}, 50%, 25%, ${alpha * 0.3})`)
      neb.addColorStop(1, "transparent")
      ctx.fillStyle = neb
      ctx.beginPath()
      ctx.arc(nx, ny, nr, 0, Math.PI * 2)
      ctx.fill()
    }

    drawNebula(cx * 0.6, cy * 0.7, radius * 0.4, 230, 0.06)
    drawNebula(cx * 1.3, cy * 0.4, radius * 0.3, 280, 0.04)
    drawNebula(cx * 0.9, cy * 1.4, radius * 0.25, 200, 0.05)

    // Dome circle
    ctx.strokeStyle = `${lineCol}80`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Inner rings with subtle glow
    for (let r = 0.33; r < 1; r += 0.33) {
      ctx.strokeStyle = `${lineCol}40`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.arc(cx, cy, radius * r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Cross lines
    ctx.strokeStyle = `${lineCol}30`
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy)
    ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius)
    ctx.stroke()

    // Diagonal cross
    const d = radius * 0.707
    ctx.strokeStyle = `${lineCol}15`
    ctx.beginPath()
    ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d)
    ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d)
    ctx.stroke()

    // Cardinal + intercardinal directions
    ctx.font = "bold 11px monospace"
    ctx.fillStyle = cyanCol
    ctx.textAlign = "center"
    ctx.fillText("N", cx, cy - radius - 10)
    ctx.fillText("S", cx, cy + radius + 18)
    ctx.fillText("E", cx + radius + 16, cy + 4)
    ctx.fillText("W", cx - radius - 16, cy + 4)

    ctx.font = "9px monospace"
    ctx.fillStyle = `${grayCol}80`
    ctx.fillText("NE", cx + d + 10, cy - d - 4)
    ctx.fillText("NW", cx - d - 10, cy - d - 4)
    ctx.fillText("SE", cx + d + 10, cy + d + 10)
    ctx.fillText("SW", cx - d - 10, cy + d + 10)

    // Background stars within dome
    bgStars.current.forEach((star) => {
      const sx = (star.x - 0.5) * 2
      const sy = (star.y - 0.5) * 2
      if (sx * sx + sy * sy > 1) return
      const px = cx + sx * radius
      const py = cy + sy * radius
      const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5
      const alpha = 0.08 + twinkle * 0.5

      if (star.hue > 0) {
        ctx.fillStyle = `hsla(${star.hue}, 50%, 80%, ${alpha * 0.6})`
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      }
      ctx.beginPath()
      ctx.arc(px, py, star.size * (0.6 + twinkle * 0.4), 0, Math.PI * 2)
      ctx.fill()
    })

    // Map constellation positions into dome
    const toScreen = (x: number, y: number) => {
      const sx = (x - 0.5) * 1.8
      const sy = (y - 0.5) * 1.8
      return { px: cx + sx * radius, py: cy + sy * radius }
    }

    // Constellation edges with animated dash
    CONSTELLATIONS.forEach((c) => {
      const isHov = hovered === c.name
      c.edges.forEach(([a, b]) => {
        const pa = toScreen(c.stars[a].x, c.stars[a].y)
        const pb = toScreen(c.stars[b].x, c.stars[b].y)

        // Glow line
        if (isHov) {
          ctx.strokeStyle = `${cyanCol}40`
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(pa.px, pa.py)
          ctx.lineTo(pb.px, pb.py)
          ctx.stroke()
        }

        // Main line
        ctx.strokeStyle = isHov ? `${cyanCol}C0` : `${cyanCol}35`
        ctx.lineWidth = isHov ? 1.5 : 0.8
        if (!isHov) {
          ctx.setLineDash([3, 4])
          ctx.lineDashOffset = -time * 0.01
        }
        ctx.beginPath()
        ctx.moveTo(pa.px, pa.py)
        ctx.lineTo(pb.px, pb.py)
        ctx.stroke()
        ctx.setLineDash([])
      })
    })

    // Constellation stars + labels
    CONSTELLATIONS.forEach((c) => {
      const isHov = hovered === c.name
      c.stars.forEach((star) => {
        const { px, py } = toScreen(star.x, star.y)
        const twinkle = Math.sin(time * 0.002 + star.x * 10 + star.y * 10) * 0.3 + 0.7
        const r = star.mag * twinkle + 0.5

        // Outer glow ring
        if (isHov || star.mag > 1.8) {
          const glowR = r * (isHov ? 6 : 4)
          const glow = ctx.createRadialGradient(px, py, 0, px, py, glowR)
          glow.addColorStop(0, isHov ? `${cyanCol}50` : `${whiteCol}25`)
          glow.addColorStop(0.4, isHov ? `${cyanCol}15` : `${whiteCol}08`)
          glow.addColorStop(1, "transparent")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(px, py, glowR, 0, Math.PI * 2)
          ctx.fill()
        }

        // Cross-hair spikes on bright stars
        if (star.mag > 1.8) {
          const spikeLen = r * 3 * twinkle
          ctx.strokeStyle = isHov ? `${cyanCol}30` : `${whiteCol}12`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(px - spikeLen, py); ctx.lineTo(px + spikeLen, py)
          ctx.moveTo(px, py - spikeLen); ctx.lineTo(px, py + spikeLen)
          ctx.stroke()
        }

        // Core
        ctx.fillStyle = isHov ? cyanCol : whiteCol
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Label
      const lp = toScreen(c.labelPos.x, c.labelPos.y)
      ctx.font = isHov ? "bold 12px monospace" : "10px monospace"
      ctx.fillStyle = isHov ? cyanCol : `${grayCol}B0`
      ctx.textAlign = "center"
      ctx.fillText(c.name, lp.px, lp.py)
    })

    // Shooting stars
    if (time - lastShootRef.current > 3000 + Math.random() * 5000) {
      lastShootRef.current = time
      const angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25
      shootingStarsRef.current.push({
        x: cx + (Math.random() - 0.5) * radius * 1.5,
        y: cy - radius * 0.8 + Math.random() * radius * 0.5,
        angle,
        speed: 3 + Math.random() * 4,
        length: 30 + Math.random() * 50,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      })
    }

    shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
      s.life++
      if (s.life > s.maxLife) return false

      const progress = s.life / s.maxLife
      const fadeIn = Math.min(progress * 5, 1)
      const fadeOut = 1 - Math.max((progress - 0.6) / 0.4, 0)
      const alpha = fadeIn * fadeOut

      const headX = s.x + Math.cos(s.angle) * s.speed * s.life
      const headY = s.y + Math.sin(s.angle) * s.speed * s.life
      const tailX = headX - Math.cos(s.angle) * s.length * alpha
      const tailY = headY - Math.sin(s.angle) * s.length * alpha

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY)
      grad.addColorStop(0, "transparent")
      grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.3})`)
      grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.9})`)

      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(headX, headY)
      ctx.stroke()

      return true
    })

    // Overlay info
    ctx.font = "10px monospace"
    ctx.fillStyle = grayCol
    ctx.textAlign = "left"
    const now = new Date()
    ctx.fillText(`${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)} UTC`, 12, h - 12)
    ctx.textAlign = "right"
    ctx.fillText(`${siteConfig.coordinates.lat}\u00b0N ${siteConfig.coordinates.lon}\u00b0E  ${siteConfig.coordinates.label}`, w - 12, h - 12)

    frameRef.current = requestAnimationFrame(draw)
  }, [hovered])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width)
    const my = (e.clientY - rect.top) * (canvas.height / rect.height)

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = Math.min(cx, cy) - 30

    let found: string | null = null
    for (const c of CONSTELLATIONS) {
      for (const star of c.stars) {
        const sx = (star.x - 0.5) * 1.8
        const sy = (star.y - 0.5) * 1.8
        const px = cx + sx * radius
        const py = cy + sy * radius
        const dx = mx - px, dy = my - py
        if (dx * dx + dy * dy < 250) { found = c.name; break }
      }
      if (found) break
    }
    setHovered(found)
    canvas.style.cursor = found ? "pointer" : "default"
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1)
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1)
    }
    resize()
    window.addEventListener("resize", resize)
    frameRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [draw])

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--term-black)]/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl border border-[var(--term-line)] bg-[var(--term-darker)] rounded-xl overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--term-line)]">
          <span className="text-[var(--term-white)] text-xs uppercase tracking-[0.14em]">Star Map — Azimuthal Projection</span>
          <button onClick={onClose} className="text-[var(--term-gray)] hover:text-[var(--term-white)] text-xs">[esc]</button>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full aspect-square"
          style={{ background: "var(--term-black)" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
        />
        <div className="flex items-center justify-between px-5 py-2 border-t border-[var(--term-line)] text-[10px] uppercase tracking-widest text-[var(--term-gray)]">
          <span>{CONSTELLATIONS.length} constellations · {CONSTELLATIONS.reduce((a, c) => a + c.stars.length, 0)} stars · {bgStars.current.length} background</span>
          <span>{hovered ? `hovering: ${hovered}` : "live twinkling simulation"}</span>
        </div>
      </div>
    </div>
  )
}
