"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AREAS = [
  "Durban CBD","Umhlanga","Westville","Ballito","PMB",
  "Richards Bay","Berea","Musgrave","Johannesburg","Cape Town",
];

const CATEGORIES = [
  { id:"Confession",           emoji:"🤫", desc:"Something you can't say IRL" },
  { id:"Rant",                 emoji:"😤", desc:"Let it out" },
  { id:"Review",               emoji:"⭐", desc:"Place, business, or service" },
  { id:"Hot Take",             emoji:"🔥", desc:"Controversial opinion" },
  { id:"Question",             emoji:"❓", desc:"Ask the city" },
  { id:"Neighbourhood Watch",  emoji:"👀", desc:"Something locals should know" },
];

const CAT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Confession:            { bg:"rgba(168,85,247,0.14)",  border:"rgba(168,85,247,0.4)", text:"#c084fc" },
  Rant:                  { bg:"rgba(239,68,68,0.14)",   border:"rgba(239,68,68,0.4)",  text:"#f87171" },
  Review:                { bg:"rgba(52,211,153,0.14)",  border:"rgba(52,211,153,0.4)", text:"#34d399" },
  "Hot Take":            { bg:"rgba(251,146,60,0.14)",  border:"rgba(251,146,60,0.4)", text:"#fb923c" },
  Question:              { bg:"rgba(56,189,248,0.14)",  border:"rgba(56,189,248,0.4)", text:"#38bdf8" },
  "Neighbourhood Watch": { bg:"rgba(250,204,21,0.14)",  border:"rgba(250,204,21,0.4)", text:"#fbbf24" },
};

const MAX = 500;

