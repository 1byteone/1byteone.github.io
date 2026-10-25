"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const GRID_SIZE = 20
const CELL_SIZE = 18
const BASE_SPEED = 150
const SPEED_INCREMENT = 5
const MIN_SPEED = 60

type Position = { x: number; y: number }
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type GameState = "waiting" | "playing" | "gameover"

interface SnakeGameProps {
  onClose: () => void
}

function randomFood(snake: Position[]): Position {
  let pos: Position
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y))
  return pos
}

function getSpeedLevel(score: number): number {
  return Math.floor(score / 3) + 1
}

function getInterval(score: number): number {
  return Math.max(MIN_SPEED, BASE_SPEED - getSpeedLevel(score) * SPEED_INCREMENT)
}

export default function SnakeGame({ onClose }: SnakeGameProps) {
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 5, y: 5 })
  const [direction, setDirection] = useState<Direction>("RIGHT")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const dirRef = useRef<Direction>("RIGHT")
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }])
  const foodRef = useRef<Position>({ x: 5, y: 5 })
  const scoreRef = useRef(0)
  const gameStateRef = useRef<GameState>("waiting")
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("snake-highscore")
      if (saved) setHighScore(parseInt(saved, 10))
    } catch {
      // localStorage unavailable
    }
  }, [])

  const resetGame = useCallback(() => {
    const initial: Position[] = [{ x: 10, y: 10 }]
    const newFood = randomFood(initial)
    setSnake(initial)
    setFood(newFood)
    setDirection("RIGHT")
    setScore(0)
    snakeRef.current = initial
    foodRef.current = newFood
    dirRef.current = "RIGHT"
    scoreRef.current = 0
  }, [])

  const endGame = useCallback(() => {
    if (loopRef.current) {
      clearInterval(loopRef.current)
      loopRef.current = null
    }
    setGameState("gameover")
    gameStateRef.current = "gameover"
    const finalScore = scoreRef.current
    setHighScore((prev) => {
      const best = Math.max(prev, finalScore)
      try {
        localStorage.setItem("snake-highscore", String(best))
      } catch {
        // localStorage unavailable
      }
      return best
    })
  }, [])

  const tick = useCallback(() => {
    const currentSnake = snakeRef.current
    const currentFood = foodRef.current
    const dir = dirRef.current
    const head = currentSnake[0]

    const deltas: Record<Direction, Position> = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    }
    const d = deltas[dir]
    const newHead: Position = { x: head.x + d.x, y: head.y + d.y }

    // Wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      endGame()
      return
    }

    // Self collision
    if (currentSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      endGame()
      return
    }

    const ate = newHead.x === currentFood.x && newHead.y === currentFood.y
    const newSnake = [newHead, ...currentSnake.slice(0, ate ? currentSnake.length : currentSnake.length - 1)]

    snakeRef.current = newSnake
    setSnake(newSnake)

    if (ate) {
      const newScore = scoreRef.current + 1
      scoreRef.current = newScore
      setScore(newScore)
      const newFood = randomFood(newSnake)
      foodRef.current = newFood
      setFood(newFood)

      // Restart interval with new speed
      if (loopRef.current) clearInterval(loopRef.current)
      loopRef.current = setInterval(tick, getInterval(newScore))
    }
  }, [endGame])

  const startGame = useCallback(() => {
    resetGame()
    setGameState("playing")
    gameStateRef.current = "playing"
    if (loopRef.current) clearInterval(loopRef.current)
    loopRef.current = setInterval(tick, BASE_SPEED)
  }, [resetGame, tick])

  useEffect(() => {
    return () => {
      if (loopRef.current) clearInterval(loopRef.current)
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (loopRef.current) clearInterval(loopRef.current)
        onClose()
        return
      }

      const current = gameStateRef.current

      if (current === "waiting") {
        startGame()
        return
      }

      if (current === "gameover") {
        if (e.key === "r" || e.key === "R") {
          startGame()
        }
        return
      }

      const opposites: Record<Direction, Direction> = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      }

      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        W: "UP",
        s: "DOWN",
        S: "DOWN",
        a: "LEFT",
        A: "LEFT",
        d: "RIGHT",
        D: "RIGHT",
      }

      const newDir = keyMap[e.key]
      if (newDir && newDir !== opposites[dirRef.current]) {
        dirRef.current = newDir
        setDirection(newDir)
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
      }
    },
    [onClose, startGame]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const isSnakeHead = (x: number, y: number) => snake[0]?.x === x && snake[0]?.y === y
  const isSnakeBody = (x: number, y: number) => snake.some((s, i) => i > 0 && s.x === x && s.y === y)
  const isFood = (x: number, y: number) => food.x === x && food.y === y

  const speedLevel = getSpeedLevel(score)

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--term-black)]/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-[var(--term-line)] bg-[var(--term-darker)] rounded-xl overflow-hidden shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--term-line)]">
          <span className="text-[var(--term-white)] text-xs uppercase tracking-[0.14em]">Snake</span>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[var(--term-gray)] tabular-nums">
              Score: <span className="text-[var(--term-cyan)]">{score}</span>
            </span>
            <span className="text-[var(--term-gray)] tabular-nums">
              Best: <span className="text-[var(--term-green)]">{highScore}</span>
            </span>
            <span className="text-[var(--term-gray)] tabular-nums">
              Speed: <span className="text-[var(--term-white)]">{speedLevel}</span>
            </span>
            <button onClick={onClose} className="text-[var(--term-gray)] hover:text-[var(--term-white)] text-xs">
              [esc]
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-5 flex flex-col items-center gap-4">
          <div
            className="relative border border-[var(--term-line)] rounded"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
              backgroundColor: "var(--term-black)",
            }}
          >
            {Array.from({ length: GRID_SIZE }).map((_, y) =>
              Array.from({ length: GRID_SIZE }).map((_, x) => {
                let content = ""
                let color = "transparent"

                if (isSnakeHead(x, y)) {
                  content = "\u2588"
                  color = "var(--term-green)"
                } else if (isSnakeBody(x, y)) {
                  content = "\u2588"
                  color = "var(--term-green)"
                } else if (isFood(x, y)) {
                  content = "\u2588"
                  color = "var(--term-cyan)"
                }

                return (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      position: "absolute",
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      color,
                      fontSize: CELL_SIZE,
                      lineHeight: `${CELL_SIZE}px`,
                      textAlign: "center",
                      opacity: isSnakeHead(x, y) ? 1 : isSnakeBody(x, y) ? 0.7 : 1,
                    }}
                  >
                    {content}
                  </div>
                )
              })
            )}

            {/* Overlay messages */}
            {gameState === "waiting" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--term-black)]/60">
                <p className="text-[var(--term-white)] text-sm font-mono mb-1">Press any key to start</p>
                <p className="text-[var(--term-gray)] text-xs font-mono">Arrow keys or WASD to move</p>
              </div>
            )}

            {gameState === "gameover" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--term-black)]/70 gap-3">
                <p className="text-red-400 text-sm font-mono uppercase tracking-wider">Game Over</p>
                <div className="flex gap-6 text-xs font-mono">
                  <span className="text-[var(--term-gray)]">
                    Score: <span className="text-[var(--term-cyan)]">{score}</span>
                  </span>
                  <span className="text-[var(--term-gray)]">
                    Best: <span className="text-[var(--term-green)]">{highScore}</span>
                  </span>
                </div>
                <p className="text-[var(--term-gray)] text-xs font-mono mt-1">Press R to restart</p>
              </div>
            )}
          </div>

          {/* Controls hint */}
          {gameState === "playing" && (
            <div className="flex gap-6 text-xs text-[var(--term-gray)] font-mono">
              <span>Direction: <span className="text-[var(--term-white)]">{direction}</span></span>
              <span>Length: <span className="text-[var(--term-cyan)] tabular-nums">{snake.length}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
