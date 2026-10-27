"use client"

import { Fragment, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { Image } from "@/components/atoms"
import type { AIBlock } from "@/lib/agnes/protocol"

type JsonRecord = Record<string, unknown>

type AiResponseRendererProps = {
  content: string | AIBlock[]
  className?: string
}

const allowedUrl = (value: string): string | null => {
  const url = value.trim()
  if (!url) return null
  if (url.startsWith("/") || url.startsWith("#")) return url
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null
  } catch {
    return null
  }
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="rounded border border-term-line px-2 py-1 text-[10px] text-term-gray transition-colors hover:border-term-cyan hover:text-term-cyan"
      aria-label="复制代码"
    >
      {copied ? "已复制" : "复制"}
    </button>
  )
}

function CodeCard({ code, language }: { code: string; language?: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-term-cyan/20 bg-term-darker">
      <div className="flex items-center justify-between border-b border-term-cyan/15 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-term-gray">
        <span>{language || "code"}</span>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-term-white"><code>{code}</code></pre>
    </div>
  )
}

function Inline({ text }: { text: string }) {
  const tokens = /(!?\[[^\]]*\]\([^)]*\)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g
  const pieces = text.split(tokens).filter(Boolean)

  return (
    <>
      {pieces.map((piece, index) => {
        const image = piece.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
        if (image) {
          const src = allowedUrl(image[2])
          return src ? (
            <Image key={index} src={src} alt={image[1]} className="my-3 max-h-96 max-w-full rounded border border-term-cyan/20 object-contain" />
          ) : null
        }

        const link = piece.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const href = allowedUrl(link[2])
          return href ? (
            <a key={index} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-term-cyan underline decoration-term-cyan/40 underline-offset-2 hover:decoration-term-cyan">
              {link[1]}
            </a>
          ) : (
            <Fragment key={index}>{link[1]}</Fragment>
          )
        }
        if (piece.startsWith("`") && piece.endsWith("`")) {
          return <code key={index} className="rounded bg-term-darker px-1.5 py-0.5 text-[0.9em] text-term-cyan">{piece.slice(1, -1)}</code>
        }
        if ((piece.startsWith("**") && piece.endsWith("**")) || (piece.startsWith("__") && piece.endsWith("__"))) {
          return <strong key={index} className="font-bold text-term-white">{piece.slice(2, -2)}</strong>
        }
        if ((piece.startsWith("*") && piece.endsWith("*")) || (piece.startsWith("_") && piece.endsWith("_"))) {
          return <em key={index}>{piece.slice(1, -1)}</em>
        }
        return <Fragment key={index}>{piece}</Fragment>
      })}
    </>
  )
}

function JsonCard({ value }: { value: JsonRecord }) {
  return (
    <div className="my-4 rounded-lg border border-term-cyan/20 bg-term-darker p-3">
      <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-term-cyan">json response</div>
      <CodeCard code={JSON.stringify(value, null, 2)} language="json" />
    </div>
  )
}

function StatusCard({ value }: { value: JsonRecord }) {
  const status = typeof value.status === "string" ? value.status : "info"
  const message = typeof value.message === "string" ? value.message : typeof value.description === "string" ? value.description : "状态已更新"
  const tone = status === "error" || status === "failed" ? "text-[#E06C75] border-[#E06C75]/40" : status === "success" || status === "ok" ? "text-term-green border-term-green/40" : "text-[#E5C07B] border-[#E5C07B]/40"
  return <div className={`my-4 rounded-lg border bg-term-darker/70 p-3 ${tone}`}><span className="mr-2 text-[10px] uppercase tracking-[0.12em]">{status}</span><span className="text-sm">{message}</span></div>
}

