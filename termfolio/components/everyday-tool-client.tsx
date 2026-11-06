"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { QRCodeCanvas } from "qrcode.react"
import {
  CalendarPlus,
  Copy,
  Download,
  ExternalLink,
  ImageIcon,
  Link2,
  MessageCircle,
  QrCode,
  SquarePen,
} from "lucide-react"
import type { UtilityToolSlug } from "@/content/lab"
import type { Locale } from "@/content/locale"

interface EverydayToolClientProps {
  slug: UtilityToolSlug
  locale?: Locale
}

const toolText = {
  en: {
    copy: "复制",
    copied: "已复制",
    download: "下载",
    open: "打开",
    privacy: "无需登录，无数据库。除非特别说明，所有处理都在浏览器本地完成。",
    urlPlaceholder: "https://example.com/really/long/link?utm_source=noise",
    shorten: "缩短链接",
    clean: "清理链接",
    shortNote: "短链接通过 TinyURL 创建，本网站不会保存链接。",
    failedShort: "短链接创建失败，但清理后的链接仍可使用。",
    qrInput: "文本、链接、电话号码或 Wi-Fi 信息",
    qrDownload: "下载二维码",
    whatsappPhone: "电话号码",
    whatsappMessage: "预置消息",
    whatsappCountry: "国家代码",
    eventTitle: "日程标题",
    eventLocation: "地点",
    eventDescription: "描述",
    eventDate: "日期",
    eventTime: "时间",
    eventDuration: "时长",
    minutes: "分钟",
    makeEvent: "生成 .ics 文件",
    imagePick: "选择图片",
    imageWidth: "新宽度",
    imageQuality: "质量",
    imageRun: "压缩图片",
    imageReady: "图片已准备下载",
    cardText: "主文本",
    cardByline: "副标题",
    cardTheme: "样式",
    cardDownload: "下载卡片",
    themes: ["终端", "编辑", "暖色"],
  },
  ar: {
    copy: "نسخ",
    copied: "تم النسخ",
    download: "تحميل",
    open: "فتح",
    privacy: "بلا تسجيل وبلا قاعدة بيانات. تعمل في المتصفح، وأي استثناء واضح داخل الأداة.",
    urlPlaceholder: "https://example.com/really/long/link?utm_source=noise",
    shorten: "قصّر الرابط",
    clean: "نظّف الرابط",
    shortNote: "الرابط القصير يُنشأ عبر TinyURL؛ موقعي لا يخزّن الرابط.",
    failedShort: "تعذّر تقصير الرابط. الرابط المنظّف جاهز للنسخ.",
    qrInput: "رابط، نص، رقم، أو بيانات Wi-Fi",
    qrDownload: "تحميل QR",
    whatsappPhone: "رقم الجوال",
    whatsappMessage: "رسالة جاهزة",
    whatsappCountry: "رمز الدولة",
    eventTitle: "اسم الموعد",
    eventLocation: "المكان",
    eventDescription: "الوصف",
    eventDate: "التاريخ",
    eventTime: "الوقت",
    eventDuration: "المدة",
    minutes: "دقيقة",
    makeEvent: "جهّز ملف .ics",
    imagePick: "اختر صورة",
    imageWidth: "العرض المطلوب",
    imageQuality: "الجودة",
    imageRun: "صغّرها",
    imageReady: "الصورة جاهزة للتحميل",
    cardText: "النص",
    cardByline: "سطر ثانوي",
    cardTheme: "الستايل",
    cardDownload: "تحميل البطاقة",
    themes: ["Terminal", "تحريري", "دافئ"],
  },
} as const

const trackingParams = [
  "fbclid",
  "gclid",
  "dclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "igshid",
  "ref",
  "ref_src",
  "spm",
  "vero_id",
]

function normalizeUrl(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function cleanUrl(raw: string) {
  try {
    const url = new URL(normalizeUrl(raw))
    const removed: string[] = []
    Array.from(url.searchParams.keys()).forEach((key) => {
      const lower = key.toLowerCase()
      if (lower.startsWith("utm_") || trackingParams.includes(lower)) {
        url.searchParams.delete(key)
        removed.push(key)
      }
    })
    return { url: url.toString(), removed }
  } catch {
    return { url: raw.trim(), removed: [] }
  }
}

function copyToClipboard(text: string, onCopied: () => void) {
  navigator.clipboard?.writeText(text)
  onCopied()
  window.setTimeout(onCopied, 1400)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="cli-frame overflow-hidden rounded-lg">
      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-6">
        {children}
      </div>
    </div>
  )
}

