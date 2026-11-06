/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"

// ── Configuration ──────────────────────────────────────────────────
const CONFIG = {
  gridSpacing: 8,
  maxDotRadius: 5,
  dotColor: "#d4d4d8",
  scatterDuration: 2500,
  holdDuration: 2000,
  transitionToClean: true,
  cleanFadeDuration: 1000,
  enableBlobEffect: true,
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

interface Particle {
  sx: number; sy: number; sr: number
  tx: number; ty: number; tr: number
}

interface HalftoneImageProps {
  src: string
  alt: string
  className?: string
}

export default function HalftoneImage({ src, alt, className = "" }: HalftoneImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [phase, setPhase] = useState<"scatter" | "assembling" | "halftone" | "clean">("scatter")

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animFrameId: number
    let particles: Particle[] = []

    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = src

    img.onload = () => {
      const rect = container.getBoundingClientRect()
      const cw = Math.floor(rect.width)
      const ch = Math.floor(rect.height)
      canvas.width = cw
      canvas.height = ch

      // Draw image to offscreen canvas for sampling
      const off = document.createElement("canvas")
      off.width = cw; off.height = ch
      const oCtx = off.getContext("2d")!
      oCtx.fillStyle = "#ffffff"
      oCtx.fillRect(0, 0, cw, ch)

      // object-cover math
      const imgR = img.width / img.height
      const canR = cw / ch
      let rw: number, rh: number, rx: number, ry: number
      if (imgR > canR) {
        rh = ch; rw = ch * imgR; rx = (cw - rw) / 2; ry = 0
      } else {
        rw = cw; rh = cw / imgR; rx = 0; ry = (ch - rh) / 2
      }
      oCtx.drawImage(img, rx, ry, rw, rh)
      const data = oCtx.getImageData(0, 0, cw, ch).data

      // Build particles
      const sp = CONFIG.gridSpacing
      const cols = Math.floor(cw / sp)
      const rows = Math.floor(ch / sp)
      const offX = (cw - cols * sp) / 2
      const offY = (ch - rows * sp) / 2

      particles = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = offX + c * sp + sp / 2
          const gy = offY + r * sp + sp / 2
          const px = Math.min(Math.floor(gx), cw - 1)
          const py = Math.min(Math.floor(gy), ch - 1)
          const i = (py * cw + px) * 4
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255
          const tr = (1 - brightness) * CONFIG.maxDotRadius

          if (tr < 0.3 && Math.random() > 0.08) continue

          particles.push({
            sx: Math.random() * cw,
            sy: Math.random() * ch,
            sr: Math.random() * 2 + 0.5,
            tx: gx, ty: gy, tr
          })
        }
      }

      // Get dot color from CSS env
      const cs = getComputedStyle(container)
      const dotColor = cs.getPropertyValue("--term-white")?.trim() || CONFIG.dotColor

      // Animation timeline
      const T_SCATTER = 500
      const T_ASSEMBLE = CONFIG.scatterDuration
      const T_HOLD = CONFIG.holdDuration
      const T_FADE = CONFIG.cleanFadeDuration
      let start: number | null = null

      setPhase("scatter")

      const loop = (ts: number) => {
        if (!start) start = ts
        const elapsed = ts - start

        ctx.clearRect(0, 0, cw, ch)
        ctx.fillStyle = dotColor

        let p = 0
        if (elapsed < T_SCATTER) {
          p = 0
          setPhase("scatter")
        } else if (elapsed < T_SCATTER + T_ASSEMBLE) {
          p = (elapsed - T_SCATTER) / T_ASSEMBLE
          setPhase("assembling")
        } else if (elapsed < T_SCATTER + T_ASSEMBLE + T_HOLD) {
          p = 1
          setPhase("halftone")
        } else if (CONFIG.transitionToClean && elapsed < T_SCATTER + T_ASSEMBLE + T_HOLD + T_FADE) {
          p = 1
          const fadeP = (elapsed - T_SCATTER - T_ASSEMBLE - T_HOLD) / T_FADE
          setPhase("clean")
          // Fade canvas out
          canvas.style.opacity = String(1 - fadeP)
          if (imgRef.current) imgRef.current.style.opacity = String(fadeP)
        } else {
          // Animation done
          setPhase("clean")
          canvas.style.opacity = "0"
          if (imgRef.current) imgRef.current.style.opacity = "1"
          return // stop loop
        }

        const eased = easeInOutCubic(Math.min(p, 1))
        ctx.beginPath()
        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i]
          const cx = lerp(pt.sx, pt.tx, eased)
          const cy = lerp(pt.sy, pt.ty, eased)
          const cr = Math.max(0, lerp(pt.sr, pt.tr, eased))
          if (cr > 0.3) {
            ctx.moveTo(cx + cr, cy)
            ctx.arc(cx, cy, cr, 0, Math.PI * 2)
          }
        }
        ctx.fill()
        animFrameId = requestAnimationFrame(loop)
      }

      animFrameId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animFrameId)
  }, [src])

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Real image underneath (fades in after halftone) */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
      />
      {/* Halftone canvas on top */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          filter: CONFIG.enableBlobEffect ? "blur(2.5px) contrast(12)" : "none",
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  )
}
