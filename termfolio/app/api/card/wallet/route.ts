import { NextResponse } from "next/server"
import { getCard } from "@/lib/card"
import { siteConfig } from "@/content/site"

export async function GET() {
  const apiKey = process.env.WALLETWALLET_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "WALLETWALLET_API_KEY not configured" },
      { status: 503 }
    )
  }

  const card = getCard()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl
  const cardUrl = `${siteUrl}/card`

  const passPayload = {
    cardTitle: card.name,
    headerTitle: card.title,
    secondaryLeft: card.company,
    secondaryRight: card.location,
    auxiliaryLeft: card.contacts.find((c) => c.type === "email")?.value ?? "",
    barcodeValue: cardUrl,
    barcodeLabel: "Scan to view contact card",
  }

  try {
    const res = await fetch("https://api.walletwallet.dev/api/pkpass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(passPayload),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: "WalletWallet API error", detail: text },
        { status: res.status }
      )
    }

    const passBuffer = await res.arrayBuffer()

    const filename = card.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    return new NextResponse(passBuffer, {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="${filename}.pkpass"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to generate wallet pass", detail: message },
      { status: 500 }
    )
  }
}