function ShortLinkTool({ locale }: { locale: Locale }) {
  const t = toolText[locale]
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const cleaned = useMemo(() => cleanUrl(url), [url])

  const shorten = async () => {
    setLoading(true)
    setError("")
    setShortUrl("")
    try {
      const response = await fetch("/api/tools/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleaned.url }),
      })
      const data = (await response.json()) as { shortUrl?: string; error?: string }
      if (!response.ok || !data.shortUrl) throw new Error(data.error || "shorten_failed")
      setShortUrl(data.shortUrl)
    } catch {
      setError(t.failedShort)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Panel>
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">URL</span>
          <textarea
            data-testid="short-link-input"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={t.urlPlaceholder}
            className="min-h-32 w-full rounded-md border border-term-line bg-term-black p-3 text-sm text-term-white outline-none focus:border-term-cyan"
            dir="ltr"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" data-testid="short-link-shorten" onClick={shorten} className="inline-flex items-center gap-2 rounded-md border border-term-white bg-term-white px-4 py-2 text-sm font-semibold text-term-black hover:border-term-cyan hover:bg-term-cyan" disabled={loading}>
            <Link2 className="h-4 w-4" />
            {loading ? "..." : t.shorten}
          </button>
          <button type="button" data-testid="short-link-clean-copy" onClick={() => copyToClipboard(cleaned.url, () => setCopied((value) => !value))} className="inline-flex items-center gap-2 rounded-md border border-term-line px-4 py-2 text-sm text-term-white hover:border-term-cyan hover:text-term-cyan">
            <Copy className="h-4 w-4" />
            {copied ? t.copied : t.clean}
          </button>
        </div>
        <p className="text-xs leading-6 text-term-gray">{t.shortNote}</p>
        {error && <p className="text-sm leading-7 text-[#FCA5A5]">{error}</p>}
      </div>

      <aside className="space-y-4">
        <ResultBlock label={t.clean} value={cleaned.url} locale={locale} />
        {shortUrl && <ResultBlock label={t.shorten} value={shortUrl} locale={locale} />}
        {cleaned.removed.length > 0 && (
          <div className="rounded-md border border-term-line bg-term-darker p-3 text-xs leading-6 text-term-gray">
            已移除：<span dir="ltr">{cleaned.removed.join(", ")}</span>
          </div>
        )}
      </aside>
    </Panel>
  )
}

function ResultBlock({ label, value, locale }: { label: string; value: string; locale: Locale }) {
  const [copied, setCopied] = useState(false)
  const t = toolText[locale]
  return (
    <div className="rounded-lg border border-term-line bg-term-darker p-4">
      <div className="text-[10px] uppercase tracking-[0.16em] text-term-gray">{label}</div>
      <p className="mt-2 break-all text-sm leading-7 text-term-white" dir="ltr">{value}</p>
      <button type="button" onClick={() => copyToClipboard(value, () => setCopied((state) => !state))} className="mt-3 inline-flex items-center gap-2 rounded-md border border-term-line px-3 py-2 text-xs text-term-white hover:border-term-cyan hover:text-term-cyan">
        <Copy className="h-4 w-4" />
        {copied ? t.copied : t.copy}
      </button>
    </div>
  )
}

function QrTool({ locale }: { locale: Locale }) {
  const t = toolText[locale]
  const [value, setValue] = useState("https://github.com/1byteone")
  const qrWrap = useRef<HTMLDivElement>(null)

  const downloadQr = () => {
    const canvas = qrWrap.current?.querySelector("canvas")
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "qr-code.png")
    })
  }

  return (
    <Panel>
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.qrInput}</span>
          <textarea data-testid="qr-input" value={value} onChange={(event) => setValue(event.target.value)} className="min-h-40 w-full rounded-md border border-term-line bg-term-black p-3 text-sm text-term-white outline-none focus:border-term-cyan" />
        </label>
      </div>
      <aside className="rounded-lg border border-term-line bg-term-white p-5 text-term-black">
        <div ref={qrWrap} className="flex justify-center">
          <QRCodeCanvas value={value || " "} size={220} includeMargin />
        </div>
        <button type="button" data-testid="qr-download" onClick={downloadQr} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-term-black px-4 py-3 text-sm font-semibold text-term-white">
          <Download className="h-4 w-4" />
          {t.qrDownload}
        </button>
      </aside>
    </Panel>
  )
}

