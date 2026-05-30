"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Testimonials } from "@/components/ui/twitter-testimonial-cards";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { PenLine, ArrowDown, MapPin, TrendingUp, Clock, Star } from "lucide-react";

interface Post {
  id:string; content:string; category:string; area:string;
  authorLabel?:string; identity?:string; createdAt:string;
  votes?:number; upvotes?:number; commentCount?:number; comments?:number;
  approved:boolean;
}

const SEED:Post[] = [
  {id:"1",content:"Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and parking costs more than your first car. But somehow we all keep coming back.",category:"Hot Take",area:"Umhlanga",authorLabel:"Umhlanga Resident",createdAt:new Date(Date.now()-3600000).toISOString(),votes:88,commentCount:21,approved:true},
  {id:"2",content:"I've lived in Durban my whole life and I've never actually been to uShaka Marine World. Not once. I walk past it, I see the queues, I think about it — and then I go get a bunny chow instead.",category:"Confession",area:"Durban CBD",authorLabel:"Durban Local",createdAt:new Date(Date.now()-14400000).toISOString(),votes:134,commentCount:18,approved:true},
  {id:"3",content:"The N3 at 7am should be classified as psychological torture. Left home at 6:45 to beat traffic. Still sitting here watching a bakkie inch forward.",category:"Rant",area:"Westville",authorLabel:"Westville Resident",createdAt:new Date(Date.now()-25200000).toISOString(),votes:201,commentCount:33,approved:true},
  {id:"4",content:"Genuinely shocked by how good the food at that new spot on Loop Street is. Rich, full flavours, generous portions, under R150. Cape Town doesn't have a monopoly on good restaurants.",category:"Review",area:"PMB",authorLabel:"PMB Local",createdAt:new Date(Date.now()-39600000).toISOString(),votes:67,commentCount:9,approved:true},
  {id:"5",content:"Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.",category:"Rant",area:"Johannesburg",authorLabel:"Joburg Local",createdAt:new Date(Date.now()-28800000).toISOString(),votes:312,commentCount:41,approved:true},
  {id:"6",content:"Does anyone actually get their deposit back from landlords in SA? Asking for literally every renter I know.",category:"Question",area:"Cape Town",authorLabel:"Cape Town Local",createdAt:new Date(Date.now()-43200000).toISOString(),votes:88,commentCount:53,approved:true},
];

const AREAS=["All SA","Umhlanga","Durban CBD","Johannesburg","Cape Town","Westville","Berea","Ballito","PMB"];

const CAT:Record<string,{bg:string;text:string;border:string}> = {
  "Rant":                {bg:"rgba(232,73,15,0.08)",  text:"#E87040",border:"rgba(232,73,15,0.2)"},
  "Confession":          {bg:"rgba(201,58,74,0.08)",  text:"#E06070",border:"rgba(201,58,74,0.2)"},
  "Review":              {bg:"rgba(74,140,106,0.08)", text:"#6AAF88",border:"rgba(74,140,106,0.2)"},
  "Hot Take":            {bg:"rgba(232,160,48,0.08)", text:"#E8B050",border:"rgba(232,160,48,0.2)"},
  "Question":            {bg:"rgba(74,106,140,0.08)", text:"#6A90B0",border:"rgba(74,106,140,0.2)"},
  "Neighbourhood Watch": {bg:"rgba(120,80,160,0.08)", text:"#A070C0",border:"rgba(120,80,160,0.2)"},
};

function timeAgo(iso:string){
  const s=(Date.now()-new Date(iso).getTime())/1000;
  if(s<60) return `${Math.floor(s)}s`;
  if(s<3600) return `${Math.floor(s/60)}m`;
  if(s<86400) return `${Math.floor(s/3600)}h`;
  return `${Math.floor(s/86400)}d`;
}

