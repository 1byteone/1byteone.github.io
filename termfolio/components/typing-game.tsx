"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Stay hungry, stay foolish.",
  "Code is poetry written in logic.",
  "First, solve the problem. Then, write the code.",
  "The best error message is the one that never shows up.",
  "Simplicity is the soul of efficiency.",
  "Programs must be written for people to read.",
  "Any fool can write code that a computer can understand.",
  "Good programmers write code. Great programmers reuse code.",
  "Talk is cheap. Show me the code.",
  "The advance of technology is based on making it fit in.",
  "Measuring programming progress by lines of code is futile.",
  "Make it work, make it right, make it fast.",
  "The function of good software is to make the complex appear simple.",
  "Perfection is achieved not when there is nothing more to add.",
  "Experience is the name everyone gives to their mistakes.",
  "It is not enough for code to work.",
  "The computer was born to solve problems that did not exist before.",
  "Before software can be reusable it first has to be usable.",
  "In theory there is no difference between theory and practice.",
  "Walking on water and developing software are easy if both are frozen.",
  "Software is like entropy: hard to grasp, weighs nothing, obeys the second law.",
  "The best way to predict the future is to implement it.",
  "A language that does not affect the way you think is not worth knowing.",
  "Technology is best when it brings people together.",
  "Computers are fast, but programmers keep things slow.",
  "The most dangerous phrase is we have always done it this way.",
  "Quality means doing it right when nobody is looking.",
  "Data is the new oil. But like oil, it must be refined.",
  "There are two ways to write error-free programs; only the third works.",
  "Weeks of programming can save you hours of planning.",
]

const WORD_LIST = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "code", "data", "type", "test",
]

type GameMode = "quote" | "timed" | "words"
type TimeDuration = 15 | 30 | 60
type Difficulty = "normal" | "strict" | "blind"

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

function generateWords(count: number): string {
  const words = []
  for (let i = 0; i < count; i++) {
    words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)])
  }
  return words.join(" ")
}

interface TypingGameProps {
  onClose: () => void
}

