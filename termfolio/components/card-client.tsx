"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import type { DigitalCard } from "@/lib/card"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"
import { getLocalePath, type Locale } from "@/content/locale"

interface CardClientProps {
  card: DigitalCard
  siteUrl: string
  locale?: Locale
}

const LINK_ICONS: Record<string, string> = {
  github: "</>",
  linkedin: "[in]",
  x: "\u{1D54F}",
  twitter: "\u{1D54F}",
  website: "~",
}

const CONTACT_ICONS: Record<string, string> = {
  email: "@",
  phone: "#",
  whatsapp: "wa",
}

function getContactHref(contact: { type: string; value: string }): string {
  switch (contact.type) {
    case "email":
      return `mailto:${contact.value}`
    case "phone":
      return `tel:${contact.value}`
    case "whatsapp": {
      const digits = contact.value.replace(/[^0-9]/g, "")
      return `https://wa.me/${digits}`
    }
    default:
      return contact.value
  }
}

export default function CardClient({ card, siteUrl, locale = "en" }: CardClientProps) {
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  const cardUrl = `${siteUrl}${getLocalePath("/card", locale)}`
  const labels = locale === "ar"
    ? {
        links: "الروابط",
        contact: "التواصل",
        save: "حفظ جهة الاتصال",
        copied: "تم النسخ",
        share: "مشاركة",
        qr: "رمز QR",
        scan: "امسح الرمز لفتح البطاقة",
        powered: "مدعوم بواسطة termfolio",
        send: "إرسال",
      }
    : {
        links: "links",
        contact: "contact",
        save: "save contact",
        copied: "copied!",
        share: "share",
        qr: "qr code",
        scan: "scan to open this card",
        powered: "powered by termfolio",
        send: "send",
      }

  const handleShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: card.name,
          text: `${card.title}`,
          url: cardUrl,
        })
        return
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(cardUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }, [card.name, card.title, cardUrl])

  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono flex flex-col">
      <MinimalNav locale={locale} />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-lg">
          {/* Back link */}
          <Link
            href={getLocalePath("/", locale)}
            className="mb-8 inline-flex items-center gap-2 text-term-gray transition-colors hover:text-term-cyan"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-term-green">$</span> cd ..
          </Link>

          {/* Card frame */}
          <section className="cli-frame overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">
              <span>card.vcf</span>
              <span>/card</span>
            </div>

            {/* Profile section */}
            <div className="flex flex-col items-center px-5 pt-8 pb-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-term-line">
                <Image
                  src={card.avatar}
                  alt={card.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-term-white text-center">
                {card.name}
              </h1>
              <p className="mt-1 text-sm text-term-gray text-center max-w-xs">
                {card.title}
              </p>
              {card.location && (
                <p className="mt-0.5 text-xs text-term-gray">{card.location}</p>
              )}
            </div>

            {/* ── Links Section ── */}
            {card.links.length > 0 && (
              <div className="border-t border-term-line">
                <div className="px-5 py-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-term-gray">
                    {labels.links}
                  </span>
                </div>
                {card.links.map((link, i) => (
                  <a
                    key={`link-${i}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cli-table-row flex items-center justify-between px-5 py-4 text-sm transition-colors hover:bg-term-dark group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-center text-term-cyan font-bold shrink-0">
                        {LINK_ICONS[link.icon] || "~"}
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate text-term-white group-hover:text-term-black">
                          {link.label}
                        </span>
                        <span className="block truncate text-[10px] text-term-gray group-hover:text-term-black">
                          {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-term-gray shrink-0 group-hover:text-term-black" />
                  </a>
                ))}
              </div>
            )}

            {/* ── Contacts Section ── */}
            {card.contacts.length > 0 && (
              <div className="border-t-2 border-term-line">
                <div className="px-5 py-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-term-gray">
                    {labels.contact}
                  </span>
                </div>
                {card.contacts.map((contact, i) => (
                  <a
                    key={`contact-${i}`}
                    href={getContactHref(contact)}
                    target={contact.type === "whatsapp" ? "_blank" : undefined}
                    rel={
                      contact.type === "whatsapp"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="cli-table-row flex items-center justify-between px-5 py-4 text-sm transition-colors hover:bg-term-dark group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-6 text-center font-bold shrink-0 ${contact.type === "whatsapp" ? "text-term-green" : "text-term-amber"}`}>
                        {CONTACT_ICONS[contact.type] || "?"}
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate text-term-white group-hover:text-term-black">
                          {contact.value}
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.14em] text-term-gray group-hover:text-term-black">
                          {contact.label}
                        </span>
                      </div>
                    </div>
                    {contact.type === "whatsapp" ? (
                      <span className="text-[10px] uppercase tracking-[0.14em] text-term-green shrink-0 group-hover:text-term-black">
                        {labels.send}
                      </span>
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-term-gray shrink-0 group-hover:text-term-black" />
                    )}
                  </a>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-term-line px-5 py-5 space-y-3">
              <a
                href="/api/card/vcard"
                className="flex items-center justify-center gap-2 w-full border border-term-white bg-term-white px-4 py-3 text-sm text-term-black font-semibold transition-colors hover:bg-term-cyan hover:border-term-cyan"
              >
                {labels.save}
              </a>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 border border-term-line px-4 py-3 text-sm text-term-white transition-colors hover:bg-term-white hover:text-term-black hover:border-term-white"
                >
                  {copied ? labels.copied : labels.share}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQR((v) => !v)}
                  className={`flex items-center justify-center gap-2 border px-4 py-3 text-sm transition-colors ${
                    showQR
                      ? "border-term-cyan text-term-cyan"
                      : "border-term-line text-term-white hover:bg-term-white hover:text-term-black hover:border-term-white"
                  }`}
                >
                  {labels.qr}
                </button>
              </div>
            </div>

            {/* QR Code (toggled) */}
            {showQR && (
              <div className="border-t border-term-line px-5 py-6 flex flex-col items-center gap-3">
                <div className="bg-term-white p-4 rounded-sm">
                  <QRCodeSVG
                    value={cardUrl}
                    size={180}
                    bgColor="#F3EADB"
                    fgColor="#0B0B0F"
                    level="M"
                  />
                </div>
                <p className="text-xs text-term-gray">
                  {labels.scan}
                </p>
              </div>
            )}

            {/* Bio */}
            {card.bio && (
              <div className="border-t border-term-line px-5 py-5">
                <p className="text-sm leading-7 text-term-gray">{card.bio}</p>
              </div>
            )}

            {/* Footer bar */}
            <div className="cli-statusbar px-4 py-2 flex items-center justify-between">
              <span>{labels.powered}</span>
              <span>
                {card.links.length} links · {card.contacts.length} contacts
              </span>
            </div>
          </section>
        </div>
      </main>

      <TerminalFooter locale={locale} />
    </div>
  )
}
