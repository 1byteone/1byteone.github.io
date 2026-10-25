import { NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"
import { siteConfig } from "@/content/site"

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function constantTimeEqual(a: string, b: string): boolean {
  const hashA = crypto.createHmac("sha256", "compare").update(a).digest()
  const hashB = crypto.createHmac("sha256", "compare").update(b).digest()
  return crypto.timingSafeEqual(hashA, hashB)
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
    // Rate limit: max 2 calls per hour
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(`notify:${ip}`, 2, 3600000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const secret = request.headers.get("x-notify-secret") || ""
    const expected = process.env.NOTIFY_SECRET || ""
    if (!secret || !expected || !constantTimeEqual(secret, expected)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, title, excerpt } = await request.json()

    if (!slug || !title) {
      return NextResponse.json(
        { error: "slug and title are required" },
        { status: 400 }
      )
    }

    if (typeof slug !== "string" || slug.length > 200 || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 })
    }
    if (typeof title !== "string" || title.length > 500) {
      return NextResponse.json({ error: "Title too long" }, { status: 400 })
    }
    if (excerpt && (typeof excerpt !== "string" || excerpt.length > 2000)) {
      return NextResponse.json({ error: "Excerpt too long" }, { status: 400 })
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID
    const resend = getResend()
    if (!audienceId || !resend) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 500 }
      )
    }

    const { data: contacts } = await resend.contacts.list({ audienceId })
    if (!contacts?.data?.length) {
      return NextResponse.json({ message: "No subscribers to notify" })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl
    const postUrl = `${siteUrl}/blog/${slug}`
    const safeTitle = escapeHtml(title)
    const safeExcerpt = excerpt ? escapeHtml(excerpt) : ""

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0B0B0F;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <pre style="display:inline-block;color:#7dd3fc;font-family:'Courier New',monospace;font-size:14px;line-height:1.2;margin:0;">
&#x2588;&#x2557; &#x2554;&#x2588;&#x2557; &#x2554;&#x2550;&#x2557;
&#x2588;&#x2588;&#x2557;&#x2588;&#x2588;&#x2551; &#x2560;&#x2550;&#x2563;
&#x255A;&#x2550;&#x255D;&#x255A;&#x255D; &#x2569; &#x2569;</pre>
      <div style="color:#918A80;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;margin-top:8px;">${escapeHtml(siteConfig.name.toLowerCase())}</div>
    </div>
    <div style="border:1px solid #2A2A31;border-radius:12px;overflow:hidden;">
      <div style="padding:12px 16px;border-bottom:1px solid #2A2A31;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;color:#918A80;">
        new transmission
      </div>
      <div style="padding:24px;">
        <p style="color:#8FD4A7;font-family:'Courier New',monospace;font-size:12px;margin:0 0 16px;">$ cat new-post.md</p>
        <h1 style="color:#F3EADB;font-size:22px;font-weight:bold;margin:0 0 12px;line-height:1.3;">${safeTitle}</h1>
        ${safeExcerpt ? `<p style="color:#918A80;font-size:14px;line-height:1.6;margin:0 0 24px;">${safeExcerpt}</p>` : ""}
        <a href="${escapeHtml(postUrl)}" style="display:inline-block;padding:10px 24px;background:#A7B8FF;color:#0B0B0F;text-decoration:none;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;border-radius:6px;">
          Read Post →
        </a>
      </div>
      <div style="padding:12px 16px;border-top:1px solid #2A2A31;font-size:10px;text-transform:uppercase;letter-spacing:0.16em;color:#918A80;">
        eof
      </div>
    </div>
    <p style="text-align:center;margin-top:24px;font-size:10px;color:#918A80;">
      You're receiving this because you subscribed at ${siteUrl}
    </p>
  </div>
</body>
</html>`

    const emails = contacts.data.map((c) => c.email).filter(Boolean)
    const batchSize = 50
    let sent = 0

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      await resend.batch.send(
        batch.map((email) => ({
          from: process.env.RESEND_FROM_EMAIL || `${siteConfig.name} <noreply@${new URL(siteConfig.siteUrl).hostname}>`,
          to: email,
          subject: `New Post: ${safeTitle}`,
          html,
        }))
      )
      sent += batch.length
    }

    return NextResponse.json({ message: `Notified ${sent} subscribers` })
  } catch (error) {
    console.error("Notify error:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