function TableCard({ value }: { value: JsonRecord }) {
  const rows = Array.isArray(value.rows) ? value.rows : Array.isArray(value.data) ? value.data : []
  const columns = Array.isArray(value.columns) ? value.columns : []
  if (!rows.length) return <JsonCard value={value} />
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-term-cyan/20">
      <table className="w-full border-collapse text-left text-xs text-term-white">
        {columns.length > 0 && <thead className="bg-term-darker text-term-cyan"><tr>{columns.map((column, i) => <th key={i} className="border-b border-term-cyan/20 px-3 py-2">{String(column)}</th>)}</tr></thead>}
        <tbody>{rows.map((row, rowIndex) => {
          const cells = Array.isArray(row) ? row : typeof row === "object" && row !== null ? Object.values(row) : [row]
          return <tr key={rowIndex} className="odd:bg-term-dark even:bg-term-darker">{cells.map((cell, cellIndex) => <td key={cellIndex} className="border-t border-term-cyan/10 px-3 py-2">{String(cell ?? "")}</td>)}</tr>
        })}</tbody>
      </table>
    </div>
  )
}

function ChartCard({ value }: { value: JsonRecord }) {
  const title = typeof value.title === "string" ? value.title : "图表数据"
  const points = Array.isArray(value.data) ? value.data : Array.isArray(value.values) ? value.values : []
  return (
    <div className="my-4 rounded-lg border border-term-cyan/20 bg-term-darker p-4">
      <div className="mb-2 text-xs text-term-cyan">{title}</div>
      <div className="flex h-20 items-end gap-1" aria-label="图表预览">
        {points.slice(0, 32).map((point, index) => {
          const numeric = typeof point === "number" ? point : typeof point === "object" && point !== null && "value" in point && typeof point.value === "number" ? point.value : 0
          const height = `${Math.max(4, Math.min(100, Math.abs(numeric)))}%`
          return <span key={index} title={String(numeric)} className="min-w-1 flex-1 rounded-t bg-term-cyan/70" style={{ height }} />
        })}
      </div>
      <div className="mt-2 text-[10px] text-term-gray">图表交互将在后续接入；当前显示安全预览。</div>
    </div>
  )
}

function StructuredValue({ value }: { value: JsonRecord }) {
  const type = typeof value.type === "string" ? value.type.toLowerCase() : ""
  if (type === "status") return <StatusCard value={value} />
  if (type === "table") return <TableCard value={value} />
  if (type === "chart" || type === "graph") return <ChartCard value={value} />
  if (type === "image" && typeof value.url === "string") {
    const src = allowedUrl(value.url)
    if (src) return <Image src={src} alt={typeof value.alt === "string" ? value.alt : "AI 返回的图片"} className="my-4 max-h-96 max-w-full rounded border border-term-cyan/20 object-contain" />
  }
  return <JsonCard value={value} />
}

