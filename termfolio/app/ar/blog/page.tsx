import type { Metadata } from "next"
import Link from "next/link"
import MinimalNav from "@/components/minimal-nav"
import SearchPosts from "@/components/search-posts"
import TerminalFooter from "@/components/terminal-footer"
import { getAllPosts } from "@/lib/posts"
import JournalClient from "@/components/journal-client"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `الدفتر - ${siteArabic.name}`,
  description: localeCopy.ar.blog.description,
  openGraph: {
    title: `الدفتر - ${siteArabic.name}`,
    description: localeCopy.ar.blog.description,
    url: `${siteConfig.siteUrl}/ar/blog`,
    siteName: siteArabic.name,
    type: "website",
  },
}

interface BlogPageProps {
  searchParams?: Promise<{ q?: string }>
}

export default async function ArabicBlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const query = resolvedSearchParams?.q?.trim().toLowerCase() ?? ""
  const allPosts = await getAllPosts()
  const copy = localeCopy.ar

  const posts = query
    ? allPosts.filter((post) => {
        const haystack = [post.title, post.excerpt, post.author, ...post.tags].join(" ").toLowerCase()
        return haystack.includes(query)
      })
    : allPosts

  return (
    <div className="min-h-screen bg-[var(--term-black)] text-[var(--term-white)] font-mono flex flex-col">
      <MinimalNav locale="ar" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href={getLocalePath("/", "ar")} className="mb-8 inline-flex items-center gap-2 text-[var(--term-gray)] transition-colors hover:text-[var(--term-cyan)]">
            ← {copy.backHome}
          </Link>

          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--term-white)]">
              {copy.blog.title}
            </h1>
            <p className="text-lg leading-relaxed text-[var(--term-gray)] max-w-2xl">
              {copy.blog.description}
            </p>
            <SearchPosts locale="ar" />
          </div>

          <div className="space-y-6">
            <JournalClient posts={posts} locale="ar" />
          </div>
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
