import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import AnimateOnScroll from "@/components/animate-on-scroll"
import { getLocalePath, localeCopy, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `نبذة - ${siteArabic.name}`,
  description: siteArabic.description,
  openGraph: {
    title: `نبذة - ${siteArabic.name}`,
    description: siteArabic.title,
    url: `${siteConfig.siteUrl}/ar/about`,
    siteName: siteArabic.name,
    type: "profile",
  },
}

const arabicCredentials = [
  {
    name: "ماجستير إدارة الأعمال MBA (قيد الدراسة)",
    desc: "Gies College of Business، مايو 2025 - يناير 2028",
    image: "/University-Wordmark-Full-Color-RGB-1.png",
    icon: "MBA",
  },
  {
    name: "بكالوريوس هندسة ميكانيكية",
    desc: "جامعة جدة",
    image: "/جامعة_جدة.png",
    icon: "BE",
  },
  {
    name: "العربية والإنجليزية",
    desc: "طلاقة في اللغتين",
    icon: "AR/EN",
  },
]

export default function ArabicAboutPage() {
  const copy = localeCopy.ar

  return (
    <div className="min-h-screen bg-[var(--term-black)] text-[var(--term-white)] font-mono flex flex-col">
      <MinimalNav locale="ar" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href={getLocalePath("/", "ar")} className="mb-8 inline-flex items-center gap-2 text-[var(--term-gray)] transition-colors hover:text-[var(--term-cyan)]">
            ← {copy.backHome}
          </Link>

          <div className="mb-8">
            <pre className="text-[var(--term-cyan)] text-[clamp(0.35rem,1vw,0.65rem)] leading-[1.15] whitespace-pre overflow-x-auto select-none" dir="ltr">
              {siteConfig.asciiArt.about.join("\n")}
            </pre>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--term-gray)] mt-2">
              {siteArabic.title}
            </div>
          </div>

          <section className="rounded-xl overflow-hidden border border-[var(--term-line)]">
            <div className="flex items-center justify-between border-b border-[var(--term-line)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--term-gray)]">
              <span dir="ltr">resume.md</span>
              <span>ملف مهني</span>
            </div>

            <div className="grid gap-8 p-5 md:grid-cols-[280px_minmax(0,1fr)] md:p-6">
              <aside className="space-y-6">
                <div className="overflow-hidden rounded-xl border border-[var(--term-line)] bg-[var(--term-darker)]">
                  <div className="relative aspect-[4/4.8]">
                    <Image src={siteConfig.avatar} alt={siteArabic.name} fill priority className="object-cover" />
                  </div>
                </div>

                <div className="space-y-3 text-sm leading-7 text-[var(--term-gray)]">
                  {[
                    ["الاسم", siteArabic.name],
                    ["الموقع", siteArabic.location],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">{label}</div>
                      <div className="text-[var(--term-white)]">{value}</div>
                    </div>
                  ))}
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">التواصل</div>
                    <a href={`mailto:${siteConfig.email}`} className="text-[var(--term-cyan)] hover:underline" dir="ltr">
                      {siteConfig.email}
                    </a>
                    {siteConfig.phone && (
                      <a href={`tel:${siteConfig.phone}`} className="mt-1 block text-[var(--term-cyan)] hover:underline" dir="ltr">
                        {siteConfig.phone}
                      </a>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-1">الروابط</div>
                    <div className="mt-1 space-y-1">
                      {Object.values(siteConfig.socials).map((social) => (
                        <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--term-cyan)] hover:underline" dir="ltr">
                          <span className="font-bold">{social.icon}</span> {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <a href="/cv.pdf" download="waleed-h-alghamdi-cv.pdf" className="flex items-center gap-3 rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-3 hover:border-[var(--term-cyan)] hover:bg-[var(--term-cyan)]/5 transition-all group">
                  <div className="text-sm text-[var(--term-gray)] group-hover:text-[var(--term-cyan)] transition-colors" dir="ltr">
                    <span className="text-[var(--term-green)]">$</span> download --resume
                  </div>
                  <span className="mr-auto text-[var(--term-cyan)] text-xs">PDF ↓</span>
                </a>
              </aside>

              <div className="space-y-8">
                <div>
                  <div className="text-sm text-[var(--term-gray)]" dir="ltr">
                    <span className="text-[var(--term-green)]">$</span> <span className="text-[var(--term-cyan)]">cat</span> about.txt
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--term-white)] md:text-4xl">
                    {siteArabic.headline}
                  </h1>
                  <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--term-gray)] max-w-3xl">
                    {siteArabic.bio.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {siteArabic.stats.map((stat, index) => (
                    <AnimateOnScroll key={stat.label} delay={index * 80}>
                      <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-4">
                        <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">{stat.label}</div>
                        <div className="mt-2 text-lg text-[var(--term-white)] font-bold">{stat.value}</div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>

                <AnimateOnScroll>
                  <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-5 whitespace-pre-wrap font-mono text-sm leading-[1.8] text-[var(--term-gray)]">
                    <div className="text-[var(--term-white)] mb-4" dir="ltr">
                      <span className="text-[var(--term-green)]">$</span> tree ./experience
                    </div>
                    <div className="space-y-5">
                      {siteArabic.experience.map((item) => (
                        <div key={`${item.period}-${item.role}`} className="border-t border-[var(--term-line)] pt-5 first:border-t-0 first:pt-0">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <div className="font-arabic-site text-base font-bold text-[var(--term-white)]">{item.role}</div>
                            <div className="font-arabic-site text-xs text-[var(--term-gray)]">{item.period}</div>
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-wider text-[var(--term-cyan)]" dir="auto">{item.company}</div>
                          <p className="mt-3 whitespace-normal font-arabic-site text-sm leading-7 text-[var(--term-gray)]">{item.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                  <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-5 whitespace-pre-wrap font-mono text-sm leading-[1.8] text-[var(--term-gray)]">
                    <div className="text-[var(--term-white)] mb-4" dir="ltr">
                      <span className="text-[var(--term-green)]">$</span> tree ./advisory-engagements
                    </div>
                    <div className="space-y-5">
                      {siteArabic.engagements.map((item) => (
                        <div key={`${item.period}-${item.role}`} className="border-t border-[var(--term-line)] pt-5 first:border-t-0 first:pt-0">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <div className="font-arabic-site text-base font-bold text-[var(--term-white)]">{item.role}</div>
                            <div className="font-arabic-site text-xs text-[var(--term-gray)]">{item.period}</div>
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-wider text-[var(--term-cyan)]" dir="auto">{item.company}</div>
                          <p className="mt-3 whitespace-normal font-arabic-site text-sm leading-7 text-[var(--term-gray)]">{item.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-3">إنجازات الهاكاثون</div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {siteArabic.hackathons.map((item) => (
                        <div key={item.name} className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] p-4">
                          <div className="text-[10px] uppercase tracking-widest text-[var(--term-amber)]">{item.place}</div>
                          <div className="mt-2 text-sm font-bold text-[var(--term-white)]">{item.name}</div>
                          <p className="mt-2 text-xs leading-7 text-[var(--term-gray)]">{item.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                  <div className="rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-4 py-4">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-3">المهارات</div>
                    <div className="flex flex-wrap gap-2">
                      {siteArabic.skills.map((skill) => (
                        <span key={skill} className="border border-[var(--term-line)] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[var(--term-gray)] rounded-full hover:border-[var(--term-cyan)] hover:text-[var(--term-cyan)] transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-3">الشهادات</div>
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
                              <span className="px-3 text-lg font-bold text-[var(--term-cyan)]" dir="ltr">
                                {"mark" in badge ? badge.mark : ""}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-[10px] font-bold text-[var(--term-white)] group-hover:text-[var(--term-cyan)] transition-colors" dir="ltr">{badge.name}</div>
                          <div className="mt-1 text-[9px] leading-4 text-[var(--term-gray)]">{badge.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {arabicCredentials.map((cred) => (
                      <div key={cred.name} className="flex items-center gap-2 rounded-lg border border-[var(--term-line)] bg-[var(--term-darker)] px-3 py-2 hover:border-[var(--term-cyan)] transition-colors group">
                        {"image" in cred && cred.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={cred.image} alt={cred.desc} className="h-6 w-auto flex-shrink-0 object-contain" />
                        ) : (
                          <span className="min-w-6 text-xs font-bold text-[var(--term-cyan)] flex-shrink-0" dir="ltr">{cred.icon}</span>
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

      <TerminalFooter locale="ar" />
    </div>
  )
}
