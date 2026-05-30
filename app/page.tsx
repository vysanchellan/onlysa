"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Testimonials } from "@/components/ui/twitter-testimonial-cards";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { PenLine, ArrowDown, MapPin, TrendingUp, Clock, Star } from "lucide-react";

interface Post {
  id: string;
  content: string;
  category: string;
  area: string;
  authorLabel?: string;
  identity?: string;
  createdAt: string;
  votes?: number;
  upvotes?: number;
  commentCount?: number;
  comments?: number;
  approved: boolean;
}

const SEED: Post[] = [
  { id:"1", content:"Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and parking costs more than your first car. But somehow we all keep coming back.", category:"Hot Take", area:"Umhlanga", authorLabel:"Umhlanga Resident", createdAt:new Date(Date.now()-3600000).toISOString(), votes:88, commentCount:21, approved:true },
  { id:"2", content:"I've lived in Durban my whole life and I've never actually been to uShaka Marine World. Not once. I walk past it, I see the queues, I think about it — and then I go get a bunny chow instead.", category:"Confession", area:"Durban CBD", authorLabel:"Durban Local", createdAt:new Date(Date.now()-14400000).toISOString(), votes:134, commentCount:18, approved:true },
  { id:"3", content:"The N3 at 7am should be classified as psychological torture. Left home at 6:45 to beat traffic. Still sitting here watching a bakkie inch forward.", category:"Rant", area:"Westville", authorLabel:"Westville Resident", createdAt:new Date(Date.now()-25200000).toISOString(), votes:201, commentCount:33, approved:true },
  { id:"4", content:"Genuinely shocked by how good the food at that new spot on Loop Street is. Rich, full flavours, generous portions, under R150. Cape Town doesn't have a monopoly on good restaurants.", category:"Review", area:"PMB", authorLabel:"PMB Local", createdAt:new Date(Date.now()-39600000).toISOString(), votes:67, commentCount:9, approved:true },
  { id:"5", content:"Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.", category:"Rant", area:"Johannesburg", authorLabel:"Joburg Local", createdAt:new Date(Date.now()-28800000).toISOString(), votes:312, commentCount:41, approved:true },
  { id:"6", content:"Does anyone actually get their deposit back from landlords in SA? Asking for literally every renter I know.", category:"Question", area:"Cape Town", authorLabel:"Cape Town Local", createdAt:new Date(Date.now()-43200000).toISOString(), votes:88, commentCount:53, approved:true },
];

const AREAS = ["All SA","Umhlanga","Durban CBD","Johannesburg","Cape Town","Westville","Berea","Ballito","PMB"];

const CAT: Record<string,{bg:string;text:string;border:string}> = {
  "Rant":                  {bg:"rgba(232,73,15,0.08)",  text:"#E87040", border:"rgba(232,73,15,0.2)" },
  "Confession":            {bg:"rgba(201,58,74,0.08)",  text:"#E06070", border:"rgba(201,58,74,0.2)" },
  "Review":                {bg:"rgba(74,140,106,0.08)", text:"#6AAF88", border:"rgba(74,140,106,0.2)"},
  "Hot Take":              {bg:"rgba(232,160,48,0.08)", text:"#E8B050", border:"rgba(232,160,48,0.2)"},
  "Question":              {bg:"rgba(74,106,140,0.08)", text:"#6A90B0", border:"rgba(74,106,140,0.2)"},
  "Neighbourhood Watch":   {bg:"rgba(120,80,160,0.08)", text:"#A070C0", border:"rgba(120,80,160,0.2)"},
};

function timeAgo(iso:string) {
  const s=(Date.now()-new Date(iso).getTime())/1000;
  if(s<60) return `${Math.floor(s)}s`;
  if(s<3600) return `${Math.floor(s/60)}m`;
  if(s<86400) return `${Math.floor(s/3600)}h`;
  return `${Math.floor(s/86400)}d`;
}

