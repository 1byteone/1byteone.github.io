"use client"

import { useEffect, useState } from "react"

export default function LiveClock() {
  const [stamp, setStamp] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const day = now.toLocaleDateString("en-US", { weekday: "long" })
      const time = now.toLocaleTimeString("en-US", { hour12: false })
      setStamp(`${day} // ${time}`)
    }

    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return <span>{stamp || "loading // --:--:--"}</span>
}
