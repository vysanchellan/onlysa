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
  const [posts, setPosts]       = useState<Post[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Tab>("recent");
  const [area, setArea]         = useState<Area>("All SA");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchPosts() {
      try {
        const res = await fetch(`/api/posts?tab=${tab}&area=${encodeURIComponent(area)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setPosts(data.posts);
        }
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    }
    void fetchPosts();
    return () => { cancelled = true; };
  }, [tab, area, refreshKey]);

  const handleAreaChange = (a: Area) => { setLoading(true); setArea(a); };
  const handleTabChange  = (t: Tab)  => { setLoading(true); setTab(t); };
  const handleRefresh    = ()        => { setLoading(true); setRefreshKey(k => k + 1); };

  const quickAreas: Area[] = ["Umhlanga", "Durban CBD", "Johannesburg", "Cape Town", "Westville"];
  const visiblePosts = posts.slice(0, 6);
  const areaCounts   = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.area] = (acc[p.area] || 0) + 1; return acc;
  }, {});
  const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "All SA";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080808" }}>
      <Navbar selectedArea={area} onAreaChange={handleAreaChange} />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 16px 96px" }}>
        <div className="feed-layout">

          {/* ─── Left column ─── */}
          <section style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Hero */}
            {area === "All SA" && tab === "recent" && !loading && (
              <HeroBanner topArea={topArea} totalPosts={posts.length} />
            )}

            {/* Area chips + tabs */}
            <div style={{
              borderRadius: "16px",
              border: "1px solid rgba(35,35,35,0.6)",
              backgroundColor: "rgba(20,20,20,0.8)",
              padding: "16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                <TrendingUp size={12} style={{ color: "#E63946", flexShrink: 0 }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  {quickAreas.map((a) => (
                    <button
                      key={a}
                      onClick={() => handleAreaChange(a)}
                      style={{
                        flexShrink: 0,
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontFamily: "var(--font-mono, monospace)",
                        border: "1px solid #232323",
                        background: "transparent",
                        color: "#5A5652",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        (e.target as HTMLButtonElement).style.borderColor = "rgba(230,57,70,0.4)";
                        (e.target as HTMLButtonElement).style.color = "#E63946";
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLButtonElement).style.borderColor = "#232323";
                        (e.target as HTMLButtonElement).style.color = "#5A5652";
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <FeedTabs activeTab={tab} onTabChange={handleTabChange} />
              </div>

              {area !== "All SA" && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                  <p style={{ fontSize: "13px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652" }}>
                    Showing: <span style={{ color: "#F0EDE8" }}>{area}</span>
                  </p>
                  <button
                    onClick={() => handleAreaChange("All SA")}
                    style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#E63946", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            {/* Feed */}
            {loading ? (
              <FeedSkeleton />
            ) : posts.length === 0 ? (
              <EmptyFeed />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Featured */}
                <div style={{
                  borderRadius: "24px",
                  border: "1px solid rgba(35,35,35,0.6)",
                  backgroundColor: "rgba(20,20,20,0.9)",
                  padding: "16px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <p style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5A5652" }}>
                        Featured now
                      </p>
                      <p style={{ fontSize: "14px", color: "#9A9590", marginTop: "2px" }}>The first post in the current feed</p>
                    </div>
                    <Link href={`/post/${visiblePosts[0].id}`} style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#E63946", textDecoration: "none" }}>
                      Open post
                    </Link>
                  </div>
                  <PostCard post={visiblePosts[0]} />
                </div>

                {/* Grid */}
                <div className="posts-grid">
                  {visiblePosts.slice(1).map((post, i) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.id}`}
                      style={{ display: "block", textDecoration: "none", animation: `fadeUp 0.5s ease ${i * 0.04}s forwards`, opacity: 0 }}
                    >
                      <PostCard post={post} className="h-full" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && posts.length > visiblePosts.length && (
              <p style={{ textAlign: "center", padding: "32px 0", fontSize: "12px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652" }}>
                {posts.length - visiblePosts.length} more posts.{" "}
                <span style={{ color: "#E63946", cursor: "pointer" }} onClick={handleRefresh}>Refresh</span>
              </p>
            )}
          </section>

          {/* ─── Right sidebar ─── */}
          <aside style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <SideCard title="Live pulse">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <StatCard label="Posts"       value={String(posts.length).padStart(2, "0")} accent />
                <StatCard label="Active area" value={topArea} />
                <StatCard label="Feed"        value={tab.replace("-", " ")} />
                <StatCard label="Mode"        value={area === "All SA" ? "Nationwide" : area} />
              </div>
            </SideCard>

            <SideCard title="What this is">
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#9A9590", marginBottom: "12px" }}>
                Anonymous posts from South Africa, tuned for local confessions, rants, reviews, and city-level opinions.
              </p>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#9A9590" }}>
                Use the area chips to narrow the feed, or switch tabs to surface what is hot right now.
              </p>
            </SideCard>

            <SideCard title="Posting flow">
              <ol style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Pick an area", "Choose a category", "Publish anonymously"].map((step, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#9A9590", fontFamily: "var(--font-mono, monospace)" }}>
                    <span style={{ color: "#E63946" }}>0{i + 1}</span> {step}
                  </li>
                ))}
              </ol>
            </SideCard>
          </aside>

        </div>
      </main>

      <Footer />

      {/* Layout styles injected as a style tag to avoid Tailwind purge issues */}
      <style>{`
        .feed-layout {
          display: grid;
          gap: 24px;
        }
        @media (min-width: 1280px) {
          .feed-layout {
            grid-template-columns: minmax(0, 1.35fr) 300px;
            align-items: start;
          }
          aside {
            position: sticky;
            top: 80px;
          }
        }
        .posts-grid {
          display: grid;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .posts-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Hero ── */
function HeroBanner({ topArea, totalPosts }: { topArea: string; totalPosts: number }) {
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "24px",
      border: "1px solid rgba(35,35,35,0.7)",
      background: "radial-gradient(circle at top left, rgba(230,57,70,0.14), transparent 30%), linear-gradient(180deg, rgba(20,20,20,0.98), rgba(14,14,14,0.98))",
      padding: "32px",
      boxShadow: "0 30px 100px rgba(0,0,0,0.35)",
    }}>
      {/* Subtle shimmer overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.02), transparent)",
      }} />

      <div style={{ position: "relative", display: "grid", gap: "24px", gridTemplateColumns: "1fr" }}>
        <div>
          {/* Live badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              backgroundColor: "#E63946",
              boxShadow: "0 0 8px #E63946",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652", textTransform: "uppercase", letterSpacing: "0.28em" }}>
              Live · Anonymous · SA
            </span>
          </div>

          <p style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652", textTransform: "uppercase", letterSpacing: "0.32em", marginBottom: "8px" }}>
            OnlySA
          </p>

          <h1 style={{
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(52px, 8vw, 80px)",
            lineHeight: "0.9",
            letterSpacing: "0.02em",
            color: "#F0EDE8",
            marginBottom: "16px",
          }}>
            For SA<br />
            <span style={{ color: "#E63946" }}>Eyes Only</span>
          </h1>

          <p style={{ maxWidth: "420px", fontSize: "14px", color: "#9A9590", lineHeight: "1.6" }}>
            Anonymous confessions, city rants, reviews, and hot takes from across South Africa. Built to feel local, sharp, and unfiltered.
          </p>

          <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
            <Link
              href="/post"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 20px",
                backgroundColor: "#E63946", color: "#fff",
                fontSize: "14px", fontWeight: 600,
                borderRadius: "12px", textDecoration: "none",
                boxShadow: "0 8px 24px rgba(230,57,70,0.3)",
                transition: "opacity 0.2s",
              }}
            >
              <PenLine size={14} />
              Post Anonymously
            </Link>

            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "8px 16px",
              border: "1px solid rgba(35,35,35,0.7)",
              borderRadius: "12px",
              fontSize: "12px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652",
              backgroundColor: "#111",
            }}>
              {totalPosts} live posts · {topArea}
            </span>
          </div>
        </div>

        {/* Mini panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <MiniPanel title="Browse"    body="Use area chips to lock onto a city or jump back to nationwide." />
          <MiniPanel title="Post flow" body="Pick a category, write naturally, then submit without an account." />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */
function MiniPanel({ title, body }: { title: string; body: string }) {
  return (
    <div style={{
      borderRadius: "16px",
      border: "1px solid rgba(35,35,35,0.6)",
      backgroundColor: "rgba(17,17,17,0.8)",
      padding: "16px",
    }}>
      <p style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5A5652", marginBottom: "8px" }}>
        {title}
      </p>
      <p style={{ fontSize: "13px", color: "#9A9590", lineHeight: "1.5" }}>{body}</p>
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      borderRadius: "16px",
      border: "1px solid rgba(35,35,35,0.6)",
      backgroundColor: "#141414",
      padding: "20px",
    }}>
      <p style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5A5652", marginBottom: "12px" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      borderRadius: "12px",
      border: "1px solid rgba(35,35,35,0.6)",
      backgroundColor: "#111",
      padding: "12px",
    }}>
      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5A5652", marginBottom: "6px", fontFamily: "var(--font-mono, monospace)" }}>
        {label}
      </p>
      <p style={{ fontSize: "14px", fontWeight: 500, color: accent ? "#E63946" : "#F0EDE8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {value}
      </p>
    </div>
  );
}

function EmptyFeed() {
  return (
    <div style={{ textAlign: "center", padding: "64px 0" }}>
      <div style={{ fontSize: "40px", marginBottom: "16px" }}>🌾</div>
      <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "14px", color: "#9A9590", marginBottom: "4px" }}>Nothing here yet.</p>
      <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "12px", color: "#5A5652", marginBottom: "24px" }}>Be the first to say something.</p>
      <Link
        href="/post"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "10px 20px",
          backgroundColor: "#E63946", color: "#fff",
          fontSize: "14px", fontWeight: 600,
          borderRadius: "12px", textDecoration: "none",
        }}
      >
        <PenLine size={14} />
        Break the silence
      </Link>
    </div>
  );
}
