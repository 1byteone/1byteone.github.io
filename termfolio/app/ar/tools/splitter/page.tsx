import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MinimalNav from "@/components/minimal-nav"
import SplitterClient from "@/components/splitter-client"
import TerminalFooter from "@/components/terminal-footer"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `مقسّم الفاتورة - ${siteArabic.name}`,
  description: localeCopy.ar.tools.splitter.description,
  openGraph: {
    title: `مقسّم الفاتورة - ${siteArabic.name}`,
    description: localeCopy.ar.tools.splitter.description,
    url: `${siteConfig.siteUrl}/ar/tools/splitter`,
    siteName: siteArabic.name,
    type: "website",
  },
}

export default function ArabicSplitterPage() {
  const copy = localeCopy.ar

  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono flex flex-col">
      <MinimalNav locale="ar" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href={getLocalePath("/tools", "ar")} className="mb-8 inline-flex items-center gap-2 text-term-gray transition-colors hover:text-term-cyan">
            <ArrowLeft className="h-4 w-4" />
            {copy.tools.title}
          </Link>

          <header className="mb-8 max-w-3xl">
            <div className="cli-topline" dir="ltr">$ open ./tools/splitter</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-term-white md:text-5xl">
              {copy.tools.splitter.routeTitle}
            </h1>
            <p className="mt-4 text-lg leading-8 text-term-gray">
              {copy.tools.splitter.routeDescription}
            </p>
          </header>

          <SplitterClient locale="ar" />
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
