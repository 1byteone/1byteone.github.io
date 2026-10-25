"use client"

import { useEffect, useRef } from "react"

/**
 * Ambient star constellation background effect with scroll parallax
 * and subtle mouse interaction. Theme-reactive colors.
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const starsRef = useRef<
    Array<{
      x: number
      y: number
      size: number
      speed: number
      phase: number
      brightness: number
      depth: number
    }>
  >([])
  const constellationsRef = useRef<
    Array<{
      stars: number[]
      edges: [number, number][]
    }>
  >([])
  const initRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Check reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height =
        document.documentElement.scrollHeight || window.innerHeight * 3

      if (!initRef.current || starsRef.current.length === 0) {
        generateStars(canvas.width, canvas.height)
        initRef.current = true
      }
    }

    const generateStars = (w: number, h: number) => {
      const density = (w * h) / 8000
      const count = Math.min(Math.floor(density), 400)
      const stars = []

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.8 + 0.3,
          speed: Math.random() * 1.5 + 0.5,
          phase: Math.random() * Math.PI * 2,
          brightness: Math.random() * 0.5 + 0.2,
          depth: Math.random() * 0.8 + 0.2, // 0.2 (far) to 1.0 (near)
        })
      }
      starsRef.current = stars

      // Build constellation clusters
      const constellations: Array<{
        stars: number[]
        edges: [number, number][]
      }> = []
      const used = new Set<number>()
      const maxDist = Math.min(w, h) * 0.12

      for (let i = 0; i < stars.length; i++) {
        if (used.has(i)) continue
        const cluster: number[] = [i]
        used.add(i)

        for (let j = i + 1; j < stars.length && cluster.length < 5; j++) {
          if (used.has(j)) continue
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            cluster.push(j)
            used.add(j)
          }
        }

        if (cluster.length >= 2 && cluster.length <= 5) {
          const edges: [number, number][] = []
          for (let k = 0; k < cluster.length - 1; k++) {
            edges.push([k, k + 1])
          }
          constellations.push({ stars: cluster, edges })
        }
      }
      constellationsRef.current = constellations
    }

    resize()
    window.addEventListener("resize", resize)

    // Mouse tracking (passive)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    if (!prefersReduced) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
    }

    // Scroll tracking (passive)
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Read theme colors from CSS vars
    const getThemeColor = (varName: string, fallback: string): string => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim()
      return val || fallback
    }

    const draw = (time: number) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const w = canvas.width
      const h = canvas.height
      const scroll = scrollRef.current
      const mouse = mouseRef.current
      const cx = w / 2
      const cy = window.innerHeight / 2

      // Theme-reactive colors
      const accentColor = getThemeColor("--term-cyan", "#A7B8FF")
      const coreColor = getThemeColor("--term-white", "#F3EADB")

      // Parse hex to RGB
      const parseHex = (hex: string) => {
        const c = hex.replace("#", "")
        return {
          r: parseInt(c.slice(0, 2), 16),
          g: parseInt(c.slice(2, 4), 16),
          b: parseInt(c.slice(4, 6), 16),
        }
      }
      const accent = parseHex(accentColor)
      const core = parseHex(coreColor)

      ctx.clearRect(0, 0, w, h)

      const stars = starsRef.current

      // Draw constellation lines
      constellationsRef.current.forEach((c) => {
        ctx.strokeStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.04)`
        ctx.lineWidth = 0.5
        c.edges.forEach(([a, b]) => {
          const sa = stars[c.stars[a]]
          const sb = stars[c.stars[b]]
          if (!sa || !sb) return

          // Apply parallax offset to constellation lines
          const scrollOffA = prefersReduced ? 0 : scroll * (1 - sa.depth) * 0.15
          const scrollOffB = prefersReduced ? 0 : scroll * (1 - sb.depth) * 0.15

          ctx.beginPath()
          ctx.moveTo(sa.x, sa.y - scrollOffA)
          ctx.lineTo(sb.x, sb.y - scrollOffB)
          ctx.stroke()
        })
      })

      // Draw twinkling stars
      stars.forEach((star) => {
        const twinkle = prefersReduced
          ? 0.7
          : Math.sin(time * 0.001 * star.speed + star.phase) * 0.5 + 0.5
        const alpha = star.brightness * (0.3 + twinkle * 0.7)
        const r = star.size * (0.7 + twinkle * 0.3)

        // Scroll parallax — deeper stars move slower
        const scrollOffset = prefersReduced ? 0 : scroll * (1 - star.depth) * 0.15

        // Mouse interaction — subtle shift based on mouse position (max 8px)
        let mouseOffX = 0
        let mouseOffY = 0
        if (!prefersReduced) {
          const mx = (mouse.x - cx) / cx // -1 to 1
          const my = (mouse.y - cy) / cy // -1 to 1
          mouseOffX = mx * 8 * (1 - star.depth)
          mouseOffY = my * 8 * (1 - star.depth)
        }

        const drawX = star.x + mouseOffX
        const drawY = star.y - scrollOffset + mouseOffY

        // Outer glow
        if (star.size > 1) {
          const glow = ctx.createRadialGradient(
            drawX, drawY, 0,
            drawX, drawY, r * 4
          )
          glow.addColorStop(
            0,
            `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${alpha * 0.15})`
          )
          glow.addColorStop(
            1,
            `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0)`
          )
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(drawX, drawY, r * 4, 0, Math.PI * 2)
          ctx.fill()
        }

        // Core dot
        ctx.fillStyle = `rgba(${core.r}, ${core.g}, ${core.b}, ${alpha})`
        ctx.beginPath()
        ctx.arc(drawX, drawY, r, 0, Math.PI * 2)
        ctx.fill()
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.6 }}
      aria-hidden="true"
    />
  )
}
