import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import LabBench from "@/components/lab-bench"
import UtilityDock from "@/components/utility-dock"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import { localeCopy } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `实验室 — ${siteConfig.name}`,
  description: "杨劲松公开的小型实验与实用工具，无需登录即可体验。",
  openGraph: {
    title: `实验室 — ${siteConfig.name}`,
    description: "杨劲松公开的小型实验与实用工具，无需登录即可体验。",
    url: `${siteConfig.siteUrl}/lab`,
    siteName: siteConfig.name,
    type: "website",
  },
}

export default function LabPage() {
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
              <span dir="ltr">lab.md</span>
              <span>{copy.lab.disclaimer}</span>
            </div>

            <div className="space-y-10 p-5 md:p-6">
              <LabBench showViewAll={false} />
              <div className="cli-rule" />
              <UtilityDock />
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter />
    </div>
  )
}
