export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--term-black)] text-[var(--term-white)] font-mono px-4 pt-24">
      <div className="container mx-auto max-w-5xl">
        <div className="h-4 w-32 animate-pulse bg-[var(--term-dark)] rounded mb-8" />
        <div className="rounded-xl overflow-hidden border border-[var(--term-line)]">
          <div className="border-b border-[var(--term-line)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--term-gray)]">
            loading // personal dossier
          </div>
          <div className="grid gap-8 p-5 md:grid-cols-[280px_minmax(0,1fr)] md:p-6">
            <div className="space-y-4">
              <div className="aspect-[4/4.8] animate-pulse bg-[var(--term-dark)] rounded-xl" />
              <div className="space-y-2">
                {[80, 60, 100].map((w, i) => (
                  <div key={i} className="h-3 animate-pulse bg-[var(--term-dark)] rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 w-3/4 animate-pulse bg-[var(--term-dark)] rounded" />
              <div className="space-y-2">
                {[100, 90, 70].map((w, i) => (
                  <div key={i} className="h-3 animate-pulse bg-[var(--term-dark)] rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="grid gap-4 grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse bg-[var(--term-dark)] rounded-lg border border-[var(--term-line)]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