/* ══════════════════════════════════════
   ENTRANCE SCREEN
══════════════════════════════════════ */
function EntranceScreen({onEnter}:{onEnter:()=>void}) {
  return (
    <div style={{
      position:"fixed",inset:0,backgroundColor:"#060608",
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",overflow:"hidden",zIndex:100,
    }}>
      {/* CSS-only ambient blobs */}
      <div aria-hidden style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{
          position:"absolute",top:"5%",left:"50%",
          width:"70vw",height:"50vh",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(232,73,15,0.07) 0%,transparent 65%)",
          animation:"breathe 9s ease-in-out infinite",
          transformOrigin:"center center",
        }}/>
        <div style={{
          position:"absolute",bottom:"10%",left:"15%",
          width:"35vw",height:"35vw",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(240,104,48,0.05) 0%,transparent 65%)",
          animation:"breathe 12s ease-in-out infinite 3s",
          transformOrigin:"center center",
        }}/>
        <div style={{
          position:"absolute",top:"25%",right:"10%",
          width:"28vw",height:"28vw",borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(232,160,48,0.04) 0%,transparent 65%)",
          animation:"breathe 15s ease-in-out infinite 6s",
          transformOrigin:"center center",
        }}/>
        {/* Dot grid */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
          backgroundSize:"44px 44px",
          maskImage:"radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)",
          WebkitMaskImage:"radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)",
        }}/>
      </div>

      {/* Top accent line */}
      <div aria-hidden style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(232,73,15,0.5),rgba(240,104,48,0.5),transparent)"}}/>

      {/* Main content — NO inline opacity:0, purely CSS animation */}
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 24px",maxWidth:580}}>

        <p className="anim-fade-up d100" style={{
          fontSize:10,fontFamily:"'DM Mono',monospace",
          textTransform:"uppercase",letterSpacing:"0.32em",
          color:"rgba(160,154,147,0.4)",
          display:"flex",alignItems:"center",justifyContent:"center",gap:14,
          marginBottom:32,
        }}>
          <span style={{display:"inline-block",width:28,height:1,background:"rgba(232,73,15,0.4)"}}/>
          South Africa
          <span style={{display:"inline-block",width:28,height:1,background:"rgba(232,73,15,0.4)"}}/>
        </p>

        <h1 className="anim-fade-up d200" style={{
          fontFamily:"'Syne',sans-serif",
          fontSize:"clamp(72px,14vw,136px)",
          fontWeight:800,letterSpacing:"-0.05em",lineHeight:0.85,
          color:"#F2EEE9",marginBottom:32,
        }}>
          Only<span style={{
            background:"linear-gradient(135deg,#E8490F 0%,#F06830 45%,#E8A030 100%)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          }}>SA</span>
        </h1>

        <p className="anim-fade-up d300" style={{
          fontSize:15,fontFamily:"'DM Sans',sans-serif",fontWeight:300,
          color:"rgba(160,154,147,0.6)",lineHeight:1.8,
          maxWidth:340,margin:"0 auto 52px",letterSpacing:"0.01em",
        }}>
          Anonymous confessions, rants, and unfiltered truths from across South Africa.
        </p>

        <div className="anim-fade-up d400">
          <LiquidButton
            onClick={onEnter}
            size="xxl"
            style={{fontFamily:"'Syne',sans-serif",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",fontSize:12}}
          >
            Enter
          </LiquidButton>
        </div>

        <div className="anim-fade-up d700" style={{display:"flex",justifyContent:"center",gap:44,marginTop:64}}>
          {[{v:"9+",l:"Cities"},{v:"Live",l:"Always"},{v:"Zero",l:"Identity"}].map(({v,l})=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:700,color:"rgba(242,238,233,0.65)",fontFamily:"'Syne',sans-serif",letterSpacing:"-0.02em"}}>{v}</div>
              <div style={{fontSize:9,color:"rgba(160,154,147,0.25)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.14em",marginTop:5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(232,73,15,0.15),transparent)"}}/>
    </div>
  );
}

/* ══════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════ */
export default function Page() {
  const [entered,setEntered]   = useState(false);
  const [exiting,setExiting]   = useState(false);
  const [posts,setPosts]       = useState<Post[]>(SEED);
  const [area,setArea]         = useState("All SA");
  const [tab,setTab]           = useState("recent");

  useEffect(()=>{
    fetch("/api/posts").then(r=>r.ok?r.json():null).then(d=>{
      if(d?.posts?.length) setPosts(d.posts);
    }).catch(()=>{});
  },[]);

  function handleEnter(){
    setExiting(true);
    setTimeout(()=>setEntered(true),600);
  }

  /* ── Entrance ── */
  if(!entered){
    return (
      <div style={{
        opacity:exiting?0:1,
        transform:exiting?"scale(1.04)":"scale(1)",
        transition:"opacity 0.6s ease,transform 0.6s ease",
      }}>
        <EntranceScreen onEnter={handleEnter}/>
      </div>
    );
  }

  const filtered=posts
    .filter(p=>p.approved!==false)
    .filter(p=>area==="All SA"||p.area===area)
    .sort((a,b)=>{
      if(tab==="trending") return (b.votes||b.upvotes||0)-(a.votes||a.upvotes||0);
      if(tab==="top")      return (b.commentCount||b.comments||0)-(a.commentCount||a.comments||0);
      return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
    });

  /* ── Feed world ── */
  return (
    <div className="grain anim-fade-in" style={{minHeight:"100vh",backgroundColor:"#060608",color:"#F2EEE9",fontFamily:"'DM Sans',sans-serif"}}>
      <div aria-hidden style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-20%",left:"50%",transform:"translateX(-50%)",width:"80vw",height:"60vh",background:"radial-gradient(ellipse,rgba(232,73,15,0.035),transparent 70%)"}}/>
      </div>

      {/* NAVBAR */}
      <header className="glass" style={{position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,letterSpacing:"-0.03em"}}>
            Only<span style={{background:"linear-gradient(135deg,#E8490F,#F06830)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>SA</span>
          </span>
          <Link href="/post">
            <button style={{display:"flex",alignItems:"center",gap:7,padding:"7px 18px",borderRadius:99,fontSize:12,fontWeight:700,color:"#fff",fontFamily:"'Syne',sans-serif",letterSpacing:"0.04em",background:"linear-gradient(135deg,#E8490F,#C93A0A)",border:"none",cursor:"pointer",boxShadow:"0 4px 14px rgba(232,73,15,0.28)",transition:"all 0.2s"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="none";}}
            >
              <PenLine size={12}/> Post Anonymously
            </button>
          </Link>
        </div>
      </header>

      <main style={{position:"relative",zIndex:1}}>

        {/* HERO */}
        <section style={{padding:"80px 24px 64px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{maxWidth:640,margin:"0 auto"}}>
            <div className="anim-fade-up d100" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 14px",borderRadius:9999,border:"1px solid rgba(232,73,15,0.2)",background:"rgba(232,73,15,0.06)",marginBottom:28}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#E8490F",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"rgba(232,73,15,0.75)",textTransform:"uppercase",letterSpacing:"0.28em"}}>Live Feed</span>
            </div>
            <h2 className="anim-fade-up d200" style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(44px,7vw,80px)",fontWeight:800,letterSpacing:"-0.04em",lineHeight:0.9,color:"#F2EEE9",marginBottom:20}}>
              For SA<br/>
              <span style={{background:"linear-gradient(135deg,#E8490F 0%,#F06830 50%,#E8A030 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Eyes Only</span>
            </h2>
            <p className="anim-fade-up d300" style={{fontSize:15,fontWeight:300,color:"rgba(160,154,147,0.6)",lineHeight:1.7,maxWidth:400,margin:"0 auto 36px"}}>
              Anonymous confessions, city rants, reviews, and unfiltered opinions from across South Africa.
            </p>
            <div className="anim-fade-up d400" style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
              <Link href="/post" style={{textDecoration:"none"}}>
                <LiquidButton size="lg" style={{fontFamily:"'Syne',sans-serif",fontWeight:700,letterSpacing:"0.05em",fontSize:12,textTransform:"uppercase"}}>Post Anonymously</LiquidButton>
              </Link>
              <a href="#feed" style={{display:"inline-flex",alignItems:"center",gap:7,padding:"10px 20px",borderRadius:12,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",color:"rgba(160,154,147,0.55)",textDecoration:"none",fontSize:13,transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";e.currentTarget.style.color="#F2EEE9";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(160,154,147,0.55)";}}
              >Browse <ArrowDown size={13}/></a>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="anim-fade-up d300" style={{padding:"80px 24px",overflow:"hidden",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontSize:10,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(160,154,147,0.3)",marginBottom:14}}>What SA is saying</p>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(26px,4vw,40px)",fontWeight:800,letterSpacing:"-0.03em",color:"#F2EEE9",lineHeight:1.1}}>
                Real posts.<br/>
                <span style={{background:"linear-gradient(135deg,#E8490F,#F06830,#E8A030)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>No filter.</span>
              </h3>
            </div>
            <div style={{display:"flex",justifyContent:"center",paddingBottom:120,paddingTop:12}}>
              <Testimonials/>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{padding:"80px 24px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <p style={{fontSize:10,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(160,154,147,0.3)",marginBottom:14}}>The process</p>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(24px,3.5vw,36px)",fontWeight:800,letterSpacing:"-0.03em",color:"#F2EEE9"}}>Three steps. Zero traces.</h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:1}}>
              {[
                {n:"01",title:"Pick your area",   body:"Durban, Joburg, Cape Town, Umhlanga and more. Your voice, your city."},
                {n:"02",title:"Choose a category",body:"Confession, Rant, Review, Hot Take, Question, or Neighbourhood Watch."},
                {n:"03",title:"Post anonymously", body:"No account. No name. A random identity is auto-assigned. Nothing stored."},
              ].map(({n,title,body},i)=>(
                <div key={n} style={{padding:"32px 28px",border:"1px solid rgba(255,255,255,0.06)",borderRadius:i===0?"12px 0 0 12px":i===2?"0 12px 12px 0":"0",background:i===1?"rgba(232,73,15,0.025)":"transparent",transition:"background 0.25s"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.025)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=i===1?"rgba(232,73,15,0.025)":"transparent";}}
                >
                  <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"rgba(232,73,15,0.45)",letterSpacing:"0.12em",marginBottom:20}}>{n}</div>
                  <h4 style={{fontSize:15,fontWeight:700,color:"#F2EEE9",fontFamily:"'Syne',sans-serif",letterSpacing:"-0.02em",marginBottom:10}}>{title}</h4>
                  <p style={{fontSize:13,color:"rgba(160,154,147,0.5)",lineHeight:1.65,fontWeight:300}}>{body}</p>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center",marginTop:40}}>
              <Link href="/post" style={{textDecoration:"none"}}>
                <LiquidButton size="lg" style={{fontFamily:"'Syne',sans-serif",fontWeight:700,letterSpacing:"0.05em",fontSize:12,textTransform:"uppercase"}}>Start posting</LiquidButton>
              </Link>
            </div>
          </div>
        </section>

        {/* LIVE FEED */}
        <section id="feed" style={{padding:"80px 24px 120px"}}>
          <div style={{maxWidth:860,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16,marginBottom:36}}>
              <div>
                <p style={{fontSize:10,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(160,154,147,0.3)",marginBottom:10}}>Live feed</p>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(22px,3.5vw,32px)",fontWeight:800,letterSpacing:"-0.03em",color:"#F2EEE9"}}>What SA is confessing</h3>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"rgba(116,183,120,0.8)",animation:"pulse 2s infinite"}}/>
                <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"rgba(160,154,147,0.28)",textTransform:"uppercase",letterSpacing:"0.12em"}}>live</span>
              </div>
            </div>

            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12,scrollbarWidth:"none"}}>
              {AREAS.map(a=>(
                <button key={a} onClick={()=>setArea(a)} style={{flexShrink:0,borderRadius:99,padding:"5px 14px",fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",background:area===a?"rgba(232,73,15,0.1)":"rgba(255,255,255,0.02)",border:area===a?"1px solid rgba(232,73,15,0.3)":"1px solid rgba(255,255,255,0.05)",color:area===a?"#E87040":"rgba(160,154,147,0.38)"}}>
                  {a}
                </button>
              ))}
            </div>

            <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.05)",marginBottom:24}}>
              {[{id:"recent",icon:<Clock size={11}/>,label:"Recent"},{id:"trending",icon:<TrendingUp size={11}/>,label:"Trending"},{id:"top",icon:<Star size={11}/>,label:"Top"}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:500,cursor:"pointer",background:"none",border:"none",color:tab===t.id?"#F2EEE9":"rgba(160,154,147,0.32)",borderBottom:tab===t.id?"1px solid #E8490F":"1px solid transparent",marginBottom:-1,transition:"all 0.2s"}}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            <div style={{display:"flex",flexDirection:"column"}}>
              {filtered.length===0?(
                <div style={{textAlign:"center",padding:"80px 0"}}>
                  <p style={{fontSize:11,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.14em",color:"rgba(160,154,147,0.25)"}}>No posts in {area} yet</p>
                </div>
              ):filtered.map((post,i)=>{
                const votes=post.votes??post.upvotes??0;
                const comments=post.commentCount??post.comments??0;
                const label=post.authorLabel??post.identity??"Anonymous";
                const c=CAT[post.category]??{bg:"rgba(255,255,255,0.03)",text:"rgba(160,154,147,0.4)",border:"rgba(255,255,255,0.07)"};
                return (
                  <article key={post.id} style={{padding:"22px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",animation:`fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*50}ms both`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11,flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:3,background:c.bg,color:c.text,border:`1px solid ${c.border}`,fontFamily:"'DM Mono',monospace"}}>{post.category}</span>
                        <span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"rgba(160,154,147,0.28)",fontFamily:"'DM Mono',monospace"}}><MapPin size={9}/>{post.area}</span>
                      </div>
                      <span style={{fontSize:10,color:"rgba(160,154,147,0.18)",fontFamily:"'DM Mono',monospace"}}>{timeAgo(post.createdAt)}</span>
                    </div>
                    <Link href={`/post/${post.id}`} style={{textDecoration:"none"}}>
                      <p style={{fontSize:15,lineHeight:1.65,fontWeight:300,color:"rgba(242,238,233,0.72)",marginBottom:14,cursor:"pointer",display:"-webkit-box",WebkitLineClamp:4,WebkitBoxOrient:"vertical",overflow:"hidden",transition:"color 0.15s"}}
                        onMouseEnter={e=>((e.currentTarget as HTMLElement).style.color="#F2EEE9")}
                        onMouseLeave={e=>((e.currentTarget as HTMLElement).style.color="rgba(242,238,233,0.72)")}
                      >{post.content}</p>
                    </Link>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontSize:10,color:"rgba(160,154,147,0.22)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
                      <div style={{display:"flex",alignItems:"center",gap:18}}>
                        <Link href={`/post/${post.id}`} style={{textDecoration:"none",display:"flex",alignItems:"center",gap:5,fontSize:11,color:"rgba(160,154,147,0.28)",fontFamily:"'DM Mono',monospace"}}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {comments}
                        </Link>
                        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"rgba(160,154,147,0.28)",fontFamily:"'DM Mono',monospace"}}><TrendingUp size={11}/>{votes}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div style={{textAlign:"center",paddingTop:52,borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:8}}>
              <p style={{fontSize:10,color:"rgba(160,154,147,0.25)",marginBottom:20,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.14em"}}>Add your voice</p>
              <Link href="/post" style={{textDecoration:"none"}}>
                <LiquidButton size="lg" style={{fontFamily:"'Syne',sans-serif",fontWeight:700,letterSpacing:"0.05em",fontSize:12,textTransform:"uppercase"}}>Post Anonymously</LiquidButton>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{borderTop:"1px solid rgba(255,255,255,0.04)",padding:"36px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,letterSpacing:"-0.03em"}}>
              Only<span style={{background:"linear-gradient(135deg,#E8490F,#F06830)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>SA</span>
            </span>
            <p style={{fontSize:9,color:"rgba(160,154,147,0.18)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.16em",textTransform:"uppercase"}}>Anonymous · Unfiltered · South Africa</p>
            <div style={{display:"flex",gap:24}}>
              {[["About","/about"],["Guidelines","/guidelines"],["Report","mailto:abuse@onlysa.co.za"]].map(([l,h])=>(
                <Link key={l} href={h} style={{fontSize:11,color:"rgba(160,154,147,0.2)",textDecoration:"none",fontFamily:"'DM Mono',monospace",transition:"color 0.2s"}}
                  onMouseEnter={e=>(e.currentTarget.style.color="rgba(160,154,147,0.55)")}
                  onMouseLeave={e=>(e.currentTarget.style.color="rgba(160,154,147,0.2)")}
                >{l}</Link>
              ))}
            </div>
            <p style={{fontSize:9,color:"rgba(160,154,147,0.1)",fontFamily:"'DM Mono',monospace"}}>© 2026 OnlySA</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
