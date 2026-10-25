import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import EverydayToolClient from "@/components/everyday-tool-client"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import { getUtilityTool, utilityTools } from "@/content/lab"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

const routedTools = utilityTools.filter((tool) => tool.slug !== "splitter")

export function generateStaticParams() {
  return routedTools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = getUtilityTool(slug)
  if (!tool || tool.slug === "splitter") return { title: "الأداة غير موجودة" }

  return {
    title: `${tool.title.ar} - ${siteArabic.name}`,
    description: tool.summary.ar,
    openGraph: {
      title: `${tool.title.ar} - ${siteArabic.name}`,
      description: tool.summary.ar,
      url: `${siteConfig.siteUrl}/ar${tool.href}`,
      siteName: siteArabic.name,
      type: "website",
    },
  }
}

export default async function ArabicToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getUtilityTool(slug)
  if (!tool || tool.slug === "splitter") notFound()
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
            <div className="cli-topline" dir="ltr">$ {tool.command}</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-term-white md:text-5xl">
              {tool.title.ar}
            </h1>
            <p className="mt-4 text-lg leading-8 text-term-gray">
              {tool.summary.ar}
            </p>
            <p className="mt-3 text-xs leading-6 text-term-gray">
              بلا تسجيل. بلا قاعدة بيانات. الملفات تبقى في المتصفح، باستثناء أداة الرابط القصير التي تطلب رابطًا من TinyURL.
            </p>
          </header>

          <EverydayToolClient slug={tool.slug} locale="ar" />
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
