"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ─── Types ─── */
interface Post {
  id: string; content: string; category: string; area: string;
  authorLabel?: string; identity?: string; createdAt: string;
  votes?: number; upvotes?: number; commentCount?: number; comments?: number;
  approved: boolean;
}

/* ─── Seed posts ─── */
const SEED: Post[] = [
  { id:"1", content:"Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and parking costs more than your first car. But somehow we all keep coming back.", category:"Hot Take", area:"Umhlanga", authorLabel:"Umhlanga Resident", createdAt:new Date(Date.now()-3600000).toISOString(), votes:88, commentCount:21, approved:true },
  { id:"2", content:"I've lived in Durban my whole life and I've never actually been to uShaka Marine World. Not once. I walk past it, see the queues, think about it — then go get a bunny chow instead.", category:"Confession", area:"Durban CBD", authorLabel:"Durban Local", createdAt:new Date(Date.now()-14400000).toISOString(), votes:134, commentCount:18, approved:true },
  { id:"3", content:"The N3 at 7am should be classified as psychological torture. Left home at 6:45 to beat traffic. Still sitting here watching a bakkie inch forward.", category:"Rant", area:"Westville", authorLabel:"Westville Resident", createdAt:new Date(Date.now()-25200000).toISOString(), votes:201, commentCount:33, approved:true },
  { id:"4", content:"Genuinely shocked by how good the food at that new spot on Loop Street is. Rich flavours, generous portions, under R150. Cape Town doesn't have a monopoly on good food.", category:"Review", area:"PMB", authorLabel:"PMB Local", createdAt:new Date(Date.now()-39600000).toISOString(), votes:67, commentCount:9, approved:true },
  { id:"5", content:"Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.", category:"Rant", area:"Johannesburg", authorLabel:"Joburg Local", createdAt:new Date(Date.now()-28800000).toISOString(), votes:312, commentCount:41, approved:true },
  { id:"6", content:"Does anyone actually get their deposit back from landlords in SA? Asking for literally every renter I know.", category:"Question", area:"Cape Town", authorLabel:"Cape Town Local", createdAt:new Date(Date.now()-43200000).toISOString(), votes:88, commentCount:53, approved:true },
];

const AREAS = ["All SA","Umhlanga","Durban CBD","Johannesburg","Cape Town","Westville","Berea","Ballito","PMB"];

const CAT: Record<string, { bg:string; color:string; border:string }> = {
  "Rant":                  { bg:"rgba(232,73,15,0.08)",  color:"#E87040", border:"rgba(232,73,15,0.22)" },
  "Confession":            { bg:"rgba(201,58,74,0.08)",  color:"#E06070", border:"rgba(201,58,74,0.22)" },
  "Review":                { bg:"rgba(74,140,106,0.08)", color:"#6AAF88", border:"rgba(74,140,106,0.22)" },
  "Hot Take":              { bg:"rgba(232,160,48,0.08)", color:"#E8B050", border:"rgba(232,160,48,0.22)" },
  "Question":              { bg:"rgba(74,106,140,0.08)", color:"#6A90B0", border:"rgba(74,106,140,0.22)" },
  "Neighbourhood Watch":   { bg:"rgba(120,80,160,0.08)", color:"#A070C0", border:"rgba(120,80,160,0.22)" },
};

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60)    return `${Math.floor(s)}s`;
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

