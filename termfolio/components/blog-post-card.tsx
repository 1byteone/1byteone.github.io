import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"
import { formatPostDate } from "@/lib/format-post-date"
import type { Post } from "@/lib/posts"
import { getLocalePath, type Locale } from "@/content/locale"

interface BlogPostCardProps {
  post: Post
  locale?: Locale
}

export default function BlogPostCard({ post, locale = "en" }: BlogPostCardProps) {
  return (
    <article className="cli-frame overflow-hidden transition-colors hover:border-term-cyan/35">
      <Link href={getLocalePath(`/blog/${post.slug}`, locale)} className="block h-full">
        {post.coverImage ? (
          <div className="relative h-44 overflow-hidden border-b border-term-line">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              width={560}
              height={320}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-term-black/40" />
          </div>
        ) : null}

        <div className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-term-gray">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatPostDate(post.date, locale)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold leading-snug text-term-white">{post.title}</h3>
            <p className="mt-2 text-sm leading-7 text-term-gray">{post.excerpt}</p>
          </div>

          <div className="text-xs uppercase tracking-[0.16em] text-term-cyan">
            {post.tags.slice(0, 2).join(" // ") || "open dispatch"}
          </div>
        </div>
      </Link>
    </article>
  )
}
