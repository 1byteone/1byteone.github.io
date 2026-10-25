import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google"
import localFont from "next/font/local"

export const uiMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ui-mono",
  weight: ["400", "500", "600", "700"],
})

export const readingSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-reading-serif",
  weight: ["400", "600", "700"],
})

export const arabicSans = localFont({
  src: [
    { path: "../public/fonts/thmanyah/thmanyahsans-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/thmanyah/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/thmanyah/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/thmanyah/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic-sans",
  display: "swap",
})

export const readingArabic = localFont({
  src: [
    { path: "../public/fonts/thmanyah/thmanyahseriftext-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/thmanyah/thmanyahseriftext-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/thmanyah/thmanyahseriftext-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-reading-arabic",
  display: "swap",
})
