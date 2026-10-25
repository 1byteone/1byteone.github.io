"use client"

import { useState } from "react"
import KnowledgeGraph from "@/components/knowledge-graph"
import WritingHeatmap from "@/components/writing-heatmap"
import Link from "next/link"
import { formatPostDate } from "@/lib/format-post-date"
import { getLocalePath, localeCopy, type Locale } from "@/content/locale"

interface Post {
  id: string
  title: string
  slug: string
  date: string
  author: string
  excerpt: string
  tags: string[]
  readingTime: number
  coverImage?: string
}

export default function JournalClient({ posts, locale = "en" }: { posts: Post[]; locale?: Locale }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const copy = localeCopy[locale]

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts

  const featured = filteredPosts[0]
  const rest = filteredPosts.slice(1)

  // Get unique tags with counts
  const tagCounts = new Map<string, number>()
  posts.forEach((p) => p.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1)))
  const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1])

  return (
    <div className={`grid gap-6 ${sidebarOpen ? "lg:grid-cols-[minmax(0,1fr)_280px]" : ""}`}>
      {/* ── Main Content ────────────────────────────── */}
      <div className="space-y-6 min-w-0">
        {/* ── Tag Filter Chips ──────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              !activeTag
                ? "bg-[var(--term-cyan)] text-[var(--term-black)] shadow-lg"
                : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
            }`}
          >
            {copy.blog.allPosts}
          </button>
          {sortedTags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeTag === tag
                  ? "bg-[var(--term-cyan)] text-[var(--term-black)] shadow-lg"
                  : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
              }`}
            >
              {tag} <span className="opacity-60 ml-0.5">({count})</span>
            </button>
          ))}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-cyan)] transition-all"
          >
            {sidebarOpen ? `⊟ ${copy.blog.hideInsights}` : `⊞ ${copy.blog.showInsights}`}
          </button>
        </div>

        {/* ── Featured Hero Post ────────────────────── */}
        {featured && (
          <Link
            href={getLocalePath(`/blog/${featured.slug}`, locale)}
            className="group block rounded-2xl overflow-hidden border border-[var(--term-line)] hover:border-[var(--term-cyan)] transition-all duration-500"
          >
            <div className="grid md:grid-cols-[1.2fr_1fr]">
              {/* Image side */}
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-[var(--term-black)] relative">
                {featured.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--term-darker)] to-[var(--term-black)]">
                    <div className="text-[var(--term-gray)] opacity-20 text-6xl font-bold select-none">
                      {featured.title.charAt(0)}
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[var(--term-cyan)] text-[var(--term-black)] px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">
                  {copy.blog.featured}
                </div>
              </div>

              {/* Content side */}
              <div className="p-6 md:p-8 flex flex-col justify-center bg-[var(--term-darker)]">
                <div className="flex flex-wrap gap-2 mb-3">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-[var(--term-line)] text-[var(--term-cyan)]">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--term-white)] group-hover:text-[var(--term-cyan)] transition-colors leading-snug mb-3">
                  {featured.title}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--term-gray)] line-clamp-3 mb-4">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.12em] text-[var(--term-gray)] mt-auto">
                  <span>{formatPostDate(featured.date, locale)}</span>
                  <span>·</span>
                  <span>{featured.readingTime} min read</span>
                  <span className="ml-auto text-[var(--term-cyan)] group-hover:translate-x-1 transition-transform">
                    {copy.blog.read} →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Blog Post Grid ────────────────────────── */}
        {rest.length === 0 && filteredPosts.length <= 1 ? null : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <Link
                key={post.id}
                href={getLocalePath(`/blog/${post.slug}`, locale)}
                className="group block rounded-xl overflow-hidden border border-[var(--term-line)] hover:border-[var(--term-cyan)] bg-[var(--term-darker)] hover:shadow-xl hover:shadow-[var(--term-cyan)]/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Cover image */}
                <div className="aspect-[16/9] overflow-hidden bg-[var(--term-black)] relative">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--term-darker)] to-[var(--term-black)]">
                      <div className="text-[var(--term-gray)] opacity-10 text-4xl font-bold select-none">
                        {post.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-[var(--term-black)]/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-[var(--term-gray)]">
                    {post.readingTime} min
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[var(--term-line)] text-[var(--term-cyan)]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-sm font-semibold text-[var(--term-white)] group-hover:text-[var(--term-cyan)] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs leading-relaxed text-[var(--term-gray)] line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--term-gray)]">
                    <span>{formatPostDate(post.date, locale)}</span>
                    <span className="text-[var(--term-cyan)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 rounded-xl border border-[var(--term-line)]">
            <p className="text-[var(--term-gray)] text-sm">{copy.blog.noPosts}</p>
            <button onClick={() => setActiveTag(null)} className="mt-3 text-xs text-[var(--term-cyan)] hover:underline">
              {copy.blog.clearFilter}
            </button>
          </div>
        )}
      </div>

      {/* ── Collapsible Sidebar ─────────────────────── */}
      {sidebarOpen && (
        <aside className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <KnowledgeGraph posts={posts} onTagClick={(tag) => { setActiveTag(tag) }} />
          <div className="hidden md:block">
            <WritingHeatmap posts={posts} />
          </div>
          <div className="md:hidden border border-term-line bg-term-darker p-3">
            <div className="text-xs uppercase tracking-[0.14em] text-term-gray mb-1">writing activity</div>
            <div className="text-sm text-term-white">{posts.length} post{posts.length !== 1 ? "s" : ""} published</div>
          </div>
        </aside>
      )}
    </div>
  )
}
