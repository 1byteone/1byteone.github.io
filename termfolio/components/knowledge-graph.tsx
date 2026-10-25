"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface Post {
  id: string
  title: string
  slug: string
  tags: string[]
}

interface GraphNode {
  id: string
  label: string
  type: "tag" | "post"
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  slug?: string
  connections: number
}

interface GraphEdge {
  source: string
  target: string
}

interface KnowledgeGraphProps {
  posts: Post[]
  onTagClick?: (tag: string | null) => void
}

export default function KnowledgeGraph({ posts, onTagClick }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<GraphNode[]>([])
  const edgesRef = useRef<GraphEdge[]>([])
  const animRef = useRef<number>(0)
  const dragRef = useRef<{ node: GraphNode | null; offsetX: number; offsetY: number }>({
    node: null, offsetX: 0, offsetY: 0,
  })
  const hoverRef = useRef<GraphNode | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  // Build graph data from posts
  useEffect(() => {
    const tagCount = new Map<string, number>()
    posts.forEach((p) => p.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) || 0) + 1)))

    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []

    // Tag nodes
    tagCount.forEach((count, tag) => {
      nodes.push({
        id: `tag:${tag}`,
        label: tag,
        type: "tag",
        x: Math.random() * 600 + 100,
        y: Math.random() * 300 + 50,
        vx: 0, vy: 0,
        radius: Math.min(8 + count * 4, 24),
        connections: count,
      })
    })

    // Post nodes + edges
    posts.forEach((post) => {
      nodes.push({
        id: `post:${post.id}`,
        label: post.title.length > 25 ? post.title.slice(0, 22) + "..." : post.title,
        type: "post",
        x: Math.random() * 600 + 100,
        y: Math.random() * 300 + 50,
        vx: 0, vy: 0,
        radius: 5,
        slug: post.slug,
        connections: post.tags.length,
      })
      post.tags.forEach((tag) => {
        edges.push({ source: `post:${post.id}`, target: `tag:${tag}` })
      })
    })

    nodesRef.current = nodes
    edgesRef.current = edges
  }, [posts])

  // Force simulation + render
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener("resize", resize)

    const getColors = () => {
      const cs = getComputedStyle(document.documentElement)
      return {
        bg: cs.getPropertyValue("--term-black").trim() || "#0B0B0F",
        fg: cs.getPropertyValue("--term-white").trim() || "#E8E6E3",
        accent: cs.getPropertyValue("--term-cyan").trim() || "#56B6C2",
        green: cs.getPropertyValue("--term-green").trim() || "#98C379",
        gray: cs.getPropertyValue("--term-gray").trim() || "#5C6370",
        line: cs.getPropertyValue("--term-line").trim() || "#2C313A",
      }
    }

    const tick = () => {
      const nodes = nodesRef.current
      const edges = edgesRef.current
      if (!nodes.length) { animRef.current = requestAnimationFrame(tick); return }

      const w = canvas.width
      const h = canvas.height
      const colors = getColors()

      // ── Physics ───────────────────────────────────
      // Gravity toward center
      for (const n of nodes) {
        n.vx += (w / 2 - n.x) * 0.0005
        n.vy += (h / 2 - n.y) * 0.0005
      }
      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          let dx = b.x - a.x, dy = b.y - a.y
          let d = Math.sqrt(dx * dx + dy * dy) || 1
          const minDist = a.radius + b.radius + 30
          if (d < minDist) {
            const f = (minDist - d) / d * 0.15
            a.vx -= dx * f; a.vy -= dy * f
            b.vx += dx * f; b.vy += dy * f
          }
        }
      }
      // Edge attraction
      for (const e of edges) {
        const a = nodes.find((n) => n.id === e.source)
        const b = nodes.find((n) => n.id === e.target)
        if (!a || !b) continue
        const dx = b.x - a.x, dy = b.y - a.y
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const f = (d - 80) * 0.003
        a.vx += (dx / d) * f; a.vy += (dy / d) * f
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f
      }
      // Apply velocity + damping + bounds
      for (const n of nodes) {
        if (dragRef.current.node === n) continue
        n.vx *= 0.85; n.vy *= 0.85
        n.x += n.vx; n.y += n.vy
        n.x = Math.max(n.radius + 5, Math.min(w - n.radius - 5, n.x))
        n.y = Math.max(n.radius + 5, Math.min(h - n.radius - 5, n.y))
      }

      // ── Render ────────────────────────────────────
      ctx.clearRect(0, 0, w, h)

      // Edges
      ctx.lineWidth = 1
      for (const e of edges) {
        const a = nodes.find((n) => n.id === e.source)
        const b = nodes.find((n) => n.id === e.target)
        if (!a || !b) continue
        const isActive = activeTag && (e.target === `tag:${activeTag}` || e.source === `tag:${activeTag}`)
        ctx.strokeStyle = isActive ? colors.accent : colors.line
        ctx.globalAlpha = isActive ? 0.8 : 0.3
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Nodes
      for (const n of nodes) {
        const isHovered = hoverRef.current === n
        const isActiveNode = activeTag && n.id === `tag:${activeTag}`

        if (n.type === "tag") {
          // Tag nodes: filled circles with glow
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
          if (isActiveNode || isHovered) {
            ctx.shadowBlur = 12
            ctx.shadowColor = colors.accent
          }
          ctx.fillStyle = isActiveNode ? colors.accent : isHovered ? colors.green : colors.gray
          ctx.fill()
          ctx.shadowBlur = 0

          // Label
          ctx.fillStyle = colors.fg
          ctx.font = `${isHovered || isActiveNode ? "bold " : ""}10px monospace`
          ctx.textAlign = "center"
          ctx.fillText(n.label, n.x, n.y + n.radius + 14)
        } else {
          // Post nodes: small squares
          const s = n.radius
          const connected = activeTag && edgesRef.current.some(
            (e) => (e.source === n.id && e.target === `tag:${activeTag}`) || (e.target === n.id && e.source === `tag:${activeTag}`)
          )
          ctx.fillStyle = connected ? colors.accent : isHovered ? colors.fg : colors.gray
          ctx.globalAlpha = connected || isHovered || !activeTag ? 1 : 0.3
          ctx.fillRect(n.x - s, n.y - s, s * 2, s * 2)
          ctx.globalAlpha = 1

          if (isHovered) {
            ctx.fillStyle = colors.fg
            ctx.font = "10px monospace"
            ctx.textAlign = "center"
            ctx.fillText(n.label, n.x, n.y - n.radius - 6)
          }
        }
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [activeTag])

  // ── Mouse interactions ──────────────────────────────────────────
  const findNode = useCallback((mx: number, my: number) => {
    for (const n of nodesRef.current) {
      const dx = mx - n.x, dy = my - n.y
      if (dx * dx + dy * dy < (n.radius + 8) * (n.radius + 8)) return n
    }
    return null
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const n = findNode(mx, my)
    if (n) {
      dragRef.current = { node: n, offsetX: mx - n.x, offsetY: my - n.y }
    }
  }, [findNode])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    if (dragRef.current.node) {
      dragRef.current.node.x = mx - dragRef.current.offsetX
      dragRef.current.node.y = my - dragRef.current.offsetY
      dragRef.current.node.vx = 0
      dragRef.current.node.vy = 0
    }
    const h = findNode(mx, my)
    hoverRef.current = h
    if (h) {
      setTooltip({ x: mx, y: my, text: h.label })
      canvasRef.current!.style.cursor = "pointer"
    } else {
      setTooltip(null)
      canvasRef.current!.style.cursor = "default"
    }
  }, [findNode])

  const onMouseUp = useCallback(() => {
    const n = dragRef.current.node
    if (n && n.type === "tag") {
      const newTag = activeTag === n.label ? null : n.label
      setActiveTag(newTag)
      onTagClick?.(newTag)
    }
    dragRef.current = { node: null, offsetX: 0, offsetY: 0 }
  }, [activeTag, onTagClick])

  return (
    <div ref={containerRef} className="relative border border-term-line bg-term-darker overflow-hidden">
      <div className="absolute top-3 left-4 text-xs uppercase tracking-[0.14em] text-term-gray z-10">
        knowledge graph {activeTag && <span className="text-term-cyan">{'// '}filter: {activeTag}</span>}
      </div>
      {activeTag && (
        <button
          onClick={() => { setActiveTag(null); onTagClick?.(null) }}
          className="absolute top-3 right-4 text-xs text-term-cyan hover:text-term-white z-10"
        >
          [clear filter]
        </button>
      )}
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 320 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => {
          dragRef.current = { node: null, offsetX: 0, offsetY: 0 }
          hoverRef.current = null
          setTooltip(null)
        }}
      />
    </div>
  )
}
