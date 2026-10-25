import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import TableOfContents from "@/components/table-of-contents"
import MarkdownRender from "@/components/markdown-render"
import TerminalCommentSection from "@/components/terminal-comment-section"
import BlogPostCard from "@/components/blog-post-card"
import ReadingControls from "@/components/reading-controls"
import NewsletterSignup from "@/components/newsletter-signup"
import PostEngagement from "@/components/post-engagement"
import ArticleDigest from "@/components/article-digest"
import { formatPostDate } from "@/lib/format-post-date"
import { getPostBySlug, getAllPosts } from "@/lib/posts"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "الملاحظة غير موجودة" }

  return {
    title: `${post.title} - ${siteArabic.name}`,
    description: post.excerpt || `اقرأ ${post.title} في دفتر ${siteArabic.name}.`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      url: `${siteConfig.siteUrl}/ar/blog/${post.slug}`,
      siteName: siteArabic.name,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function ArabicBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllPosts()
  const relatedPosts = allPosts.filter((candidate) => candidate.id !== post.id && candidate.tags.some((tag: string) => post.tags.includes(tag))).slice(0, 2)
  const copy = localeCopy.ar
  const postIsArabic = post.language === "ar"

  return (
    <div className="min-h-screen bg-[var(--term-black)] text-[var(--term-white)] font-mono flex flex-col">
      <MinimalNav locale="ar" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
          <Link href={getLocalePath("/blog", "ar")} className="mb-8 inline-flex items-center gap-2 text-[var(--term-gray)] transition-colors hover:text-[var(--term-cyan)]">
            ← {copy.post.back}
          </Link>

          <article className="cli-frame overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-[var(--term-line)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--term-gray)]">
              <span dir="ltr">{post.slug}.md</span>
              <span>{copy.post.entryType}</span>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-8 px-3 py-5 sm:px-5 lg:grid-cols-[minmax(0,1fr)_240px] lg:p-6">
              <div className="space-y-8 min-w-0">
                <header className="space-y-5 border-b border-[var(--term-line)] pb-6">
                  {post.coverImage && (
                    <div className="rounded-xl overflow-hidden border border-[var(--term-line)]">
                      <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} width={1200} height={680} className="h-auto w-full object-cover" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span key={`${tag}-${index}`} className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[var(--term-line)] text-[var(--term-cyan)]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1
                    className={`text-3xl font-bold tracking-tight text-[var(--term-white)] md:text-4xl leading-tight${postIsArabic ? " font-arabic text-right" : ""}`}
                    dir={postIsArabic ? "rtl" : "ltr"}
                    lang={postIsArabic ? "ar" : "en"}
                  >
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-xs text-[var(--term-gray)]">
                    <span>{formatPostDate(post.date, "ar")}</span>
                    <span>{post.author}</span>
                    <span>{post.readingTime} د قراءة</span>
                  </div>

                  {post.excerpt && <p className="text-sm leading-7 text-[var(--term-gray)] max-w-3xl" dir={postIsArabic ? "rtl" : "ltr"}>{post.excerpt}</p>}
                </header>

                <ArticleDigest post={post} locale="ar" />

                <div className="border-y-[3px] border-double border-[var(--term-line)] py-1.5 my-8 text-center text-[10px] uppercase tracking-[0.3em] text-[var(--term-gray)]">
                  {copy.post.begin}
                </div>

                <div
                  className={`post-content max-w-[65ch] mx-auto text-base overflow-x-hidden${postIsArabic ? " font-arabic" : ""}`}
                  dir={postIsArabic ? "rtl" : "ltr"}
                  lang={postIsArabic ? "ar" : "en"}
                >
                  <MarkdownRender content={post.content} />
                </div>

                <div className="mt-16 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--term-line)] pt-8 text-xs uppercase tracking-[0.14em] text-[var(--term-gray)] max-w-[65ch] mx-auto">
                  <span className="ml-2">{copy.post.tags}</span>
                  {post.tags.map((tag: string, index: number) => (
                    <span key={`${tag}-${index}`} className="border border-[var(--term-line)] px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border-y-[3px] border-double border-[var(--term-line)] py-1.5 my-8 text-center text-[10px] uppercase tracking-[0.3em] text-[var(--term-gray)]">
                  {copy.post.eof}
                </div>

                <div className="max-w-[65ch] mx-auto">
                  <PostEngagement slug={post.slug} locale="ar" />
                </div>
              </div>

              <aside className="order-first lg:order-none">
                <div className="lg:sticky lg:top-24 space-y-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                  <ReadingControls headings={post.headings} wordCount={post.content.split(/\s+/).filter(Boolean).length} locale="ar" />
                  <div className="hidden lg:block">
                    <TableOfContents headings={post.headings} locale="ar" />
                  </div>
                </div>
              </aside>
            </div>
          </article>

          <section className="mt-10 space-y-5">
            <div className="text-sm text-[var(--term-gray)]" dir="ltr">
              <span className="text-[var(--term-green)]">$</span> <span className="text-[var(--term-cyan)]">node</span> comments.js
            </div>
            <TerminalCommentSection locale="ar" />
          </section>

          {relatedPosts.length > 0 && (
            <section className="mt-10 space-y-5">
              <div className="text-sm text-[var(--term-gray)]" dir="ltr">
                <span className="text-[var(--term-green)]">$</span> <span className="text-[var(--term-cyan)]">find</span> ./related-posts
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} locale="ar" />
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 max-w-2xl mx-auto">
            <div className="cli-frame rounded-xl overflow-hidden border border-[var(--term-line)]">
              <div className="flex items-center justify-between border-b border-[var(--term-line)] px-4 py-3 text-xs uppercase tracking-[0.14em] text-[var(--term-gray)]">
                <span dir="ltr"><span className="text-[var(--term-green)]">$</span> subscribe --no-spam --pinky-promise</span>
                <span>{copy.post.newsletterMeta}</span>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-[var(--term-white)] leading-relaxed">
                  {copy.post.newsletterLead}
                </p>
                <p className="text-xs text-[var(--term-gray)] leading-relaxed">
                  {copy.post.newsletterCopy}
                </p>
                <NewsletterSignup locale="ar" />
                <p className="text-[10px] text-[var(--term-gray)] text-center tracking-wide">
                  {copy.post.newsletterFooter}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
