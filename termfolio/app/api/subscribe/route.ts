import { NextResponse } from "next/server"
import { Resend } from "resend"

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  rateLimitMap.set(key, { count: entry.count + 1, resetAt: entry.resetAt })
  return true
}

export async function POST(request: Request) {
  try {
    // Rate limit: max 5 per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(`subscribe:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { email } = await request.json()

    if (!email || typeof email !== "string" || email.length > 254) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID
    const resend = getResend()
    if (!audienceId || !resend) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 500 }
      )
    }

    const { error } = await resend.contacts.create({
      email,
      audienceId,
    })

    if (error) {
      // Normalize response to prevent email enumeration
      if (error.message?.includes("already exists")) {
        return NextResponse.json({ message: "Subscribed successfully!" })
      }
      return NextResponse.json(
        { error: "Subscription failed. Please try again." },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: "Subscribed successfully!" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
