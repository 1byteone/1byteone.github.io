import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import StarField from "@/components/star-field"
import { arabicSans, readingSerif, readingArabic, uiMono } from "@/app/fonts"
import { siteConfig } from "@/content/site"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl),
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${uiMono.variable} ${readingSerif.variable} ${arabicSans.variable} ${readingArabic.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <StarField />
          {children}
        </ThemeProvider>

        {/* Analytics components placed outside of ThemeProvider */}
        <Analytics debug={false} />
        <SpeedInsights debug={false} />
      </body>
    </html>
  )
}

