"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, PenLine, Menu, X } from "lucide-react";
import { AREAS, type Area } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface NavProps {
  selectedArea?: Area;
  onAreaChange?: (area: Area) => void;
}

export function Navbar({ selectedArea = "All SA", onAreaChange }: NavProps) {
  const [areaOpen, setAreaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAreaSelect = (area: Area) => {
    onAreaChange?.(area);
    setAreaOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-display tracking-wider text-text-primary">
              Only
              <span className="text-accent-red">SA</span>
            </span>
          </Link>

          {/* Area selector - desktop */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setAreaOpen(!areaOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-text-secondary hover:text-text-primary hover:border-[#333] transition-all text-sm font-mono"
            >
              <span className="max-w-[120px] truncate">{selectedArea}</span>
              <ChevronDown
                size={12}
                className={cn(
                  "transition-transform",
                  areaOpen && "rotate-180"
                )}
              />
            </button>

            {areaOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setAreaOpen(false)}
                />
                <div className="absolute top-full mt-1 left-0 w-48 bg-bg-card border border-border rounded-xl shadow-xl overflow-hidden z-20 py-1">
                  {AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => handleAreaSelect(area)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm font-mono transition-colors",
                        selectedArea === area
                          ? "text-text-primary bg-bg-elevated"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
                      )}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/post"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-red text-white text-sm font-semibold hover:bg-accent-red/90 active:scale-95 transition-all shadow-lg shadow-accent-red/20"
            >
              <PenLine size={14} />
              <span className="hidden sm:inline">Post Anonymously</span>
              <span className="sm:hidden">Post</span>
            </Link>

            {/* Mobile menu */}
            <button
              className="sm:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile area selector */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border/60 px-4 py-3 bg-bg-secondary">
            <p className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-2">
              Filter by area
            </p>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => {
                    handleAreaSelect(area);
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-mono border transition-all",
                    selectedArea === area
                      ? "border-accent-red text-accent-red bg-accent-red/10"
                      : "border-border text-text-secondary hover:border-[#333] hover:text-text-primary"
                  )}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Bottom nav for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden glass border-t border-border/60 safe-bottom">
        <div className="flex items-center justify-around px-4 py-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 px-4 py-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span className="text-[10px] font-mono">Feed</span>
          </Link>
          <Link
            href="/post"
            className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl bg-accent-red text-white transition-colors"
          >
            <PenLine size={18} />
            <span className="text-[10px] font-mono font-semibold">Post</span>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center gap-0.5 px-4 py-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[10px] font-mono">Areas</span>
          </button>
        </div>
      </nav>
    </>
  );
}
