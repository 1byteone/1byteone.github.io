"use client"

import { useEffect, useRef, useState } from "react"
import AiResponseRenderer from "@/components/ai/ai-response-renderer"
import { parseAIBlocks, type AIBlock } from "@/lib/agnes/protocol"
import { createAgnesRouteClient } from "@/lib/agnes"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  blocks?: AIBlock[]
}

const MAX_INPUT_LENGTH = 4000
// The server route owns upstream retries. Retrying the same 429 in the
// browser would multiply provider traffic and make rate limiting worse.
const agnesRouteClient = createAgnesRouteClient({ retry: { maxAttempts: 1 } })

export default function AgnesChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Agnes AI 已连接。你可以问我 RAG、Agent、部署或代码设计问题。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading, error])

  async function sendMessage() {
    const content = input.trim()
    if (!content || isLoading) return

    if (content.length > MAX_INPUT_LENGTH) {
      setError(`单条消息最多 ${MAX_INPUT_LENGTH} 个字符。`)
      return
    }

    const nextMessages = [...messages, { role: "user" as const, content }]
    setMessages(nextMessages)
    setInput("")
    setError("")
    setIsLoading(true)

    try {
      const result = await agnesRouteClient.chat(nextMessages.slice(-12).map(({ role, content }) => ({ role, content })))
      const blocks = result.blocks.length ? parseAIBlocks(result.blocks) : undefined
      setMessages((current) => [...current, { role: "assistant", content: result.message, blocks }])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "连接 AI 服务失败，请稍后再试。")
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-term-black/85 p-4 backdrop-blur-sm">
      <div className="flex h-[min(560px,calc(100%-1rem))] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-term-line bg-term-darker shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-term-line bg-term-black px-4 py-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-term-white">
            <span className="text-term-green">●</span>
            <span>agnes://chat</span>
            <span className="text-term-gray">· 中文工程助手</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-term-gray transition-colors hover:text-term-white"
            aria-label="关闭 Agnes AI 对话"
          >
            [esc]
          </button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 font-mono text-sm leading-7">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === "user" ? "text-term-white" : "text-term-cyan"}>
              <span className="mr-2 text-term-gray">{message.role === "user" ? "$" : "agnes>"}</span>
              {message.role === "assistant" ? (
                <AiResponseRenderer content={message.blocks?.length ? message.blocks : message.content} />
              ) : (
                <span className="whitespace-pre-wrap break-words">{message.content}</span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-term-gray" aria-live="polite">
              <span className="mr-2 text-term-green">agnes&gt;</span>
              正在思考<span className="animate-pulse">...</span>
            </div>
          )}
          {error && (
            <div className="border-l-2 border-[#E5C07B] pl-3 text-[#E5C07B]" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-term-line bg-term-black p-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              if (error) setError("")
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                void sendMessage()
              }
              if (event.key === "Escape") {
                event.preventDefault()
                onClose()
              }
            }}
            placeholder="输入问题，Enter 发送，Shift+Enter 换行..."
            maxLength={MAX_INPUT_LENGTH}
            disabled={isLoading}
            rows={2}
            className="w-full resize-none bg-transparent text-sm leading-6 text-term-white outline-none placeholder:text-term-gray disabled:opacity-60"
            spellCheck={false}
            aria-label="发送给 Agnes AI 的消息"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] text-term-gray">
            <span>{input.length}/{MAX_INPUT_LENGTH} · 内容会通过服务端安全转发</span>
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || isLoading}
              className="rounded border border-term-line px-3 py-1 text-term-cyan transition-colors hover:border-term-cyan hover:bg-term-line/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? "发送中..." : "发送 ↵"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
