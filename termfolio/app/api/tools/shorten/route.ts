import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: string } | null
  const rawUrl = body?.url?.trim()

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 })
  }

  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return NextResponse.json({ error: "Only HTTP and HTTPS URLs are supported" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url.toString())}`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Shortener failed" }, { status: 502 })
    }

    const shortUrl = (await response.text()).trim()
    if (!/^https?:\/\//i.test(shortUrl)) {
      return NextResponse.json({ error: "Unexpected shortener response" }, { status: 502 })
    }

    return NextResponse.json({ shortUrl })
  } catch {
    return NextResponse.json({ error: "Shortener unavailable" }, { status: 502 })
  }
}
