import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8 px-4 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-lg font-display tracking-wider">
              Only<span className="text-accent-red">SA</span>
            </span>
            <p className="text-[11px] font-mono text-text-muted mt-0.5">
              Anonymous. Unfiltered. SA.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-[12px] font-mono text-text-muted">
            <Link href="/about" className="hover:text-text-secondary transition-colors">
              About
            </Link>
            <Link href="/guidelines" className="hover:text-text-secondary transition-colors">
              Guidelines
            </Link>
            <a href="mailto:abuse@onlysa.co.za" className="hover:text-text-secondary transition-colors">
              Report Abuse
            </a>
            <a href="mailto:hello@onlysa.co.za" className="hover:text-text-secondary transition-colors">
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between">
          <p className="text-[11px] font-mono text-text-muted">
            © {new Date().getFullYear()} OnlySA · For SA eyes only
          </p>
          <p className="text-[11px] font-mono text-text-muted">
            🇿🇦 Made in SA
          </p>
        </div>
      </div>
    </footer>
  );
}
