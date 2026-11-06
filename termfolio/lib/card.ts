import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { siteConfig } from "@/content/site"

export interface CardLink {
  label: string
  url: string
  icon: string
}

export interface CardContact {
  type: "email" | "phone" | "website" | "whatsapp"
  label: string
  value: string
}

export interface CardSocial {
  platform: string
  url: string
}

export interface DigitalCard {
  name: string
  title: string
  company: string
  location: string
  avatar: string
  bio: string
  links: CardLink[]
  contacts: CardContact[]
  socials: CardSocial[]
}

const CARD_PATH = path.join(process.cwd(), "content", "card.md")

export function getCard(): DigitalCard {
  if (!fs.existsSync(CARD_PATH)) {
    return {
      name: siteConfig.name,
      title: siteConfig.title,
      company: "",
      location: siteConfig.location,
      avatar: siteConfig.avatar,
      bio: siteConfig.headline,
      links: Object.entries(siteConfig.socials).map(([platform, s]) => ({
        label: s.label,
        url: s.url,
        icon: platform,
      })),
      contacts: [
        { type: "email", label: "Email", value: siteConfig.email },
      ],
      socials: Object.entries(siteConfig.socials).map(([platform, s]) => ({
        platform,
        url: s.url,
      })),
    }
  }

  const raw = fs.readFileSync(CARD_PATH, "utf-8")
  const { data } = matter(raw)

  return {
    name: data.name || siteConfig.name,
    title: data.title || siteConfig.title,
    company: data.company || "",
    location: data.location ?? siteConfig.location,
    avatar: data.avatar || siteConfig.avatar,
    bio: data.bio || siteConfig.headline,
    links: Array.isArray(data.links) ? data.links : [],
    contacts: Array.isArray(data.contacts) ? data.contacts : [],
    socials: Array.isArray(data.socials) ? data.socials : [],
  }
}
