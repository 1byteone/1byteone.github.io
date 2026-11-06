import type { Metadata } from "next"
import Link from "next/link"
import MinimalNav from "@/components/minimal-nav"
import SearchPosts from "@/components/search-posts"
import TerminalFooter from "@/components/terminal-footer"
import { getAllPosts } from "@/lib/posts"
import JournalClient from "@/components/journal-client"
import BitmapIllustrations from "@/components/bitmap-illustrations"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `技术文章 — ${siteConfig.name}`,
  description: `${siteConfig.name} 关于工程实践、AI 应用与后端系统的技术文章。`,
  openGraph: {
    title: `技术文章 — ${siteConfig.name}`,
    description: `${siteConfig.name} 关于工程实践、AI 应用与后端系统的技术文章。`,
    url: `${siteConfig.siteUrl}/blog`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `技术文章 — ${siteConfig.name}`,
    description: `${siteConfig.name} 关于工程实践、AI 应用与后端系统的技术文章。`,
  },
}

interface BlogPageProps {
  searchParams?: Promise<{ q?: string; lang?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const query = resolvedSearchParams?.q?.trim().toLowerCase() ?? ""
  const language = resolvedSearchParams?.lang === "en" ? "en" : "zh"
  const allPosts = await getAllPosts(language)

  const posts = query
    ? allPosts.filter((post) => {
        const haystack = [post.title, post.excerpt, post.author, ...post.tags].join(" ").toLowerCase()
        return haystack.includes(query)
      })
    : allPosts

  return (
    <div className="min-h-screen bg-[var(--term-black)] text-[var(--term-white)] font-mono flex flex-col">
      <MinimalNav />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-[var(--term-gray)] transition-colors hover:text-[var(--term-cyan)]">
            ← 返回首页
          </Link>

          {/* Header */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--term-white)]">
              技术文章
            </h1>
            <p className="text-lg leading-relaxed text-[var(--term-gray)] max-w-2xl">
              记录 AI 应用、后端工程与技术实践，让复杂系统变得清晰可验证。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <SearchPosts locale="en" />
              <Link
                href={language === "zh" ? "/blog?lang=en" : "/blog"}
                className="rounded border border-[var(--term-line)] px-3 py-2 text-xs text-[var(--term-gray)] transition-colors hover:border-[var(--term-cyan)] hover:text-[var(--term-cyan)]"
              >
                {language === "zh" ? "English" : "中文"}
              </Link>
            </div>
          </div>

          {/* Client-side interactive section */}
          <div className="space-y-6">
            <JournalClient posts={posts} locale="en" />
          </div>

          <div className="mt-14 border-t border-[var(--term-line)] pt-8">
            <BitmapIllustrations />
          </div>
        </div>
      </main>

      <TerminalFooter />
    </div>
  )
}
