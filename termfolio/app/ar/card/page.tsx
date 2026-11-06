import type { Metadata } from "next"
import { getCard } from "@/lib/card"
import { siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"
import CardClient from "@/components/card-client"

const card = getCard()
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl

export const metadata: Metadata = {
  title: `${siteArabic.name} - البطاقة الرقمية`,
  description: card.bio,
  openGraph: {
    title: `${siteArabic.name} - البطاقة الرقمية`,
    description: card.title,
    url: `${siteUrl}/ar/card`,
    siteName: siteArabic.name,
    type: "profile",
  },
}

export default function ArabicCardPage() {
  return <CardClient card={card} siteUrl={siteUrl} locale="ar" />
}
