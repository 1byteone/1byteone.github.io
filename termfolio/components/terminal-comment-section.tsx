"use client"

import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { AlertTriangle, MessageSquare } from "lucide-react"
import { siteConfig } from "@/content/site"
import type { Locale } from "@/content/locale"

const Giscus = dynamic(() => import("@giscus/react"), {
  ssr: false,
  loading: () => (
    <div className="cli-frame p-6 text-center text-term-gray">
      Initializing comment system...
    </div>
  ),
})

export default function TerminalCommentSection({ locale = "en" }: { locale?: Locale }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const { theme = "dark" } = useTheme()

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID
  const isConfigured = Boolean(repo && repoId && category && categoryId)

  return (
    <div className="cli-frame overflow-hidden">
      <div className="flex items-center justify-between border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">
        <span className="inline-flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-term-cyan" /> comments.sh
        </span>
        <span>{locale === "ar" ? "النقاش" : "discussion"}</span>
      </div>

      <div className="p-4">
        {isConfigured ? (
          <Giscus
            id="comments"
            repo={repo as `${string}/${string}`}
            repoId={repoId as string}
            category={category as string}
            categoryId={categoryId as string}
            mapping="pathname"
            term={pathname}
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            loading="lazy"
            theme={theme === "dark" ? "dark_high_contrast" : "light_high_contrast"}
            host="https://giscus.app"
            lang={locale}
          />
        ) : (
          <div className="flex items-start gap-3 text-sm leading-7 text-term-gray">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-term-cyan" />
            <p>
              {locale === "ar"
                ? "التعليقات غير مفعلة حتى يتم إعداد Giscus. يمكنك إرسال ملاحظاتك مباشرة عبر "
                : "Comments are offline until Giscus is configured. You can still send feedback directly at "}
              <a href={`mailto:${siteConfig.email}`} className="cli-link">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
