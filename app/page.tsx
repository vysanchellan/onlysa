"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
  id: string;
  content: string;
  category: string;
  area: string;
  authorLabel: string;
  createdAt: string;
  votes: number;
  commentCount: number;
  approved: boolean;
}

// ─── Seed posts (client-side fallback) ────────────────────────────────────────
const SEED: Post[] = [
  {
    id: "1",
    content: "The Umhlanga ridge traffic at 7am is genuinely a form of psychological torture. Three robots out, zero cones, pure chaos.",
    category: "Rant",
    area: "Umhlanga",
    authorLabel: "Umhlanga Local",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    votes: 48,
    commentCount: 12,
    approved: true,
  },
  {
    id: "2",
    content: "Spotted a brand new KFC in Westville that's actually clean. The bathrooms have soap. I cried a little.",
    category: "Review",
    area: "Westville",
    authorLabel: "Westville Resident",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    votes: 73,
    commentCount: 8,
    approved: true,
  },
  {
    id: "3",
    content: "Hot take: bunnychow is the only correct hangover cure and anyone who says otherwise has never been to Durban.",
    category: "Hot Take",
    area: "Durban CBD",
    authorLabel: "Durban Local",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    votes: 119,
    commentCount: 34,
    approved: true,
  },
  {
    id: "4",
    content: "My neighbour's car alarm has been going off every night at 2am for three weeks. I have transcended anger. I am at peace with the noise. I am the noise.",
    category: "Confession",
    area: "Berea",
    authorLabel: "Berea Resident",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    votes: 201,
    commentCount: 27,
    approved: true,
  },
  {
    id: "5",
    content: "Eskom scheduled maintenance notice for 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.",
    category: "Rant",
    area: "Johannesburg",
    authorLabel: "Joburg Local",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    votes: 312,
    commentCount: 41,
    approved: true,
  },
  {
    id: "6",
    content: "Serious question: does anyone actually get their deposit back from landlords in SA? Asking for literally every renter I know.",
    category: "Question",
    area: "Cape Town",
    authorLabel: "Cape Town Local",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    votes: 88,
    commentCount: 53,
    approved: true,
  },
];

const AREAS = ["All SA", "Umhlanga", "Durban CBD", "Johannesburg", "Cape Town", "Westville", "Berea", "Ballito"];
const TABS = ["🕐 Recent", "🔥 Trending", "⭐ Top"];

const CATEGORY_STYLES: Record<string, string> = {
  Rant: "bg-red-500/15 text-red-400 border-red-500/30",
  Confession: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Review: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Hot Take": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Question: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "Neighbourhood Watch": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(post.votes);

  function handleVote() {
    if (voted) { setVoteCount(v => v - 1); setVoted(false); }
    else { setVoteCount(v => v + 1); setVoted(true); }
  }

  const catStyle = CATEGORY_STYLES[post.category] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";

  return (
    <article className="group relative rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/16 hover:bg-white/6 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/3 to-transparent" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border ${catStyle}`}>
            {post.category}
          </span>
          <span className="text-[11px] text-white/35 font-mono">{post.area}</span>
        </div>
        <span className="text-[11px] text-white/25 font-mono shrink-0">{timeAgo(post.createdAt)}</span>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`}>
        <p className="text-[15px] leading-relaxed text-white/80 mb-4 cursor-pointer hover:text-white/95 transition-colors line-clamp-4">
          {post.content}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-[8px]">
            🇿🇦
          </div>
          <span className="text-[11px] text-white/30 font-mono">{post.authorLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/post/${post.id}`} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-[12px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="font-mono">{post.commentCount}</span>
          </Link>
          <button
            onClick={handleVote}
            className={`flex items-center gap-1.5 text-[12px] font-mono transition-all ${voted ? "text-emerald-400" : "text-white/30 hover:text-white/60"}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={voted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            {voteCount}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Testimonial-style Stats Cards (Twitter card aesthetic) ───────────────────
function StatCard({ emoji, label, value, sub }: { emoji: string; label: string; value: string; sub: string }) {
  return (
    <div className="relative -skew-y-1 rounded-xl border border-white/10 bg-white/4 backdrop-blur-md px-4 py-3 transition-all duration-300 hover:border-white/20 hover:bg-white/6 hover:-skew-y-0 hover:scale-[1.02]">
      <div className="text-xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-widest">{label}</div>
      <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [area, setArea] = useState("All SA");
  const [tab, setTab] = useState("🕐 Recent");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        if (data.posts?.length) setPosts(data.posts);
      }
    } catch {
      // fallback to seed
    } finally {
      setLoading(false);
    }
  }

  const filtered = posts
    .filter(p => p.approved !== false)
    .filter(p => area === "All SA" || p.area === area)
    .sort((a, b) => {
      if (tab === "🔥 Trending") return b.votes - a.votes;
      if (tab === "⭐ Top") return b.commentCount - a.commentCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-[#070709] text-white font-[family-name:var(--font-body)]">
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Ccircle cx='1' cy='1' r='1' fill='white'/%3E%3C/svg%3E\")" }}
        />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#070709]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">OnlySA</span>
            <span className="text-[10px] text-white/25 border border-white/15 rounded px-1.5 py-0.5 font-mono tracking-wider">🇿🇦 ZA</span>
          </div>
          <Link href="/post">
            {/* Liquid glass button style */}
            <button className="relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-white/90 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
                boxShadow: "0 0 6px rgba(0,0,0,0.03),0 2px 6px rgba(0,0,0,0.08),inset 1px 1px 1px rgba(255,255,255,0.15),inset -1px -1px 1px rgba(255,255,255,0.05),0 0 12px rgba(52,211,153,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Post Anonymously
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Stats row (Twitter-card inspired, skewed) ── */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <StatCard emoji="📬" label="Posts" value={String(posts.length).padStart(2, "0")} sub="and counting" />
          <StatCard emoji="📍" label="Areas" value="8" sub="cities covered" />
          <StatCard emoji="👁" label="Live" value="On" sub="refreshes live" />
          <StatCard emoji="🔒" label="Identity" value="None" sub="zero tracking" />
        </div>

        {/* ── Hero heading ── */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
            <span className="text-white">For SA </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Eyes Only</span>
          </h1>
          <p className="text-white/35 text-sm">Anonymous confessions, rants, reviews & hot takes from across South Africa.</p>
        </div>

        {/* ── Area chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {AREAS.map(a => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-mono transition-all duration-200 border ${
                area === a
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  : "bg-white/4 border-white/10 text-white/45 hover:bg-white/8 hover:text-white/70"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 border-b border-white/8">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-[13px] font-medium transition-all duration-200 border-b-2 -mb-px ${
                tab === t
                  ? "border-emerald-400 text-white"
                  : "border-transparent text-white/35 hover:text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-white/30 font-mono">live</span>
          </div>
        </div>

        {/* ── Feed ── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-white/4 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/25">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-mono text-sm">No posts yet for {area}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <div
                key={post.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-in fade-in-0 slide-in-from-bottom-2 duration-400"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="mt-16 pt-8 border-t border-white/8 text-center">
          <p className="text-[11px] text-white/20 font-mono mb-3">© 2026 OnlySA · Anonymous. Unfiltered. SA.</p>
          <div className="flex justify-center gap-5 text-[11px] text-white/25">
            <Link href="/about" className="hover:text-white/50 transition-colors">About</Link>
            <Link href="/guidelines" className="hover:text-white/50 transition-colors">Guidelines</Link>
            <a href="mailto:abuse@onlysa.co.za" className="hover:text-white/50 transition-colors">Report</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
