import type { Locale } from "@/content/locale"

export function formatPostDate(value: string, locale: Locale = "en") {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
