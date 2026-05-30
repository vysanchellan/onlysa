"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

const SEED: Post[] = [
  {
    id: "1",
    content: "Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and the parking costs more than your first car. But somehow we all keep coming back. Change my mind.",
    category: "Hot Take", area: "Umhlanga", authorLabel: "Umhlanga Local",
    createdAt: new Date(Date.now() - 1000*60*60).toISOString(), votes: 88, commentCount: 21, approved: true,
  },
  {
    id: "2",
    content: "I've lived in Durban my whole life and I've never actually been to uShaka Marine World. Not once. I walk past it, I see the queues, I think about it — and then I go get a bunny chow instead.",
    category: "Confession", area: "Durban CBD", authorLabel: "Durban Local",
    createdAt: new Date(Date.now() - 1000*60*60*4).toISOString(), votes: 134, commentCount: 18, approved: true,
  },
  {
    id: "3",
    content: "The N3 at 7am should be classified as a form of psychological torture. I left home at 6:45 to beat traffic and I'm still sitting here watching a bakkie inch forward. That is all.",
    category: "Rant", area: "Westville", authorLabel: "Westville Resident",
    createdAt: new Date(Date.now() - 1000*60*60*7).toISOString(), votes: 201, commentCount: 33, approved: true,
  },
  {
    id: "4",
    content: "Genuinely shocked by how good the food at that new spot on Loop Street is. Rich, full flavours, generous portions, and under R150 for a meal. Cape Town doesn't have to be the only city with good restaurants.",
    category: "Review", area: "PMB", authorLabel: "PMB Local",
    createdAt: new Date(Date.now() - 1000*60*60*11).toISOString(), votes: 67, commentCount: 9, approved: true,
  },
  {
    id: "5",
    content: "Eskom scheduled maintenance notice for 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.",
    category: "Rant", area: "Johannesburg", authorLabel: "Joburg Local",
    createdAt: new Date(Date.now() - 1000*60*60*8).toISOString(), votes: 312, commentCount: 41, approved: true,
  },
  {
    id: "6",
    content: "Serious question: does anyone actually get their deposit back from landlords in SA? Asking for literally every renter I know.",
    category: "Question", area: "Cape Town", authorLabel: "Cape Town Local",
    createdAt: new Date(Date.now() - 1000*60*60*12).toISOString(), votes: 88, commentCount: 53, approved: true,
  },
];

const AREAS = ["All SA", "Umhlanga", "Durban CBD", "Johannesburg", "Cape Town", "Westville", "Berea", "Ballito", "PMB"];
const TABS  = ["Recent", "Trending", "Top"];

