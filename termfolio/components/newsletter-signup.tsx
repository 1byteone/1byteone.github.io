"use client"

import { useState, type FormEvent } from "react"
import type { Locale } from "@/content/locale"

export default function NewsletterSignup({ locale = "en" }: { locale?: Locale }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const copy = locale === "ar"
    ? {
        success: "تم الاشتراك. راجع بريدك.",
        error: "حدث خطأ. حاول مرة أخرى.",
        lead: "تنبيهات قليلة من الدفتر: مقالات وخربشات عن الاستراتيجية، التفكير النظمي، وبناء أشياء تنفع.",
        email: "البريد الإلكتروني",
        placeholder: "you@email.com",
        loading: "جار الاشتراك...",
        submit: "[ENTER] اشترك",
        newsletter: "النشرة",
      }
    : {
        success: "subscribed! check your inbox.",
        error: "something went wrong. try again.",
        lead: "Occasional essays on strategy, systems thinking, and building things that matter.",
        email: "Email address",
        placeholder: "you@email.com",
        loading: "subscribing...",
        submit: "[ENTER] subscribe",
        newsletter: "newsletter",
      }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Subscription failed")
      }
      setStatus("success")
      setMessage(copy.success)
      setEmail("")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : copy.error)
    }
  }

  return (
    <div className="border border-term-line bg-term-darker rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-term-line text-xs uppercase tracking-[0.14em] text-term-gray">
        <span>
          <span className="text-term-cyan">$</span> subscribe
        </span>
        <span>{copy.newsletter}</span>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-term-gray leading-relaxed">
          {copy.lead}
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center gap-2 border border-term-line rounded bg-term-black px-3 py-2 focus-within:border-term-cyan transition-colors">
            <span className="text-term-green text-sm flex-shrink-0">$</span>
            <span className="text-term-gray text-sm flex-shrink-0">subscribe --email</span>
            <label htmlFor="newsletter-email" className="sr-only">{copy.email}</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status !== "idle") setStatus("idle")
              }}
              placeholder={copy.placeholder}
              required
              aria-label={copy.email}
              className="flex-1 bg-transparent text-term-white text-sm outline-none min-w-0"
              disabled={status === "loading"}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="w-full py-2 text-xs uppercase tracking-[0.14em] border border-term-line rounded bg-term-black text-term-white hover:border-term-cyan hover:text-term-cyan transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "loading" ? copy.loading : copy.submit}
          </button>
        </form>
        {status === "success" && (
          <div className="text-xs text-term-green">{message}</div>
        )}
        {status === "error" && (
          <div className="text-xs text-red-400">{message}</div>
        )}
      </div>
    </div>
  )
}
