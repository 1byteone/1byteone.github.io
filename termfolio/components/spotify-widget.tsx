"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { siteConfig } from "@/content/site"

const TRACKS = [
  {
    title: "Good Night",
    artist: "FASSounds",
    src: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    title: "Lofi Study",
    artist: "FASSounds",
    src: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
  },
]

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function SpotifyWidget() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const track = TRACKS[trackIdx]

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      play()
    }
  }, [playing, play])

  const prevTrack = useCallback(() => {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length)
  }, [])

  const nextTrack = useCallback(() => {
    setTrackIdx((i) => (i + 1) % TRACKS.length)
  }, [])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!audioRef.current || !duration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      audioRef.current.currentTime = ratio * duration
    },
    [duration],
  )

  // When track changes, load and resume if was playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    if (playing) {
      play()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx])

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setTrackIdx((i) => (i + 1) % TRACKS.length)
    const onError = () => setTrackIdx((i) => (i + 1) % TRACKS.length)

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
    }
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const barLen = 24
  const filled = Math.floor((progress / 100) * barLen)
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(barLen - filled)

  return (
    <div className="border border-term-line bg-term-darker font-mono text-xs">
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <div className="flex items-center justify-between px-3 py-2 text-term-gray uppercase tracking-[0.14em] border-b border-term-line">
        <span>♫ now playing</span>
        <span className={`text-[10px] ${playing ? "text-term-green" : "text-term-gray"}`}>
          {playing ? "● live" : "○ paused"}
        </span>
      </div>

      <div className="p-3 space-y-2">
        <div className="text-term-white truncate">
          {track.title} <span className="text-term-gray">— {track.artist}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevTrack}
            className="text-term-gray hover:text-term-cyan transition-colors flex-shrink-0"
            aria-label="Previous track"
          >
            ◁
          </button>
          <button
            onClick={togglePlay}
            className="text-term-gray hover:text-term-cyan transition-colors flex-shrink-0"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <button
            onClick={nextTrack}
            className="text-term-gray hover:text-term-cyan transition-colors flex-shrink-0"
            aria-label="Next track"
          >
            ▷
          </button>
          <button
            onClick={handleSeek}
            className="text-term-cyan tracking-wider flex-1 overflow-hidden text-left cursor-pointer bg-transparent border-none p-0 font-mono text-xs"
            aria-label="Seek in track"
          >
            {bar}
          </button>
        </div>

        <div className="flex justify-between text-[10px] text-term-gray">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="pt-1 border-t border-term-line">
          <a
            href={siteConfig.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-term-gray hover:text-term-cyan transition-colors"
          >
            open on spotify →
          </a>
        </div>
      </div>
    </div>
  )
}
