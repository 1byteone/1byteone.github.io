import Link from "next/link"
import MinimalNav from "@/components/minimal-nav"
import TerminalFooter from "@/components/terminal-footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--term-black)] text-[var(--term-white)] font-mono flex flex-col">
      <MinimalNav />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/noise.png')] animate-noise" />

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <pre className="text-[var(--term-cyan)] text-sm leading-relaxed">
{`  _  _    ___  _  _
 | || |  / _ \\| || |
 | || |_| | | | || |_
 |__   _| | | |__   _|
    | | | |_| |  | |
    |_|  \\___/   |_|`}
          </pre>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--term-gray)]">
              file not found
            </div>
            <p className="text-sm text-[var(--term-gray)]">
              <span className="text-[var(--term-green)]">$</span>{" "}
              <span className="text-[var(--term-cyan)]">cat</span> page.md
            </p>
            <p className="text-sm text-[var(--term-amber)]">
              error: No such file or directory
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="border border-[var(--term-line)] px-4 py-2 text-sm text-[var(--term-cyan)] hover:bg-[var(--term-cyan)]/10 hover:border-[var(--term-cyan)] transition-colors"
            >
              cd ~
            </Link>
            <Link
              href="/blog"
              className="border border-[var(--term-line)] px-4 py-2 text-sm text-[var(--term-gray)] hover:text-[var(--term-white)] hover:border-[var(--term-white)] transition-colors"
            >
              ls ./journal
            </Link>
          </div>
        </div>
      </main>

      <TerminalFooter />
    </div>
  )
}