function WhatsAppTool({ locale }: { locale: Locale }) {
  const t = toolText[locale]
  const [country, setCountry] = useState("966")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "")
  const countryDigits = country.replace(/\D/g, "")
  const finalPhone = digits.startsWith(countryDigits) ? digits : `${countryDigits}${digits}`
  const waUrl = `https://wa.me/${finalPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`

  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.whatsappCountry}</span>
          <input data-testid="whatsapp-country" value={country} onChange={(event) => setCountry(event.target.value)} className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-term-white outline-none focus:border-term-cyan" dir="ltr" />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.whatsappPhone}</span>
          <input data-testid="whatsapp-phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-term-white outline-none focus:border-term-cyan" dir="ltr" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.whatsappMessage}</span>
          <textarea data-testid="whatsapp-message" value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-32 w-full rounded-md border border-term-line bg-term-black p-3 text-sm text-term-white outline-none focus:border-term-cyan" />
        </label>
      </div>
      <aside className="space-y-4">
        <ResultBlock label="wa.me" value={waUrl} locale={locale} />
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-term-white bg-term-white px-4 py-3 text-sm font-semibold text-term-black hover:border-term-cyan hover:bg-term-cyan">
          <ExternalLink className="h-4 w-4" />
          {t.open}
        </a>
        <button type="button" data-testid="whatsapp-copy" onClick={() => copyToClipboard(waUrl, () => setCopied((state) => !state))} className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-term-line px-4 py-3 text-sm text-term-white hover:border-term-cyan hover:text-term-cyan">
          <Copy className="h-4 w-4" />
          {copied ? t.copied : t.copy}
        </button>
      </aside>
    </Panel>
  )
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function EventTool({ locale }: { locale: Locale }) {
  const t = toolText[locale]
  const today = new Date().toISOString().slice(0, 10)
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(today)
  const [time, setTime] = useState("19:00")
  const [duration, setDuration] = useState(60)

  const makeIcs = () => {
    const start = new Date(`${date}T${time}:00`)
    const end = new Date(start.getTime() + duration * 60 * 1000)
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//termfolio//everyday-tools//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}@termfolio`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `LOCATION:${escapeIcs(location)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    downloadBlob(new Blob([ics], { type: "text/calendar;charset=utf-8" }), "event.ics")
  }

  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t.eventTitle} value={title} onChange={setTitle} />
        <Input label={t.eventLocation} value={location} onChange={setLocation} />
        <Input label={t.eventDate} value={date} onChange={setDate} type="date" />
        <Input label={t.eventTime} value={time} onChange={setTime} type="time" />
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.eventDuration}</span>
          <input type="number" min="5" step="5" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-term-white outline-none focus:border-term-cyan" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.eventDescription}</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-28 w-full rounded-md border border-term-line bg-term-black p-3 text-sm text-term-white outline-none focus:border-term-cyan" />
        </label>
      </div>
      <aside className="rounded-lg border border-term-line bg-term-darker p-4">
        <div className="text-[10px] uppercase tracking-[0.16em] text-term-gray">{t.eventTitle}</div>
        <h2 className="mt-2 text-2xl font-semibold text-term-white">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-term-gray">{date} · {time} · {duration} {t.minutes}</p>
        {location && <p className="text-sm leading-7 text-term-gray">{location}</p>}
        <button type="button" data-testid="event-download" onClick={makeIcs} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-term-white bg-term-white px-4 py-3 text-sm font-semibold text-term-black hover:border-term-cyan hover:bg-term-cyan">
          <CalendarPlus className="h-4 w-4" />
          {t.makeEvent}
        </button>
      </aside>
    </Panel>
  )
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-term-white outline-none focus:border-term-cyan" />
    </label>
  )
}