/* ══════════════════════════════════════════════
   ENTRANCE SCREEN — zero external imports
══════════════════════════════════════════════ */
function EntranceScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: "#060608",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden", zIndex: 100,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
        width: "70vw", height: "50vh", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(232,73,15,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "15%",
        width: "35vw", height: "35vw", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(240,104,48,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(232,73,15,0.5), rgba(240,104,48,0.5), transparent)",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 580 }}>
        <p style={{
          fontSize: 10, fontFamily: "DM Mono, monospace",
          textTransform: "uppercase", letterSpacing: "0.32em",
          color: "rgba(160,154,147,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
          marginBottom: 32,
        }}>
          <span style={{ display: "inline-block", width: 28, height: 1, background: "rgba(232,73,15,0.4)" }} />
          South Africa
          <span style={{ display: "inline-block", width: 28, height: 1, background: "rgba(232,73,15,0.4)" }} />
        </p>

        <h1 style={{
          fontFamily: "Syne, DM Sans, sans-serif",
          fontSize: "clamp(72px, 14vw, 136px)",
          fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.85,
          color: "#F2EEE9", marginBottom: 32,
        }}>
          Only
          <span style={{
            background: "linear-gradient(135deg, #E8490F 0%, #F06830 45%, #E8A030 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>SA</span>
        </h1>

        <p style={{
          fontSize: 15, fontFamily: "DM Sans, sans-serif", fontWeight: 300,
          color: "rgba(160,154,147,0.65)", lineHeight: 1.8,
          maxWidth: 340, margin: "0 auto 52px", letterSpacing: "0.01em",
        }}>
          Anonymous confessions, rants, and unfiltered truths from across South Africa.
        </p>

        {/* Enter button — pure HTML, zero deps */}
        <button
          onClick={onEnter}
          style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 56, padding: "0 48px",
            fontSize: 12, fontFamily: "Syne, DM Sans, sans-serif",
            fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#F2EEE9",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 9999,
            cursor: "pointer",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 60px rgba(232,73,15,0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 1px rgba(255,255,255,0.08), 0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 80px rgba(232,73,15,0.15)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 60px rgba(232,73,15,0.1)";
          }}
        >
          Enter
        </button>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 44, marginTop: 64 }}>
          {[{ v:"9+", l:"Cities" }, { v:"Live", l:"Always" }, { v:"Zero", l:"Identity" }].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(242,238,233,0.6)", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>{v}</div>
              <div style={{ fontSize: 9, color: "rgba(160,154,147,0.25)", fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(232,73,15,0.2), transparent)",
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════════════ */
export default function Page() {
  const [entered, setEntered]   = useState(false);
  const [exiting, setExiting]   = useState(false);
  const [posts, setPosts]       = useState<Post[]>(SEED);
  const [area, setArea]         = useState("All SA");
  const [tab, setTab]           = useState("recent");

  useEffect(() => {
    fetch("/api/posts")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.posts?.length) setPosts(d.posts); })
      .catch(() => {});
  }, []);

  function handleEnter() {
    setExiting(true);
    setTimeout(() => setEntered(true), 600);
  }

  /* ── Entrance ── */
  if (!entered) {
    return (
      <div style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        <EntranceScreen onEnter={handleEnter} />
      </div>
    );
  }

  const filtered = posts
    .filter(p => p.approved !== false)
    .filter(p => area === "All SA" || p.area === area)
    .sort((a, b) => {
      if (tab === "trending") return (b.votes||b.upvotes||0) - (a.votes||a.upvotes||0);
      if (tab === "top")      return (b.commentCount||b.comments||0) - (a.commentCount||a.comments||0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  /* ── Feed world ── */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060608", color: "#F2EEE9", fontFamily: "DM Sans, sans-serif" }}>

      {/* Ambient bg */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse, rgba(232,73,15,0.03), transparent 70%)" }} />
      </div>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        backgroundColor: "rgba(6,6,8,0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Only<span style={{ background: "linear-gradient(135deg,#E8490F,#F06830)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>SA</span>
          </span>
          <Link href="/post">
            <button style={{
              display: "flex", alignItems: "center", gap: 7, padding: "7px 18px", borderRadius: 99,
              fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "Syne, sans-serif", letterSpacing: "0.04em",
              background: "linear-gradient(135deg,#E8490F,#C93A0A)", border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(232,73,15,0.28)", transition: "all 0.2s",
            }}>
              + Post Anonymously
            </button>
          </Link>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ padding: "80px 24px 64px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 9999, border: "1px solid rgba(232,73,15,0.2)", background: "rgba(232,73,15,0.06)", marginBottom: 28 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#E8490F" }} />
              <span style={{ fontSize: 10, fontFamily: "DM Mono, monospace", color: "rgba(232,73,15,0.75)", textTransform: "uppercase", letterSpacing: "0.28em" }}>Live Feed</span>
            </div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(44px,7vw,80px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, color: "#F2EEE9", marginBottom: 20 }}>
              For SA<br />
              <span style={{ background: "linear-gradient(135deg,#E8490F 0%,#F06830 50%,#E8A030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Eyes Only</span>
            </h2>
            <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(160,154,147,0.6)", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 36px" }}>
              Anonymous confessions, city rants, reviews, and unfiltered opinions from across South Africa.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <Link href="/post">
                <button style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px",
                  borderRadius: 12, fontSize: 13, fontWeight: 700, color: "#fff",
                  fontFamily: "Syne, sans-serif", letterSpacing: "0.04em",
                  background: "linear-gradient(135deg,#E8490F,#C93A0A)", border: "none", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(232,73,15,0.3)", transition: "all 0.2s",
                }}>
                  Post Anonymously
                </button>
              </Link>
              <a href="#feed" style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 20px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)",
                color: "rgba(160,154,147,0.55)", textDecoration: "none", fontSize: 13, transition: "all 0.2s",
              }}>
                Browse
              </a>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS — inline, no import ── */}
        <section style={{ padding: "80px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 10, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(160,154,147,0.3)", marginBottom: 14 }}>What SA is saying</p>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#F2EEE9" }}>
                Real posts. No filter.
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 900, margin: "0 auto" }}>
              {[
                { user:"Westville Resident", handle:"@westville_za", cat:"Rant", area:"Westville", text:"The N3 at 7am should be classified as psychological torture. Left home at 6:45. Still watching a bakkie inch forward.", time:"2h", likes:201 },
                { user:"Umhlanga Resident",  handle:"@umhlanga_za",  cat:"Hot Take", area:"Umhlanga", text:"Umhlanga is just Sandton with a beach view and twice the attitude. R90 coffee and parking costs more than your first car.", time:"5h", likes:88 },
                { user:"Joburg Local",       handle:"@joburg_za",    cat:"Rant", area:"Johannesburg", text:"Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.", time:"8h", likes:312 },
              ].map((card, i) => {
                const c = CAT[card.cat] ?? { bg:"rgba(255,255,255,0.04)", color:"#A09A93", border:"rgba(255,255,255,0.08)" };
                return (
                  <div key={i} style={{
                    background: "rgba(13,13,16,0.85)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16, padding: "20px 22px",
                    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,238,233,0.9)", fontFamily: "Syne, sans-serif" }}>{card.user}</div>
                        <div style={{ fontSize: 11, color: "rgba(160,154,147,0.5)", fontFamily: "DM Mono, monospace", marginTop: 1 }}>{card.handle}</div>
                      </div>
                      <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 3, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", alignSelf: "flex-start" }}>
                        {card.cat}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(242,238,233,0.72)", marginBottom: 14, fontWeight: 300 }}>{card.text}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "rgba(160,154,147,0.3)", fontFamily: "DM Mono, monospace" }}>{card.area} · {card.time}</span>
                      <span style={{ fontSize: 11, color: "rgba(160,154,147,0.35)", fontFamily: "DM Mono, monospace" }}>{card.likes}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "80px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 10, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(160,154,147,0.3)", marginBottom: 14 }}>The process</p>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#F2EEE9" }}>Three steps. Zero traces.</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1 }}>
              {[
                { n:"01", title:"Pick your area",   body:"Durban, Joburg, Cape Town, Umhlanga and more. Your voice, your city." },
                { n:"02", title:"Choose a category", body:"Confession, Rant, Review, Hot Take, Question, or Neighbourhood Watch." },
                { n:"03", title:"Post anonymously",  body:"No account. No name. A random identity is auto-assigned. Nothing stored." },
              ].map(({ n, title, body }, i) => (
                <div key={n} style={{ padding: "32px 28px", border: "1px solid rgba(255,255,255,0.06)", background: i === 1 ? "rgba(232,73,15,0.025)" : "transparent" }}>
                  <div style={{ fontSize: 10, fontFamily: "DM Mono, monospace", color: "rgba(232,73,15,0.45)", letterSpacing: "0.12em", marginBottom: 20 }}>{n}</div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#F2EEE9", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em", marginBottom: 10 }}>{title}</h4>
                  <p style={{ fontSize: 13, color: "rgba(160,154,147,0.5)", lineHeight: 1.65, fontWeight: 300 }}>{body}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/post">
                <button style={{ padding: "12px 32px", borderRadius: 12, fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg,#E8490F,#C93A0A)", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(232,73,15,0.3)" }}>
                  Start posting
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── LIVE FEED ── */}
        <section id="feed" style={{ padding: "80px 24px 120px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(160,154,147,0.3)", marginBottom: 10 }}>Live feed</p>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#F2EEE9" }}>What SA is confessing</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(116,183,120,0.8)" }} />
                <span style={{ fontSize: 10, fontFamily: "DM Mono, monospace", color: "rgba(160,154,147,0.28)", textTransform: "uppercase", letterSpacing: "0.12em" }}>live</span>
              </div>
            </div>

            {/* Area chips */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 12 }}>
              {AREAS.map(a => (
                <button key={a} onClick={() => setArea(a)} style={{
                  flexShrink: 0, borderRadius: 99, padding: "5px 14px", fontSize: 11,
                  fontFamily: "DM Mono, monospace", cursor: "pointer", whiteSpace: "nowrap",
                  background: area === a ? "rgba(232,73,15,0.1)" : "rgba(255,255,255,0.02)",
                  border: area === a ? "1px solid rgba(232,73,15,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  color: area === a ? "#E87040" : "rgba(160,154,147,0.38)", transition: "all 0.15s",
                }}>
                  {a}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 24 }}>
              {[{ id:"recent", label:"Recent" }, { id:"trending", label:"Trending" }, { id:"top", label:"Top" }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: "9px 16px", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 500,
                  cursor: "pointer", background: "none", border: "none",
                  color: tab === t.id ? "#F2EEE9" : "rgba(160,154,147,0.32)",
                  borderBottom: tab === t.id ? "1px solid #E8490F" : "1px solid transparent",
                  marginBottom: -1, transition: "all 0.2s",
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filtered.length === 0 ? (
                <p style={{ textAlign: "center", padding: "80px 0", fontSize: 11, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(160,154,147,0.25)" }}>No posts in {area} yet</p>
              ) : filtered.map((post, i) => {
                const votes    = post.votes ?? post.upvotes ?? 0;
                const comments = post.commentCount ?? post.comments ?? 0;
                const label    = post.authorLabel ?? post.identity ?? "Anonymous";
                const c = CAT[post.category] ?? { bg:"rgba(255,255,255,0.03)", color:"rgba(160,154,147,0.4)", border:"rgba(255,255,255,0.07)" };
                return (
                  <article key={post.id} style={{ padding: "22px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 3, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: "DM Mono, monospace" }}>
                          {post.category}
                        </span>
                        <span style={{ fontSize: 10, color: "rgba(160,154,147,0.28)", fontFamily: "DM Mono, monospace" }}>{post.area}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "rgba(160,154,147,0.18)", fontFamily: "DM Mono, monospace" }}>{timeAgo(post.createdAt)}</span>
                    </div>
                    <Link href={`/post/${post.id}`} style={{ textDecoration: "none" }}>
                      <p style={{ fontSize: 15, lineHeight: 1.65, fontWeight: 300, color: "rgba(242,238,233,0.72)", marginBottom: 14, cursor: "pointer" }}>
                        {post.content}
                      </p>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: "rgba(160,154,147,0.22)", fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <Link href={`/post/${post.id}`} style={{ textDecoration: "none", fontSize: 11, color: "rgba(160,154,147,0.28)", fontFamily: "DM Mono, monospace" }}>
                          {comments} replies
                        </Link>
                        <span style={{ fontSize: 11, color: "rgba(160,154,147,0.28)", fontFamily: "DM Mono, monospace" }}>{votes}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div style={{ textAlign: "center", paddingTop: 52, borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 8 }}>
              <p style={{ fontSize: 10, color: "rgba(160,154,147,0.25)", marginBottom: 20, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.14em" }}>Add your voice</p>
              <Link href="/post">
                <button style={{ padding: "12px 32px", borderRadius: 12, fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg,#E8490F,#C93A0A)", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(232,73,15,0.3)" }}>
                  Post Anonymously
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "36px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em" }}>
              Only<span style={{ background: "linear-gradient(135deg,#E8490F,#F06830)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>SA</span>
            </span>
            <p style={{ fontSize: 9, color: "rgba(160,154,147,0.18)", fontFamily: "DM Mono, monospace", letterSpacing: "0.16em", textTransform: "uppercase" }}>Anonymous · Unfiltered · South Africa</p>
            <div style={{ display: "flex", gap: 24 }}>
              {[["About","/about"],["Guidelines","/guidelines"],["Report","mailto:abuse@onlysa.co.za"]].map(([l, h]) => (
                <Link key={l} href={h} style={{ fontSize: 11, color: "rgba(160,154,147,0.2)", textDecoration: "none", fontFamily: "DM Mono, monospace" }}>{l}</Link>
              ))}
            </div>
            <p style={{ fontSize: 9, color: "rgba(160,154,147,0.1)", fontFamily: "DM Mono, monospace" }}>© 2026 OnlySA</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
