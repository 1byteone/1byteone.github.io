import type { Metadata } from "next"
import Link from "next/link"
import MinimalNav from "@/components/minimal-nav"
import SearchPosts from "@/components/search-posts"
import TerminalFooter from "@/components/terminal-footer"
import { getAllPosts } from "@/lib/posts"
import JournalClient from "@/components/journal-client"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `Journal — ${siteConfig.name}`,
  description: `${siteConfig.name}'s journal on strategy, technology, and digital transformation.`,
  openGraph: {
    title: `Journal — ${siteConfig.name}`,
    description: `${siteConfig.name}'s journal on strategy, technology, and digital transformation.`,
    url: `${siteConfig.siteUrl}/blog`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Journal — ${siteConfig.name}`,
    description: `${siteConfig.name}'s journal on strategy, technology, and digital transformation.`,
  },
}

interface BlogPageProps {
  searchParams?: Promise<{ q?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const query = resolvedSearchParams?.q?.trim().toLowerCase() ?? ""
  const allPosts = await getAllPosts()

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
            ← back to home
          </Link>

          {/* Header */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--term-white)]">
              Journal
            </h1>
            <p className="text-lg leading-relaxed text-[var(--term-gray)] max-w-2xl">
              Thoughts on strategy, technology, digital transformation, and the craft of making complicated things feel clear.
            </p>
            <SearchPosts locale="en" />
          </div>

          {/* Client-side interactive section */}
          <div className="space-y-6">
            <JournalClient posts={posts} locale="en" />
          </div>
        </div>
      </main>

      <TerminalFooter />
    </div>
  )
}