function ImageTool({ locale }: { locale: Locale }) {
  const t = toolText[locale]
  const [file, setFile] = useState<File | null>(null)
  const [width, setWidth] = useState(1200)
  const [quality, setQuality] = useState(0.82)
  const [resultUrl, setResultUrl] = useState("")
  const [meta, setMeta] = useState("")

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl)
  }, [resultUrl])

  const shrink = async () => {
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      const ratio = image.height / image.width
      const targetWidth = Math.min(width, image.width)
      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = Math.round(targetWidth * ratio)
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(imageUrl)
        if (!blob) return
        if (resultUrl) URL.revokeObjectURL(resultUrl)
        setResultUrl(URL.createObjectURL(blob))
        setMeta(`${Math.round(file.size / 1024)}KB → ${Math.round(blob.size / 1024)}KB`)
      }, "image/jpeg", quality)
    }
    image.src = imageUrl
  }

  return (
    <Panel>
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.imagePick}</span>
          <input data-testid="image-input" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-sm text-term-gray file:mr-3 file:rounded file:border-0 file:bg-term-line file:px-3 file:py-1.5 file:text-term-white" />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.imageWidth}</span>
          <input type="number" min="200" step="100" value={width} onChange={(event) => setWidth(Number(event.target.value))} className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-term-white outline-none focus:border-term-cyan" />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.imageQuality}: {Math.round(quality * 100)}%</span>
          <input type="range" min="0.4" max="0.95" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-term-cyan" />
        </label>
        <button type="button" data-testid="image-shrink" onClick={shrink} className="inline-flex items-center gap-2 rounded-md border border-term-white bg-term-white px-4 py-2 text-sm font-semibold text-term-black hover:border-term-cyan hover:bg-term-cyan">
          <ImageIcon className="h-4 w-4" />
          {t.imageRun}
        </button>
      </div>
      <aside className="rounded-lg border border-term-line bg-term-darker p-4">
        <div className="text-[10px] uppercase tracking-[0.16em] text-term-gray">{t.imageReady}</div>
        {resultUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="" className="mt-3 max-h-56 w-full rounded-md border border-term-line object-contain" />
            <p className="mt-3 text-sm text-term-gray" dir="ltr">{meta}</p>
            <a href={resultUrl} download="shrunk-image.jpg" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-term-white bg-term-white px-4 py-3 text-sm font-semibold text-term-black hover:border-term-cyan hover:bg-term-cyan">
              <Download className="h-4 w-4" />
              {t.download}
            </a>
          </>
        ) : (
          <p className="mt-3 text-sm leading-7 text-term-gray">{toolText[locale].privacy}</p>
        )}
      </aside>
    </Panel>
  )
}

let thmanyahCanvasFontsPromise: Promise<void> | null = null

function ensureThmanyahCanvasFonts() {
  if (typeof document === "undefined" || typeof FontFace === "undefined" || !("fonts" in document)) {
    return Promise.resolve()
  }

  thmanyahCanvasFontsPromise ??= Promise.all([
    new FontFace("Thmanyah Canvas", "url('/fonts/thmanyah/thmanyahsans-Regular.woff2')", { weight: "400" }).load(),
    new FontFace("Thmanyah Canvas", "url('/fonts/thmanyah/thmanyahsans-Bold.woff2')", { weight: "700" }).load(),
  ])
    .then((fonts) => {
      fonts.forEach((font) => document.fonts.add(font))
      return document.fonts.ready.then(() => undefined)
    })
    .catch(() => undefined)

  return thmanyahCanvasFontsPromise
}