export default function PostPage() {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [area, setArea]             = useState("");
  const [category, setCategory]     = useState("");
  const [content, setContent]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");

  const remaining = MAX - content.length;
  const canSubmit = !!area && !!category && content.trim().length >= 10 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ area, category, content }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ minHeight:"100vh", background:"#070709", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"var(--font-dm,'DM Sans',sans-serif)" }}>
        <div style={{ position:"fixed", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, borderRadius:"50%", background:"rgba(52,211,153,0.08)", filter:"blur(120px)" }} />
        </div>
        <div style={{ position:"relative", textAlign:"center", maxWidth:380 }}>
          <div style={{ fontSize:60, marginBottom:16 }}>🇿🇦</div>
          <h2 style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.03em", marginBottom:8, fontFamily:"var(--font-syne,'Syne',sans-serif)" }}>Posted.</h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.38)", lineHeight:1.7, marginBottom:32 }}>
            Your post is in the queue. It&apos;ll go live once reviewed. Anonymous, always.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <Link href="/">
              <button style={{ borderRadius:99, padding:"10px 22px", fontSize:13, fontWeight:600, cursor:"pointer", background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.4)", color:"#34d399", transition:"all 0.2s" }}>
                View Feed
              </button>
            </Link>
            <button onClick={() => { setDone(false); setContent(""); setArea(""); setCategory(""); }}
              style={{ borderRadius:99, padding:"10px 22px", fontSize:13, fontWeight:600, cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.55)", transition:"all 0.2s" }}>
              Post Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#070709", color:"white", fontFamily:"var(--font-dm,'DM Sans',sans-serif)" }}>

      {/* ambient */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:0, right:"20%", width:400, height:300, borderRadius:"50%", background:"rgba(34,211,238,0.05)", filter:"blur(110px)" }} />
        <div style={{ position:"absolute", bottom:"25%", left:"15%", width:300, height:300, borderRadius:"50%", background:"rgba(52,211,153,0.05)", filter:"blur(110px)" }} />
      </div>

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(7,7,9,0.88)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:720, margin:"0 auto", padding:"0 20px", height:56, display:"flex", alignItems:"center", gap:10 }}>
          <Link href="/">
            <button style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)", display:"flex", alignItems:"center", padding:4, borderRadius:6, transition:"color 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
          </Link>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>OnlySA</span>
          <span style={{ color:"rgba(255,255,255,0.18)" }}>/</span>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.85)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>Post</span>
        </div>
      </nav>

      <main style={{ maxWidth:720, margin:"0 auto", padding:"40px 20px", position:"relative", zIndex:1 }}>

        {/* HEADING */}
        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:"clamp(28px,5vw,38px)", fontWeight:800, letterSpacing:"-0.03em", marginBottom:10, fontFamily:"var(--font-syne,'Syne',sans-serif)" }}>
            Say Something
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.38)", marginBottom:16 }}>
            No name. No email. No account. Just your unfiltered truth.
          </p>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, borderRadius:99, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", padding:"6px 12px" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", flexShrink:0, display:"inline-block" }} />
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.38)", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>Identity is never stored</span>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:28 }}>

          {/* STEP 1 — AREA */}
          <section>
            <p style={{ fontSize:10, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:12 }}>
              01 · Your Area
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {AREAS.map(a => (
                <button key={a} onClick={() => setArea(a)} style={{ borderRadius:99, padding:"7px 15px", fontSize:12, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", cursor:"pointer", transition:"all 0.2s",
                  background: area===a ? "rgba(52,211,153,0.16)" : "rgba(255,255,255,0.04)",
                  border: area===a ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.09)",
                  color: area===a ? "#34d399" : "rgba(255,255,255,0.42)",
                }}>
                  {a}
                </button>
              ))}
            </div>
          </section>

          {/* STEP 2 — CATEGORY */}
          <section>
            <p style={{ fontSize:10, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:12 }}>
              02 · Category
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:10 }}>
              {CATEGORIES.map(c => {
                const col = CAT_COLORS[c.id];
                const active = category === c.id;
                return (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{ borderRadius:14, padding:"14px 16px", textAlign:"left", cursor:"pointer", transition:"all 0.2s",
                    background: active ? col.bg : "rgba(255,255,255,0.03)",
                    border: active ? `1px solid ${col.border}` : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: active ? `0 0 20px ${col.bg}` : "none",
                  }}>
                    <span style={{ fontSize:20, display:"block", marginBottom:6 }}>{c.emoji}</span>
                    <span style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:2, color: active ? col.text : "rgba(255,255,255,0.75)" }}>{c.id}</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.28)" }}>{c.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 3 — CONTENT */}
          <section>
            <p style={{ fontSize:10, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:12 }}>
              03 · Your Post
            </p>
            <div style={{ position:"relative" }}>
              <textarea ref={textRef} value={content}
                onChange={e => { if (e.target.value.length <= MAX) setContent(e.target.value); }}
                placeholder="Write your confession, rant, review or hot take..."
                rows={5}
                style={{ width:"100%", borderRadius:16, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", backdropFilter:"blur(12px)", padding:"16px 48px 16px 16px", fontSize:14, color:"rgba(255,255,255,0.85)", resize:"none", outline:"none", transition:"border-color 0.2s, background 0.2s", lineHeight:1.65, fontFamily:"var(--font-dm,'DM Sans',sans-serif)" }}
                onFocus={e => { e.target.style.borderColor = "rgba(52,211,153,0.4)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.1)";  e.target.style.background = "rgba(255,255,255,0.04)"; }}
              />
              <span style={{ position:"absolute", bottom:12, right:14, fontSize:11, fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", color: remaining < 50 ? "#f87171" : "rgba(255,255,255,0.2)" }}>
                {remaining}
              </span>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div style={{ borderRadius:10, border:"1px solid rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.08)", padding:"10px 14px", fontSize:12, color:"#f87171", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)" }}>
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <div>
            <button onClick={handleSubmit} disabled={!canSubmit}
              style={{ width:"100%", borderRadius:16, padding:"15px 20px", fontSize:15, fontWeight:600, cursor: canSubmit ? "pointer" : "not-allowed", transition:"all 0.25s", display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                background: canSubmit ? "linear-gradient(135deg,rgba(52,211,153,0.22),rgba(34,211,238,0.14))" : "rgba(255,255,255,0.03)",
                border: canSubmit ? "1px solid rgba(52,211,153,0.38)" : "1px solid rgba(255,255,255,0.07)",
                color: canSubmit ? "white" : "rgba(255,255,255,0.28)",
                backdropFilter: canSubmit ? "blur(12px)" : "none",
                WebkitBackdropFilter: canSubmit ? "blur(12px)" : "none",
                boxShadow: canSubmit ? "0 0 30px rgba(52,211,153,0.1)" : "none",
              }}
              onMouseEnter={e => { if(canSubmit) (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(52,211,153,0.18)"; }}
              onMouseLeave={e => { if(canSubmit) (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(52,211,153,0.1)"; }}
            >
              {submitting ? (
                <>
                  <svg style={{ animation:"spin 1s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
                  Posting…
                </>
              ) : (
                <><span>🇿🇦</span> Post Anonymously</>
              )}
            </button>
            <p style={{ marginTop:12, fontSize:11, color:"rgba(255,255,255,0.2)", textAlign:"center", fontFamily:"var(--font-mono,'IBM Plex Mono',monospace)", lineHeight:1.6 }}>
              A random label like &quot;Durban Local&quot; is assigned · No IP stored · Reviewed before live
            </p>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
