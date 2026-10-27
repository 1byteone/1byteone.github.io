"use client"

import { useMemo, useState } from "react"
import { Copy, Plus, RotateCcw, Trash2 } from "lucide-react"
import { localeCopy, type Locale } from "@/content/locale"

type Person = {
  id: number
  name: string
  weight: number
  paid: number
}

interface SplitterClientProps {
  locale?: Locale
}

const initialPeople: Person[] = [
  { id: 1, name: "杨劲松", weight: 1, paid: 138 },
  { id: 2, name: "朋友", weight: 1, paid: 0 },
]

const labels = {
  en: {
    bill: "账单总额",
    service: "服务费",
    tax: "税费",
    people: "参与人",
    addPerson: "添加参与人",
    reset: "重置",
    copy: "复制结果",
    copied: "已复制",
    name: "姓名",
    weight: "份数",
    weightHelp: "1 = 一份均摊；承担两个人时填 2，半份填 0.5。",
    total: "合计",
    each: "分摊结果",
    note: "群聊消息",
    messagePreview: "可直接发送的说明",
    paid: "已支付",
    paidTotal: "已支付合计",
    shareAmount: "应承担金额",
    owes: "还需支付",
    gets: "应收回",
    even: "已结清",
    personLabel: "参与人",
    finalBalance: "结算结果",
    peopleDetails: "参与人明细",
    settlement: "最终转账",
    noTransfers: "无需转账。",
    paysTo: "支付给",
    unpaid: "尚未支付",
    overpaid: "已超额支付",
    empty: "至少添加一名参与人才能分摊账单。",
  },
  ar: {
    bill: "إجمالي الفاتورة",
    service: "رسوم الخدمة",
    tax: "الضريبة",
    people: "الأشخاص",
    addPerson: "إضافة شخص",
    reset: "إعادة ضبط",
    copy: "نسخ النتيجة",
    copied: "تم النسخ",
    name: "الاسم",
    weight: "الحصص",
    weightHelp: "الحصص تعني كم شخصًا يمثله هذا الاسم في القسمة. ١ = حصة عادية، ٢ = حصتين، ٠٫٥ = نصف حصة.",
    total: "الإجمالي",
    each: "النتيجة",
    note: "رسالة جاهزة للمجموعة",
    messagePreview: "نص الرسالة",
    paid: "دفع مسبقًا",
    paidTotal: "المدفوع حتى الآن",
    shareAmount: "حصته من الفاتورة",
    owes: "باقي عليه",
    gets: "يسترجع",
    even: "متوازن",
    personLabel: "الشخص",
    finalBalance: "بعد الحساب",
    peopleDetails: "تفاصيل الأشخاص",
    settlement: "التحويلات النهائية",
    noTransfers: "لا توجد تحويلات مطلوبة.",
    paysTo: "يرسل إلى",
    unpaid: "نقص في المدفوعات",
    overpaid: "مدفوع زيادة",
    empty: "أضف شخصًا واحدًا على الأقل.",
  },
} as const

function formatMoney(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 2,
  }).format(value || 0)
}

function isolateText(value: string, locale: Locale) {
  if (locale !== "ar") return value
  return `\u2068${value}\u2069`
}

