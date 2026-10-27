"use client"

import { useEffect, useState } from "react"

export default function LiveClock() {
  const [stamp, setStamp] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const day = now.toLocaleDateString("zh-CN", { weekday: "long" })
      const time = now.toLocaleTimeString("zh-CN", { hour12: false })
      setStamp(`${day} // ${time}`)
    }

    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return <span>{stamp || "加载中 // --:--:--"}</span>
}
