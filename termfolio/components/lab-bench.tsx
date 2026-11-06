import Link from "next/link"
import { ArrowUpRight, GitBranch } from "lucide-react"
import { labExperiments } from "@/content/lab"
import { getLocalePath, localeCopy, type Locale } from "@/content/locale"

interface LabBenchProps {
  locale?: Locale
  limit?: number
  showIntro?: boolean
  showViewAll?: boolean
}

export default function LabBench({ locale = "en", limit, showIntro = true, showViewAll = true }: LabBenchProps) {
  const copy = localeCopy[locale]
  const experiments = typeof limit === "number" ? labExperiments.slice(0, limit) : labExperiments

  return (
    <section className="space-y-4">
      {showIntro && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="cli-topline" dir="ltr">{copy.lab.eyebrow}</div>
            <h2 className="mt-2 text-2xl font-semibold text-term-white md:text-3xl">
              {copy.lab.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-term-gray">
              {copy.lab.description}
            </p>
          </div>
          {showViewAll && (
            <Link
              href={getLocalePath("/lab", locale)}
              className="inline-flex items-center gap-2 self-start border border-term-line px-4 py-3 text-sm text-term-white transition-colors hover:border-term-cyan hover:text-term-cyan sm:self-auto"
            >
              {copy.lab.viewAll}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {experiments.map((item) => (
          <article key={item.repo} className="rounded-lg border border-term-line bg-term-darker p-4 transition-colors hover:border-term-cyan/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-term-gray">
                  {item.type[locale]}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-term-white" dir="ltr">
                  {item.title}
                </h3>
              </div>
              <GitBranch className="mt-1 h-4 w-4 shrink-0 text-term-cyan" />
            </div>

            <p className="mt-3 min-h-[5.25rem] text-sm leading-7 text-term-gray">
              {item.summary[locale]}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.stack.map((stack) => (
                <span key={stack} className="rounded-full border border-term-line px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-term-gray">
                  {stack}
                </span>
              ))}
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-term-cyan hover:text-term-cyan-bright"
              dir="ltr"
            >
              {copy.lab.repo}: {item.repo}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </article>
        ))}
      </div>

      <p className="text-xs uppercase tracking-[0.14em] text-term-gray">
        {copy.lab.disclaimer}
      </p>
    </section>
  )
}
