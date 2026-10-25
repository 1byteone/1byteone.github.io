import fs from "fs"
import path from "path"
import matter from "gray-matter"
import GithubSlugger from "github-slugger"
import { siteConfig } from "@/content/site"

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

const POSTS_DIR = path.join(process.cwd(), "content", "posts")

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

function parsePost(filePath: string): ParsedPost {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)

  const slug = data.slug || path.basename(filePath, ".md")
  const headings = extractHeadings(content)

  return {
    id: slug,
    title: data.title || "Untitled",
    slug,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    author: data.author || siteConfig.name,
    excerpt: data.excerpt || "",
    content,
    coverImage: data.coverImage || undefined,
    tags: data.tags || [],
    readingTime: calculateReadingTime(content),
    views: 0,
    language: data.language || "en",
    headings,
    status: data.status || "draft",
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))

  const posts = files
    .map((file) => parsePost(path.join(POSTS_DIR, file)))
    .filter((p) => p.status === "published")

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((p) => p.slug === slug) || null
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.tags.includes(tag))
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = posts.flatMap((p) => p.tags)
  return [...new Set(tags)]
}