const CAT: Record<string, { bg: string; text: string; border: string }> = {
  Rant:                  { bg:"rgba(239,68,68,0.12)",   text:"#f87171", border:"rgba(239,68,68,0.35)"  },
  Confession:            { bg:"rgba(168,85,247,0.12)",  text:"#c084fc", border:"rgba(168,85,247,0.35)" },
  Review:                { bg:"rgba(52,211,153,0.12)",  text:"#34d399", border:"rgba(52,211,153,0.35)" },
  "Hot Take":            { bg:"rgba(251,146,60,0.12)",  text:"#fb923c", border:"rgba(251,146,60,0.35)" },
  Question:              { bg:"rgba(56,189,248,0.12)",  text:"#38bdf8", border:"rgba(56,189,248,0.35)" },
  "Neighbourhood Watch": { bg:"rgba(250,204,21,0.12)",  text:"#fbbf24", border:"rgba(250,204,21,0.35)" },
};

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60)   return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function PostCard({ post }: { post: Post }) {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(post.votes);
  const c = CAT[post.category] ?? { bg:"rgba(255,255,255,0.08)", text:"rgba(255,255,255,0.5)", border:"rgba(255,255,255,0.15)" };

  return (
    <article style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"18px 20px", transition:"all 0.25s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.13)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      {/* top row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 9px", borderRadius:99, background:c.bg, color:c.text, border:`1px solid ${c.border}`, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>
            {post.category}
          </span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>
            {post.area}
          </span>
        </div>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.22)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", flexShrink:0 }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* content */}
      <Link href={`/post/${post.id}`}>
        <p style={{ fontSize:14, lineHeight:1.65, color:"rgba(255,255,255,0.78)", marginBottom:14, cursor:"pointer", display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {post.content}
        </p>
      </Link>

      {/* footer */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"linear-gradient(135deg,#34d399,#22d3ee)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>🇿🇦</div>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.28)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>{post.authorLabel}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Link href={`/post/${post.id}`}>
            <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"rgba(255,255,255,0.28)", cursor:"pointer", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {post.commentCount}
            </span>
          </Link>
          <button onClick={() => { voted ? setCount(v=>v-1) : setCount(v=>v+1); setVoted(!voted); }}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color: voted ? "#34d399" : "rgba(255,255,255,0.28)", background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", transition:"color 0.2s" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={voted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            {count}
          </button>
        </div>
      </div>
    </article>
  );
}

function StatCard({ emoji, value, label, sub }: { emoji: string; value: string; label: string; sub: string }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"16px 18px", transition:"all 0.25s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
    >
      <div style={{ fontSize:18, marginBottom:6 }}>{emoji}</div>
      <div style={{ fontSize:26, fontWeight:700, color:"white", fontFamily:"var(--font-syne,'Syne',sans-serif)", letterSpacing:"-0.03em", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:4, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>{label}</div>
      <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", marginTop:2, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>{sub}</div>
    </div>
  );
}

export default function HomePage() {
  const [posts, setPosts]   = useState<Post[]>(SEED);
  const [area, setArea]     = useState("All SA");
  const [tab, setTab]       = useState("Recent");
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      if (res.ok) { const d = await res.json(); if (d.posts?.length) setPosts(d.posts); }
    } catch { /* use seed */ } finally { setLoading(false); }
  }

  const filtered = posts
    .filter(p => p.approved !== false)
    .filter(p => area === "All SA" || p.area === area)
    .sort((a, b) => {
      if (tab === "Trending") return b.votes - a.votes;
      if (tab === "Top")      return b.commentCount - a.commentCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div style={{ minHeight:"100vh", background:"#070709", color:"white", fontFamily:"var(--font-dm,'DM Sans',sans-serif)" }}>

      {/* ambient blobs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)", width:600, height:300, borderRadius:"50%", background:"rgba(52,211,153,0.07)", filter:"blur(100px)" }} />
        <div style={{ position:"absolute", bottom:"30%", right:0, width:400, height:400, borderRadius:"50%", background:"rgba(34,211,238,0.04)", filter:"blur(130px)" }} />
      </div>

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(7,7,9,0.88)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:860, margin:"0 auto", padding:"0 20px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-0.03em", fontFamily:"var(--font-syne,'Syne',sans-serif)" }}>OnlySA</span>
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.25)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:4, padding:"2px 6px", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", letterSpacing:"0.08em" }}>🇿🇦 ZA</span>
          </div>
          <Link href="/post">
            <button style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 18px", borderRadius:99, fontSize:13, fontWeight:600, color:"white", cursor:"pointer", transition:"all 0.2s", background:"rgba(52,211,153,0.12)", border:"1px solid rgba(52,211,153,0.35)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.12)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Post Anonymously
            </button>
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth:860, margin:"0 auto", padding:"36px 20px", position:"relative", zIndex:1 }}>

        {/* STAT CARDS */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:36 }}>
          <StatCard emoji="📬" value={String(posts.length)} label="Posts" sub="and counting" />
          <StatCard emoji="📍" value="8" label="Areas" sub="cities covered" />
          <StatCard emoji="👁" value="Live" label="Status" sub="auto-refresh" />
          <StatCard emoji="🔒" value="Zero" label="Identity" sub="never stored" />
        </div>

        {/* HEADING */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:"clamp(28px,5vw,40px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:8, fontFamily:"var(--font-syne,'Syne',sans-serif)" }}>
            <span style={{ color:"white" }}>For SA </span>
            <span style={{ background:"linear-gradient(90deg,#34d399,#22d3ee)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Eyes Only</span>
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.38)", lineHeight:1.6 }}>
            Anonymous confessions, rants, reviews &amp; hot takes from across South Africa.
          </p>
        </div>

        {/* AREA CHIPS */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:16, scrollbarWidth:"none" }}>
          {AREAS.map(a => (
            <button key={a} onClick={() => setArea(a)} style={{ flexShrink:0, borderRadius:99, padding:"6px 14px", fontSize:12, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap",
              background: area===a ? "rgba(52,211,153,0.18)" : "rgba(255,255,255,0.04)",
              border: area===a ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.09)",
              color: area===a ? "#34d399" : "rgba(255,255,255,0.42)",
            }}>
              {a}
            </button>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:0, marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.07)", alignItems:"center" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 18px", fontSize:13, fontWeight:500, cursor:"pointer", background:"none", border:"none", color: tab===t ? "white" : "rgba(255,255,255,0.32)", borderBottom: tab===t ? "2px solid #34d399" : "2px solid transparent", marginBottom:-1, transition:"all 0.2s" }}>
              {t==="Recent"?"🕐 Recent":t==="Trending"?"🔥 Trending":"⭐ Top"}
            </button>
          ))}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, paddingBottom:10 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>live</span>
          </div>
        </div>

        {/* FEED */}
        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[1,2,3].map(i => <div key={i} style={{ height:120, borderRadius:16, background:"rgba(255,255,255,0.03)", animation:"pulse 2s infinite" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:"rgba(255,255,255,0.22)" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
            <p style={{ fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", fontSize:13 }}>No posts yet for {area}</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map((post, i) => (
              <div key={post.id} style={{ animationDelay:`${i*60}ms` }} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-400">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <footer style={{ marginTop:60, paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.18)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", marginBottom:12 }}>© 2026 OnlySA · Anonymous. Unfiltered. SA. 🇿🇦</p>
          <div style={{ display:"flex", justifyContent:"center", gap:24 }}>
            {["About", "Guidelines", "Report"].map(l => (
              <Link key={l} href={l==="Report" ? "mailto:abuse@onlysa.co.za" : `/${l.toLowerCase()}`}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.22)", cursor:"pointer", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", transition:"color 0.2s" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.22)")}
                >{l}</span>
              </Link>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
