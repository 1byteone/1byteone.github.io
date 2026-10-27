export type AgnesErrorCode =
  | "configuration"
  | "invalid_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "timeout"
  | "aborted"
  | "upstream"
  | "parse"
  | "network"
  | "unknown"

export type AgnesErrorOptions = {
  status?: number
  retryable?: boolean
  retryAfterMs?: number
  requestId?: string
  cause?: unknown
}

/** A stable error shape for UI, route handlers and logs. */
export class AgnesError extends Error {
  readonly name = "AgnesError"
  readonly code: AgnesErrorCode
  readonly status?: number
  readonly retryable: boolean
  readonly retryAfterMs?: number
  readonly requestId?: string

  constructor(code: AgnesErrorCode, message: string, options: AgnesErrorOptions = {}) {
    super(message)
    this.code = code
    this.status = options.status
    this.retryable = options.retryable ?? isRetryableCode(code)
    this.retryAfterMs = options.retryAfterMs
    this.requestId = options.requestId
    if (options.cause !== undefined) this.cause = options.cause
  }
}

export function isRetryableCode(code: AgnesErrorCode): boolean {
  return code === "rate_limit" || code === "timeout" || code === "upstream" || code === "network"
}

export function isAgnesError(error: unknown): error is AgnesError {
  return error instanceof AgnesError
}

export function classifyStatus(status: number): AgnesErrorCode {
  if (status === 400 || status === 422) return "invalid_request"
  if (status === 401) return "unauthorized"
  if (status === 403) return "forbidden"
  if (status === 404) return "not_found"
  if (status === 408) return "timeout"
  if (status === 429) return "rate_limit"
  if (status >= 500) return "upstream"
  return "unknown"
}

export function errorFromStatus(status: number, message: string, options: AgnesErrorOptions = {}): AgnesError {
  const code = classifyStatus(status)
  return new AgnesError(code, message, { ...options, status, retryable: options.retryable ?? isRetryableCode(code) })
}

export function toAgnesError(error: unknown, fallback = "Agnes AI 请求失败"): AgnesError {
  if (isAgnesError(error)) return error
  if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
    return new AgnesError("aborted", "请求已取消", { retryable: false, cause: error })
  }
  if (error instanceof Error && error.name === "AbortError") {
    return new AgnesError("aborted", "请求已取消", { retryable: false, cause: error })
  }
  if (error instanceof TypeError) {
    return new AgnesError("network", "无法连接 Agnes AI 服务", { cause: error })
  }
  return new AgnesError("unknown", error instanceof Error ? error.message : fallback, { cause: error })
}
