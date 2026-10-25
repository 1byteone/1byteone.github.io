export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--term-black)] flex items-center justify-center font-mono">
      <div className="text-center space-y-4">
        <div className="flex items-center gap-2 text-[var(--term-gray)] text-sm">
          <span className="text-[var(--term-green)]">$</span>
          <span className="animate-pulse">loading...</span>
        </div>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--term-cyan)] animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