function renderBlocksFromProtocol(blocks: AIBlock[]): ReactNode[] {
  return blocks.reduce<ReactNode[]>((result, block, index) => {
    if (block.type === "text") {
      renderBlocks(block.text).forEach((node, textIndex) => {
        result.push(<Fragment key={`text-${index}-${textIndex}`}>{node}</Fragment>)
      })
      return result
    }
    if (block.type === "code") {
      result.push(<CodeCard key={`code-${index}`} code={block.code} language={block.language} />)
      return result
    }
    if (block.type === "markdown") {
      renderBlocks(block.content).forEach((node, textIndex) => {
        result.push(<Fragment key={`markdown-${index}-${textIndex}`}>{node}</Fragment>)
      })
      return result
    }
    if (block.type === "json") {
      const value = block.data && typeof block.data === "object" && !Array.isArray(block.data)
        ? block.data as JsonRecord
        : { value: block.data }
      result.push(<JsonCard key={`json-${index}`} value={value} />)
      return result
    }
    if (block.type === "table") {
      result.push(<TableCard key={`table-${index}`} value={{ columns: block.columns, rows: block.rows }} />)
      return result
    }
    if (block.type === "chart") {
      result.push(<ChartCard key={`chart-${index}`} value={block.option} />)
      return result
    }
    if (block.type === "image") {
      const src = allowedUrl(block.url)
      result.push(src ? <Image key={`image-${index}`} src={src} alt={block.alt || "AI 返回的图片"} className="my-4 max-h-96 max-w-full rounded border border-term-cyan/20 object-contain" /> : <StatusCard key={`image-error-${index}`} value={{ type: "status", status: "error", message: "图片地址不安全，已阻止显示。" }} />)
      return result
    }
    if (block.type === "status") {
      result.push(<StatusCard key={`status-${index}`} value={{ type: "status", status: block.state, message: block.label }} />)
      return result
    }
    if (block.type === "source") {
      const href = allowedUrl(block.url)
      result.push(href ? <a key={`source-${index}`} href={href} target="_blank" rel="noopener noreferrer" className="my-2 block rounded border border-term-cyan/20 bg-term-darker px-3 py-2 text-xs text-term-cyan hover:border-term-cyan"><span className="mr-2">↗</span>{block.title}{block.excerpt ? <span className="mt-1 block text-term-gray">{block.excerpt}</span> : null}</a> : null)
      return result
    }
    if (block.type === "metric") {
      result.push(<div key={`metric-${index}`} className="my-3 rounded border border-term-cyan/20 bg-term-darker p-3"><div className="text-[10px] uppercase tracking-[0.12em] text-term-gray">{block.label}</div><div className="mt-1 text-xl text-term-cyan">{String(block.value)}{block.unit ? <span className="ml-1 text-xs text-term-gray">{block.unit}</span> : null}</div>{block.help ? <div className="mt-1 text-xs text-term-gray">{block.help}</div> : null}</div>)
      return result
    }
    if (block.type === "artifact") {
      result.push(<CodeCard key={`artifact-${index}`} code={block.content} language={block.kind} />)
      return result
    }
    if (block.type === "citation") {
      const href = allowedUrl(block.url)
      result.push(
        href ? <a key={`citation-${index}`} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="my-2 block rounded border border-term-cyan/20 bg-term-darker px-3 py-2 text-xs text-term-cyan hover:border-term-cyan"><span className="mr-2">↗</span>{block.title || block.text || href}</a> : null,
      )
      return result
    }
    if (block.type === "tool-call") {
      const args = block.arguments && typeof block.arguments === "object" ? block.arguments as JsonRecord : { arguments: block.arguments ?? {} }
      result.push(<div key={`tool-${index}`} className="my-2 rounded border border-term-cyan/20 bg-term-darker px-3 py-2 text-xs text-term-gray"><span className="mr-2 text-term-cyan">tool</span>{block.name}<pre className="mt-1 overflow-x-auto text-[10px]">{JSON.stringify(args, null, 2)}</pre></div>)
      return result
    }
    if (block.type === "error") {
      result.push(<StatusCard key={`error-${index}`} value={{ type: "status", status: "error", message: block.message }} />)
    }
    return result
  }, [])
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function TableBlock({ header, body }: { header: string; body: string[] }) {
  const split = (line: string) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim())
  const columns = split(header)
  return <div className="my-4 overflow-x-auto rounded-lg border border-term-cyan/20"><table className="w-full border-collapse text-left text-xs text-term-white"><thead className="bg-term-darker text-term-cyan"><tr>{columns.map((column, i) => <th key={i} className="border-b border-term-cyan/20 px-3 py-2"><Inline text={column} /></th>)}</tr></thead><tbody>{body.map((line, rowIndex) => <tr key={rowIndex} className="odd:bg-term-dark even:bg-term-darker">{split(line).map((cell, i) => <td key={i} className="border-t border-term-cyan/10 px-3 py-2"><Inline text={cell} /></td>)}</tr>)}</tbody></table></div>
}

