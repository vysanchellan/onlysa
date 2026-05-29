"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { PostCard } from "@/components/ui/post-card";
import { FeedTabs } from "@/components/ui/feed-tabs";
import { FeedSkeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/ui/footer";
import { Post } from "@/types";
import { cn, type Area } from "@/lib/utils";
import { PenLine, TrendingUp } from "lucide-react";

type Tab = "recent" | "trending" | "top-rated";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("recent");
  const [area, setArea] = useState<Area>("All SA");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        const res = await fetch(`/api/posts?tab=${tab}&area=${encodeURIComponent(area)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setPosts(data.posts);
          }
        }
      } catch {
        // handle error
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [tab, area, refreshKey]);

  const handleAreaChange = (nextArea: Area) => {
    setLoading(true);
    setArea(nextArea);
  };

  const handleTabChange = (nextTab: Tab) => {
    setLoading(true);
    setTab(nextTab);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const quickAreas: Area[] = ["Umhlanga", "Durban CBD", "Johannesburg", "Cape Town", "Westville"];
  const visiblePosts = posts.slice(0, 6);
  const areaCounts = posts.reduce<Record<string, number>>((counts, post) => {
    counts[post.area] = (counts[post.area] || 0) + 1;
    return counts;
  }, {});
  const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "All SA";

  return (
    <div className="min-h-screen bg-bg">
      <Navbar selectedArea={area} onAreaChange={handleAreaChange} />

      <main className="max-w-6xl mx-auto px-4 pt-20 pb-24 sm:pb-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_340px] lg:items-start">
          <section className="min-w-0 space-y-4">
            {area === "All SA" && tab === "recent" && !loading && (
              <HeroBanner topArea={topArea} totalPosts={posts.length} />
            )}

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-bg-card/80 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <TrendingUp size={12} className="text-accent-red shrink-0" />
                <div className="flex gap-2">
                  {quickAreas.map((a) => (
                    <button
                      key={a}
                      onClick={() => handleAreaChange(a)}
                      className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono border border-border text-text-muted hover:border-accent-red/40 hover:text-accent-red transition-all"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <FeedTabs activeTab={tab} onTabChange={handleTabChange} />
              </div>

              {area !== "All SA" && (
                <div className="flex items-center justify-between mt-4">
                  <h2 className="text-sm font-mono text-text-muted">
                    Showing: <span className="text-text-primary">{area}</span>
                  </h2>
                  <button
                    onClick={() => handleAreaChange("All SA")}
                    className="text-[11px] font-mono text-accent-red hover:underline"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <FeedSkeleton />
            ) : posts.length === 0 ? (
              <EmptyFeed />
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-border/60 bg-bg-card/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted">Featured now</p>
                      <p className="text-sm text-text-secondary">The first post in the current feed</p>
                    </div>
                    <Link href={`/post/${visiblePosts[0].id}`} className="text-[11px] font-mono text-accent-red hover:underline">
                      Open post
                    </Link>
                  </div>
                  <PostCard post={visiblePosts[0]} className="border-border/80 bg-bg-secondary" />
                </div>

                <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-2">
                  {visiblePosts.slice(1).map((post, i) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.id}`}
                      className="block h-full"
                      style={{ animation: `fadeUp 0.5s ease ${i * 0.04}s forwards`, opacity: 0 }}
                    >
                      <PostCard post={post} className="h-full" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && posts.length > visiblePosts.length && (
              <div className="text-center py-8">
                <p className="text-[12px] font-mono text-text-muted">
                  {posts.length - visiblePosts.length} more posts in the feed. <span className="text-accent-red cursor-pointer hover:underline" onClick={handleRefresh}>Refresh</span>
                </p>
              </div>
            )}
          </section>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-border/60 bg-bg-card p-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted mb-3">
                Live pulse
              </p>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Posts" value={String(posts.length).padStart(2, "0")} tone="accent-red" />
                <StatCard label="Active area" value={topArea} tone="text-primary" />
                <StatCard label="Feed" value={tab.replace("-", " ")} tone="text-secondary" />
                <StatCard label="Mode" value={area === "All SA" ? "Nationwide" : area} tone="text-secondary" />
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-bg-card p-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted mb-3">
                What this is
              </p>
              <div className="space-y-3 text-sm leading-relaxed text-text-secondary">
                <p>
                  Anonymous posts from South Africa, tuned for local confessions, rants, reviews, and city-level opinions.
                </p>
                <p>
                  Use the area chips to narrow the feed, or switch tabs to surface what is hot right now.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-bg-card p-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted mb-3">
                Posting flow
              </p>
              <ol className="space-y-2 text-sm text-text-secondary font-mono">
                <li className="flex items-center gap-3"><span className="text-accent-red">01</span> Pick an area</li>
                <li className="flex items-center gap-3"><span className="text-accent-red">02</span> Choose a category</li>
                <li className="flex items-center gap-3"><span className="text-accent-red">03</span> Publish anonymously</li>
              </ol>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeroBanner({ topArea, totalPosts }: { topArea: string; totalPosts: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(230,57,70,0.14),transparent_30%),linear-gradient(180deg,rgba(20,20,20,0.98),rgba(14,14,14,0.98))] p-6 sm:p-8 lg:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
            <span className="text-[11px] font-mono text-text-muted uppercase tracking-[0.28em]">
              Live · Anonymous · SA
            </span>
          </div>

          <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.32em] mb-3">
            OnlySA
          </p>
          <h1 className="max-w-[10ch] text-4xl sm:text-5xl lg:text-6xl font-display tracking-tight text-text-primary leading-[0.84] mb-4 text-balance">
            For SA<br />
            <span className="text-accent-red">Eyes Only</span>
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-text-secondary leading-relaxed">
            Anonymous confessions, city rants, reviews, and hot takes from across South Africa. Built to feel local, sharp, and unfiltered.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/post"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-red text-white text-sm font-semibold rounded-xl hover:bg-accent-red/90 transition-all shadow-lg shadow-accent-red/25 active:scale-95"
            >
              <PenLine size={14} />
              Post Anonymously
            </Link>
            <span className="inline-flex items-center rounded-xl border border-border/70 bg-bg-secondary px-4 py-2 text-xs font-mono text-text-muted">
              {totalPosts} live posts · {topArea}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <MiniPanel title="Browse" body="Use area chips to lock onto a city or jump back to nationwide." />
          <MiniPanel title="Post flow" body="Pick a category, write naturally, then submit without an account." />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-bg-secondary px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted mb-2 font-mono">{label}</p>
      <p className={cn("text-sm font-medium truncate", tone)}>{value}</p>
    </div>
  );
}

function MiniPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-bg-secondary/80 p-4">
      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted mb-2">{title}</p>
      <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
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
