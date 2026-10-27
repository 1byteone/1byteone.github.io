"use client"

import { useState } from "react"
import { siteConfig } from "@/content/site"

export default function CalEmbed() {
  const [loaded, setLoaded] = useState(false)

  if (!siteConfig.calEmbedUrl) {
    return (
      <div className="border border-term-line bg-term-darker p-5 text-sm text-term-gray">
        <div className="cli-topline">日历通道</div>
        <p className="mt-3 leading-7">目前通过邮件安排时间。</p>
        <a href={`mailto:${siteConfig.email}`} className="mt-2 inline-block text-term-cyan hover:underline">
          {siteConfig.email} -&gt;
        </a>
      </div>
    )
  }

  // Extract display path from calUrl (e.g. "cal.com/walhamed")
  const calDisplay = siteConfig.calUrl.replace(/^https?:\/\//, "").replace(/\/\d+min$/, "")

  return (
    <div className="border border-term-line bg-term-darker rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-term-line text-xs uppercase tracking-[0.14em] text-term-gray">
        <span>
          <span className="text-term-cyan">$</span> {calDisplay}
        </span>
        <span>预约交流</span>
      </div>
      <div className="relative" style={{ minHeight: 500 }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="space-y-2 text-center">
              <div className="text-term-gray text-xs uppercase tracking-[0.14em] animate-pulse">
                正在加载日历...
              </div>
              <div className="flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-term-cyan animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <iframe
          src={siteConfig.calEmbedUrl}
          title={`与 ${siteConfig.name} 预约交流`}
          className="w-full border-0"
          style={{ height: 700, minHeight: 500 }}
          onLoad={() => setLoaded(true)}
          allow="payment"
        />
      </div>
      <div className="px-4 py-2 border-t border-term-line text-[10px] text-term-gray">
        更习惯邮件？{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-term-cyan hover:underline">
          {siteConfig.email}
        </a>
      </div>
    </div>
  )
}
