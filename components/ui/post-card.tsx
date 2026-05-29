"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { MessageCircle, ArrowUp, Share2, Flag } from "lucide-react";
import { Post } from "@/types";
import { CategoryBadge, AreaTag } from "./badge";
import { timeAgo, getSessionToken, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
  showFull?: boolean;
}

export function PostCard({ post, className, showFull = false }: PostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [upvoted, setUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isUpvoting) return;

      setIsUpvoting(true);
      const session = getSessionToken();

      // Optimistic update
      setUpvoted((prev) => !prev);
      setUpvotes((prev) => (upvoted ? prev - 1 : prev + 1));

      try {
        const res = await fetch(`/api/posts/${post.id}/upvote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: session }),
        });
        if (res.ok) {
          const data = await res.json();
          setUpvotes(data.upvotes);
          setUpvoted(data.upvoted);
        }
      } catch {
        // Revert on failure
        setUpvoted((prev) => !prev);
        setUpvotes((prev) => (upvoted ? prev + 1 : prev - 1));
      } finally {
        setIsUpvoting(false);
      }
    },
    [post.id, upvoted, isUpvoting]
  );

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const url = `${window.location.origin}/post/${post.id}`;
      const text = `Check this on OnlySA: ${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    },
    [post.id]
  );

  const content = showFull ? post.content : truncate(post.content, 220);

  return (
    <article
      className={cn(
        "group relative bg-bg-card border border-border rounded-xl p-5 card-hover cursor-pointer",
        "hover:border-[#2a2a2a]",
        className
      )}
    >
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#333] to-transparent" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={post.category} />
          <AreaTag area={post.area} />
        </div>
        <span className="text-[11px] font-mono text-text-muted shrink-0">
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="text-text-primary text-[15px] leading-relaxed mb-4 font-body">
        {content}
        {!showFull && post.content.length > 220 && (
          <span className="text-text-muted ml-1 text-sm">read more</span>
        )}
      </p>

      {/* Identity */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-red/60" />
        <span className="text-[12px] font-mono text-text-muted uppercase tracking-wider">
          {post.identity}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-border/60">
        {/* Upvote */}
        <button
          onClick={handleUpvote}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            upvoted
              ? "text-accent-red bg-accent-red/10"
              : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
          )}
          aria-label="Upvote"
        >
          <ArrowUp
            size={15}
            className={cn(
              "transition-transform",
              upvoted && "scale-110"
            )}
          />
          <span className="font-mono text-[13px]">{upvotes}</span>
        </button>

        {/* Comments */}
        <Link
          href={`/post/${post.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
        >
          <MessageCircle size={15} />
          <span className="font-mono text-[13px]">{post.comments}</span>
        </Link>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all"
          aria-label="Share on WhatsApp"
        >
          <Share2 size={15} />
          <span className="text-[12px] hidden sm:inline">Share</span>
        </button>

        {/* Report */}
        <button
          className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-text-muted/40 hover:text-text-muted hover:bg-bg-elevated transition-all"
          title="Something wrong here?"
          aria-label="Report"
        >
          <Flag size={12} />
        </button>
      </div>
    </article>
  );
}
