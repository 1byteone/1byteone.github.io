import { AgnesError, toAgnesError } from "./errors"

export type RetryOptions = {
  maxAttempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
  jitter?: number
  signal?: AbortSignal
  sleep?: (delayMs: number, signal?: AbortSignal) => Promise<void>
  random?: () => number
}

export function backoffDelay(attempt: number, options: RetryOptions = {}): number {
  const base = Math.max(0, options.baseDelayMs ?? 350)
  const max = Math.max(base, options.maxDelayMs ?? 8_000)
  const jitter = Math.min(1, Math.max(0, options.jitter ?? 0.2))
  const exponential = Math.min(max, base * 2 ** Math.max(0, attempt - 1))
  const random = Math.min(1, Math.max(0, options.random?.() ?? Math.random()))
  const factor = 1 - jitter + random * jitter * 2
  return Math.round(Math.min(max, exponential * factor))
}

function defaultSleep(delayMs: number, signal?: AbortSignal): Promise<void> {
  if (delayMs <= 0) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, delayMs)
    if (!signal) return
    const abort = () => {
      clearTimeout(timer)
      signal.removeEventListener("abort", abort)
      reject(new AgnesError("aborted", "请求已取消", { retryable: false }))
    }
    const done = () => signal.removeEventListener("abort", abort)
    if (signal.aborted) abort()
    else {
      signal.addEventListener("abort", abort, { once: true })
      setTimeout(done, delayMs)
    }
  })
}

export async function withRetry<T>(operation: (attempt: number) => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const maxAttempts = Math.max(1, Math.floor(options.maxAttempts ?? 3))
  let lastError: AgnesError | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (options.signal?.aborted) throw new AgnesError("aborted", "请求已取消", { retryable: false })
    try {
      return await operation(attempt)
    } catch (error) {
      const normalized = toAgnesError(error)
      lastError = normalized
      if (!normalized.retryable || attempt >= maxAttempts) throw normalized
      const requestedDelay = normalized.retryAfterMs ?? backoffDelay(attempt, options)
      const delay = Math.min(Math.max(0, requestedDelay), Math.max(0, options.maxDelayMs ?? 8_000))
      await (options.sleep ?? defaultSleep)(delay, options.signal)
    }
  }

  throw lastError ?? new AgnesError("unknown", "Agnes AI 请求失败")
}