/* ─────────────────────────────────────────────────
   ENTRANCE SCREEN — full-screen cinematic
───────────────────────────────────────────────── */
function EntranceScreen({ onEnter }: { onEnter: () => void }) {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  /* Particle field */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf: number;

    const particles: { x:number; y:number; vx:number; vy:number; r:number; alpha:number; hue:number }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        hue: 15 + Math.random() * 30,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      backgroundColor:"#060608",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      overflow:"hidden",
    }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, zIndex:0 }} />

      {/* Radial gradient atmosphere */}
      <div style={{
        position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 60% 50% at 50% 60%, rgba(232,73,15,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 40% 30% at 20% 20%, rgba(240,104,48,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 30% 40% at 80% 80%, rgba(201,58,10,0.05) 0%, transparent 60%)
        `,
      }} />

      {/* Horizontal rule top */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"1px", zIndex:2,
        background:"linear-gradient(90deg, transparent, rgba(232,73,15,0.3), rgba(240,104,48,0.3), transparent)",
        opacity: mounted ? 1 : 0, transition:"opacity 1.2s ease 0.3s",
      }} />

      {/* Content */}
      <div style={{ position:"relative", zIndex:3, textAlign:"center", padding:"0 24px", maxWidth:640 }}>

        {/* Wordmark */}
        <div style={{
          marginBottom:48,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(16px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:4,
            fontSize:11, fontFamily:"'DM Mono',monospace",
            textTransform:"uppercase", letterSpacing:"0.3em",
            color:"rgba(160,154,147,0.5)",
            marginBottom:20,
          }}>
            <span style={{ display:"inline-block", width:16, height:"1px", background:"rgba(232,73,15,0.5)" }} />
            South Africa
            <span style={{ display:"inline-block", width:16, height:"1px", background:"rgba(232,73,15,0.5)" }} />
          </div>
          <h1 style={{
            fontFamily:"'Syne', sans-serif",
            fontSize:"clamp(64px, 12vw, 120px)",
            fontWeight:800,
            letterSpacing:"-0.04em",
            lineHeight:0.88,
            color:"#F2EEE9",
          }}>
            Only<span style={{
              background:"linear-gradient(135deg, #E8490F 0%, #F06830 40%, #E8A030 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>SA</span>
          </h1>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize:16,
          fontFamily:"'DM Sans',sans-serif",
          fontWeight:300,
          color:"rgba(160,154,147,0.7)",
          lineHeight:1.7,
          letterSpacing:"0.01em",
          marginBottom:56,
          maxWidth:380,
          margin:"0 auto 56px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(12px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }}>
          Anonymous confessions, rants, and unfiltered truths
          from across South Africa.
        </p>

        {/* Enter CTA */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(10px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s",
        }}>
          <LiquidButton
            onClick={onEnter}
            size="xxl"
            style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", fontSize:13 }}
          >
            Enter
          </LiquidButton>
        </div>

        {/* Stats row */}
        <div style={{
          display:"flex", justifyContent:"center", gap:32, marginTop:64,
          opacity: mounted ? 1 : 0,
          transition:"opacity 1s ease 0.8s",
        }}>
          {[{v:"9+",l:"Cities"},{v:"Live",l:"Always"},{v:"Zero",l:"Identity stored"}].map(({v,l}) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#F2EEE9", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.02em" }}>{v}</div>
              <div style={{ fontSize:10, color:"rgba(160,154,147,0.4)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.12em", marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"1px", zIndex:2,
        background:"linear-gradient(90deg, transparent, rgba(232,73,15,0.2), transparent)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   MAIN FEED PAGE
───────────────────────────────────────────────── */
export default function Page() {
  const [entered, setEntered]     = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [posts, setPosts]         = useState<Post[]>(SEED);
  const [area, setArea]           = useState("All SA");
  const [tab, setTab]             = useState("recent");
  const [feedVisible, setFeedVisible] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/posts").then(r=>r.ok?r.json():null).then(d=>{
      if(d?.posts?.length) setPosts(d.posts);
    }).catch(()=>{});
  },[]);

  const handleEnter = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setEntered(true);
      setTransitioning(false);
      setTimeout(() => setFeedVisible(true), 100);
    }, 700);
  }, []);

  const filtered = posts
    .filter(p=>p.approved!==false)
    .filter(p=>area==="All SA"||p.area===area)
    .sort((a,b)=>{
      if(tab==="trending") return (b.votes||b.upvotes||0)-(a.votes||a.upvotes||0);
      if(tab==="top")      return (b.commentCount||b.comments||0)-(a.commentCount||a.comments||0);
      return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
    });

  /* Entrance screen */
  if (!entered) {
    return (
      <div style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "scale(1.02)" : "scale(1)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        <EntranceScreen onEnter={handleEnter} />
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#060608", color:"#F2EEE9", fontFamily:"'DM Sans',sans-serif" }}
      className="grain">

      {/* Ambient background */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-20%", left:"50%", transform:"translateX(-50%)", width:"80vw", height:"50vh", borderRadius:"50%", background:"radial-gradient(ellipse, rgba(232,73,15,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* ── NAVBAR ── */}
      <header className="glass" style={{
        position:"sticky", top:0, zIndex:50,
        borderBottom:"1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, letterSpacing:"-0.03em", color:"#F2EEE9" }}>
              Only<span style={{ background:"linear-gradient(135deg,#E8490F,#F06830)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>SA</span>
            </span>
            <span style={{ fontSize:9, color:"rgba(160,154,147,0.4)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:3, padding:"2px 6px", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em" }}>ZA</span>
          </div>
          <Link href="/post">
            <button style={{
              display:"flex", alignItems:"center", gap:7,
              padding:"7px 16px", borderRadius:99,
              fontSize:12, fontWeight:600, color:"#fff",
              fontFamily:"'Syne',sans-serif", letterSpacing:"0.02em",
              background:"linear-gradient(135deg,#E8490F,#C93A0A)",
              border:"none", cursor:"pointer",
              boxShadow:"0 4px 16px rgba(232,73,15,0.3)",
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLElement).style.boxShadow="0 6px 24px rgba(232,73,15,0.4)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="none";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(232,73,15,0.3)";}}
            >
              <PenLine size={12}/> Post Anonymously
            </button>
          </Link>
        </div>
      </header>

      <main style={{ position:"relative", zIndex:1 }}>

        {/* ── HERO ── */}
        <section style={{
          padding:"80px 24px 64px", textAlign:"center",
          borderBottom:"1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"4px 14px", borderRadius:9999,
              border:"1px solid rgba(232,73,15,0.2)",
              background:"rgba(232,73,15,0.06)",
              marginBottom:28,
              opacity: feedVisible ? 1 : 0,
              transition:"opacity 0.7s ease 0.1s",
            }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#E8490F", animation:"pulse 2s infinite" }} />
              <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"rgba(232,73,15,0.8)", textTransform:"uppercase", letterSpacing:"0.28em" }}>
                Live Feed
              </span>
            </div>

            <h2 style={{
              fontFamily:"'Syne',sans-serif",
              fontSize:"clamp(40px, 7vw, 72px)",
              fontWeight:800,
              letterSpacing:"-0.04em",
              lineHeight:0.9,
              color:"#F2EEE9",
              marginBottom:20,
              opacity: feedVisible ? 1 : 0,
              transform: feedVisible ? "none" : "translateY(16px)",
              transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
            }}>
              For SA<br/>
              <span style={{
                background:"linear-gradient(135deg, #E8490F 0%, #F06830 50%, #E8A030 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>Eyes Only</span>
            </h2>

            <p style={{
              fontSize:15, fontWeight:300, color:"rgba(160,154,147,0.7)", lineHeight:1.7,
              maxWidth:440, margin:"0 auto 36px",
              opacity: feedVisible ? 1 : 0,
              transition:"opacity 0.8s ease 0.35s",
            }}>
              Anonymous confessions, city rants, reviews, and unfiltered opinions from across South Africa.
            </p>

            <div style={{
              display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap",
              opacity: feedVisible ? 1 : 0,
              transition:"opacity 0.8s ease 0.45s",
            }}>
              <Link href="/post" style={{ textDecoration:"none" }}>
                <LiquidButton size="lg" style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:"0.04em", fontSize:13 }}>
                  Post Anonymously
                </LiquidButton>
              </Link>
              <a href="#feed" style={{
                display:"inline-flex", alignItems:"center", gap:7,
                padding:"10px 20px", borderRadius:12,
                border:"1px solid rgba(255,255,255,0.08)",
                background:"rgba(255,255,255,0.03)",
                color:"rgba(160,154,147,0.7)", textDecoration:"none",
                fontSize:13, fontFamily:"'DM Sans',sans-serif",
                transition:"all 0.2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.14)";e.currentTarget.style.color="#F2EEE9";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="rgba(160,154,147,0.7)";}}
              >
                Browse <ArrowDown size={13}/>
              </a>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{
          padding:"80px 24px",
          overflow:"hidden",
          borderBottom:"1px solid rgba(255,255,255,0.04)",
          opacity: feedVisible ? 1 : 0,
          transition:"opacity 1s ease 0.5s",
        }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <p style={{ fontSize:10, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.3em", color:"rgba(160,154,147,0.4)", marginBottom:14 }}>
                What SA is saying
              </p>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:800, letterSpacing:"-0.03em", color:"#F2EEE9", lineHeight:1.1 }}>
                Real posts.<br/>
                <span style={{ background:"linear-gradient(135deg,#E8490F,#F06830,#E8A030)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>No filter.</span>
              </h3>
            </div>
            <div style={{ display:"flex", justifyContent:"center", paddingBottom:120, paddingTop:12 }}>
              <Testimonials />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{
          padding:"80px 24px",
          borderBottom:"1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:52 }}>
              <p style={{ fontSize:10, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.3em", color:"rgba(160,154,147,0.4)", marginBottom:14 }}>
                The process
              </p>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px,3.5vw,36px)", fontWeight:800, letterSpacing:"-0.03em", color:"#F2EEE9" }}>
                Three steps. Zero traces.
              </h3>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:1 }}>
              {[
                { n:"01", title:"Pick your area", body:"Durban, Joburg, Cape Town, Umhlanga and more. Your voice, your city." },
                { n:"02", title:"Choose a category", body:"Confession, Rant, Review, Hot Take, Question, or Neighbourhood Watch." },
                { n:"03", title:"Post anonymously", body:"No account. No name. A random identity is auto-assigned. Nothing stored." },
              ].map(({ n, title, body }, i) => (
                <div key={n} style={{
                  padding:"32px 28px",
                  background: i===1 ? "rgba(232,73,15,0.04)" : "transparent",
                  border:"1px solid rgba(255,255,255,0.06)",
                  transition:"all 0.25s",
                  borderRadius: i===0 ? "12px 0 0 12px" : i===2 ? "0 12px 12px 0" : "0",
                }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.03)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=i===1?"rgba(232,73,15,0.04)":"transparent";}}
                >
                  <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"rgba(232,73,15,0.6)", letterSpacing:"0.12em", marginBottom:20 }}>{n}</div>
                  <h4 style={{ fontSize:16, fontWeight:700, color:"#F2EEE9", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.02em", marginBottom:10 }}>{title}</h4>
                  <p style={{ fontSize:13, color:"rgba(160,154,147,0.6)", lineHeight:1.65, fontWeight:300 }}>{body}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:40 }}>
              <Link href="/post" style={{ textDecoration:"none" }}>
                <LiquidButton size="lg" style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:"0.04em", fontSize:13 }}>
                  Start posting
                </LiquidButton>
              </Link>
            </div>
          </div>
        </section>

        {/* ── LIVE FEED ── */}
        <section id="feed" ref={feedRef} style={{ padding:"80px 24px 120px" }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>

            {/* Feed header */}
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:36 }}>
              <div>
                <p style={{ fontSize:10, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.3em", color:"rgba(160,154,147,0.4)", marginBottom:10 }}>
                  Live feed
                </p>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,3.5vw,32px)", fontWeight:800, letterSpacing:"-0.03em", color:"#F2EEE9" }}>
                  What SA is confessing
                </h3>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"rgba(116,183,120,0.8)", animation:"pulse 2s infinite" }} />
                <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"rgba(160,154,147,0.35)", textTransform:"uppercase", letterSpacing:"0.12em" }}>live</span>
              </div>
            </div>

            {/* Area filter */}
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:12, scrollbarWidth:"none" }}>
              {AREAS.map(a=>(
                <button key={a} onClick={()=>setArea(a)} style={{
                  flexShrink:0, borderRadius:99, padding:"5px 14px",
                  fontSize:11, fontFamily:"'DM Mono',monospace", cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap",
                  background: area===a ? "rgba(232,73,15,0.12)" : "rgba(255,255,255,0.03)",
                  border: area===a ? "1px solid rgba(232,73,15,0.35)" : "1px solid rgba(255,255,255,0.06)",
                  color: area===a ? "#E87040" : "rgba(160,154,147,0.45)",
                }}>
                  {a}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:24 }}>
              {[
                { id:"recent",   icon:<Clock size={11}/>,      label:"Recent" },
                { id:"trending", icon:<TrendingUp size={11}/>,  label:"Trending" },
                { id:"top",      icon:<Star size={11}/>,         label:"Top" },
              ].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  display:"flex", alignItems:"center", gap:6,
                  padding:"10px 16px", fontSize:12,
                  fontFamily:"'DM Sans',sans-serif", fontWeight:500, cursor:"pointer",
                  background:"none", border:"none",
                  color: tab===t.id ? "#F2EEE9" : "rgba(160,154,147,0.4)",
                  borderBottom: tab===t.id ? "1px solid #E8490F" : "1px solid transparent",
                  marginBottom:-1, transition:"all 0.2s",
                }}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
              {filtered.length===0 ? (
                <div style={{ textAlign:"center", padding:"80px 0", color:"rgba(160,154,147,0.3)" }}>
                  <div style={{ fontSize:11, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.16em", marginBottom:8 }}>Empty</div>
                  <p style={{ fontSize:13 }}>No posts in {area} yet.</p>
                </div>
              ) : filtered.map((post,i)=>{
                const votes = post.votes ?? post.upvotes ?? 0;
                const comments = post.commentCount ?? post.comments ?? 0;
                const label = post.authorLabel ?? post.identity ?? "Anonymous";
                const c=CAT[post.category]??{bg:"rgba(255,255,255,0.04)",text:"rgba(160,154,147,0.5)",border:"rgba(255,255,255,0.08)"};
                return (
                  <article key={post.id} style={{
                    padding:"24px 0",
                    borderBottom:"1px solid rgba(255,255,255,0.05)",
                    transition:"all 0.18s",
                    animation:`fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*40}ms both`,
                  }}>
                    {/* Top */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{
                          fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
                          padding:"3px 9px", borderRadius:4,
                          background:c.bg, color:c.text, border:`1px solid ${c.border}`,
                          fontFamily:"'DM Mono',monospace",
                        }}>
                          {post.category}
                        </span>
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"rgba(160,154,147,0.35)", fontFamily:"'DM Mono',monospace" }}>
                          <MapPin size={9}/>{post.area}
                        </span>
                      </div>
                      <span style={{ fontSize:10, color:"rgba(160,154,147,0.25)", fontFamily:"'DM Mono',monospace" }}>{timeAgo(post.createdAt)}</span>
                    </div>

                    {/* Content */}
                    <Link href={`/post/${post.id}`} style={{ textDecoration:"none" }}>
                      <p style={{
                        fontSize:15, lineHeight:1.65, fontWeight:300,
                        color:"rgba(242,238,233,0.78)",
                        marginBottom:16, cursor:"pointer",
                        display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden",
                        transition:"color 0.15s",
                      }}
                        onMouseEnter={e=>((e.currentTarget as HTMLElement).style.color="#F2EEE9")}
                        onMouseLeave={e=>((e.currentTarget as HTMLElement).style.color="rgba(242,238,233,0.78)")}
                      >
                        {post.content}
                      </p>
                    </Link>

                    {/* Footer */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontSize:10, color:"rgba(160,154,147,0.3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
                      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                        <Link href={`/post/${post.id}`} style={{ textDecoration:"none" }}>
                          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(160,154,147,0.35)", fontFamily:"'DM Mono',monospace", cursor:"pointer", transition:"color 0.15s" }}
                            onMouseEnter={e=>((e.currentTarget as HTMLElement).style.color="rgba(160,154,147,0.7)")}
                            onMouseLeave={e=>((e.currentTarget as HTMLElement).style.color="rgba(160,154,147,0.35)")}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            {comments}
                          </span>
                        </Link>
                        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(160,154,147,0.35)", fontFamily:"'DM Mono',monospace" }}>
                          <TrendingUp size={11}/>{votes}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* CTA bottom */}
            <div style={{ textAlign:"center", paddingTop:56, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize:13, color:"rgba(160,154,147,0.4)", marginBottom:20, fontFamily:"'DM Mono',monospace", letterSpacing:"0.04em" }}>
                Add your voice to the feed
              </p>
              <Link href="/post" style={{ textDecoration:"none" }}>
                <LiquidButton size="lg" style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:"0.04em", fontSize:13 }}>
                  Post Anonymously
                </LiquidButton>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"36px 24px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, letterSpacing:"-0.03em", color:"#F2EEE9" }}>
              Only<span style={{ background:"linear-gradient(135deg,#E8490F,#F06830)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>SA</span>
            </span>
            <p style={{ fontSize:10, color:"rgba(160,154,147,0.25)", fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", textTransform:"uppercase" }}>
              Anonymous · Unfiltered · South Africa
            </p>
            <div style={{ display:"flex", gap:24 }}>
              {[["About","/about"],["Guidelines","/guidelines"],["Report","mailto:abuse@onlysa.co.za"]].map(([l,h])=>(
                <Link key={l} href={h} style={{ fontSize:11, color:"rgba(160,154,147,0.25)", textDecoration:"none", fontFamily:"'DM Mono',monospace", transition:"color 0.2s" }}
                  onMouseEnter={e=>(e.currentTarget.style.color="rgba(160,154,147,0.6)")}
                  onMouseLeave={e=>(e.currentTarget.style.color="rgba(160,154,147,0.25)")}
                >{l}</Link>
              ))}
            </div>
            <p style={{ fontSize:10, color:"rgba(160,154,147,0.15)", fontFamily:"'DM Mono',monospace" }}>© 2026 OnlySA</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
