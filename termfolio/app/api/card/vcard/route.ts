import { NextResponse } from "next/server"
import { getCard } from "@/lib/card"
import { generateVCard } from "@/lib/vcard"

export async function GET() {
  const card = getCard()
  const vcf = generateVCard(card)

  const filename = card.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return new NextResponse(vcf, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.vcf"`,
      "Cache-Control": "no-store",
    },
  })
}
