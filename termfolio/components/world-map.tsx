"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { siteConfig } from "@/content/site"

const CITIES: [number, number, string, boolean][] = [
  [siteConfig.coordinates.lat, siteConfig.coordinates.lon, siteConfig.coordinates.label, true],
  [35.6762, 139.6503, "Tokyo", false],
  [51.5074, -0.1278, "London", false],
  [40.7128, -74.006, "New York", false],
  [48.8566, 2.3522, "Paris", false],
  [-33.8688, 151.2093, "Sydney", false],
  [25.2048, 55.2708, "Dubai", false],
  [30.0444, 31.2357, "Cairo", false],
  [1.3521, 103.8198, "Singapore", false],
  [-23.5505, -46.6333, "Sao Paulo", false],
]

const COASTLINES: [number, number][][] = [
  // North America
  [[60,-140],[58,-137],[55,-132],[50,-127],[48,-124],[42,-124],[37,-122],[33,-117],
   [28,-112],[25,-110],[22,-106],[20,-105],[18,-103],[16,-96],[15,-92],[18,-88],
   [21,-87],[25,-90],[29,-89],[30,-88],[30,-85],[27,-82],[25,-80],[26,-77],
   [30,-81],[32,-80],[35,-75],[37,-76],[39,-74],[41,-72],[42,-70],[43,-66],
   [45,-64],[47,-60],[49,-55],[50,-57],[51,-56],[53,-56],[55,-60],[58,-62],
   [60,-65],[62,-72],[64,-76],[66,-80],[68,-85],[70,-90],[72,-95],[71,-110],
   [69,-120],[66,-140],[63,-145],[60,-150],[58,-155],[56,-160],[55,-165],[58,-170],
   [60,-165],[62,-165],[65,-168],[68,-164],[71,-157],[72,-150],[71,-140],[68,-135],
   [66,-140],[63,-140],[60,-140]],
  // South America
  [[12,-72],[10,-75],[8,-77],[5,-77],[2,-79],[0,-80],[-3,-80],[-5,-81],[-7,-80],
   [-10,-77],[-13,-76],[-15,-75],[-18,-71],[-22,-70],[-24,-70],[-27,-70],
   [-30,-71],[-33,-72],[-36,-73],[-40,-73],[-43,-74],[-46,-75],[-50,-75],
   [-53,-70],[-55,-68],[-54,-65],[-52,-68],[-48,-65],[-43,-63],[-40,-62],
   [-38,-57],[-35,-53],[-30,-50],[-25,-48],[-22,-41],[-18,-39],[-13,-38],
   [-10,-37],[-5,-35],[-2,-44],[0,-50],[2,-52],[5,-60],[7,-62],[10,-66],
   [11,-72],[12,-72]],
  // Europe
  [[36,-6],[37,-2],[38,0],[40,0],[42,3],[43,5],[43,7],[44,8],[42,10],[40,14],
   [38,13],[37,15],[35,24],[37,24],[39,20],[40,20],[42,19],[43,16],[44,15],
   [45,14],[46,14],[45,12],[44,12],[44,10],[46,8],[48,7],[50,5],[51,4],[52,5],
   [54,10],[55,10],[56,11],[57,12],[58,12],[60,11],[62,6],[63,5],[64,11],
   [66,14],[68,15],[70,19],[71,26],[70,28],[68,28],[66,25],[64,22],[62,18],
   [60,20],[58,18],[56,16],[55,14],[54,14],[54,18],[56,22],[58,24],[60,28],
   [62,30],[64,38],[67,41],[69,33],[70,32]],
  // Africa
  [[36,-6],[35,-2],[37,10],[33,12],[30,10],[32,32],[30,33],[28,33],[25,35],
   [20,37],[15,42],[12,44],[10,45],[8,50],[5,48],[2,45],[0,42],[-1,42],
   [-5,40],[-8,39],[-10,40],[-15,41],[-20,35],[-25,35],[-28,33],[-30,31],
   [-33,28],[-34,25],[-34,18],[-30,17],[-25,15],[-20,12],[-15,12],[-10,14],
   [-5,12],[0,10],[5,2],[5,-5],[7,-8],[10,-10],[15,-17],[18,-16],[20,-17],
   [25,-15],[30,-10],[33,-8],[35,-6],[36,-6]],
  // Asia
  [[70,32],[68,45],[65,55],[60,60],[55,58],[50,53],[48,50],[45,42],[42,44],
   [40,44],[38,45],[35,45],[33,44],[30,48],[25,50],[22,55],[20,58],[18,62],
   [15,65],[12,70],[10,76],[8,78],[5,80],[2,80],[1,104],[2,103],[5,105],
   [10,106],[15,108],[20,110],[22,108],[25,105],[28,105],[30,110],[32,115],
   [35,117],[37,118],[32,122],[30,122],[28,120],[25,120],[22,114],[20,110],
   [18,108],[14,109],[10,108],[8,106],[5,105],[2,106],[1,104]],
  // Japan
  [[32,130],[35,129],[38,128],[40,130],[42,132],[43,135],[42,140],[40,140],
   [38,138],[35,136],[34,130],[32,130]],
  // East Russia
  [[42,132],[45,135],[48,140],[50,143],[52,140],[54,137],[56,138],[58,140],
   [60,150],[62,155],[63,160],[65,170],[66,180]],
  // Australia
  [[-12,130],[-14,127],[-16,123],[-18,122],[-20,118],[-22,114],[-25,114],
   [-28,114],[-30,115],[-33,116],[-35,117],[-37,140],[-38,145],[-38,148],
   [-36,150],[-33,152],[-28,153],[-25,152],[-22,150],[-20,149],[-18,146],
   [-16,145],[-14,136],[-12,131],[-12,130]],
]

