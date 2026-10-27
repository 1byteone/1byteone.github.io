import type { Metadata } from "next"
import { getCard } from "@/lib/card"
import { siteConfig } from "@/content/site"
import CardClient from "@/components/card-client"

const card = getCard()
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl

export const metadata: Metadata = {
  title: `${card.name} — 数字名片`,
  description: `${card.title} at ${card.company}. ${card.bio}`,
  openGraph: {
    title: `${card.name} — 数字名片`,
    description: `${card.title} at ${card.company}`,
    url: `${siteUrl}/card`,
    siteName: siteConfig.name,
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: `${card.name} — 数字名片`,
    description: `${card.title} at ${card.company}`,
  },
}

export default function CardPage() {
  return <CardClient card={card} siteUrl={siteUrl} />
}
