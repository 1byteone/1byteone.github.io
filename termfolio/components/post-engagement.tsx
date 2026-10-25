"use client"

import { useState, useEffect, useCallback } from "react"
import type { Locale } from "@/content/locale"

interface PostEngagementProps {
  slug: string
  locale?: Locale
}

export default function PostEngagement({ slug, locale = "en" }: PostEngagementProps) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [views, setViews] = useState(0)
  const [copied, setCopied] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const storedLikes = localStorage.getItem(`post-likes-${slug}`)
    if (storedLikes) setLikes(parseInt(storedLikes, 10))

    const hasLiked = localStorage.getItem(`post-liked-${slug}`) === "1"
    setLiked(hasLiked)

    // Simulate view count from slug hash
    const hash = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    const baseViews = (hash * 17) % 900 + 100
    const storedViews = localStorage.getItem(`post-views-${slug}`)
    const currentViews = storedViews ? parseInt(storedViews, 10) : baseViews
    const newViews = storedViews ? currentViews + 1 : currentViews
    setViews(newViews)
    localStorage.setItem(`post-views-${slug}`, newViews.toString())
  }, [slug])

  const handleLike = useCallback(() => {
    if (liked) {
      const newLikes = Math.max(0, likes - 1)
      setLikes(newLikes)
      setLiked(false)
      localStorage.setItem(`post-likes-${slug}`, newLikes.toString())
      localStorage.removeItem(`post-liked-${slug}`)
    } else {
      const newLikes = likes + 1
      setLikes(newLikes)
      setLiked(true)
      localStorage.setItem(`post-likes-${slug}`, newLikes.toString())
      localStorage.setItem(`post-liked-${slug}`, "1")
    }
  }, [liked, likes, slug])

  const handleShare = useCallback(async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ url })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard?.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <div className="flex items-center justify-between py-4 border-t border-b border-[var(--term-line)] text-xs font-mono">
      <div className="flex items-center gap-6">
        {/* Views */}
        <span className="flex items-center gap-1.5 text-[var(--term-gray)]">
          <span>👁</span>
          <span>{views.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")} {locale === "ar" ? "قراءة" : "reads"}</span>
        </span>

        {/* Likes */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors ${
            liked ? "text-red-400" : "text-[var(--term-gray)] hover:text-red-400"
          }`}
        >
          <span>{liked ? "♥" : "♡"}</span>
          <span>{likes > 0 ? likes.toLocaleString(locale === "ar" ? "ar-SA" : "en-US") : ""} {locale === "ar" ? "إعجاب" : likes === 1 ? "like" : likes > 1 ? "likes" : "like"}</span>
        </button>
      </div>

      {/* Share */}
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-[var(--term-gray)] hover:text-[var(--term-cyan)] transition-colors"
      >
        <span>↗</span>
        <span>{copied ? (locale === "ar" ? "تم النسخ" : "copied!") : locale === "ar" ? "مشاركة" : "share"}</span>
      </button>
    </div>
  )
}
