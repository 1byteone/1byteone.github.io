export default function Loading() {
  return (
    <div className="min-h-screen bg-term-black text-term-white font-mono px-4 pt-24">
      <div className="container mx-auto">
        <div className="cli-frame overflow-hidden">
          <div className="border-b border-term-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-term-gray">loading // journal archive</div>
          <div className="space-y-4 p-5">
            <div className="h-4 w-44 animate-pulse bg-term-dark" />
            <div className="h-10 w-80 animate-pulse bg-term-dark" />
            <div className="h-14 w-full animate-pulse bg-term-dark" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse border border-term-line bg-term-darker" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

