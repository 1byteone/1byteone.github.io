import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import CalEmbed from "@/components/cal-embed"
import NewsletterSignup from "@/components/newsletter-signup"
import { siteConfig } from "@/content/site"

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name}. Book a 30-minute session or send an email.`,
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name}.`,
    url: `${siteConfig.siteUrl}/contact`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Contact — ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name}.`,
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono flex flex-col">
      <MinimalNav />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-term-gray transition-colors hover:text-term-cyan">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-term-green">$</span> cd ..
          </Link>

          <section className="cli-frame overflow-hidden">
            <div className="flex items-center justify-between border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">
              <span>contact.txt</span>
              <span>open channel</span>
            </div>

            <div className="grid gap-8 p-5 md:grid-cols-[0.9fr_1.1fr] md:p-6">
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-term-gray">
                    <span className="text-term-green">$</span> <span className="text-term-cyan">ping</span> me
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-term-white md:text-4xl">Open a clean line.</h1>
                  <p className="mt-5 cli-soft-copy max-w-xl">
                    If you want to work together, compare notes, or explore a transformation problem, this is the simplest way in.
                  </p>
                </div>

                <div className="overflow-hidden border border-term-line">
                  <div className="grid gap-4 border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray md:grid-cols-[120px_minmax(0,1fr)]">
                    <span>field</span>
                    <span>value</span>
                  </div>
                  <div className="space-y-0 text-sm">
                    {[
                      ["email", siteConfig.email],
                      ["location", siteConfig.location],
                      ["availability", "select strategy, transformation, and product collaborations"],
                    ].map(([label, value]) => (
                      <div key={label} className="cli-table-row grid gap-3 px-4 py-4 md:grid-cols-[120px_minmax(0,1fr)]">
                        <div className="text-xs uppercase tracking-[0.14em] text-term-gray">{label}</div>
                        <div className="text-term-white">
                          {label === "email" ? (
                            <a href={`mailto:${value}`} className="cli-link">
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

                {/* Newsletter Signup */}
                <NewsletterSignup />
              </div>

              <div className="space-y-6">
                <div className="cli-panel px-4 py-4">
                  <div className="cli-topline">good reasons to reach out</div>
                  <div className="mt-3 space-y-2 text-sm leading-7 text-term-gray">
                    <p>- organizational transformation that needs sharper execution</p>
                    <p>- product or service ideas that need a clearer operating model</p>
                    <p>- ai-enabled internal tools or decision systems</p>
                    <p>- advisory, speaking, or focused strategy conversations</p>
                  </div>
                </div>

                <div className="cli-panel px-4 py-4">
                  <div className="cli-topline">quick links</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={siteConfig.calUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-term-white bg-term-white px-4 py-3 text-sm text-term-black transition-colors hover:bg-term-cyan hover:border-term-cyan hover:text-term-black font-semibold"
                    >
                      book a 30-minute session
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 border border-term-line px-4 py-3 text-sm text-term-white transition-colors hover:bg-term-white hover:text-term-black hover:border-term-white">
                      email instead
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cal.com Embed Section */}
          <section className="mt-8">
            <div className="text-sm text-term-gray mb-4">
              <span className="text-term-green">$</span> <span className="text-term-cyan">open</span> calendar
            </div>
            <CalEmbed />
          </section>
        </div>
      </main>

      <TerminalFooter />
    </div>
  )
}
