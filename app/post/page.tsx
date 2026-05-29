"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PenLine, Loader2, CheckCircle, XCircle } from "lucide-react";
import { AREAS, CATEGORIES, getSessionToken, cn } from "@/lib/utils";

type PostState = "idle" | "reviewing" | "success" | "error";

export default function PostPage() {
  const router = useRouter();
  const [area, setArea]         = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent]   = useState("");
  const [state, setState]       = useState<PostState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const maxChars  = 500;
  const remaining = maxChars - content.length;
  const isValid   = area && category && content.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || state === "reviewing") return;

    setState("reviewing");
    setErrorMsg("");
    const sessionToken = getSessionToken();

    try {
      // Step 1: Moderate
      const moderateRes = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, category, content }),
      });

      if (moderateRes.ok) {
        const modResult = await moderateRes.json();
        if (!modResult.approved) {
          setState("error");
          setErrorMsg(modResult.reason || "Post flagged. Please review community guidelines.");
          return;
        }
        if (modResult.category_suggestion) setCategory(modResult.category_suggestion);
      }

      // Step 2: Post
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, category, content, sessionToken }),
      });

      if (postRes.ok) {
        setState("success");
        setTimeout(() => router.push("/"), 2500);
      } else {
        setState("error");
        setErrorMsg("Something went wrong. Try again.");
      }
    } catch {
      setState("error");
      setErrorMsg("Network error. Check your connection and try again.");
    }
  }

  if (state === "success") return <SuccessScreen />;
  if (state === "error")   return <ErrorScreen message={errorMsg} onRetry={() => setState("idle")} />;

  return (
    <div className="min-h-screen bg-bg">

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="text-base font-display tracking-wider text-text-primary">
            Only<span className="text-accent-red">SA</span>
          </span>
          <span className="text-text-muted text-sm font-mono">/ Post</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-24 pb-24 sm:pb-12">

        {/* ── Page heading ── */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl font-display text-text-primary tracking-wide mb-2">
            Say Something
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            No name. No email. No account. Just your unfiltered truth.
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Area */}
          <div className="space-y-3">
            <label className="text-[11px] font-mono text-text-muted uppercase tracking-widest block">
              Your Area <span className="text-accent-red">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AREAS.filter((a) => a !== "All SA").map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all",
                    area === a
                      ? "border-accent-red text-accent-red bg-accent-red/10"
                      : "border-border text-text-muted bg-bg-elevated hover:border-[#333] hover:text-text-secondary"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-[11px] font-mono text-text-muted uppercase tracking-widest block">
              Category <span className="text-accent-red">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all",
                    category === cat
                      ? "border-accent-red text-accent-red bg-accent-red/10"
                      : "border-border text-text-muted bg-bg-elevated hover:border-[#333] hover:text-text-secondary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content textarea */}
          <div className="space-y-3">
            <label className="text-[11px] font-mono text-text-muted uppercase tracking-widest block">
              Your Post <span className="text-accent-red">*</span>
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
                placeholder="What's on your mind? This is your space. Be real."
                rows={6}
                className={cn(
                  "w-full bg-bg-card border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 text-sm leading-relaxed resize-none transition-colors",
                  "focus:outline-none focus:border-accent-red/50",
                  content.length > maxChars * 0.9
                    ? "border-accent-orange/50"
                    : "border-border hover:border-[#2a2a2a]"
                )}
              />
              <div className={cn(
                "absolute bottom-3 right-3 text-[11px] font-mono transition-colors",
                remaining < 50
                  ? remaining < 20 ? "text-accent-red" : "text-accent-orange"
                  : "text-text-muted"
              )}>
                {remaining}
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-elevated border border-border/60">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1.5 shrink-0" />
            <p className="text-[12px] text-text-muted leading-relaxed font-mono">
              Your identity is never stored. A random label like &ldquo;Durban Local&rdquo; is assigned
              automatically. All posts are reviewed before publishing.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || state === "reviewing"}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all",
              isValid
                ? "bg-accent-red text-white hover:bg-accent-red/90 shadow-lg shadow-accent-red/20 active:scale-[0.99]"
                : "bg-bg-elevated text-text-muted cursor-not-allowed border border-border"
            )}
          >
            {state === "reviewing" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Checking your post...
              </>
            ) : (
              <>
                <PenLine size={16} />
                Post Anonymously
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-accent-green" />
        </div>
        <h2 className="text-4xl font-display text-text-primary mb-3 tracking-wide">
          It&apos;s Live
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Your post is live. No name. No face. Just truth.
        </p>
        <p className="text-text-muted text-[12px] font-mono mt-4">
          Redirecting to feed...
        </p>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-accent-red/10 border border-accent-red/30 flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-accent-red" />
        </div>
        <h2 className="text-4xl font-display text-text-primary mb-3 tracking-wide">
          Post Flagged
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {message || "Your post was flagged. Please review our community guidelines."}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-bg-elevated border border-border text-text-primary text-sm font-mono rounded-xl hover:border-[#333] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
