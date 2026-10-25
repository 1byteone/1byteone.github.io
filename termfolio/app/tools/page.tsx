import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import UtilityDock from "@/components/utility-dock"
import { localeCopy } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `Tools — ${siteConfig.name}`,
  description: localeCopy.en.tools.indexDescription,
  openGraph: {
    title: `Tools — ${siteConfig.name}`,
    description: localeCopy.en.tools.indexDescription,
    url: `${siteConfig.siteUrl}/tools`,
    siteName: siteConfig.name,
    type: "website",
  },
}

export default function ToolsPage() {
  const copy = localeCopy.en

  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono flex flex-col">
      <MinimalNav />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-term-gray transition-colors hover:text-term-cyan">
            <ArrowLeft className="h-4 w-4" />
            {copy.backHome}
          </Link>

          <section className="cli-frame overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">
              <span dir="ltr">tools.md</span>
              <span>no login · no database</span>
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
              <UtilityDock />
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter />
    </div>
  )
}
