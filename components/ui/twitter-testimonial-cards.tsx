"use client";

import { useState } from "react";

interface TestimonialCardProps {
  className?: string;
  username?: string;
  handle?: string;
  content?: string;
  date?: string;
  verified?: boolean;
  likes?: number;
  retweets?: number;
  tweetUrl?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
  avatar?: string;
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function TwitterIcon() {
  return (
    <svg style={{ width:16, height:16 }} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function TestimonialCard({
  className, username="SA Anonymous", handle="@anonymous",
  content="This is the most honest I've been on the internet in years.",
  date="Jan 5, 2026", verified=false, likes=42, retweets=8,
  tweetUrl="https://onlysa.vercel.app", onHover, onLeave, isActive, onTap, avatar,
}: TestimonialCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch && !isActive) { e.preventDefault(); onTap?.(); }
  };

  return (
    <a
      href={tweetUrl} target="_blank" rel="noopener noreferrer"
      onClick={handleClick} onMouseEnter={onHover} onMouseLeave={onLeave}
      className={cn(
        "relative flex h-auto min-h-[140px] sm:min-h-[180px] w-[260px] sm:w-[380px] -skew-y-[8deg] select-none flex-col rounded-2xl border border-border bg-card/90 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-4 transition-all duration-500 hover:border-border/80 hover:bg-card cursor-pointer",
        isActive && "ring-2 ring-primary/50",
        className
      )}
      style={{ textDecoration:"none" }}
    >
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="size-9 sm:size-12 rounded-full flex items-center justify-center overflow-hidden shrink-0"
          style={{ background:"linear-gradient(135deg,#FF3B1F,#ff6b47)", width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
          {avatar ? <img src={avatar} alt={username} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "🇿🇦"}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontWeight:700, color:"rgba(255,255,255,0.9)", fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{username}</span>
          </div>
          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{handle}</span>
        </div>
        <span style={{ color:"rgba(255,255,255,0.5)", flexShrink:0 }}><TwitterIcon /></span>
      </div>
      <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, lineHeight:1.55, marginBottom:12, display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
        {content}
      </p>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", color:"rgba(255,255,255,0.35)", fontSize:12, marginTop:"auto" }}>
        <span>{date}</span>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
            <svg style={{ width:14,height:14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            {likes}
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
            <svg style={{ width:14,height:14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            {retweets}
          </span>
        </div>
      </div>
    </a>
  );
}

interface TestimonialsProps {
  cards?: TestimonialCardProps[];
}

export function Testimonials({ cards }: TestimonialsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex]   = useState<number | null>(null);

  const getCardClassName = (index: number, base: string) => {
    const focused = hoveredIndex ?? activeIndex;
    if (focused === 0 && index === 1) return base + " !translate-y-20 sm:!translate-y-32 !translate-x-14 sm:!translate-x-24";
    if (focused === 0 && index === 2) return base + " !translate-y-28 sm:!translate-y-44 !translate-x-24 sm:!translate-x-40";
    if (focused === 1 && index === 2) return base + " !translate-y-24 sm:!translate-y-40 !translate-x-24 sm:!translate-x-40";
    return base;
  };

  const defaultCards: TestimonialCardProps[] = [
    { className:"[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0", username:"Durban Local", handle:"@durban_anon", content:"The N3 at 7am should be classified as psychological torture. I left home at 6:45 and I'm still watching a bakkie inch forward. That is all. 🚗", date:"2h ago", likes:201, retweets:33 },
    { className:"[grid-area:stack] translate-x-8 sm:translate-x-16 translate-y-6 sm:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0", username:"Umhlanga Resident", handle:"@umhlanga_anon", content:"Umhlanga is just Sandton with a beach view and twice the attitude. R90 coffee and parking costs more than your first car.", date:"5h ago", likes:88, retweets:21 },
    { className:"[grid-area:stack] translate-x-16 sm:translate-x-32 translate-y-12 sm:translate-y-20 hover:translate-y-6 sm:hover:translate-y-10", username:"Joburg Local", handle:"@joburg_anon", content:"Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense. 🕯️", date:"8h ago", likes:312, retweets:41 },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {displayCards.map((cardProps, index) => (
        <TestimonialCard
          key={index} {...cardProps}
          className={getCardClassName(index, cardProps.className || "")}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
          isActive={activeIndex === index}
          onTap={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}

export { TestimonialCard };
export type { TestimonialCardProps, TestimonialsProps };
