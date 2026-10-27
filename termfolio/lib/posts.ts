import fs from "fs"
import path from "path"
import matter from "gray-matter"
import GithubSlugger from "github-slugger"
import { siteConfig } from "@/content/site"
import bitmapCatalog from "@/lib/bitmap-catalog.json"

export interface PostHeading {
  text: string
  id: string
  level: number
}

export interface Post {
  id: string
  title: string
  slug: string
  date: string
  author: string
  excerpt: string
  content: string
  coverImage?: string
  tags: string[]
  readingTime: number
  views: number
  language?: string
  headings: PostHeading[]
}

type ContentLanguage = "zh" | "en"

function postsDirectory(language: ContentLanguage = "zh") {
  return language === "zh"
    ? path.join(process.cwd(), "..", "content", "zh", "blog")
    : path.join(process.cwd(), "content", "posts")
}

// Keep the article index useful even when a synced Markdown file does not carry
// a coverImage field. These files are checked into `public/`, so they work in
// both the local dev server and a static production deployment.
// Article covers intentionally come from the local Bitmap catalog. Keeping the
// catalog in JSON makes the cover set easy to extend without another code edit.
const BITMAP_COVER_IMAGES = bitmapCatalog.map((asset) => asset.src)

function normalizeImagePath(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined

  const raw = value.trim().replaceAll("\\", "/")
  if (/^(?:https?:|data:|blob:)/i.test(raw)) return raw

  // Markdown/frontmatter sometimes uses a path copied from the repository
  // (`public/images/...`) or from a relative article folder (`../images/...`).
  // Normalize both forms to the URL path served by Next.js.
  const publicPath = raw.replace(/^public\//i, "")
  if (publicPath.startsWith("/")) return publicPath
  if (publicPath.startsWith("images/")) return `/${publicPath}`

  const imageSegment = publicPath.indexOf("images/")
  if (imageSegment >= 0) return `/${publicPath.slice(imageSegment)}`

  return `/images/blog/${publicPath.replace(/^(?:\.\.\/|\.\/)+/, "")}`
}

function defaultCoverForPost(slug: string, tags: string[]): string {
  if (BITMAP_COVER_IMAGES.length === 0) return "/images/blog/icons8-bitmap-planet-earth.png"

  // A stable hash means the same article keeps the same cover across builds,
  // while different slugs naturally spread across the local Bitmap set.
  const key = `${slug}:${tags.join(",")}`
  let hash = 2166136261
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return BITMAP_COVER_IMAGES[(hash >>> 0) % BITMAP_COVER_IMAGES.length]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .trim()
}

function extractHeadings(markdown: string): PostHeading[] {
  const headings: PostHeading[] = []
  const slugger = new GithubSlugger()
  const lines = markdown.split("\n")
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      headings.push({
        text,
        id: slugger.slug(text),
        level,
      })
    }
  }

  return headings
}

function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

interface ParsedPost extends Post {
  status: string
}

function parsePost(filePath: string, language: ContentLanguage): ParsedPost {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  const fileSlug = path.basename(filePath, ".md") === "index"
    ? path.basename(path.dirname(filePath))
    : path.basename(filePath, ".md")
  const slug = data.slug || fileSlug
  const headings = extractHeadings(content)
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : []
  const coverImage = normalizeImagePath(data.coverImage) || defaultCoverForPost(slug, tags)

  return {
    id: slug,
    title: data.title || "Untitled",
    slug,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    author: data.author || siteConfig.name,
    excerpt: data.excerpt || "",
    content,
    coverImage,
    tags,
    readingTime: calculateReadingTime(content),
    views: 0,
    language: data.language || language,
    headings,
    status: data.status || "draft",
  }
}

export async function getAllPosts(language: ContentLanguage = "zh"): Promise<Post[]> {
  const postsDir = postsDirectory(language)
  if (!fs.existsSync(postsDir)) {
    return []
  }

  const files = fs.readdirSync(postsDir).flatMap((entry) => {
    const entryPath = path.join(postsDir, entry)
    if (language === "zh" && fs.statSync(entryPath).isDirectory()) {
      const indexPath = path.join(entryPath, "index.md")
      return fs.existsSync(indexPath) ? [path.relative(postsDir, indexPath)] : []
    }
    return entry.endsWith(".md") ? [entry] : []
  })

  const parsedPosts = files
    .map((file) => parsePost(path.join(postsDir, file), language))
    .filter((p) => p.status === "published" || language === "zh")

  // Give every current article a distinct local Bitmap cover. The assignment
  // is based on slug order instead of request order, so the same article does
  // not change artwork between server builds or language views.
  const coverBySlug = new Map(
    [...parsedPosts]
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((post, index) => [post.slug, BITMAP_COVER_IMAGES[index % BITMAP_COVER_IMAGES.length]]),
  )

  const posts = parsedPosts.map((post) => ({
    ...post,
    coverImage: coverBySlug.get(post.slug) || post.coverImage,
  }))

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getPostBySlug(slug: string, language: ContentLanguage = "zh"): Promise<Post | null> {
  const posts = await getAllPosts(language)
  return posts.find((p) => p.slug === slug) || null
}

export async function getPostsByTag(tag: string, language: ContentLanguage = "zh"): Promise<Post[]> {
  const posts = await getAllPosts(language)
  return posts.filter((p) => p.tags.includes(tag))
}

export async function getAllTags(language: ContentLanguage = "zh"): Promise<string[]> {
  const posts = await getAllPosts(language)
  const tags = posts.flatMap((p) => p.tags)
  return [...new Set(tags)]
}
