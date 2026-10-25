import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import LabBench from "@/components/lab-bench"
import UtilityDock from "@/components/utility-dock"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `المعمل - ${siteArabic.name}`,
  description: localeCopy.ar.lab.description,
  openGraph: {
    title: `المعمل - ${siteArabic.name}`,
    description: localeCopy.ar.lab.description,
    url: `${siteConfig.siteUrl}/ar/lab`,
    siteName: siteArabic.name,
    type: "website",
  },
}

export default function ArabicLabPage() {
  const copy = localeCopy.ar

  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono flex flex-col">
      <MinimalNav locale="ar" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href={getLocalePath("/", "ar")} className="mb-8 inline-flex items-center gap-2 text-term-gray transition-colors hover:text-term-cyan">
            <ArrowLeft className="h-4 w-4" />
            {copy.backHome}
          </Link>

          <section className="cli-frame overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">
              <span dir="ltr">lab.md</span>
              <span>{copy.lab.disclaimer}</span>
            </div>

            <div className="space-y-10 p-5 md:p-6">
              <LabBench locale="ar" showViewAll={false} />
              <div className="cli-rule" />
              <UtilityDock locale="ar" />
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
