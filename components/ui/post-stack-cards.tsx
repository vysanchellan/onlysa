"use client";

/**
 * OnlySA — Twitter-style stacked post preview cards
 * Adapted from twitter-testimonial-cards.tsx pattern
 * 
 * Drop this in components/ui/post-stack-cards.tsx
 * Usage: <PostStackCards posts={recentPosts} />
 */

import { useState } from "react";

export interface StackPost {
  id: string;
  content: string;
  category: string;
  area: string;
  authorLabel: string;
  createdAt: string;
  votes: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Rant:       { bg: "rgba(239,68,68,0.15)",  text: "#f87171", border: "rgba(239,68,68,0.3)"  },
  Confession: { bg: "rgba(168,85,247,0.15)", text: "#c084fc", border: "rgba(168,85,247,0.3)" },
  Review:     { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
  "Hot Take": { bg: "rgba(251,146,60,0.15)", text: "#fb923c", border: "rgba(251,146,60,0.3)" },
  Question:   { bg: "rgba(56,189,248,0.15)", text: "#38bdf8", border: "rgba(56,189,248,0.3)" },
  "Neighbourhood Watch": { bg: "rgba(250,204,21,0.15)", text: "#fbbf24", border: "rgba(250,204,21,0.3)" },
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function SAIcon() {
  return (
    <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  );
}

interface PostCardProps {
  post: StackPost;
  className?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
}

function StackedPostCard({ post, className = "", onHover, onLeave, isActive, onTap }: PostCardProps) {
  const colors = CATEGORY_COLORS[post.category] ?? { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.15)" };

  return (
    <div
      onClick={() => {
        const isTouch = "ontouchstart" in window;
        if (isTouch && !isActive) { onTap?.(); return; }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        relative flex h-auto min-h-[150px] w-[280px] sm:w-[360px]
        -skew-y-[6deg] select-none flex-col rounded-2xl
        px-4 py-4 transition-all duration-500 cursor-pointer
        ${isActive ? "ring-2 ring-emerald-400/40" : ""}
        ${className}
      `}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Right gradient fade */}
      <div
        className="absolute -right-1 top-0 h-full w-24 rounded-r-2xl pointer-events-none"
        style={{ background: "linear-gradient(to left, #070709, transparent)" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold"
            style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
          >
            {post.category.charAt(0)}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/80">{post.authorLabel}</p>
            <p className="text-[10px] text-white/30 font-mono">{post.area} · {timeAgo(post.createdAt)} ago</p>
          </div>
        </div>
        <SAIcon />
      </div>

      {/* Content */}
      <p className="text-[13px] text-white/65 leading-relaxed line-clamp-3 mb-3">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
          style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
        >
          {post.category}
        </span>
        <div className="flex items-center gap-1 text-white/30 text-[11px] font-mono">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
          </svg>
          {post.votes}
        </div>
      </div>
    </div>
  );
}

interface PostStackCardsProps {
  posts?: StackPost[];
}

const DEFAULT_POSTS: StackPost[] = [
  {
    id: "a",
    content: "Eskom scheduled maintenance 8am–4pm. Power off at 8:01am. Back on at 5:47pm. Living in SA is peak comedy.",
    category: "Rant",
    area: "Johannesburg",
    authorLabel: "Joburg Local",
    createdAt: new Date(Date.now() - 1000*60*20).toISOString(),
    votes: 312,
  },
  {
    id: "b",
    content: "Hot take: bunnychow is the only correct hangover cure and anyone who disagrees has never been to Durban.",
    category: "Hot Take",
    area: "Durban CBD",
    authorLabel: "Durban Local",
    createdAt: new Date(Date.now() - 1000*60*90).toISOString(),
    votes: 119,
  },
  {
    id: "c",
    content: "My neighbour's car alarm has been going off at 2am for three weeks. I have transcended anger. I am the noise.",
    category: "Confession",
    area: "Berea",
    authorLabel: "Berea Resident",
    createdAt: new Date(Date.now() - 1000*60*60*5).toISOString(),
    votes: 201,
  },
];

export function PostStackCards({ posts }: PostStackCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive]   = useState<number | null>(null);

  const displayPosts = (posts ?? DEFAULT_POSTS).slice(0, 3);

  function cardClass(index: number): string {
    const base = "[grid-area:stack]";
    const focused = hovered ?? active;

    // Back card
    if (index === 0) return `${base} hover:-translate-y-10 before:absolute before:w-full before:h-full before:rounded-2xl before:bg-background/60 before:content-[''] grayscale-[100%] hover:before:opacity-0 hover:grayscale-0 before:transition-opacity before:duration-500 before:left-0 before:top-0`;

    // Middle
    if (index === 1) {
      const push = focused === 0 ? "!translate-y-20 sm:!translate-y-28 !translate-x-10 sm:!translate-x-16" : "";
      return `${base} translate-x-8 sm:translate-x-12 translate-y-6 sm:translate-y-8 hover:-translate-y-1 before:absolute before:w-full before:h-full before:rounded-2xl before:bg-background/60 before:content-[''] grayscale-[100%] hover:before:opacity-0 hover:grayscale-0 before:transition-opacity before:duration-500 before:left-0 before:top-0 ${push}`;
    }

    // Front
    const push =
      focused === 0 ? "!translate-y-28 sm:!translate-y-40 !translate-x-20 sm:!translate-x-28" :
      focused === 1 ? "!translate-y-20 sm:!translate-y-28 !translate-x-20 sm:!translate-x-28" : "";
    return `${base} translate-x-16 sm:translate-x-24 translate-y-12 sm:translate-y-16 hover:translate-y-6 ${push}`;
  }

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {displayPosts.map((post, i) => (
        <StackedPostCard
          key={post.id}
          post={post}
          className={cardClass(i)}
          onHover={() => setHovered(i)}
          onLeave={() => setHovered(null)}
          isActive={active === i}
          onTap={() => setActive(active === i ? null : i)}
        />
      ))}
    </div>
  );
}

export default PostStackCards;
