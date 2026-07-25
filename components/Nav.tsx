import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-6 md:px-12 border-b border-rule bg-void/90 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="font-serif text-2xl">
          <span className="italic text-ink">Hi</span>
          <span className="font-bold text-signal">vig</span>
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-signal animate-blink" />
      </Link>

      <ul className="hidden lg:flex gap-7 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        <li><Link href="/intel" className="hover:text-ink transition-colors">Intel</Link></li>
        <li><Link href="/manifesto" className="hover:text-ink transition-colors">Manifesto</Link></li>
        <li><Link href="/about" className="hover:text-ink transition-colors">About</Link></li>
        <li><Link href="/consultancy" className="hover:text-ink transition-colors">Consultancy</Link></li>
        <li className="text-signal"><Link href="/race" className="hover:text-ink transition-colors">The Race</Link></li>
        <li className="text-verify"><Link href="/agents" className="hover:text-ink transition-colors">Agent Store</Link></li>
      </ul>

      <div className="flex items-center gap-4">
        <span className="hidden xl:inline font-mono text-[10px] text-muted border border-rule-strong px-2.5 py-1">
          Vol.I · 2026
        </span>
        <ThemeToggle />
        <Link
          href="/subscribe"
          className="bg-signal hover:bg-signal-dark text-white font-sans text-[11px] font-bold uppercase tracking-[0.1em] px-5 py-2 transition-colors"
        >
          Subscribe
        </Link>
      </div>
    </nav>
  );
}
