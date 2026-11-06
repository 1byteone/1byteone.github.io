import type { DigitalCard } from "./card"

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

export function generateVCard(card: DigitalCard): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(card.name)}`,
  ]

  if (card.company || card.title) {
    lines.push(`ORG:${escapeVCard(card.company)}`)
    lines.push(`TITLE:${escapeVCard(card.title)}`)
  }

  for (const contact of card.contacts) {
    const label = escapeVCard(contact.label)

    switch (contact.type) {
      case "email":
        lines.push(`EMAIL;TYPE=INTERNET,${label}:${contact.value}`)
        break
      case "phone":
      case "whatsapp":
        lines.push(`TEL;TYPE=${label}:${contact.value}`)
        break
      case "website":
        lines.push(`URL;TYPE=${label}:${contact.value}`)
        break
    }
  }

  for (const link of card.links) {
    lines.push(`URL;TYPE=${escapeVCard(link.label)}:${link.url}`)
  }

  for (const social of card.socials) {
    lines.push(
      `X-SOCIALPROFILE;TYPE=${escapeVCard(social.platform)}:${social.url}`
    )
  }

  if (card.bio) {
    lines.push(`NOTE:${escapeVCard(card.bio)}`)
  }

  if (card.avatar) {
    lines.push(`PHOTO;VALUE=URI:${card.avatar}`)
  }

  lines.push("END:VCARD")

  return lines.join("\r\n")
}
