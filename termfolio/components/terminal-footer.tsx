"use client"

import { useEffect, useState } from "react"
import { siteConfig } from "@/content/site"
import { localeCopy, type Locale } from "@/content/locale"

export default function TerminalFooter({ locale = "en" }: { locale?: Locale }) {
  const [time, setTime] = useState("")
  const copy = localeCopy[locale]

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      )
    }
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <footer className="mt-auto" dir={copy.dir}>
      <div className="border-t border-term-line bg-term-black px-4 py-2">
        <div className="container mx-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs font-mono uppercase tracking-[0.14em] text-term-gray">
          <span>
            {copy.footer.developedBy}{" "}
            <a
              href={siteConfig.developedBy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-white hover:text-term-cyan transition-colors"
            >
              {siteConfig.developedBy.name.toLowerCase()}
            </a>
            {siteConfig.customizedBy && (
              <>
                {" · "}{copy.footer.customizedBy}{" "}
                <a
                  href={siteConfig.customizedBy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-term-white hover:text-term-cyan transition-colors"
                >
                  {siteConfig.customizedBy.name.toLowerCase()}
                </a>
              </>
            )}
            {" | "}{time || "--:--"}
          </span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="text-term-green">●</span> {copy.footer.online}
            </span>
            <span>|</span>
            <span className="text-term-white" dir="ltr">{copy.footer.help}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
