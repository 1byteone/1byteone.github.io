import type { Metadata } from "next"
import Link from "next/link"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import LiveClock from "@/components/live-clock"
import { formatPostDate } from "@/lib/format-post-date"
import { getAllPosts } from "@/lib/posts"
import BootTerminal from "@/components/boot-terminal"
import HalftoneImage from "@/components/halftone-image"
import ApodWidget from "@/components/apod-widget"
import AnimateOnScroll from "@/components/animate-on-scroll"
import LabBench from "@/components/lab-bench"
import UtilityDock from "@/components/utility-dock"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `${siteArabic.name} - ${siteArabic.title}`,
  description: siteArabic.description,
  openGraph: {
    title: siteArabic.name,
    description: siteArabic.title,
    url: `${siteConfig.siteUrl}/ar`,
    siteName: siteArabic.name,
    type: "website",
  },
}

export default async function ArabicHome() {
  const posts = (await getAllPosts()).slice(0, 4)
  const copy = localeCopy.ar

  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono flex flex-col">
      <MinimalNav locale="ar" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-6">
        <div className="container mx-auto px-4">
          <section className="cli-frame overflow-hidden rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">
              <div>
                <span className="text-term-green" dir="ltr">{siteConfig.handle}</span> على <LiveClock />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {Object.values(siteConfig.socials).map((social) => (
                  <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-term-cyan flex items-center gap-1" dir="ltr">
                    <span className="text-term-white font-bold">{social.icon}</span> {social.label}
                  </a>
                ))}
                <Link href={getLocalePath("/about", "ar")} className="hover:text-term-cyan">
                  كيف أعمل
                </Link>
              </div>
            </div>

            <div className="space-y-6 p-5 md:p-6">
              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-stretch">
                <div className="min-h-[320px] md:min-h-[420px]">
                  <BootTerminal />
                </div>

                <div className="space-y-4">
                  <div className="border border-term-line bg-term-darker rounded-lg overflow-hidden">
                    <div className="relative aspect-[5/4] border-b border-term-line overflow-hidden">
                      <HalftoneImage src="/engineer-terminal-avatar.png" alt={siteArabic.name} />
                    </div>
                    <div className="p-3 text-xs uppercase tracking-[0.14em] text-term-gray bg-term-black">
                      <span className="text-term-white" dir="ltr">sys.status:</span> {copy.home.status.split(":").slice(1).join(":").trim()}
                    </div>
                  </div>

                  <div className="rounded-lg border border-term-line bg-term-darker p-4">
                    <div className="cli-topline">{copy.home.executiveTitle}</div>
                    <p className="mt-3 text-sm leading-7 text-term-gray">
                      {copy.home.executiveCopy}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      {[
                        ["التركيز", "People Analytics"],
                        ["النمط", "بناء ثم إطلاق"],
                        ["الموقع", siteArabic.location],
                        ["البطاقة", "vCard جاهزة"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-md border border-term-line bg-term-black px-3 py-2">
                          <div className="text-[10px] uppercase tracking-[0.14em] text-term-gray">{label}</div>
                          <div className="mt-1 text-term-white">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <AnimateOnScroll>
                <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-term-line pt-4 text-sm">
                  {copy.home.navLinks.map((item) => (
                    <Link key={item.href} href={getLocalePath(item.href, "ar")} className="text-term-cyan hover:text-term-cyan-bright transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={60}>
                <UtilityDock locale="ar" compact />
              </AnimateOnScroll>

              <AnimateOnScroll delay={80}>
                <ApodWidget />
              </AnimateOnScroll>

              <AnimateOnScroll delay={160}>
                <div className="space-y-4">
                  <div className="cli-topline">{copy.home.recentEntries}</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {posts.map((post, index) => (
                      <Link
                        key={post.id}
                        href={getLocalePath(`/blog/${post.slug}`, "ar")}
                        className="group block rounded-xl overflow-hidden border border-[var(--term-line)] hover:border-[var(--term-cyan)] bg-[var(--term-darker)] hover:shadow-lg hover:shadow-[var(--term-cyan)]/5 transition-all duration-300"
                      >
                        <div className="aspect-[2.2/1] overflow-hidden bg-[var(--term-black)] relative">
                          {post.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--term-darker)] to-[var(--term-black)]">
                              <div className="text-[var(--term-gray)] opacity-10 text-5xl font-bold select-none">
                                {post.title.charAt(0)}
                              </div>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-[var(--term-black)]/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-[var(--term-gray)]">
                            {post.readingTime} {copy.home.readTime}
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 right-2 bg-[var(--term-cyan)]/20 border border-[var(--term-cyan)]/30 px-2 py-0.5 rounded-full text-[10px] text-[var(--term-cyan)]">
                              {copy.home.latest}
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[var(--term-line)] text-[var(--term-cyan)]">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h2 className="text-sm font-semibold text-[var(--term-white)] group-hover:text-[var(--term-cyan)] transition-colors leading-snug">
                            {post.title}
                          </h2>
                          <p className="text-xs leading-relaxed text-[var(--term-gray)] line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--term-gray)]">
                            <span>{formatPostDate(post.date, "ar")}</span>
                            <span className="text-[var(--term-cyan)] opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={220}>
                <LabBench locale="ar" limit={3} />
              </AnimateOnScroll>

              <div className="text-term-gray/30 text-sm leading-[1.8] select-none" dir="ltr">
                {"~\n~\n~".split("\n").map((_, i) => (
                  <div key={i}>~</div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
