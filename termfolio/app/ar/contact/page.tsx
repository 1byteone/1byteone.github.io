import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import CalEmbed from "@/components/cal-embed"
import NewsletterSignup from "@/components/newsletter-signup"
import { getLocalePath, siteArabic } from "@/content/locale"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `تواصل - ${siteArabic.name}`,
  description: `راسل ${siteArabic.name} لحوار واضح حول المنتج، التحول، أو People Analytics.`,
  openGraph: {
    title: `تواصل - ${siteArabic.name}`,
    description: `راسل ${siteArabic.name} لحوار واضح حول المنتج، التحول، أو People Analytics.`,
    url: `${siteConfig.siteUrl}/ar/contact`,
    siteName: siteArabic.name,
    type: "website",
  },
}

export default function ArabicContactPage() {
  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono flex flex-col">
      <MinimalNav locale="ar" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link href={getLocalePath("/", "ar")} className="mb-8 inline-flex items-center gap-2 text-term-gray transition-colors hover:text-term-cyan">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-term-green" dir="ltr">$</span> cd ..
          </Link>

          <section className="cli-frame overflow-hidden">
            <div className="flex items-center justify-between border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">
              <span dir="ltr">contact.txt</span>
              <span>إذا كان الكلام يستاهل</span>
            </div>

            <div className="grid gap-8 p-5 md:grid-cols-[0.9fr_1.1fr] md:p-6">
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-term-gray" dir="ltr">
                    <span className="text-term-green">$</span> <span className="text-term-cyan">ping</span> me
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold text-term-white md:text-4xl">إذا عندك شيء يستحق، تفضل.</h1>
                  <p className="mt-5 cli-soft-copy max-w-xl">
                    للمشاريع الجادة، أسئلة المنتج، التحول، أو People Analytics. أقرأ الرسائل بنفسي، وأفضّل الكلام الواضح: ما المشكلة؟ ما السياق؟ وما القرار الذي نحاول الوصول إليه؟
                  </p>
                </div>

                <div className="overflow-hidden border border-term-line">
                  <div className="grid gap-4 border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray md:grid-cols-[120px_minmax(0,1fr)]">
                    <span>البند</span>
                    <span>التفاصيل</span>
                  </div>
                  <div className="space-y-0 text-sm">
                    {[
                      ["البريد", siteConfig.email],
                      ["المكان", "الرياض، السعودية"],
                      ["المناسب", "منتج، ذكاء اصطناعي، People Analytics، أو تحول يحتاج تفكيرًا وتنفيذًا"],
                    ].map(([label, value]) => (
                      <div key={label} className="cli-table-row grid gap-3 px-4 py-4 md:grid-cols-[120px_minmax(0,1fr)]">
                        <div className="text-xs uppercase tracking-[0.14em] text-term-gray">{label}</div>
                        <div className="text-term-white">
                          {label === "البريد" ? (
                            <a href={`mailto:${value}`} className="cli-link" dir="ltr">
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <NewsletterSignup locale="ar" />
              </div>

              <div className="space-y-6">
                <div className="cli-panel px-4 py-4">
                  <div className="cli-topline">أسباب جيدة للتواصل</div>
                  <div className="mt-3 space-y-2 text-sm leading-7 text-term-gray">
                    <p>- عندك مشكلة واضحة وتحتاج من يفككها معك بهدوء.</p>
                    <p>- تبني منتجًا أو أداة داخلية وتريد تحويل الفكرة إلى تجربة قابلة للاستخدام.</p>
                    <p>- تعمل على People Analytics أو AI وتحتاج رأيًا عمليًا لا تنظيرًا زائدًا.</p>
                    <p>- تريد جلسة قصيرة، مباشرة، بلا مقدمات كثيرة ولا مجاملات.</p>
                  </div>
                </div>

                <div className="cli-panel px-4 py-4">
                  <div className="cli-topline">روابط سريعة</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href={siteConfig.calUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-term-white bg-term-white px-4 py-3 text-sm text-term-black transition-colors hover:bg-term-cyan hover:border-term-cyan hover:text-term-black font-semibold">
                      احجز نصف ساعة
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 border border-term-line px-4 py-3 text-sm text-term-white transition-colors hover:bg-term-white hover:text-term-black hover:border-term-white">
                      اكتب لي بريدًا
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="text-sm text-term-gray mb-4" dir="ltr">
              <span className="text-term-green">$</span> <span className="text-term-cyan">open</span> calendar
            </div>
            <CalEmbed />
          </section>
        </div>
      </main>

      <TerminalFooter locale="ar" />
    </div>
  )
}