function latLngToXY(
  lat: number, lng: number, w: number, h: number,
  offsetX: number, offsetY: number, zoom: number
): [number, number] {
  const x = ((lng + 180) / 360) * w * zoom + offsetX
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  const y = (h / 2 - (w * zoom * mercN) / (2 * Math.PI)) + offsetY
  return [x, y]
}

interface WorldMapProps {
  onClose: () => void
}

export default function WorldMap({ onClose }: WorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null)
  const dragRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false, lastX: 0, lastY: 0,
  })
  const stateRef = useRef({ zoom: 1, offsetX: 0, offsetY: 0 })
  const dprRef = useRef(1)

  useEffect(() => {
    stateRef.current = { zoom, offsetX: offset.x, offsetY: offset.y }
  }, [zoom, offset])

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = dprRef.current
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    const { zoom: z, offsetX: ox, offsetY: oy } = stateRef.current

    ctx.save()
    ctx.scale(dpr, dpr)

    const style = getComputedStyle(canvas)
    const cyanCol = style.getPropertyValue("--term-cyan").trim() || "#A7B8FF"
    const grayCol = style.getPropertyValue("--term-gray").trim() || "#918A80"
    const whiteCol = style.getPropertyValue("--term-white").trim() || "#F3EADB"
    const blackCol = style.getPropertyValue("--term-black").trim() || "#0B0B0F"
    const greenCol = style.getPropertyValue("--term-green").trim() || "#8FD4A7"
    const lineCol = style.getPropertyValue("--term-line").trim() || "#2A2A31"

    // Dark gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
    bgGrad.addColorStop(0, "#080810")
    bgGrad.addColorStop(0.5, "#0a0a14")
    bgGrad.addColorStop(1, blackCol)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Grid lines with gradient fade
    for (let lat = -80; lat <= 80; lat += 20) {
      const [, y] = latLngToXY(lat, 0, w, h, ox, oy, z)
      const alpha = lat === 0 ? 0.2 : 0.06
      ctx.strokeStyle = `${lineCol}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`
      ctx.lineWidth = lat === 0 ? 1 : 0.5
      if (lat === 0) {
        ctx.setLineDash([6, 8])
      }
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      const [x] = latLngToXY(0, lng, w, h, ox, oy, z)
      ctx.strokeStyle = `${lineCol}10`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }

    // Draw coastlines — filled with subtle glow + brighter outline
    COASTLINES.forEach((polyline) => {
      // Fill the landmass with subtle color
      ctx.fillStyle = `${cyanCol}08`
      ctx.beginPath()
      polyline.forEach((point, i) => {
        const [px, py] = latLngToXY(point[0], point[1], w, h, ox, oy, z)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()
      ctx.fill()

      // Coastline stroke — glowing effect
      ctx.strokeStyle = `${cyanCol}50`
      ctx.lineWidth = 1.2
      ctx.shadowColor = cyanCol
      ctx.shadowBlur = 3
      ctx.beginPath()
      polyline.forEach((point, i) => {
        const [px, py] = latLngToXY(point[0], point[1], w, h, ox, oy, z)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()
      ctx.shadowBlur = 0

      // Dot nodes at vertices
      ctx.fillStyle = `${cyanCol}90`
      polyline.forEach((point) => {
        const [px, py] = latLngToXY(point[0], point[1], w, h, ox, oy, z)
        if (px < -20 || px > w + 20 || py < -20 || py > h + 20) return
        ctx.beginPath()
        ctx.arc(px, py, 1.2, 0, Math.PI * 2)
        ctx.fill()
      })
    })

    // Animated scan line
    const scanY = (time * 0.02) % h
    const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2)
    scanGrad.addColorStop(0, "transparent")
    scanGrad.addColorStop(0.5, `${cyanCol}0A`)
    scanGrad.addColorStop(1, "transparent")
    ctx.fillStyle = scanGrad
    ctx.fillRect(0, scanY - 20, w, 40)

    // City markers
    CITIES.forEach(([lat, lng, name, isPrimary]) => {
      const [cx, cy] = latLngToXY(lat, lng, w, h, ox, oy, z)
      if (cx < -20 || cx > w + 20 || cy < -20 || cy > h + 20) return

      if (isPrimary) {
        // Animated radar rings
        for (let ring = 0; ring < 3; ring++) {
          const ringTime = (time * 0.002 + ring * 0.8) % 3
          const ringRadius = ringTime * 12
          const ringAlpha = Math.max(0, 1 - ringTime / 3) * 0.4
          ctx.strokeStyle = `${greenCol}${Math.round(ringAlpha * 255).toString(16).padStart(2, "0")}`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Glow
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15)
        glow.addColorStop(0, `${greenCol}40`)
        glow.addColorStop(1, "transparent")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, 15, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = greenCol
        ctx.beginPath()
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2)
        ctx.fill()

        // Label with bg
        ctx.font = "bold 11px monospace"
        const textW = ctx.measureText(`> ${name}`).width
        ctx.fillStyle = `${blackCol}C0`
        ctx.fillRect(cx + 10, cy - 10, textW + 8, 16)
        ctx.fillStyle = greenCol
        ctx.fillText(`> ${name}`, cx + 14, cy + 2)

        // Coordinates
        ctx.font = "9px monospace"
        ctx.fillStyle = grayCol
        ctx.fillText(`${lat.toFixed(2)}N ${lng.toFixed(2)}E`, cx + 14, cy + 16)
      } else {
        // Dot
        ctx.fillStyle = whiteCol
        ctx.beginPath()
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Crosshair
        ctx.strokeStyle = `${whiteCol}30`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy)
        ctx.moveTo(cx, cy - 6); ctx.lineTo(cx, cy + 6)
        ctx.stroke()

        // Label
        ctx.font = "9px monospace"
        ctx.fillStyle = `${whiteCol}B0`
        ctx.fillText(name, cx + 8, cy + 3)
      }
    })

    // Corner brackets
    ctx.strokeStyle = `${grayCol}60`
    ctx.lineWidth = 1
    const cs = 14
    ;[[4, 4, 1, 1], [w - 4, 4, -1, 1], [4, h - 4, 1, -1], [w - 4, h - 4, -1, -1]].forEach(
      ([x, y, dx, dy]) => {
        ctx.beginPath()
        ctx.moveTo(x, y + dy * cs)
        ctx.lineTo(x, y)
        ctx.lineTo(x + dx * cs, y)
        ctx.stroke()
      }
    )

    // Coordinate overlay
    ctx.font = "10px monospace"
    ctx.fillStyle = grayCol
    ctx.textAlign = "left"
    const coordStr = mouseCoords
      ? `${mouseCoords.lat >= 0 ? "N" : "S"}${Math.abs(mouseCoords.lat).toFixed(2)}  ${mouseCoords.lng >= 0 ? "E" : "W"}${Math.abs(mouseCoords.lng).toFixed(2)}`
      : "hover for coords"
    ctx.fillText(coordStr, 10, h - 10)
    ctx.textAlign = "right"
    ctx.fillText(`zoom: ${z.toFixed(1)}x`, w - 10, 18)

    ctx.restore()
    frameRef.current = requestAnimationFrame(draw)
  }, [mouseCoords])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      dprRef.current = dpr
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
    }
    resize()
    window.addEventListener("resize", resize)
    frameRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [draw])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const PAN_STEP = 30
      switch (e.key) {
        case "Escape": onClose(); break
        case "ArrowUp": e.preventDefault(); setOffset((prev) => ({ ...prev, y: prev.y + PAN_STEP })); break
        case "ArrowDown": e.preventDefault(); setOffset((prev) => ({ ...prev, y: prev.y - PAN_STEP })); break
        case "ArrowLeft": e.preventDefault(); setOffset((prev) => ({ ...prev, x: prev.x + PAN_STEP })); break
        case "ArrowRight": e.preventDefault(); setOffset((prev) => ({ ...prev, x: prev.x - PAN_STEP })); break
        case "+": case "=": setZoom((prev) => Math.min(5, prev + 0.25)); break
        case "-": case "_": setZoom((prev) => Math.max(0.5, prev - 0.25)); break
        case "0": setZoom(1); setOffset({ x: 0, y: 0 }); break
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const w = rect.width
    const h = rect.height
    const z = stateRef.current.zoom
    const ox = stateRef.current.offsetX
    const oy = stateRef.current.offsetY

    const lng = ((mx - ox) / (w * z)) * 360 - 180
    const mercN = ((h / 2 - (my - oy)) * 2 * Math.PI) / (w * z)
    const lat = (Math.atan(Math.exp(mercN)) - Math.PI / 4) * 2 * (180 / Math.PI)
    if (lat >= -85 && lat <= 85 && lng >= -180 && lng <= 180) {
      setMouseCoords({ lat: Math.round(lat * 100) / 100, lng: Math.round(lng * 100) / 100 })
    }

    if (dragRef.current.dragging) {
      const dx = e.clientX - dragRef.current.lastX
      const dy = e.clientY - dragRef.current.lastY
      dragRef.current.lastX = e.clientX
      dragRef.current.lastY = e.clientY
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    }
  }, [])

  const handleMouseUp = useCallback(() => { dragRef.current.dragging = false }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    setZoom((prev) => Math.min(5, Math.max(0.5, prev + delta)))
  }, [])

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--term-black)]/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl border border-[var(--term-line)] bg-[var(--term-darker)] rounded-xl overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--term-line)]">
          <span className="text-[var(--term-white)] text-xs uppercase tracking-[0.14em]">
            World Map — Mercator Projection
          </span>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[var(--term-gray)] hidden sm:inline">arrows:pan  +/-:zoom  0:reset</span>
            <button onClick={onClose} className="text-[var(--term-gray)] hover:text-[var(--term-white)] text-xs">[esc]</button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full aspect-[16/9] cursor-crosshair select-none"
          style={{ background: "var(--term-black)" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
        <div className="flex items-center justify-between px-5 py-2 border-t border-[var(--term-line)] text-[10px] uppercase tracking-widest text-[var(--term-gray)]">
          <span>{CITIES.length} markers{mouseCoords ? ` — ${mouseCoords.lat >= 0 ? "N" : "S"}${Math.abs(mouseCoords.lat).toFixed(2)} ${mouseCoords.lng >= 0 ? "E" : "W"}${Math.abs(mouseCoords.lng).toFixed(2)}` : ""}</span>
          <span>zoom {zoom.toFixed(1)}x — drag to pan</span>
        </div>
      </div>
    </div>
  )
}
