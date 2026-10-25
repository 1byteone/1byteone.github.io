import type React from "react"
import type { Metadata } from "next"
import { siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: siteArabic.name,
  description: siteArabic.description,
  alternates: {
    canonical: `${siteConfig.siteUrl}/ar`,
    languages: {
      en: siteConfig.siteUrl,
      ar: `${siteConfig.siteUrl}/ar`,
    },
  },
}

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className="font-arabic-site">
      {children}
    </div>
  )
}
