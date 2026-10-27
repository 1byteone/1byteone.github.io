import { NextResponse } from "next/server"
import { createAgnesClient } from "@/lib/agnes"
import { isAgnesError } from "@/lib/agnes/errors"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_MESSAGES = 12
const MAX_MESSAGE_LENGTH = 4000
const MAX_TOTAL_LENGTH = 16000

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type ChatRequest = {
  messages?: unknown
}

function isRequestBody(value: unknown): value is ChatRequest {
  return Boolean(value && typeof value === "object")
}

function jsonError(error: string, status: number) {
  return NextResponse.json(
    { error },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  )
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false
  const message = value as Record<string, unknown>
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  )
}

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  )
}

// A small process-local guard keeps an accidentally exposed demo from flooding
// the upstream API. Production deployments should also enforce a platform rate limit.
const rateLimit = new Map<string, { count: number; resetAt: number }>()
function allowRequest(key: string) {
  const now = Date.now()
  const current = rateLimit.get(key)
  if (!current || current.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (current.count >= 20) return false
  current.count += 1
  return true
}

export async function POST(request: Request) {
  const apiKey = process.env.AGNES_API_KEY?.trim()
  if (!apiKey) {
    return jsonError("AI 服务尚未配置，请先在服务端设置 AGNES_API_KEY。", 503)
  }
  if (!allowRequest(getClientKey(request))) {
    return jsonError("请求过于频繁，请稍后再试。", 429)
  }

  let body: ChatRequest
  try {
    const parsed: unknown = await request.json()
    if (!isRequestBody(parsed)) return jsonError("请求格式无效。", 400)
    body = parsed
  } catch {
    return jsonError("请求格式无效。", 400)
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError("请至少输入一条消息。", 400)
  }
  if (body.messages.length > MAX_MESSAGES) {
    return jsonError(`对话最多保留 ${MAX_MESSAGES} 条消息。`, 400)
  }

  const messages = body.messages.filter(isChatMessage)
  if (messages.length !== body.messages.length) {
    return jsonError("消息内容无效，单条消息最多 4000 个字符。", 400)
  }
  if (messages.reduce((total, message) => total + message.content.length, 0) > MAX_TOTAL_LENGTH) {
    return jsonError("本次对话内容过长，请先清理历史消息。", 400)
  }

  try {
    const client = createAgnesClient({
      apiKey,
      baseUrl: process.env.AGNES_API_BASE_URL,
      model: process.env.AGNES_MODEL,
      timeoutMs: 45_000,
      retry: { maxAttempts: 2, baseDelayMs: 1_000, maxDelayMs: 8_000 },
      systemPrompt:
        "你是 YOYO / DEV SPACE 终端里的中文 AI 工程助手。回答要准确、简洁、可操作；保留 RAG、Agent、FastAPI、Spring AI 等技术名词和代码格式。不要声称可以直接执行用户机器上的命令。",
    })
    const result = await client.chat(messages, { temperature: 0.4, maxTokens: 1200 })

    return NextResponse.json(
      {
        message: result.message,
        model: result.model,
        requestId: result.requestId,
        response: {
          status: "success",
          requestId: result.requestId,
          model: result.model,
          blocks: result.blocks,
          usage: result.usage,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    if (isAgnesError(error)) {
      const status = error.code === "rate_limit" ? 429 : error.code === "timeout" ? 504 : error.code === "configuration" ? 503 : error.code === "invalid_request" ? 400 : error.status && error.status >= 500 ? 503 : 502
      if (status >= 500) console.error("Agnes API request failed", error.code, error.requestId)
      return NextResponse.json(
        { error: error.code === "rate_limit" ? "AI 服务当前请求较多，请稍后再试。" : error.code === "timeout" ? "AI 响应超时，请稍后重试。" : error.code === "configuration" ? "AI 服务尚未配置，请联系站点管理员。" : "AI 服务请求失败，请稍后再试。", requestId: error.requestId },
        { status, headers: { "Cache-Control": "no-store" } },
      )
    }
    console.error("Agnes API request failed", error instanceof Error ? error.message : "unknown")
    return jsonError("AI 服务连接失败，请稍后再试。", 502)
  }
}
