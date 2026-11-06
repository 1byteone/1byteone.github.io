import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import UtilityDock from "@/components/utility-dock"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `الأدوات - ${siteArabic.name}`,
  description: localeCopy.ar.tools.indexDescription,
  openGraph: {
    title: `الأدوات - ${siteArabic.name}`,
    description: localeCopy.ar.tools.indexDescription,
    url: `${siteConfig.siteUrl}/ar/tools`,
    siteName: siteArabic.name,
    type: "website",
  },
}

export default function ArabicToolsPage() {
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
              <span dir="ltr">tools.md</span>
              <span>بلا تسجيل · بلا قاعدة بيانات</span>
            </div>
            <div className="space-y-8 p-5 md:p-6">
              <header className="max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tight text-term-white md:text-5xl">
                  {copy.tools.indexTitle}
                </h1>
                <p className="mt-4 text-lg leading-8 text-term-gray">
                  {copy.tools.indexDescription}
                </p>
              </header>
              <UtilityDock locale="ar" />
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