export default function SplitterClient({ locale = "en" }: SplitterClientProps) {
  const copy = localeCopy[locale]
  const t = labels[locale]
  const [bill, setBill] = useState(120)
  const [servicePercent, setServicePercent] = useState(0)
  const [taxPercent, setTaxPercent] = useState(15)
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [copied, setCopied] = useState(false)
  const captionClass =
    locale === "ar"
      ? "text-xs font-medium leading-6 text-term-gray"
      : "text-[10px] uppercase tracking-[0.14em] text-term-gray"
  const compactCaptionClass =
    locale === "ar"
      ? "text-[11px] font-medium leading-5 text-term-gray"
      : "text-[10px] uppercase tracking-[0.14em] text-term-gray"

  const calculation = useMemo(() => {
    const safeBill = Math.max(0, bill)
    const service = safeBill * (Math.max(0, servicePercent) / 100)
    const taxable = safeBill + service
    const tax = taxable * (Math.max(0, taxPercent) / 100)
    const total = taxable + tax
    const totalWeight = people.reduce((sum, person) => sum + Math.max(0, person.weight), 0)
    const totalPaid = people.reduce((sum, person) => sum + Math.max(0, person.paid), 0)
    const shares = people.map((person) => {
      const weight = Math.max(0, person.weight)
      const amount = totalWeight > 0 ? (total * weight) / totalWeight : 0
      const paid = Math.max(0, person.paid)
      return {
        ...person,
        amount,
        paid,
        balance: paid - amount,
      }
    })
    const debtors = shares
      .filter((person) => person.balance < -0.01)
      .map((person) => ({ name: person.name || t.name, amount: Math.abs(person.balance) }))
    const creditors = shares
      .filter((person) => person.balance > 0.01)
      .map((person) => ({ name: person.name || t.name, amount: person.balance }))
    const transfers: Array<{ from: string; to: string; amount: number }> = []
    let debtorIdx = 0
    let creditorIdx = 0

    while (debtorIdx < debtors.length && creditorIdx < creditors.length) {
      const debtor = debtors[debtorIdx]
      const creditor = creditors[creditorIdx]
      const amount = Math.min(debtor.amount, creditor.amount)
      if (amount > 0.01) {
        transfers.push({ from: debtor.name, to: creditor.name, amount })
      }
      debtor.amount -= amount
      creditor.amount -= amount
      if (debtor.amount <= 0.01) debtorIdx += 1
      if (creditor.amount <= 0.01) creditorIdx += 1
    }

    return { service, tax, total, totalPaid, totalWeight, shares, transfers }
  }, [bill, people, servicePercent, t.name, taxPercent])

  const settlementText = useMemo(() => {
    if (calculation.shares.length === 0) return t.empty
    const personLines = calculation.shares.map((person) => {
      const name = isolateText(person.name || t.name, locale)
      const status =
        Math.abs(person.balance) < 0.01
          ? t.even
          : person.balance < 0
            ? `${t.owes} ${formatMoney(Math.abs(person.balance), locale)}`
            : `${t.gets} ${formatMoney(person.balance, locale)}`

      return locale === "ar"
        ? `${t.personLabel}: ${name}\n  ${t.shareAmount}: ${formatMoney(person.amount, locale)}\n  ${t.paid}: ${formatMoney(person.paid, locale)}\n  ${t.finalBalance}: ${status}`
        : `${t.personLabel}: ${name}\n  ${t.shareAmount}: ${formatMoney(person.amount, locale)}\n  ${t.paid}: ${formatMoney(person.paid, locale)}\n  ${t.finalBalance}: ${status}`
    })
    const transferLines =
      calculation.transfers.length > 0
        ? calculation.transfers.map((transfer) => {
            const from = isolateText(transfer.from, locale)
            const to = isolateText(transfer.to, locale)
            return `${from} ${t.paysTo} ${to}: ${formatMoney(transfer.amount, locale)}`
          })
        : [t.noTransfers]

    const lines = [
      `${t.total}: ${formatMoney(calculation.total, locale)}`,
      `${t.paidTotal}: ${formatMoney(calculation.totalPaid, locale)}`,
      "",
      `${t.peopleDetails}:`,
      ...personLines,
      "",
      `${t.settlement}:`,
      ...transferLines,
    ]

    const delta = calculation.total - calculation.totalPaid
    if (Math.abs(delta) > 0.01) {
      lines.push(
        delta > 0
          ? `${t.unpaid}: ${formatMoney(delta, locale)}`
          : `${t.overpaid}: ${formatMoney(Math.abs(delta), locale)}`
      )
    }

    return lines.join("\n")
  }, [calculation.shares, calculation.total, calculation.totalPaid, calculation.transfers, locale, t])

  const updatePerson = (id: number, patch: Partial<Person>) => {
    setPeople((current) =>
      current.map((person) => (person.id === id ? { ...person, ...patch } : person))
    )
  }

  const copyResult = async () => {
    await navigator.clipboard?.writeText(settlementText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const addPerson = () => {
    setPeople((current) => [
      ...current,
      { id: Date.now(), name: locale === "ar" ? `شخص ${current.length + 1}` : `Person ${current.length + 1}`, weight: 1, paid: 0 },
    ])
  }

  const reset = () => {
    setBill(120)
    setServicePercent(0)
    setTaxPercent(15)
    setPeople(initialPeople)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="cli-frame overflow-hidden">
        <div className="flex items-center justify-between border-b border-term-line px-4 py-3 text-xs text-term-gray">
          <span className="uppercase tracking-[0.16em]" dir="ltr">$ split bill</span>
          <span>{copy.tools.splitter.title}</span>
        </div>

        <div className="space-y-6 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { id: "splitter-bill", testId: "splitter-bill", label: t.bill, value: bill, suffix: "元", set: setBill },
              { id: "splitter-service", testId: "splitter-service", label: t.service, value: servicePercent, suffix: "%", set: setServicePercent },
              { id: "splitter-tax", testId: "splitter-tax", label: t.tax, value: taxPercent, suffix: "%", set: setTaxPercent },
            ].map((field) => (
              <label key={field.label} className="space-y-2">
                <span className={captionClass} id={`${field.id}-label`}>
                  {field.label}
                </span>
                <span className="flex items-center gap-2 rounded-md border border-term-line bg-term-darker px-3 py-2 focus-within:border-term-cyan">
                  <input
                    id={field.id}
                    data-testid={field.testId}
                    aria-labelledby={`${field.id}-label`}
                    type="number"
                    min="0"
                    value={field.value}
                    onChange={(event) => field.set(Number(event.target.value))}
                    className="min-w-0 flex-1 bg-transparent text-term-white outline-none"
                  />
                  <span className="text-xs text-term-gray" dir="ltr">{field.suffix}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="max-w-2xl space-y-1">
                <h2 className="text-lg font-semibold text-term-white">{t.people}</h2>
                <p className="text-sm leading-7 text-term-gray">{t.weightHelp}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addPerson}
                  data-testid="splitter-add-person"
                  className="inline-flex items-center gap-2 rounded-md border border-term-line px-3 py-2 text-xs text-term-white hover:border-term-cyan hover:text-term-cyan"
                >
                  <Plus className="h-4 w-4" />
                  {t.addPerson}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-md border border-term-line px-3 py-2 text-xs text-term-gray hover:text-term-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t.reset}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {people.map((person) => (
                <div key={person.id} className="grid gap-2 rounded-lg border border-term-line bg-term-darker p-3 sm:grid-cols-[minmax(0,1fr)_112px_132px_44px]">
                  <label className="space-y-1">
                    <span className={compactCaptionClass}>{t.name}</span>
                    <input
                      value={person.name}
                      onChange={(event) => updatePerson(person.id, { name: event.target.value })}
                      className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-sm text-term-white outline-none focus:border-term-cyan"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className={compactCaptionClass}>{t.weight}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={person.weight}
                      onChange={(event) => updatePerson(person.id, { weight: Number(event.target.value) })}
                      className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-sm text-term-white outline-none focus:border-term-cyan"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className={compactCaptionClass}>{t.paid}</span>
                    <input
                      data-testid={`splitter-paid-${person.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={person.paid}
                      onChange={(event) => updatePerson(person.id, { paid: Number(event.target.value) })}
                      className="w-full rounded-md border border-term-line bg-term-black px-3 py-2 text-sm text-term-white outline-none focus:border-term-cyan"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setPeople((current) => current.filter((item) => item.id !== person.id))}
                    className="flex min-h-11 items-center justify-center rounded-md border border-term-line text-term-gray hover:border-red-400 hover:text-red-400"
                    aria-label={`Remove ${person.name || t.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-lg border border-term-line bg-term-darker p-4">
          <div className={captionClass}>{t.total}</div>
          <div className="mt-2 text-3xl font-semibold text-term-white">
            {formatMoney(calculation.total, locale)}
          </div>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-md border border-term-line bg-term-black p-3">
              <div className={compactCaptionClass}>{t.service}</div>
              <div className="mt-1 text-term-white">{formatMoney(calculation.service, locale)}</div>
            </div>
            <div className="rounded-md border border-term-line bg-term-black p-3">
              <div className={compactCaptionClass}>{t.tax}</div>
              <div className="mt-1 text-term-white">{formatMoney(calculation.tax, locale)}</div>
            </div>
            <div className="rounded-md border border-term-line bg-term-black p-3">
              <div className={compactCaptionClass}>{t.paidTotal}</div>
              <div className="mt-1 text-term-white">{formatMoney(calculation.totalPaid, locale)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-term-line bg-term-darker p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className={captionClass}>{t.each}</div>
              <h2 className="mt-1 text-lg font-semibold text-term-white">{t.note}</h2>
            </div>
            <button
              type="button"
              onClick={copyResult}
              data-testid="splitter-copy-result"
              className="inline-flex items-center gap-2 rounded-md border border-term-line px-3 py-2 text-xs text-term-white hover:border-term-cyan hover:text-term-cyan"
            >
              <Copy className="h-4 w-4" />
              {copied ? t.copied : t.copy}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {calculation.shares.length > 0 ? (
              calculation.shares.map((person) => {
                const balanceLabel =
                  Math.abs(person.balance) < 0.01
                    ? t.even
                    : person.balance < 0
                      ? t.owes
                      : t.gets
                const balanceClass =
                  Math.abs(person.balance) < 0.01
                    ? "text-term-gray"
                    : person.balance < 0
                      ? "text-amber-300"
                      : "text-term-green"

                return (
                  <div key={person.id} className="space-y-2 border-t border-term-line py-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <bdi className="min-w-0 truncate text-term-gray" dir="auto">{person.name || t.name}</bdi>
                      <span className={`font-semibold ${balanceClass}`}>
                        {balanceLabel}: {formatMoney(Math.abs(person.balance), locale)}
                      </span>
                    </div>
                    <div className="grid gap-2 text-xs text-term-gray sm:grid-cols-2">
                      <span>{t.shareAmount}: <span className="text-term-white">{formatMoney(person.amount, locale)}</span></span>
                      <span>{t.paid}: <span className="text-term-white">{formatMoney(person.paid, locale)}</span></span>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm leading-7 text-term-gray">{t.empty}</p>
            )}
          </div>

          <div className="mt-4 rounded-md border border-term-line bg-term-black p-4">
            <div className={compactCaptionClass}>{t.messagePreview}</div>
            <div
              data-testid="splitter-message-preview"
              className={`mt-3 whitespace-pre-wrap break-words text-sm leading-8 text-term-white [font-variant-numeric:tabular-nums] [unicode-bidi:plaintext] ${locale === "ar" ? "font-arabic-site" : "font-mono"}`}
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              {settlementText}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
