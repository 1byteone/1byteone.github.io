import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import AnimateOnScroll from "@/components/animate-on-scroll"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `关于我 — ${siteConfig.name}`,
  description: siteConfig.description,
  openGraph: {
    title: `关于我 — ${siteConfig.name}`,
    description: siteConfig.title,
    url: `${siteConfig.siteUrl}/about`,
    siteName: siteConfig.name,
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: `关于我 — ${siteConfig.name}`,
    description: siteConfig.title,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--term-black)] text-[var(--term-white)] font-mono flex flex-col">
      <MinimalNav />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-[var(--term-gray)] transition-colors hover:text-[var(--term-cyan)]">
            ← 返回首页
          </Link>

          {/* ASCII Name Header */}
          <div className="mb-8">
            <pre className="text-[var(--term-cyan)] text-[clamp(0.35rem,1vw,0.65rem)] leading-[1.15] whitespace-pre overflow-x-auto select-none">
              {siteConfig.asciiArt.about.join("\n")}
            </pre>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--term-gray)] mt-2">
              {siteConfig.title.toLowerCase()}
            </div>
          </div>

          <section className="rounded-xl overflow-hidden border border-[var(--term-line)]">
            <div className="flex items-center justify-between border-b border-[var(--term-line)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--term-gray)]">
              <span>about.md</span>
              <span>工程档案</span>
            </div>

            <div className="grid gap-8 p-5 md:grid-cols-[280px_minmax(0,1fr)] md:p-6">
              <aside className="space-y-6">
                <div className="overflow-hidden rounded-xl border border-[var(--term-line)] bg-[var(--term-darker)]">
                  <div className="relative aspect-[4/4.8]">
                    <Image src={siteConfig.avatar} alt={siteConfig.professionalName} fill priority className="object-cover" />
                  </div>
                </div>

                <div className="space-y-3 text-sm leading-7 text-[var(--term-gray)]">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">姓名</div>
                    <div className="text-[var(--term-white)]">{siteConfig.professionalName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">位置</div>
                    <div className="text-[var(--term-white)]">{siteConfig.location}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">联系</div>
                    <a href={`mailto:${siteConfig.email}`} className="text-[var(--term-cyan)] hover:underline">
                      {siteConfig.email}
                    </a>
                    {siteConfig.phone && (
                      <a href={`tel:${siteConfig.phone}`} className="mt-1 block text-[var(--term-cyan)] hover:underline">
                        {siteConfig.phone}
                      </a>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">链接</div>
                    <div className="mt-1 space-y-1">
                      {Object.values(siteConfig.socials).map((social) => (
                        <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--term-cyan)] hover:underline">
                          <span className="font-bold">{social.icon}</span> {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </aside>

              <div className="space-y-8">
                <div>
                  <div className="text-sm text-[var(--term-gray)]">
                    <span className="text-[var(--term-green)]">$</span> <span className="text-[var(--term-cyan)]">cat</span> about.txt
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--term-white)] md:text-4xl">
                    {siteConfig.headline}
                  </h1>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--term-gray)] max-w-3xl">
                    {siteConfig.bio.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {siteConfig.stats.map((stat, index) => (
                    <AnimateOnScroll key={stat.label} delay={index * 80}>
                    <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-4">
                      <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">{stat.label}</div>
                      <div className="mt-2 text-lg text-[var(--term-white)] font-bold">{stat.value}</div>
                    </div>
                    </AnimateOnScroll>
                  ))}
                </div>

                {/* Experience Timeline */}
                <AnimateOnScroll>
                <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-5 whitespace-pre-wrap font-mono text-sm leading-[1.8] text-[var(--term-gray)]">
                  <div className="text-[var(--term-white)] mb-4">
                    <span className="text-[var(--term-green)]">$</span> tree ./experience
                  </div>
                  <div className="text-[var(--term-white)]">./experience</div>
                  {siteConfig.experience.map((item, idx) => {
                    const isLast = idx === siteConfig.experience.length - 1
                    return (
                      <div key={`${item.period}-${item.role}`}>
                        <div>{isLast ? "└──" : "├──"} <span className="text-[var(--term-gray)]">[{item.period}]</span> <span className="text-[var(--term-cyan)] uppercase tracking-wider text-xs">{item.company}</span></div>
                        <div>{isLast ? "    " : "│   "} └── <span className="text-[var(--term-white)]">{item.role}</span></div>
                        <div>{isLast ? "    " : "│   "}     <span className="text-[var(--term-gray)] whitespace-normal inline-block max-w-2xl align-top text-sm leading-6 mt-1 mb-4">{item.summary}</span></div>
                      </div>
                    )
                  })}
                </div>
                </AnimateOnScroll>

                {/* Independent engagements */}
                <AnimateOnScroll>
                <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-5 whitespace-pre-wrap font-mono text-sm leading-[1.8] text-[var(--term-gray)]">
                  <div className="text-[var(--term-white)] mb-4">
                    <span className="text-[var(--term-green)]">$</span> tree ./engineering-projects
                  </div>
                  <div className="text-[var(--term-white)]">./engineering-projects</div>
                  {siteConfig.engagements.map((item, idx) => {
                    const isLast = idx === siteConfig.engagements.length - 1
                    return (
                      <div key={`${item.period}-${item.role}`}>
                        <div>{isLast ? "└──" : "├──"} <span className="text-[var(--term-gray)]">[{item.period}]</span> <span className="text-[var(--term-cyan)] uppercase tracking-wider text-xs">{item.company}</span></div>
                        <div>{isLast ? "    " : "│   "} └── <span className="text-[var(--term-white)]">{item.role}</span></div>
                        <div>{isLast ? "    " : "│   "}     <span className="text-[var(--term-gray)] whitespace-normal inline-block max-w-2xl align-top text-sm leading-6 mt-1 mb-4">{item.summary}</span></div>
                      </div>
                    )
                  })}
                </div>
                </AnimateOnScroll>

                {/* Hackathons */}
                <AnimateOnScroll>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-3">工程成果</div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {siteConfig.hackathons.map((item) => (
                      <div key={item.name} className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] p-4">
                        <div className="text-[10px] uppercase tracking-widest text-[var(--term-amber)]">{item.place}</div>
                        <div className="mt-2 text-sm font-bold text-[var(--term-white)]">{item.name}</div>
                        <p className="mt-2 text-xs leading-6 text-[var(--term-gray)]">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
                </AnimateOnScroll>

                {/* Skills */}
                <AnimateOnScroll>
                <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-4">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-3">技术能力</div>
                  <div className="flex flex-wrap gap-2">
                    {siteConfig.skills.map((skill) => (
                      <span key={skill} className="border border-[var(--term-line)] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[var(--term-gray)] rounded-full hover:border-[var(--term-cyan)] hover:text-[var(--term-cyan)] transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                </AnimateOnScroll>

                {/* Certification Badges */}
                <AnimateOnScroll>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-3">能力标签</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-2">
                    {siteConfig.certifications.map((badge) => (
                      <div key={badge.name} className="group text-center">
                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-[var(--term-line)] bg-[var(--term-darker)] hover:border-[var(--term-cyan)] transition-all duration-300">
                          {"image" in badge && badge.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={badge.image}
                              alt={badge.name}
                              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <span className="px-3 text-lg font-bold text-[var(--term-cyan)]">
                              {"mark" in badge ? badge.mark : ""}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-[10px] font-bold text-[var(--term-white)] group-hover:text-[var(--term-cyan)] transition-colors">{badge.name}</div>
                        <div className="mt-1 text-[9px] leading-4 text-[var(--term-gray)]">{badge.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                </AnimateOnScroll>

                {/* Additional Credentials */}
                <AnimateOnScroll>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {siteConfig.credentials.map((cred) => (
                    <div key={cred.name} className="flex items-center gap-2 rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-3 py-2 hover:border-[var(--term-cyan)] transition-colors group">
                      {"image" in cred && cred.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cred.image} alt={cred.desc} className="h-6 w-auto flex-shrink-0 object-contain" />
                      ) : (
                        <span className="text-lg flex-shrink-0">{cred.icon}</span>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[var(--term-white)] group-hover:text-[var(--term-cyan)] transition-colors">{cred.name}</div>
                        <div className="text-[10px] text-[var(--term-gray)]">{cred.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                </AnimateOnScroll>
              </div>
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter />
    </div>
  )
}
