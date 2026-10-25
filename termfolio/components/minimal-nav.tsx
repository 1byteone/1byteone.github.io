"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemePicker from "@/components/theme-picker"
import { siteConfig } from "@/content/site"
import { getLanguageSwitchPath, getLocalePath, localeCopy, type Locale } from "@/content/locale"

interface MinimalNavProps {
  locale?: Locale
}

export default function MinimalNav({ locale = "en" }: MinimalNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const copy = localeCopy[locale]
  const navItems = copy.navItems
  const languageHref = getLanguageSwitchPath(pathname, locale)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-term-line bg-term-black/95 backdrop-blur-sm" dir={copy.dir}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-4 text-sm">
          <Link href={getLocalePath("/", locale)} className="min-w-0 text-term-white transition-colors hover:text-term-cyan group" dir="ltr">
            <pre className="text-[8px] leading-[1.1] text-term-cyan group-hover:text-term-white transition-colors font-mono select-none" aria-hidden="true">{`█╗ ╔█╗ ╔═╗\n██╗██║ ╠═╣\n╚═╝╚╝ ╩ ╩`}</pre>
            <span className="block text-[9px] uppercase tracking-[0.3em] text-term-gray mt-0.5">{copy.portfolioLabel}</span>
          </Link>

          <div className="hidden items-center gap-4 md:flex xl:gap-5">
            {navItems.map((item) => {
              const href = getLocalePath(item.path, locale)
              const active = item.path === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

              return (
                <Link
                  key={item.path}
                  href={href}
                  className={`transition-colors ${active ? "text-term-white" : "text-term-gray hover:text-term-cyan"}`}
                >
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-term-gray" dir="ltr">({item.number}) {item.command}</span>
                  <span className="block text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-6">
            <ThemePicker />
            <Link
              href={languageHref}
              className="text-xs uppercase tracking-[0.16em] text-term-gray transition-colors hover:text-term-cyan"
              title={copy.languageSwitchTitle}
            >
              {copy.languageLabel}
            </Link>
            <div className="hidden lg:flex items-center gap-4 text-xs tracking-[0.16em] text-term-gray uppercase">
              {Object.values(siteConfig.socials).map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-term-cyan focus:text-term-cyan outline-none transition-colors flex items-center gap-1.5">
                  <span className="text-term-white font-bold">{social.icon}</span> {social.label.toLowerCase()}
                </a>
              ))}
              <a href={`mailto:${siteConfig.email}`} className="hover:text-term-cyan focus:text-term-cyan outline-none transition-colors flex items-center gap-1.5">
                <span className="text-term-white font-bold">@</span> email
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center justify-center border border-term-line px-4 py-3 min-w-[44px] min-h-[44px] text-term-white lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "[X]" : "[=]"}
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="border-t border-term-line py-3 lg:hidden">
            <div className="grid gap-3">
              {navItems.map((item) => {
                const href = getLocalePath(item.path, locale)
                const active = item.path === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

                return (
                  <Link
                    key={item.path}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`border border-term-line px-4 py-4 min-h-[48px] ${active ? "bg-term-dark text-term-white" : "text-term-gray hover:text-term-cyan"}`}
                  >
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-term-gray" dir="ltr">({item.number}) {item.command}</span>
                    <span className="mt-1 block text-sm">{item.label}</span>
                  </Link>
                )
              })}
              <Link
                href={languageHref}
                onClick={() => setOpen(false)}
                className="border border-term-line px-4 py-4 min-h-[48px] text-term-gray hover:text-term-cyan"
              >
                {copy.languageLabel}
              </Link>
              <div className="flex items-center gap-4 px-4 py-2 text-xs tracking-[0.16em] text-term-gray uppercase">
                {Object.values(siteConfig.socials).map((social) => (
                  <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-term-cyan flex items-center gap-1.5">
                    <span className="text-term-white font-bold">{social.icon}</span> {social.label.toLowerCase()}
                  </a>
                ))}
                <a href={`mailto:${siteConfig.email}`} className="hover:text-term-cyan flex items-center gap-1.5">
                  <span className="text-term-white font-bold">@</span> email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
