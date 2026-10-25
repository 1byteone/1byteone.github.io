import { BookOpen, ListChecks, MousePointer2, Timer, WholeWord } from "lucide-react"
import type { Post } from "@/lib/posts"
import { localeCopy, type Locale } from "@/content/locale"

interface ArticleDigestProps {
  post: Post
  locale?: Locale
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "this",
  "that",
  "your",
  "you",
  "are",
  "was",
  "were",
  "into",
  "about",
  "how",
  "why",
  "what",
  "from",
  "have",
  "will",
  "been",
  "they",
  "their",
  "there",
  "عن",
  "في",
  "من",
  "على",
  "إلى",
  "هذا",
  "هذه",
  "ذلك",
  "التي",
  "الذي",
  "كان",
  "كانت",
])

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[\s-*+\d.)]+/gm, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function getParagraphs(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n{2,}/)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter((paragraph) => paragraph.split(/\s+/).length > 8)
}

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!؟?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).length > 6)
}

function clampSentence(sentence: string, max = 220) {
  if (sentence.length <= max) return sentence
  return `${sentence.slice(0, max).trim()}...`
}

function getKeySentences(post: Post) {
  const paragraphs = getParagraphs(post.content)
  const sentences = paragraphs.flatMap((paragraph) => splitSentences(paragraph))
  const useful = sentences
    .filter((sentence) => sentence.length > 55 && sentence.length < 260)
    .filter((sentence, index, list) => list.findIndex((item) => item.toLowerCase() === sentence.toLowerCase()) === index)

  return useful.slice(0, 5).map((sentence) => clampSentence(sentence, 190))
}

function getSectionDigest(post: Post) {
  const lines = post.content.split("\n")
  const sections: { title: string; body: string }[] = []
  let currentTitle = ""
  let currentLines: string[] = []

  const flush = () => {
    if (!currentTitle) return
    const paragraph = getParagraphs(currentLines.join("\n"))[0]
    if (paragraph) {
      sections.push({ title: currentTitle, body: clampSentence(splitSentences(paragraph)[0] || paragraph, 170) })
    }
  }

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      flush()
      currentTitle = match[2].trim()
      currentLines = []
    } else if (currentTitle) {
      currentLines.push(line)
    }
  }
  flush()

  return sections.slice(0, 4)
}

function getThreeWords(post: Post) {
  const fromTags = post.tags.slice(0, 3)
  if (fromTags.length >= 3) return fromTags

  const fromTitle = post.title
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}-]/gu, "").toLowerCase())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 3 - fromTags.length)

  return [...fromTags, ...fromTitle].slice(0, 3)
}

export default function ArticleDigest({ post, locale = "en" }: ArticleDigestProps) {
  const copy = localeCopy[locale]
  const threeWords = getThreeWords(post)
  const isRtl = locale === "ar"
  const keySentences = getKeySentences(post)
  const sectionDigest = getSectionDigest(post)
  const firstPoint = post.excerpt || keySentences[0] || copy.digest.empty
  const savedMinutes = Math.max(1, post.readingTime - 1)

  const cards = [
    {
      label: copy.digest.cards[0].label,
      helper: copy.digest.cards[0].helper,
      icon: Timer,
      body: firstPoint,
    },
    {
      label: copy.digest.cards[1].label,
      helper: copy.digest.cards[1].helper,
      icon: ListChecks,
      body: keySentences.slice(1, 4),
    },
    {
      label: copy.digest.cards[2].label,
      helper: copy.digest.cards[2].helper,
      icon: MousePointer2,
      body: sectionDigest,
    },
    {
      label: copy.digest.cards[3].label,
      helper: copy.digest.cards[3].helper,
      icon: WholeWord,
      body: threeWords.length > 0 ? threeWords.join(" · ") : post.title,
    },
  ]

  return (
    <section id="lazy-read" className="scroll-mt-24 rounded-lg border border-term-cyan/30 bg-term-darker/80 p-4 shadow-lg shadow-term-cyan/5">
      <div className="flex flex-col gap-3 border-b border-term-line pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="cli-topline">{copy.digest.meta}</div>
          <h2 className="mt-1 text-xl font-semibold text-term-white">
            {copy.digest.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-term-gray">
            {copy.digest.intro}
          </p>
        </div>
        <div className="rounded-md border border-term-line bg-term-black px-3 py-2 text-xs leading-6 text-term-gray">
          <span dir="ltr">{post.readingTime} min</span> {copy.digest.fullRead}
          <br />
          <span dir="ltr">~{savedMinutes} min</span> {copy.digest.savedTime}
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="rounded-md border border-term-line bg-term-black p-4">
              <div className="flex items-center gap-2 text-term-cyan">
                <Icon className="h-4 w-4" />
                <h3 className="text-sm font-semibold">{card.label}</h3>
              </div>
              <p className="mt-2 text-xs leading-6 text-term-gray">
                {card.helper}
              </p>
              {Array.isArray(card.body) ? (
                <div className="mt-3 space-y-3" dir={isRtl ? "rtl" : undefined}>
                  {card.body.length > 0 ? card.body.map((item) => (
                    typeof item === "string" ? (
                      <p key={item} className="border-t border-term-line pt-3 text-sm leading-7 text-term-white">
                        {item}
                      </p>
                    ) : (
                      <div key={item.title} className="border-t border-term-line pt-3">
                        <div className="text-sm font-semibold text-term-white">{item.title}</div>
                        <p className="mt-1 text-xs leading-6 text-term-gray">{item.body}</p>
                      </div>
                    )
                  )) : (
                    <p className="text-sm leading-7 text-term-white">{copy.digest.empty}</p>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-7 text-term-white" dir={isRtl ? "rtl" : undefined}>
                  {card.body}
                </p>
              )}
            </article>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs leading-6 text-term-gray">
        <BookOpen className="h-4 w-4 text-term-cyan" />
        <span>{locale === "ar" ? "الخلاصة مولّدة من نص المقال نفسه، لا من خدمة خارجية." : "Digest generated from the post text itself, not an external service."}</span>
      </div>
    </section>
  )
}
