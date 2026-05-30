"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Testimonials } from "@/components/ui/twitter-testimonial-cards";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { PenLine, TrendingUp, Flame, MapPin, ArrowRight, ChevronDown } from "lucide-react";

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
  { id:"1", content:"Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and the parking costs more than your first car. But somehow we all keep coming back. Change my mind.", category:"Hot Take", area:"Umhlanga", authorLabel:"Umhlanga Local", createdAt:new Date(Date.now()-1000*60*60).toISOString(), votes:88, commentCount:21, approved:true },
  { id:"2", content:"I've lived in Durban my whole life and I've never actually been to uShaka Marine World. Not once. I walk past it, I see the queues, I think about it — and then I go get a bunny chow instead.", category:"Confession", area:"Durban CBD", authorLabel:"Durban Local", createdAt:new Date(Date.now()-1000*60*60*4).toISOString(), votes:134, commentCount:18, approved:true },
  { id:"3", content:"The N3 at 7am should be classified as a form of psychological torture. I left home at 6:45 to beat traffic and I'm still sitting here watching a bakkie inch forward. That is all.", category:"Rant", area:"Westville", authorLabel:"Westville Resident", createdAt:new Date(Date.now()-1000*60*60*7).toISOString(), votes:201, commentCount:33, approved:true },
  { id:"4", content:"Genuinely shocked by how good the food at that new spot on Loop Street is. Rich, full flavours, generous portions, and under R150 for a meal.", category:"Review", area:"PMB", authorLabel:"PMB Local", createdAt:new Date(Date.now()-1000*60*60*11).toISOString(), votes:67, commentCount:9, approved:true },
  { id:"5", content:"Eskom scheduled maintenance notice for 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.", category:"Rant", area:"Johannesburg", authorLabel:"Joburg Local", createdAt:new Date(Date.now()-1000*60*60*8).toISOString(), votes:312, commentCount:41, approved:true },
  { id:"6", content:"Serious question: does anyone actually get their deposit back from landlords in SA? Asking for literally every renter I know.", category:"Question", area:"Cape Town", authorLabel:"Cape Town Local", createdAt:new Date(Date.now()-1000*60*60*12).toISOString(), votes:88, commentCount:53, approved:true },
];

const AREAS = ["All SA","Umhlanga","Durban CBD","Johannesburg","Cape Town","Westville","Berea","Ballito","PMB"];

const CAT_COLORS: Record<string,{bg:string;text:string;border:string}> = {
  Rant:                  {bg:"rgba(239,68,68,0.1)",   text:"#f87171", border:"rgba(239,68,68,0.3)"  },
  Confession:            {bg:"rgba(168,85,247,0.1)",  text:"#c084fc", border:"rgba(168,85,247,0.3)" },
  Review:                {bg:"rgba(34,197,94,0.1)",   text:"#4ade80", border:"rgba(34,197,94,0.3)"  },
  "Hot Take":            {bg:"rgba(251,146,60,0.1)",  text:"#fb923c", border:"rgba(251,146,60,0.3)" },
  Question:              {bg:"rgba(56,189,248,0.1)",  text:"#38bdf8", border:"rgba(56,189,248,0.3)" },
  "Neighbourhood Watch": {bg:"rgba(250,204,21,0.1)",  text:"#fbbf24", border:"rgba(250,204,21,0.3)" },
};

