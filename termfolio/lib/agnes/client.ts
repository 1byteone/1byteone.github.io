import { AgnesError, errorFromStatus, toAgnesError } from "./errors"
import { withRetry, type RetryOptions } from "./retry"
import {
  normalizeAgnesResponse,
  toAgnesWireMessages,
  type AIMessage,
  type ChatCompletionRequest,
  type ChatCompletionResult,
} from "./protocol"

export type AgnesClientOptions = {
  /** Server-only secret. Never pass a NEXT_PUBLIC_* value here. */
  apiKey: string
  baseUrl?: string
  model?: string
  timeoutMs?: number
  retry?: RetryOptions
  fetch?: typeof fetch
  systemPrompt?: string
}

export type ChatOptions = Omit<ChatCompletionRequest, "messages"> & {
  signal?: AbortSignal
  retry?: RetryOptions
}

const DEFAULT_BASE_URL = "https://api.agnes-ai.cn/v1"
const DEFAULT_MODEL = "agnes-3.0-flash"

function makeRequestId(): string {
  return `agnes_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as unknown
    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>
      const error = record.error
      if (typeof error === "string") return error
      if (error && typeof error === "object" && typeof (error as Record<string, unknown>).message === "string") {
        return (error as Record<string, string>).message
      }
      if (typeof record.message === "string") return record.message
    }
  } catch {
    // The provider may return an empty or non-JSON error body.
  }
  return response.statusText || "Agnes AI 请求失败"
}

function retryAfterMs(response: Response): number | undefined {
  const value = response.headers.get("retry-after")
  if (!value) return undefined
  const seconds = Number(value)
  if (Number.isFinite(seconds)) return Math.max(0, Math.round(seconds * 1_000))
  const date = Date.parse(value)
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined
}

export function createAgnesClient(options: AgnesClientOptions) {
  if (typeof window !== "undefined") {
    throw new AgnesError("configuration", "Agnes provider client 只能在服务端调用", { retryable: false })
  }
  const apiKey = options.apiKey?.trim()
  if (!apiKey) throw new AgnesError("configuration", "AGNES_API_KEY 未配置", { retryable: false })

  const baseUrl = options.baseUrl?.trim() || DEFAULT_BASE_URL
  const model = options.model?.trim() || DEFAULT_MODEL
  const request = options.fetch ?? fetch

  async function chat(messages: AIMessage[], chatOptions: ChatOptions = {}): Promise<ChatCompletionResult> {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new AgnesError("invalid_request", "至少需要一条消息", { retryable: false })
    }
    if (chatOptions.stream) {
      throw new AgnesError("invalid_request", "流式请求请使用 streamText，并在服务端转发密钥", { retryable: false })
    }
    const requestId = makeRequestId()
    const signal = chatOptions.signal
    const timeoutMs = options.timeoutMs ?? 45_000
    const retryOptions: RetryOptions = {
      ...options.retry,
      ...chatOptions.retry,
      signal,
    }

    return withRetry(async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)
      const onAbort = () => controller.abort()
      signal?.addEventListener("abort", onAbort, { once: true })

      try {
        const body: Record<string, unknown> = {
          model: chatOptions.model || model,
          messages: toAgnesWireMessages(messages),
          ...(chatOptions.temperature !== undefined ? { temperature: chatOptions.temperature } : {}),
          ...(chatOptions.maxTokens !== undefined ? { max_tokens: chatOptions.maxTokens } : {}),
          ...(chatOptions.stream !== undefined ? { stream: chatOptions.stream } : {}),
          ...(chatOptions.metadata ? { metadata: chatOptions.metadata } : {}),
        }
        if (options.systemPrompt && !messages.some((message) => message.role === "system")) {
          body.messages = toAgnesWireMessages([{ role: "system", content: options.systemPrompt }, ...messages])
        }

        const response = await request(joinUrl(baseUrl, "/chat/completions"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        })
        if (!response.ok) {
          const message = await readErrorMessage(response)
          throw errorFromStatus(response.status, message, {
            retryAfterMs: retryAfterMs(response),
            requestId,
          })
        }

        let payload: unknown
        try {
          payload = await response.json()
        } catch (error) {
          throw new AgnesError("parse", "Agnes AI 返回了无效 JSON", { retryable: false, requestId, cause: error })
        }
        const result = normalizeAgnesResponse(payload, chatOptions.model || model, requestId)
        if (!result.text) throw new AgnesError("parse", "Agnes AI 没有返回可显示的内容", { retryable: false, requestId })
        return result
      } catch (error) {
        if (error instanceof AgnesError) throw error
        if (error instanceof Error && error.name === "AbortError") {
          if (signal?.aborted) throw new AgnesError("aborted", "请求已取消", { retryable: false, requestId })
          throw new AgnesError("timeout", "Agnes AI 响应超时", { retryable: true, requestId, cause: error })
        }
        throw toAgnesError(error)
      } finally {
        clearTimeout(timeout)
        signal?.removeEventListener("abort", onAbort)
      }
    }, retryOptions)
  }

  return { chat }
}

export type AgnesClient = ReturnType<typeof createAgnesClient>

export type AgnesRouteClientOptions = {
  /** Same-origin route; no provider secret is ever accepted or sent here. */
  endpoint?: string
  timeoutMs?: number
  retry?: RetryOptions
  fetch?: typeof fetch
}

/**
 * Browser-safe client for the app's own route. It deliberately has no `apiKey`
 * option, making it harder to accidentally ship a provider secret to a bundle.
 */
export function createAgnesRouteClient(options: AgnesRouteClientOptions = {}) {
  const endpoint = options.endpoint || "/api/agnes/chat"
  if (!endpoint.startsWith("/") || endpoint.startsWith("//")) {
    throw new AgnesError("configuration", "终端代理地址必须是本站相对路径", { retryable: false })
  }
  const request = options.fetch ?? fetch

  async function chat(messages: AIMessage[], chatOptions: ChatOptions = {}): Promise<ChatCompletionResult> {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new AgnesError("invalid_request", "至少需要一条消息", { retryable: false })
    }
    if (chatOptions.stream) {
      throw new AgnesError("invalid_request", "本站代理暂不支持直接流式 JSON，请使用专用 SSE 路由", { retryable: false })
    }
    if (messages.some((message) => message.role !== "user" && message.role !== "assistant")) {
      throw new AgnesError("invalid_request", "终端路由只接受 user / assistant 消息", { retryable: false })
    }

    const requestId = makeRequestId()
    const timeoutMs = options.timeoutMs ?? 45_000
    const retryOptions: RetryOptions = { ...options.retry, ...chatOptions.retry, signal: chatOptions.signal }
    return withRetry(async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)
      const onAbort = () => controller.abort()
      chatOptions.signal?.addEventListener("abort", onAbort, { once: true })

      try {
        const response = await request(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Request-ID": requestId },
          body: JSON.stringify({
            messages: toAgnesWireMessages(messages),
            ...(chatOptions.metadata ? { metadata: chatOptions.metadata } : {}),
          }),
          signal: controller.signal,
        })
        if (!response.ok) {
          throw errorFromStatus(response.status, await readErrorMessage(response), {
            retryAfterMs: retryAfterMs(response),
            requestId,
          })
        }
        let payload: unknown
        try {
          payload = await response.json()
        } catch (error) {
          throw new AgnesError("parse", "终端路由返回了无效 JSON", { retryable: false, requestId, cause: error })
        }
        const result = normalizeAgnesResponse(payload, "agnes-3.0-flash", requestId)
        if (!result.text) throw new AgnesError("parse", "AI 没有返回可显示的内容", { retryable: false, requestId })
        return result
      } catch (error) {
        if (error instanceof AgnesError) throw error
        if (error instanceof Error && error.name === "AbortError") {
          if (chatOptions.signal?.aborted) throw new AgnesError("aborted", "请求已取消", { retryable: false, requestId })
          throw new AgnesError("timeout", "AI 响应超时", { retryable: true, requestId, cause: error })
        }
        throw toAgnesError(error)
      } finally {
        clearTimeout(timeout)
        chatOptions.signal?.removeEventListener("abort", onAbort)
      }
    }, retryOptions)
  }

  return { chat }
}

export type AgnesRouteClient = ReturnType<typeof createAgnesRouteClient>