function renderBlocks(content: string): ReactNode[] {
  const lines = content.replaceAll("\r\n", "\n").split("\n")
  const blocks: ReactNode[] = []
  let index = 0
  let blockKey = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) { index += 1; continue }

    const fence = line.match(/^\s*```\s*([\w-]*)\s*$/)
    if (fence) {
      const language = fence[1] || "text"
      const codeLines: string[] = []
      index += 1
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) { codeLines.push(lines[index]); index += 1 }
      if (index < lines.length) index += 1
      const code = codeLines.join("\n")
      if (language.toLowerCase() === "json") {
        try {
          const parsed = JSON.parse(code) as unknown
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) blocks.push(<StructuredValue key={blockKey++} value={parsed as JsonRecord} />)
          else blocks.push(<CodeCard key={blockKey++} code={code} language={language} />)
        } catch { blocks.push(<CodeCard key={blockKey++} code={code} language={language} />) }
      } else if (language.toLowerCase() === "chart") {
        try { blocks.push(<ChartCard key={blockKey++} value={JSON.parse(code) as JsonRecord} />) } catch { blocks.push(<CodeCard key={blockKey++} code={code} language={language} />) }
      } else blocks.push(<CodeCard key={blockKey++} code={code} language={language} />)
      continue
    }

    const structured = line.trim().match(/^\{[\s\S]*\}$/)
    if (structured) {
      try {
        const value = JSON.parse(line) as unknown
        if (value && typeof value === "object" && !Array.isArray(value)) { blocks.push(<StructuredValue key={blockKey++} value={value as JsonRecord} />); index += 1; continue }
      } catch { /* treat malformed JSON as normal text */ }
    }

    const heading = line.match(/^\s*(#{1,3})\s+(.+)$/)
    if (heading) { const Tag = `h${heading[1].length}` as "h1" | "h2" | "h3"; blocks.push(<Tag key={blockKey++} className="mt-4 mb-2 font-bold text-term-cyan"><Inline text={heading[2]} /></Tag>); index += 1; continue }

    if (index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      const tableBody: string[] = []; index += 2
      while (index < lines.length && lines[index].trim().startsWith("|")) { tableBody.push(lines[index]); index += 1 }
      blocks.push(<TableBlock key={blockKey++} header={line} body={tableBody} />); continue
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) { items.push(lines[index].replace(/^\s*[-*+]\s+/, "")); index += 1 }
      blocks.push(<ul key={blockKey++} className="my-3 list-disc space-y-1 pl-5 text-term-white">{items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</ul>); continue
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) { items.push(lines[index].replace(/^\s*\d+[.)]\s+/, "")); index += 1 }
      blocks.push(<ol key={blockKey++} className="my-3 list-decimal space-y-1 pl-5 text-term-white">{items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</ol>); continue
    }

    if (/^\s*>\s?/.test(line)) { blocks.push(<blockquote key={blockKey++} className="my-3 border-l-2 border-term-cyan/40 pl-3 italic text-term-gray"><Inline text={line.replace(/^\s*>\s?/, "")} /></blockquote>); index += 1; continue }

    const paragraph: string[] = [line]; index += 1
    while (index < lines.length && lines[index].trim() && !/^\s*```/.test(lines[index]) && !/^\s*(#{1,3})\s+/.test(lines[index]) && !/^\s*[-*+]\s+/.test(lines[index]) && !/^\s*\d+[.)]\s+/.test(lines[index]) && !/^\s*>/.test(lines[index])) { paragraph.push(lines[index]); index += 1 }
    blocks.push(<p key={blockKey++} className="my-3 whitespace-pre-wrap break-words text-term-white"><Inline text={paragraph.join("\n")} /></p>)
  }
  return blocks
}

export default function AiResponseRenderer({ content, className = "" }: AiResponseRendererProps) {
  const rendered = useMemo(() => {
    try {
      return Array.isArray(content) ? renderBlocksFromProtocol(content) : renderBlocks(content)
    } catch {
      return [<p key="fallback" className="whitespace-pre-wrap break-words text-term-white">{Array.isArray(content) ? "AI 返回内容无法渲染。" : content}</p>]
    }
  }, [content])
  return <div className={`ai-response-renderer text-sm leading-7 ${className}`}>{rendered}</div>
}