export default function TypingGame({ onClose }: TypingGameProps) {
  const [mode, setMode] = useState<GameMode>("quote")
  const [timeDuration, setTimeDuration] = useState<TimeDuration>(30)
  const [wordCount] = useState(25)
  const [difficulty, setDifficulty] = useState<Difficulty>("normal")
  const [quote, setQuote] = useState("")
  const [typed, setTyped] = useState("")
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [wpmHistory, setWpmHistory] = useState<number[]>([])
  const [personalBest, setPersonalBest] = useState(0)
  const [showConfig, setShowConfig] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load personal best
  useEffect(() => {
    try {
      const saved = localStorage.getItem("typing-best-wpm")
      if (saved) setPersonalBest(parseInt(saved, 10))
    } catch { /* ignore */ }
  }, [])

  const initGame = useCallback(() => {
    if (mode === "quote") {
      setQuote(getRandomQuote())
    } else if (mode === "timed") {
      setQuote(generateWords(100))
      setTimeLeft(timeDuration)
    } else {
      setQuote(generateWords(wordCount))
    }
    setTyped("")
    setStarted(false)
    setFinished(false)
    setStartTime(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setElapsed(0)
    setWpmHistory([])
    setShowConfig(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [mode, timeDuration, wordCount])

  const finishGame = useCallback((finalTyped: string, finalElapsed: number) => {
    setFinished(true)
    const minutes = finalElapsed / 60
    const words = finalTyped.split(" ").filter(Boolean).length
    const finalWpm = minutes > 0 ? Math.round(words / minutes) : 0
    setWpm(finalWpm)

    let errs = 0
    for (let i = 0; i < finalTyped.length; i++) {
      if (finalTyped[i] !== quote[i]) errs++
    }
    const acc = finalTyped.length > 0 ? Math.round(((finalTyped.length - errs) / finalTyped.length) * 100) : 100
    setAccuracy(acc)

    if (finalWpm > personalBest) {
      setPersonalBest(finalWpm)
      try { localStorage.setItem("typing-best-wpm", String(finalWpm)) } catch { /* ignore */ }
    }
  }, [quote, personalBest])

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (finished) return
      let val = e.target.value

      if (difficulty === "strict" && val.length < typed.length) {
        return // no backspace in strict mode
      }

      if (!started) {
        setStarted(true)
        setStartTime(Date.now())
      }
      setTyped(val)

      let errs = 0
      for (let i = 0; i < val.length; i++) {
        if (val[i] !== quote[i]) errs++
      }
      setErrors(errs)
      setAccuracy(val.length > 0 ? Math.round(((val.length - errs) / val.length) * 100) : 100)

      // Check if finished (quote/words mode)
      if (mode !== "timed" && val.length >= quote.length) {
        const el = (Date.now() - (startTime || Date.now())) / 1000
        finishGame(val, el)
      }
    },
    [started, startTime, quote, finished, difficulty, typed, mode, finishGame]
  )

  // Live timer
  useEffect(() => {
    if (!started || finished) return
    const iv = setInterval(() => {
      const el = (Date.now() - startTime) / 1000
      setElapsed(el)

      // Track WPM history every 2s
      const words = typed.split(" ").filter(Boolean).length
      const minutes = el / 60
      const currentWpm = minutes > 0 ? Math.round(words / minutes) : 0
      setWpmHistory((prev) => {
        if (prev.length < Math.floor(el / 2)) return [...prev, currentWpm]
        return prev
      })

      // Timed mode countdown
      if (mode === "timed") {
        const remaining = timeDuration - el
        setTimeLeft(Math.max(0, remaining))
        if (remaining <= 0) {
          finishGame(typed, timeDuration)
        }
      }
    }, 100)
    return () => clearInterval(iv)
  }, [started, finished, startTime, typed, mode, timeDuration, finishGame])

  // WPM sparkline
  const renderSparkline = () => {
    if (wpmHistory.length < 2) return null
    const max = Math.max(...wpmHistory, 1)
    const bars = wpmHistory.slice(-20)
    return (
      <div className="flex items-end gap-px h-6">
        {bars.map((v, i) => (
          <div
            key={i}
            className="w-1 bg-[var(--term-cyan)] rounded-t-sm transition-all"
            style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
          />
        ))}
      </div>
    )
  }

  // Config screen
  if (showConfig) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--term-black)]/80 backdrop-blur-sm">
        <div className="w-full max-w-lg border border-[var(--term-line)] bg-[var(--term-darker)] rounded-xl overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--term-line)]">
            <span className="text-[var(--term-white)] text-xs uppercase tracking-[0.14em]">Typing Speed Test</span>
            <button onClick={onClose} className="text-[var(--term-gray)] hover:text-[var(--term-white)] text-xs">[esc]</button>
          </div>
          <div className="p-6 space-y-5">
            {personalBest > 0 && (
              <div className="text-center text-xs text-[var(--term-gray)]">
                Personal Best: <span className="text-[var(--term-cyan)] font-bold">{personalBest} WPM</span>
              </div>
            )}

            {/* Mode */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">Mode</div>
              <div className="flex gap-2">
                {([["quote", "Quote"], ["timed", "Timed"], ["words", "Words"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === key
                        ? "bg-[var(--term-cyan)] text-[var(--term-black)]"
                        : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time duration (only for timed) */}
            {mode === "timed" && (
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">Duration</div>
                <div className="flex gap-2">
                  {([15, 30, 60] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeDuration(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        timeDuration === t
                          ? "bg-[var(--term-cyan)] text-[var(--term-black)]"
                          : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)]">Difficulty</div>
              <div className="flex gap-2">
                {([["normal", "Normal"], ["strict", "Strict"], ["blind", "Blind"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      difficulty === key
                        ? "bg-[var(--term-cyan)] text-[var(--term-black)]"
                        : "bg-[var(--term-line)] text-[var(--term-gray)] hover:text-[var(--term-white)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-[var(--term-gray)]">
                {difficulty === "normal" && "Standard typing with backspace allowed"}
                {difficulty === "strict" && "No backspace — every keystroke counts"}
                {difficulty === "blind" && "No error highlighting — type by feel"}
              </div>
            </div>

            <button
              onClick={initGame}
              className="w-full py-3 bg-[var(--term-cyan)] text-[var(--term-black)] rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--term-black)]/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-[var(--term-line)] bg-[var(--term-darker)] rounded-xl overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--term-line)]">
          <span className="text-[var(--term-white)] text-xs uppercase tracking-[0.14em]">
            Typing — {mode === "timed" ? `${timeDuration}s` : mode} · {difficulty}
          </span>
          <div className="flex items-center gap-4 text-xs">
            {started && !finished && mode === "timed" && (
              <span className={`font-bold tabular-nums ${timeLeft < 5 ? "text-red-400" : "text-[var(--term-cyan)]"}`}>
                {Math.ceil(timeLeft)}s
              </span>
            )}
            {started && !finished && mode !== "timed" && (
              <span className="text-[var(--term-cyan)] tabular-nums">{elapsed.toFixed(1)}s</span>
            )}
            <button onClick={onClose} className="text-[var(--term-gray)] hover:text-[var(--term-white)]">[esc]</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Quote Display */}
          <div className="font-mono text-lg leading-relaxed select-none min-h-[4rem]">
            {quote.split("").map((char, i) => {
              let color = "text-[var(--term-gray)]/40"
              if (difficulty === "blind") {
                color = i < typed.length ? "text-[var(--term-white)]" : "text-[var(--term-gray)]/40"
              } else if (i < typed.length) {
                color = typed[i] === char ? "text-[var(--term-green)]" : "text-red-400 bg-red-400/10"
              }
              if (i === typed.length) {
                color = "text-[var(--term-white)] border-b-2 border-[var(--term-cyan)]"
              }
              return (
                <span key={i} className={`${color} transition-colors duration-75`}>
                  {char}
                </span>
              )
            })}
          </div>

          {/* Input */}
          {!finished ? (
            <input
              ref={inputRef}
              value={typed}
              onChange={handleInput}
              onKeyDown={(e) => { if (e.key === "Escape") onClose() }}
              className="w-full bg-[var(--term-black)] border border-[var(--term-line)] rounded-lg px-4 py-3 text-sm text-[var(--term-white)] font-mono outline-none focus:border-[var(--term-cyan)] transition-colors"
              placeholder="start typing..."
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center rounded-lg bg-[var(--term-black)] border border-[var(--term-line)] p-3">
                  <div className="text-2xl font-bold text-[var(--term-cyan)]">{wpm}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mt-1">WPM</div>
                </div>
                <div className="text-center rounded-lg bg-[var(--term-black)] border border-[var(--term-line)] p-3">
                  <div className="text-2xl font-bold text-[var(--term-green)]">{accuracy}%</div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mt-1">Accuracy</div>
                </div>
                <div className="text-center rounded-lg bg-[var(--term-black)] border border-[var(--term-line)] p-3">
                  <div className="text-2xl font-bold text-[var(--term-white)]">{elapsed.toFixed(1)}s</div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mt-1">Time</div>
                </div>
                <div className="text-center rounded-lg bg-[var(--term-black)] border border-[var(--term-line)] p-3">
                  <div className="text-2xl font-bold text-[var(--term-cyan)]">{personalBest}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mt-1">Best</div>
                </div>
              </div>

              {/* WPM sparkline */}
              {wpmHistory.length > 1 && (
                <div className="rounded-lg bg-[var(--term-black)] border border-[var(--term-line)] p-3">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--term-gray)] mb-2">WPM Over Time</div>
                  {renderSparkline()}
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={initGame} className="flex-1 py-2.5 bg-[var(--term-cyan)] text-[var(--term-black)] rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                  Try Again
                </button>
                <button onClick={() => setShowConfig(true)} className="px-4 py-2.5 bg-[var(--term-line)] text-[var(--term-gray)] rounded-lg text-xs uppercase tracking-wider hover:text-[var(--term-white)] transition-colors">
                  Settings
                </button>
                <button onClick={onClose} className="px-4 py-2.5 bg-[var(--term-line)] text-[var(--term-gray)] rounded-lg text-xs uppercase tracking-wider hover:text-[var(--term-white)] transition-colors">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Live Stats Bar */}
          {started && !finished && (
            <div className="flex items-center gap-6 text-xs text-[var(--term-gray)]">
              <span>WPM: <span className="text-[var(--term-cyan)] tabular-nums">{elapsed > 0 ? Math.round((typed.split(" ").filter(Boolean).length / (elapsed / 60))) : 0}</span></span>
              <span>Accuracy: <span className="text-[var(--term-green)] tabular-nums">{accuracy}%</span></span>
              <span>Errors: <span className={errors > 0 ? "text-red-400" : "text-[var(--term-green)]"}>{errors}</span></span>
              <span className="ml-auto">{typed.length}/{quote.length}</span>
              <div className="w-20">{renderSparkline()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
