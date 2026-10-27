import { AgnesError, errorFromStatus, toAgnesError } from "./errors"

export type StreamTextOptions = {
  signal?: AbortSignal
  requestId?: string
  fetch?: typeof fetch
}

export type AgnesStreamChunk = {
  text: string
  done: boolean
}

export type AIStreamEvent =
  | { type: "start"; requestId: string; model: string }
  | { type: "delta"; text: string }
  | { type: "finish"; usage?: { inputTokens?: number; outputTokens?: number } }
  | { type: "error"; code: string; retryable: boolean; message: string }

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined
}

function extractDelta(payload: unknown): string {
  const root = asRecord(payload)
  const choices = Array.isArray(root?.choices) ? root.choices : []
  const choice = asRecord(choices[0])
  const delta = asRecord(choice?.delta)
  const content = delta?.content ?? choice?.text
  if (typeof content === "string") return content
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        const record = asRecord(part)
        return typeof record?.text === "string" ? record.text : ""
      })
      .join("")
  }
  return ""
}

/** Parse an OpenAI-compatible SSE response body into text chunks. */
export async function* parseSse(body: ReadableStream<Uint8Array>, signal?: AbortSignal): AsyncGenerator<AgnesStreamChunk> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      if (signal?.aborted) throw new AgnesError("aborted", "请求已取消", { retryable: false })
      const { done, value } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })
      const events = buffer.split(/\r?\n\r?\n/)
      buffer = events.pop() ?? ""
      for (const event of events) {
        const data = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("\n")
        if (!data) continue
        if (data === "[DONE]") {
          yield { text: "", done: true }
          return
        }
        let payload: unknown
        try {
          payload = JSON.parse(data)
        } catch (error) {
          throw new AgnesError("parse", "Agnes AI 流响应格式无效", { retryable: false, cause: error })
        }
        const text = extractDelta(payload)
        if (text) yield { text, done: false }
      }
      if (done) break
    }
    const tail = buffer.trim()
    if (tail) {
      const data = tail
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("\n")
      if (data && data !== "[DONE]") {
        let payload: unknown
        try {
          payload = JSON.parse(data)
        } catch (error) {
          throw new AgnesError("parse", "Agnes AI 流响应格式无效", { retryable: false, cause: error })
        }
        const text = extractDelta(payload)
        if (text) yield { text, done: false }
      }
    }
    yield { text: "", done: true }
  } finally {
    reader.releaseLock()
  }
}

/** Fetch a streaming completion without exposing an API key to the browser. */
export async function* streamText(
  url: string,
  init: RequestInit,
  options: StreamTextOptions = {},
): AsyncGenerator<AgnesStreamChunk> {
  try {
    const response = await (options.fetch ?? fetch)(url, { ...init, signal: options.signal })
    if (!response.ok) {
      throw errorFromStatus(response.status, response.statusText || "Agnes AI 流请求失败", {
        requestId: options.requestId,
      })
    }
    if (!response.body) throw new AgnesError("parse", "Agnes AI 未返回流数据", { retryable: false })
    yield* parseSse(response.body, options.signal)
  } catch (error) {
    throw toAgnesError(error)
  }
}
