"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { PostCard } from "@/components/ui/post-card";
import { FeedTabs } from "@/components/ui/feed-tabs";
import { FeedSkeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/ui/footer";
import { Post } from "@/types";
import { type Area } from "@/lib/utils";
import { PenLine, TrendingUp } from "lucide-react";

type Tab = "recent" | "trending" | "top-rated";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("recent");
  const [area, setArea] = useState<Area>("All SA");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?tab=${tab}&area=${encodeURIComponent(area)}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [tab, area]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const quickAreas: Area[] = ["Umhlanga", "Durban CBD", "Johannesburg", "Cape Town", "Westville"];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar selectedArea={area} onAreaChange={setArea} />

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-24 sm:pb-12">
        {area === "All SA" && tab === "recent" && !loading && (
          <HeroBanner />
        )}

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <TrendingUp size={12} className="text-accent-red shrink-0" />
          <div className="flex gap-2">
            {quickAreas.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono border border-border text-text-muted hover:border-accent-red/40 hover:text-accent-red transition-all"
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <FeedTabs activeTab={tab} onTabChange={setTab} />
        </div>

        {area !== "All SA" && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-text-muted">
              Showing: <span className="text-text-primary">{area}</span>
            </h2>
            <button
              onClick={() => setArea("All SA")}
              className="text-[11px] font-mono text-accent-red hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {loading ? (
          <FeedSkeleton />
        ) : posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          <div className="space-y-3">
            {posts.map((post, i) => (
              <Link key={post.id} href={`/post/${post.id}`} className="block" style={{ animation: `fadeUp 0.5s ease ${i * 0.04}s forwards`, opacity: 0 }}>
                <PostCard post={post} />
              </Link>
            ))}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-[12px] font-mono text-text-muted">
              All caught up. <span className="text-accent-red cursor-pointer hover:underline" onClick={fetchPosts}>Refresh</span>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function HeroBanner() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/60 bg-bg-card p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-red/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-accent-red/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
            Live · Anonymous · SA
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-display tracking-wide text-text-primary leading-none mb-2">
          For SA<br />
          <span className="text-accent-red">Eyes Only</span>
        </h1>
        <p className="text-sm text-text-secondary max-w-xs mt-3 leading-relaxed">
          No login. No name. Just the raw pulse of South Africa — confessions, rants, reviews, and hot takes from every corner of the country.
        </p>
        <Link
          href="/post"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-accent-red text-white text-sm font-semibold rounded-xl hover:bg-accent-red/90 transition-all shadow-lg shadow-accent-red/25 active:scale-95"
        >
          <PenLine size={14} />
          Post Anonymously
        </Link>
      </div>
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="text-center py-16">
      <div className="text-4xl mb-4">🌾</div>
      <p className="text-text-secondary font-mono text-sm mb-1">Nothing here yet.</p>
      <p className="text-text-muted text-[12px] font-mono mb-6">Be the first to say something.</p>
      <Link
        href="/post"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-red text-white text-sm font-semibold rounded-xl hover:bg-accent-red/90 transition-all"
      >
        <PenLine size={14} />
        Break the silence
      </Link>
    </div>
  );
}
