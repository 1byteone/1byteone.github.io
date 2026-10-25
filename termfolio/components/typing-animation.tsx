"use client"

import { useState, useEffect } from "react"

interface TypingAnimationProps {
  content: React.ReactNode[]
  typingSpeed?: number
  delayStart?: number
  className?: string
}

export default function TypingAnimation({
  content,
  typingSpeed = 25,
  delayStart = 1000,
  className = "",
}: TypingAnimationProps) {
  const [renderedNodes, setRenderedNodes] = useState<React.ReactNode[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasStarted(true)
    }, delayStart)
    return () => clearTimeout(timeout)
  }, [delayStart])

  useEffect(() => {
    if (!hasStarted) return
    if (currentIndex >= content.length) return

    const timeout = setTimeout(() => {
      setRenderedNodes(prev => [...prev, content[currentIndex]])
      setCurrentIndex(prev => prev + 1)
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentIndex, hasStarted, content, typingSpeed])

  return (
    <div className={className}>
      {renderedNodes}
      {currentIndex < content.length && (
        <span className="inline-block w-[0.6em] h-[1.2rem] bg-term-white ml-1 align-middle animate-blink"></span>
      )}
    </div>
  )
}