function ShareCardTool({ locale }: { locale: Locale }) {
  const t = toolText[locale]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [text, setText] = useState(locale === "ar" ? "الفكرة الجيدة لا تحتاج ضجيجًا كثيرًا." : "好想法不需要太多噪音。")
  const [byline, setByline] = useState(locale === "ar" ? "1byteone" : "1byteone")
  const [theme, setTheme] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function draw() {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      if (locale === "ar") await ensureThmanyahCanvasFonts()

      if (cancelled) return

      const themes = [
        { bg: "#000000", panel: "#0a0a0a", fg: "#ededed", muted: "#8f8f8f", accent: "#50e3c2", line: "#262626" },
        { bg: "#f7f7f4", panel: "#ffffff", fg: "#111111", muted: "#6b7280", accent: "#111111", line: "#d8d8d3" },
        { bg: "#211a16", panel: "#2a211b", fg: "#fff7ed", muted: "#c4a484", accent: "#f59e0b", line: "#5b4030" },
      ]
      const current = themes[theme]
      const rtl = locale === "ar"
      const siteFont = getComputedStyle(document.body).fontFamily || "'IBM Plex Mono', monospace"
      const textFont = rtl ? "'Thmanyah Canvas', sans-serif" : siteFont
      const monoFont = siteFont
  const makerHost = "1byteone"

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawCardBackground(ctx, canvas.width, canvas.height, current.bg, current.panel, current.line)

      ctx.textBaseline = "alphabetic"
      ctx.direction = rtl ? "rtl" : "ltr"
      ctx.textAlign = rtl ? "right" : "left"

      const inset = 74
      const textX = rtl ? canvas.width - inset : inset
      const maxWidth = canvas.width - inset * 2

      drawShareCardHeader(ctx, {
        accent: current.accent,
        bg: current.bg,
        fg: current.fg,
        inset,
        label: rtl ? "بطاقة مشاركة" : "分享卡片",
        makerHost,
        monoFont,
        rtl,
        textFont,
        width: canvas.width,
      })

      ctx.fillStyle = current.accent
      ctx.fillRect(rtl ? canvas.width - inset - 160 : inset, 144, 160, 4)

      ctx.fillStyle = current.fg
      ctx.font = `700 ${rtl ? 72 : 64}px ${textFont}`
      const lastLineY = wrapCanvasText(ctx, text, textX, 320, maxWidth, rtl ? 86 : 78, rtl, 7)

      ctx.fillStyle = current.muted
      ctx.font = `500 30px ${textFont}`
      wrapCanvasText(ctx, byline, textX, Math.max(lastLineY + 78, canvas.height - 150), maxWidth, 42, rtl, 2)

      ctx.direction = "ltr"
      ctx.textAlign = "left"
      ctx.fillStyle = current.accent
      ctx.font = `600 22px ${monoFont}`
      ctx.fillText("termfolio", inset, canvas.height - 72)
      ctx.textAlign = "right"
      ctx.fillText(new Date().getFullYear().toString(), canvas.width - inset, canvas.height - 72)
      drawShareCardMaker(ctx, {
        accent: current.accent,
        makerHost,
        monoFont,
        rtl,
        textFont,
        width: canvas.width,
        y: canvas.height - 104,
      })
    }

    void draw()

    return () => {
      cancelled = true
    }
  }, [byline, locale, text, theme])

  const download = () => {
    canvasRef.current?.toBlob((blob) => {
      if (blob) downloadBlob(blob, "share-card.png")
    })
  }

  return (
    <Panel>
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.cardText}</span>
          <textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-36 w-full rounded-md border border-term-line bg-term-black p-3 text-sm text-term-white outline-none focus:border-term-cyan" />
        </label>
        <Input label={t.cardByline} value={byline} onChange={setByline} />
        <div className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-term-gray">{t.cardTheme}</span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t.cardTheme}>
            {t.themes.map((label, index) => (
              <button
                key={label}
                type="button"
                data-testid={`share-card-theme-${index}`}
                onClick={() => setTheme(index)}
                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                  theme === index
                    ? "border-term-cyan bg-term-cyan text-term-black"
                    : "border-term-line bg-term-black text-term-gray hover:text-term-white"
                }`}
                role="radio"
                aria-checked={theme === index}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button type="button" data-testid="share-card-download" onClick={download} className="inline-flex items-center gap-2 rounded-md border border-term-white bg-term-white px-4 py-2 text-sm font-semibold text-term-black hover:border-term-cyan hover:bg-term-cyan">
          <Download className="h-4 w-4" />
          {t.cardDownload}
        </button>
      </div>
      <aside>
        <canvas ref={canvasRef} data-testid="share-card-canvas" width={1080} height={1080} className="aspect-square w-full rounded-lg border border-term-line bg-term-black" />
      </aside>
    </Panel>
  )
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function getBadgeTextColor(accent: string) {
  return accent === "#111111" ? "#ffffff" : "#000000"
}

function drawShareCardHeader(
  ctx: CanvasRenderingContext2D,
  options: {
    accent: string
    bg: string
    fg: string
    inset: number
    label: string
    makerHost: string
    monoFont: string
    rtl: boolean
    textFont: string
    width: number
  }
) {
  const { accent, bg, fg, inset, label, makerHost, monoFont, rtl, textFont, width } = options
  const badgeHeight = 56
  const badgeY = 60
  const gap = 20

  ctx.save()
  ctx.direction = "ltr"
  ctx.textAlign = rtl ? "right" : "left"
  ctx.textBaseline = "middle"
  ctx.font = `600 28px ${monoFont}`
  ctx.fillStyle = fg

  const hostWidth = ctx.measureText(makerHost).width
  const hostX = rtl ? width - inset : inset
  ctx.fillText(makerHost, hostX, badgeY + badgeHeight / 2)

  ctx.strokeStyle = accent
  ctx.lineWidth = 3
  ctx.beginPath()
  if (rtl) {
    ctx.moveTo(hostX - hostWidth, badgeY + badgeHeight - 2)
    ctx.lineTo(hostX, badgeY + badgeHeight - 2)
  } else {
    ctx.moveTo(hostX, badgeY + badgeHeight - 2)
    ctx.lineTo(hostX + hostWidth, badgeY + badgeHeight - 2)
  }
  ctx.stroke()

  ctx.direction = rtl ? "rtl" : "ltr"
  ctx.textAlign = "center"
  ctx.font = `700 30px ${rtl ? textFont : monoFont}`
  const badgeWidth = Math.ceil(ctx.measureText(label).width) + 36
  const badgeX = rtl ? hostX - hostWidth - gap - badgeWidth : hostX + hostWidth + gap

  ctx.fillStyle = accent
  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 12)
  ctx.fill()

  ctx.fillStyle = getBadgeTextColor(accent)
  ctx.fillText(label, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2 + (rtl ? 2 : 0))

  ctx.globalAlpha = 0.42
  ctx.strokeStyle = accent
  ctx.lineWidth = 1
  drawRoundedRect(ctx, inset, badgeY - 16, width - inset * 2, badgeHeight + 32, 18)
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.fillStyle = bg
  ctx.restore()
}

function drawShareCardMaker(
  ctx: CanvasRenderingContext2D,
  options: {
    accent: string
    makerHost: string
    monoFont: string
    rtl: boolean
    textFont: string
    width: number
    y: number
  }
) {
  const { accent, makerHost, monoFont, rtl, textFont, width, y } = options
  const makerLabel = rtl ? "صُنعت في" : "制作于"
  const x = rtl ? width - 74 : 74

  ctx.save()
  ctx.textBaseline = "alphabetic"
  ctx.direction = rtl ? "rtl" : "ltr"
  ctx.textAlign = rtl ? "right" : "left"
  ctx.fillStyle = accent
  ctx.font = `600 24px ${rtl ? textFont : monoFont}`
  ctx.fillText(makerLabel, x, y)

  const labelWidth = ctx.measureText(makerLabel).width
  const gap = 12
  const hostX = rtl ? x - labelWidth - gap : x + labelWidth + gap

  ctx.direction = "ltr"
  ctx.textAlign = rtl ? "right" : "left"
  ctx.font = `600 24px ${monoFont}`
  ctx.fillText(makerHost, hostX, y)

  const hostWidth = ctx.measureText(makerHost).width
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.beginPath()
  if (rtl) {
    ctx.moveTo(hostX - hostWidth, y + 7)
    ctx.lineTo(hostX, y + 7)
  } else {
    ctx.moveTo(hostX, y + 7)
    ctx.lineTo(hostX + hostWidth, y + 7)
  }
  ctx.stroke()
  ctx.restore()
}

function drawCardBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bg: string,
  panel: string,
  line: string
) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, panel)
  gradient.addColorStop(0.55, bg)
  gradient.addColorStop(1, panel)
  ctx.fillStyle = gradient
  ctx.fillRect(32, 32, width - 64, height - 64)

  ctx.strokeStyle = line
  ctx.lineWidth = 2
  ctx.strokeRect(42, 42, width - 84, height - 84)

  ctx.globalAlpha = 0.22
  for (let x = 120; x < width; x += 120) {
    ctx.beginPath()
    ctx.moveTo(x, 70)
    ctx.lineTo(x - 260, height - 70)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  rtl: boolean,
  maxLines = 99
) {
  const words = text.split(/\s+/)
  let line = ""
  let lines = 0
  words.forEach((word) => {
    if (lines >= maxLines) return
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y)
      lines += 1
      line = word
      y += lineHeight
    } else {
      line = testLine
    }
  })
  if (line && lines < maxLines) {
    ctx.fillText(line, x, y)
  }
  if (rtl) ctx.textAlign = "left"
  return y
}

export default function EverydayToolClient({ slug, locale = "en" }: EverydayToolClientProps) {
  if (slug === "short-link") return <ShortLinkTool locale={locale} />
  if (slug === "qr") return <QrTool locale={locale} />
  if (slug === "whatsapp") return <WhatsAppTool locale={locale} />
  if (slug === "event") return <EventTool locale={locale} />
  if (slug === "image") return <ImageTool locale={locale} />
  if (slug === "share-card") return <ShareCardTool locale={locale} />

  return (
    <div className="rounded-lg border border-term-line bg-term-darker p-5 text-sm text-term-gray">
      {toolText[locale].privacy}
    </div>
  )
}