function timeAgo(iso:string) {
  const s = (Date.now()-new Date(iso).getTime())/1000;
  if(s<60) return `${Math.floor(s)}s ago`;
  if(s<3600) return `${Math.floor(s/60)}m ago`;
  if(s<86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

export default function LandingPage() {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [area, setArea]   = useState("All SA");
  const [tab, setTab]     = useState("Recent");
  const [visible, setVisible] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    fetch("/api/posts").then(r => r.ok ? r.json() : null).then(d => { if(d?.posts?.length) setPosts(d.posts); }).catch(()=>{});
  }, []);

  const filtered = posts
    .filter(p => p.approved !== false)
    .filter(p => area === "All SA" || p.area === area)
    .sort((a,b) => {
      if(tab==="Trending") return b.votes - a.votes;
      if(tab==="Top")      return b.commentCount - a.commentCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#070709", color:"white", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

      {/* ── Ambient blobs ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-120, left:"50%", transform:"translateX(-50%)", width:700, height:350, borderRadius:"50%", background:"rgba(255,59,31,0.06)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", bottom:"20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"rgba(168,85,247,0.04)", filter:"blur(140px)" }} />
        <div style={{ position:"absolute", top:"40%", left:"-5%", width:400, height:400, borderRadius:"50%", background:"rgba(56,189,248,0.03)", filter:"blur(100px)" }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(7,7,9,0.85)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.03em", color:"white" }}>
              Only<span style={{ color:"#FF3B1F" }}>SA</span>
            </span>
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"2px 6px", fontFamily:"monospace", letterSpacing:"0.08em" }}>🇿🇦 ZA</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <a href="#feed" style={{ fontSize:13, color:"rgba(255,255,255,0.45)", textDecoration:"none", transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="rgba(255,255,255,0.85)")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.45)")}
            >Feed</a>
            <Link href="/post">
              <button style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 18px", borderRadius:99, fontSize:13, fontWeight:600, color:"white", cursor:"pointer", background:"#FF3B1F", border:"none", boxShadow:"0 4px 20px rgba(255,59,31,0.35)", transition:"all 0.2s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLElement).style.boxShadow="0 6px 28px rgba(255,59,31,0.45)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="none";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 20px rgba(255,59,31,0.35)";}}
              >
                <PenLine size={13}/> Post Anonymously
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ position:"relative", zIndex:1 }}>

        {/* ════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════ */}
        <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px 60px", textAlign:"center" }}>

          {/* Live badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"5px 14px", borderRadius:9999,
            border:"1px solid rgba(255,59,31,0.3)",
            background:"rgba(255,59,31,0.08)",
            marginBottom:32,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition:"all 0.6s ease 0.1s",
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#FF3B1F", boxShadow:"0 0 8px #FF3B1F", animation:"livepulse 2s infinite" }} />
            <span style={{ fontSize:11, fontFamily:"monospace", color:"rgba(255,59,31,0.9)", textTransform:"uppercase", letterSpacing:"0.28em" }}>
              Live · Anonymous · South Africa
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily:"'Space Grotesk','DM Sans',sans-serif",
            fontSize:"clamp(52px, 9vw, 100px)",
            fontWeight:800,
            lineHeight:0.92,
            letterSpacing:"-0.04em",
            marginBottom:28,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition:"all 0.7s ease 0.2s",
          }}>
            <span style={{ color:"white" }}>For SA</span><br/>
            <span style={{ background:"linear-gradient(135deg, #FF3B1F, #ff6b47)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Eyes Only</span>
          </h1>

          {/* Subheading */}
          <p style={{
            maxWidth:520, fontSize:17, color:"rgba(255,255,255,0.45)", lineHeight:1.65,
            marginBottom:44,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition:"all 0.7s ease 0.35s",
          }}>
            Anonymous confessions, city rants, reviews, and hot takes from across South Africa.
            Built to feel local, sharp, and unfiltered.
          </p>

          {/* CTA buttons */}
          <div style={{
            display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center",
            marginBottom:80,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition:"all 0.7s ease 0.45s",
          }}>
            {/* Liquid Glass CTA */}
            <div style={{ position:"relative", height:200, width:260, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{
                position:"absolute", inset:0,
                background:"radial-gradient(ellipse at center, rgba(255,59,31,0.15), transparent 70%)",
                borderRadius:24,
              }} />
              <Link href="/post" style={{ textDecoration:"none" }}>
                <LiquidButton className="text-white font-semibold tracking-wide">
                  ✍️ Post Anonymously
                </LiquidButton>
              </Link>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10, justifyContent:"center" }}>
              <a href="#feed" style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"12px 24px", borderRadius:12,
                border:"1px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.04)",
                color:"rgba(255,255,255,0.7)", textDecoration:"none",
                fontSize:14, fontWeight:500, transition:"all 0.2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";e.currentTarget.style.color="white";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.7)";}}
              >
                Browse the feed <ArrowRight size={14}/>
              </a>
              <div style={{ display:"flex", gap:8 }}>
                {[{e:"📬",v:String(posts.length),l:"Posts"},{e:"📍",v:"9",l:"Areas"},{e:"🔒",v:"Zero",l:"Identity"}].map(s=>(
                  <div key={s.l} style={{ flex:1, padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
                    <div style={{ fontSize:14, marginBottom:2 }}>{s.e}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"white" }}>{s.v}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ opacity:0.4, animation:"bounce 2s ease infinite" }}>
            <ChevronDown size={20} color="white"/>
          </div>
        </section>

        {/* ════════════════════════════════════
            TESTIMONIALS SECTION
        ════════════════════════════════════ */}
        <section style={{ padding:"80px 24px", overflow:"hidden" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <p style={{ fontSize:11, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.28em", color:"rgba(255,255,255,0.3)", marginBottom:12 }}>
                What SA is saying
              </p>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(28px,5vw,44px)", fontWeight:800, letterSpacing:"-0.03em", color:"white" }}>
                Real posts. Real people.<br/>
                <span style={{ background:"linear-gradient(135deg,#FF3B1F,#ff6b47)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Zero filter.</span>
              </h2>
            </div>

            {/* Stacked testimonial cards */}
            <div style={{ display:"flex", justifyContent:"center", paddingBottom:120, paddingTop:20 }}>
              <Testimonials cards={[
                {
                  className:"[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
                  username:"Durban Local", handle:"@durban_anon",
                  content:"The N3 at 7am should be classified as a form of psychological torture. I left home at 6:45 and I'm still sitting here watching a bakkie inch forward. That is all. 🚗",
                  date:"2h ago", verified:false, likes:201, retweets:33, tweetUrl:"https://onlysa.vercel.app",
                },
                {
                  className:"[grid-area:stack] translate-x-8 sm:translate-x-16 translate-y-6 sm:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
                  username:"Umhlanga Resident", handle:"@umhlanga_anon",
                  content:"Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and parking costs more than your first car. But somehow we all keep coming back. Change my mind.",
                  date:"5h ago", verified:false, likes:88, retweets:21, tweetUrl:"https://onlysa.vercel.app",
                },
                {
                  className:"[grid-area:stack] translate-x-16 sm:translate-x-32 translate-y-12 sm:translate-y-20 hover:translate-y-6 sm:hover:translate-y-10",
                  username:"Joburg Local", handle:"@joburg_anon",
                  content:"Eskom scheduled maintenance notice for 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense. 🕯️",
                  date:"8h ago", verified:false, likes:312, retweets:41, tweetUrl:"https://onlysa.vercel.app",
                },
              ]}/>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════ */}
        <section style={{ padding:"80px 24px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:56 }}>
              <p style={{ fontSize:11, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.28em", color:"rgba(255,255,255,0.3)", marginBottom:12 }}>Simple as that</p>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:800, letterSpacing:"-0.03em", color:"white" }}>
                Three steps. Zero traces.
              </h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
              {[
                { n:"01", icon:"📍", title:"Pick your area", body:"Durban, Joburg, Cape Town, Umhlanga and more. Your post goes to your city's feed." },
                { n:"02", icon:"🏷️", title:"Choose a category", body:"Confession, Rant, Review, Hot Take, Question or Neighbourhood Watch." },
                { n:"03", icon:"🔒", title:"Post anonymously", body:"No account. No name. A random identity like 'Durban Local' is auto-assigned." },
              ].map(({ n, icon, title, body }) => (
                <div key={n} style={{
                  padding:"28px 24px", borderRadius:20,
                  background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                  transition:"all 0.25s",
                }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.055)";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,59,31,0.2)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.03)";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.07)";}}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                    <span style={{ fontSize:11, fontFamily:"monospace", color:"#FF3B1F", fontWeight:700 }}>{n}</span>
                    <span style={{ fontSize:24 }}>{icon}</span>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:"white", marginBottom:8, fontFamily:"'Space Grotesk',sans-serif" }}>{title}</h3>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{body}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign:"center", marginTop:48 }}>
              <Link href="/post">
                <button style={{
                  display:"inline-flex", alignItems:"center", gap:10,
                  padding:"14px 32px", borderRadius:14,
                  background:"#FF3B1F", color:"white",
                  fontSize:15, fontWeight:700, border:"none", cursor:"pointer",
                  boxShadow:"0 8px 28px rgba(255,59,31,0.35)", transition:"all 0.2s",
                }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow="0 12px 36px rgba(255,59,31,0.45)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="none";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 28px rgba(255,59,31,0.35)";}}
                >
                  <PenLine size={16}/> Start posting now
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            LIVE FEED
        ════════════════════════════════════ */}
        <section id="feed" ref={feedRef} style={{ padding:"80px 24px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>

            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:32 }}>
              <div>
                <p style={{ fontSize:11, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.28em", color:"rgba(255,255,255,0.3)", marginBottom:8 }}>Live feed</p>
                <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:800, letterSpacing:"-0.03em", color:"white" }}>
                  What SA is confessing
                </h2>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", animation:"livepulse 2s infinite" }} />
                <span style={{ fontSize:11, fontFamily:"monospace", color:"rgba(255,255,255,0.3)" }}>live updates</span>
              </div>
            </div>

            {/* Area chips */}
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:16, scrollbarWidth:"none" }}>
              {AREAS.map(a => (
                <button key={a} onClick={()=>setArea(a)} style={{
                  flexShrink:0, borderRadius:9999, padding:"6px 14px",
                  fontSize:12, fontFamily:"monospace", cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap",
                  background: area===a ? "rgba(255,59,31,0.15)" : "rgba(255,255,255,0.04)",
                  border: area===a ? "1px solid rgba(255,59,31,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: area===a ? "#FF3B1F" : "rgba(255,255,255,0.4)",
                }}>
                  {a}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", gap:0, marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.07)", alignItems:"center" }}>
              {[
                { id:"Recent", label:"🕐 Recent" },
                { id:"Trending", label:"🔥 Trending" },
                { id:"Top", label:"⭐ Top" },
              ].map(t => (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  padding:"10px 18px", fontSize:13, fontWeight:500, cursor:"pointer",
                  background:"none", border:"none",
                  color: tab===t.id ? "white" : "rgba(255,255,255,0.32)",
                  borderBottom: tab===t.id ? "2px solid #FF3B1F" : "2px solid transparent",
                  marginBottom:-1, transition:"all 0.2s",
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center", padding:"80px 0", color:"rgba(255,255,255,0.22)" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                  <p style={{ fontFamily:"monospace", fontSize:13 }}>No posts yet for {area}</p>
                </div>
              ) : filtered.map((post, i) => {
                const c = CAT_COLORS[post.category] ?? {bg:"rgba(255,255,255,0.06)",text:"rgba(255,255,255,0.5)",border:"rgba(255,255,255,0.12)"};
                return (
                  <article key={post.id} style={{
                    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                    borderRadius:16, padding:"18px 20px", transition:"all 0.22s",
                    animation:`fadeUp 0.4s ease ${i*50}ms both`,
                  }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.05)";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.12)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.03)";(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.07)";}}
                  >
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 9px", borderRadius:99, background:c.bg, color:c.text, border:`1px solid ${c.border}`, fontFamily:"monospace" }}>
                          {post.category}
                        </span>
                        <span style={{ fontSize:11, color:"rgba(255,255,255,0.28)", fontFamily:"monospace", display:"flex", alignItems:"center", gap:4 }}>
                          <MapPin size={10}/>{post.area}
                        </span>
                      </div>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"monospace" }}>{timeAgo(post.createdAt)}</span>
                    </div>
                    <Link href={`/post/${post.id}`}>
                      <p style={{ fontSize:14, lineHeight:1.65, color:"rgba(255,255,255,0.75)", marginBottom:14, cursor:"pointer", display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                        {post.content}
                      </p>
                    </Link>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:18, height:18, borderRadius:"50%", background:"linear-gradient(135deg,#FF3B1F,#ff6b47)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>🇿🇦</div>
                        <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:"monospace" }}>{post.authorLabel}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                        <Link href={`/post/${post.id}`}>
                          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"rgba(255,255,255,0.28)", cursor:"pointer", fontFamily:"monospace" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            {post.commentCount}
                          </span>
                        </Link>
                        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"rgba(255,255,255,0.28)", fontFamily:"monospace" }}>
                          <TrendingUp size={13}/>{post.votes}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div style={{ textAlign:"center", marginTop:40 }}>
              <Link href="/post">
                <button style={{ padding:"12px 28px", borderRadius:12, background:"rgba(255,59,31,0.1)", border:"1px solid rgba(255,59,31,0.3)", color:"#FF3B1F", fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,59,31,0.2)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,59,31,0.1)";}}
                >
                  Add your voice →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"40px 24px", textAlign:"center" }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, letterSpacing:"-0.03em", color:"white", marginBottom:6 }}>
              Only<span style={{ color:"#FF3B1F" }}>SA</span>
            </p>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"monospace", marginBottom:20 }}>Anonymous. Unfiltered. SA. 🇿🇦</p>
            <div style={{ display:"flex", justifyContent:"center", gap:24, marginBottom:24 }}>
              {["About","Guidelines","Report Abuse"].map(l => (
                <Link key={l} href={l==="Report Abuse" ? "mailto:abuse@onlysa.co.za" : `/${l.toLowerCase().replace(" ","-")}`}>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.25)", cursor:"pointer", fontFamily:"monospace", transition:"color 0.2s" }}
                    onMouseEnter={e=>((e.target as HTMLElement).style.color="rgba(255,255,255,0.6)")}
                    onMouseLeave={e=>((e.target as HTMLElement).style.color="rgba(255,255,255,0.25)")}
                  >{l}</span>
                </Link>
              ))}
            </div>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.12)", fontFamily:"monospace" }}>© 2026 OnlySA</p>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes livepulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(6px);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
      `}</style>
    </div>
  );
}
