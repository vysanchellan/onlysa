"use client";

import { useState } from "react";

interface TestimonialCardProps {
  className?: string;
  username?: string;
  handle?: string;
  content?: string;
  date?: string;
  likes?: number;
  retweets?: number;
  tweetUrl?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
  avatar?: string;
  area?: string;
  category?: string;
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const CAT_COLORS: Record<string, { dot: string }> = {
  "Rant":                  { dot: "#E87040" },
  "Confession":            { dot: "#E06070" },
  "Review":                { dot: "#6AAF88" },
  "Hot Take":              { dot: "#E8B050" },
  "Question":              { dot: "#6A90B0" },
  "Neighbourhood Watch":   { dot: "#A070C0" },
};

export function TestimonialCard({
  className, username = "Anonymous", handle = "@anonymous",
  content = "This is the most honest I've been on the internet in years.",
  date = "2h ago", likes = 42, retweets = 8,
  tweetUrl = "#", onHover, onLeave, isActive, onTap, avatar, area, category,
}: TestimonialCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch && !isActive) { e.preventDefault(); onTap?.(); }
  };

  const dot = category ? (CAT_COLORS[category]?.dot ?? "#E87040") : "#E87040";

  return (
    <a
      href={tweetUrl} target="_blank" rel="noopener noreferrer"
      onClick={handleClick} onMouseEnter={onHover} onMouseLeave={onLeave}
      className={cn(
        "relative flex h-auto min-h-[160px] sm:min-h-[200px] w-[280px] sm:w-[400px]",
        "-skew-y-[6deg] select-none flex-col rounded-2xl cursor-pointer",
        "transition-all duration-500",
        isActive && "ring-1 ring-white/20",
        className
      )}
      style={{
        background: "rgba(13,13,16,0.92)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "20px 24px",
        textDecoration: "none",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Top row */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Avatar */}
          <div style={{
            width:36, height:36, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg, #E8490F, #F06830)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:700, color:"#fff",
            fontFamily:"'Syne', sans-serif",
          }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"rgba(242,238,233,0.9)", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.01em" }}>{username}</div>
            <div style={{ fontSize:11, color:"rgba(160,154,147,0.7)", fontFamily:"'DM Mono',monospace", marginTop:1 }}>{handle}</div>
          </div>
        </div>
        {/* Category dot + area */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          {category && (
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:dot }} />
              <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:dot, textTransform:"uppercase", letterSpacing:"0.1em" }}>{category}</span>
            </div>
          )}
          {area && <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"rgba(160,154,147,0.5)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{area}</span>}
        </div>
      </div>

      {/* Content */}
      <p style={{
        fontSize:14, lineHeight:1.6, color:"rgba(242,238,233,0.78)",
        flex:1, marginBottom:16,
        display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden",
        fontFamily:"'DM Sans',sans-serif", fontWeight:300,
      }}>
        {content}
      </p>

      {/* Footer */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"rgba(160,154,147,0.45)" }}>{date}</span>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(160,154,147,0.45)", fontFamily:"'DM Mono',monospace" }}>
            <svg style={{ width:12,height:12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            {likes}
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(160,154,147,0.45)", fontFamily:"'DM Mono',monospace" }}>
            <svg style={{ width:12,height:12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
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
    if (focused === 0 && index === 1) return base + " !translate-y-20 sm:!translate-y-32 !translate-x-12 sm:!translate-x-20";
    if (focused === 0 && index === 2) return base + " !translate-y-28 sm:!translate-y-44 !translate-x-20 sm:!translate-x-36";
    if (focused === 1 && index === 2) return base + " !translate-y-24 sm:!translate-y-40 !translate-x-20 sm:!translate-x-36";
    return base;
  };

  const defaultCards: TestimonialCardProps[] = [
    {
      className:"[grid-area:stack] hover:-translate-y-8 before:absolute before:w-full before:h-full before:rounded-2xl before:content-[''] before:bg-bg/60 hover:before:opacity-0 before:transition-opacity before:duration-400 before:left-0 before:top-0 before:pointer-events-none",
      username:"Westville Resident", handle:"@westville_za", area:"Westville", category:"Rant",
      content:"The N3 at 7am should be classified as psychological torture. Left home at 6:45 to beat traffic. Still sitting here watching a bakkie inch forward. That is all.",
      date:"2h ago", likes:201, retweets:33,
    },
    {
      className:"[grid-area:stack] translate-x-6 sm:translate-x-14 translate-y-5 sm:translate-y-8 hover:-translate-y-2 before:absolute before:w-full before:h-full before:rounded-2xl before:content-[''] before:bg-bg/60 hover:before:opacity-0 before:transition-opacity before:duration-400 before:left-0 before:top-0 before:pointer-events-none",
      username:"Umhlanga Resident", handle:"@umhlanga_za", area:"Umhlanga", category:"Hot Take",
      content:"Umhlanga is just Sandton with a beach view and twice the attitude. The coffee is R90 and parking costs more than your first car. But somehow we all keep coming back.",
      date:"5h ago", likes:88, retweets:21,
    },
    {
      className:"[grid-area:stack] translate-x-12 sm:translate-x-28 translate-y-10 sm:translate-y-16 hover:translate-y-4 sm:hover:translate-y-8",
      username:"Joburg Local", handle:"@joburg_za", area:"Johannesburg", category:"Rant",
      content:"Eskom scheduled maintenance 8am–4pm. Power back off at 8:01am. Back on at 5:47pm. Make it make sense.",
      date:"8h ago", likes:312, retweets:41,
    },
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

export type { TestimonialCardProps, TestimonialsProps };
