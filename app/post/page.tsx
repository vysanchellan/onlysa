"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AREAS = [
  "Durban CBD", "Umhlanga", "Westville", "Ballito", "PMB",
  "Richards Bay", "Berea", "Musgrave", "Johannesburg", "Cape Town",
];

const CATEGORIES = [
  { id: "Confession",         emoji: "🤫", desc: "Something you can't say IRL" },
  { id: "Rant",               emoji: "😤", desc: "Let it out" },
  { id: "Review",             emoji: "⭐", desc: "Place, business, or service" },
  { id: "Hot Take",           emoji: "🔥", desc: "Controversial opinion" },
  { id: "Question",           emoji: "❓", desc: "Ask the city" },
  { id: "Neighbourhood Watch",emoji: "👀", desc: "Something locals should know" },
];

const MAX = 500;

export default function PostPage() {
  const router = useRouter();
  const textRef = useRef<HTMLTextAreaElement>(null);

  const [area, setArea]           = useState("");
  const [category, setCategory]   = useState("");
  const [content, setContent]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const [mounted, setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const remaining = MAX - content.length;
  const canSubmit = area && category && content.trim().length >= 10 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, category, content }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center px-4 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
        </div>
        <div className="relative text-center max-w-sm animate-in fade-in-0 zoom-in-95 duration-500">
          <div className="text-6xl mb-4">🇿🇦</div>
          <h2 className="text-2xl font-bold mb-2">Posted.</h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Your post is in the queue. It&apos;ll go live once reviewed. Anonymous, always.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <button className="rounded-full px-6 py-2.5 text-sm font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all">
                View Feed
              </button>
            </Link>
            <button
              onClick={() => { setDone(false); setContent(""); setArea(""); setCategory(""); }}
              className="rounded-full px-6 py-2.5 text-sm font-semibold bg-white/6 border border-white/12 text-white/60 hover:bg-white/10 transition-all"
            >
              Post Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070709] text-white font-[family-name:var(--font-body)]">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full bg-cyan-500/6 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/6 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")" }}
        />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#070709]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white/80 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </Link>
          <span className="text-sm font-medium text-white/60">OnlySA</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/90 font-medium">Post</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Heading */}
        <div className={`mb-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Say Something
          </h1>
          <p className="text-white/35 text-sm">No name. No email. No account. Just your unfiltered truth.</p>

          {/* Anonymous badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] text-white/40 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Identity is never stored
          </div>
        </div>

        <div className="space-y-6">

          {/* Step 1 — Area */}
          <section
            className={`transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <label className="block text-[11px] font-mono text-white/35 uppercase tracking-widest mb-3">
              01 · Your Area
            </label>
            <div className="flex flex-wrap gap-2">
              {AREAS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-mono border transition-all duration-200 ${
                    area === a
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                      : "bg-white/4 border-white/10 text-white/40 hover:bg-white/8 hover:text-white/70"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </section>

          {/* Step 2 — Category */}
          <section
            className={`transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <label className="block text-[11px] font-mono text-white/35 uppercase tracking-widest mb-3">
              02 · Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`group relative rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                    category === c.id
                      ? "bg-emerald-500/12 border-emerald-500/40 shadow-[0_0_16px_rgba(52,211,153,0.08)]"
                      : "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15"
                  }`}
                >
                  <span className="text-lg block mb-1">{c.emoji}</span>
                  <span className={`text-[12px] font-semibold block ${category === c.id ? "text-emerald-300" : "text-white/70"}`}>
                    {c.id}
                  </span>
                  <span className="text-[10px] text-white/25">{c.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 3 — Content */}
          <section
            className={`transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <label className="block text-[11px] font-mono text-white/35 uppercase tracking-widest mb-3">
              03 · Your Post
            </label>
            <div className="relative">
              <textarea
                ref={textRef}
                value={content}
                onChange={e => { if (e.target.value.length <= MAX) setContent(e.target.value); }}
                placeholder="Write your confession, rant, review or hot take..."
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm px-4 py-4 text-[14px] text-white/85 placeholder:text-white/20 resize-none outline-none transition-all duration-200 focus:border-emerald-500/40 focus:bg-white/6 focus:shadow-[0_0_24px_rgba(52,211,153,0.08)]"
              />
              <div className={`absolute bottom-3 right-3 text-[11px] font-mono transition-colors ${remaining < 50 ? "text-red-400" : "text-white/20"}`}>
                {remaining}
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-[12px] font-mono border border-red-500/20 bg-red-500/8 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className={`transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`relative w-full rounded-2xl py-4 text-[15px] font-semibold transition-all duration-300 overflow-hidden ${
                canSubmit
                  ? "text-white hover:scale-[1.01] active:scale-[0.99]"
                  : "opacity-35 cursor-not-allowed text-white/50"
              }`}
              style={canSubmit ? {
                background: "linear-gradient(135deg, rgba(52,211,153,0.25) 0%, rgba(6,182,212,0.15) 100%)",
                boxShadow: "0 0 6px rgba(0,0,0,0.03),0 2px 6px rgba(0,0,0,0.08),inset 1px 1px 1px rgba(255,255,255,0.1),inset -1px -1px 1px rgba(0,0,0,0.2),0 0 30px rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.3)",
              } : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Liquid glass inner glow layer */}
              {canSubmit && (
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-2xl"
                  style={{ backdropFilter: "blur(2px)" }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/>
                    </svg>
                    Posting…
                  </>
                ) : (
                  <>
                    <span>🇿🇦</span> Post Anonymously
                  </>
                )}
              </span>
            </button>

            <p className="mt-3 text-[11px] text-white/20 text-center font-mono">
              A random label like &quot;Durban Local&quot; is assigned · No IP stored · Reviewed before live
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
