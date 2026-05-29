"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, ArrowUp, MessageCircle, Loader2, Send } from "lucide-react";
import { Post, Comment } from "@/types";
import { CategoryBadge, AreaTag } from "@/components/ui/badge";
import { timeAgo, getSessionToken } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch(`/api/posts/${id}/comments`),
        ]);

        if (!postRes.ok) {
          setNotFound(true);
          return;
        }

        const postData = await postRes.json();
        const commentsData = commentsRes.ok ? await commentsRes.json() : { comments: [] };

        setPost(postData.post);
        setUpvotes(postData.post.upvotes);
        setComments(commentsData.comments);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleUpvote() {
    const session = getSessionToken();
    setUpvoted((prev) => !prev);
    setUpvotes((prev) => (upvoted ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/posts/${id}/upvote`, {
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
      setUpvoted((prev) => !prev);
      setUpvotes((prev) => (upvoted ? prev + 1 : prev - 1));
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || submitting) return;

    setSubmitting(true);
    const session = getSessionToken();

    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment.trim(),
          sessionToken: session,
          area: post?.area || "All SA",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setComment("");
      }
    } catch {
      // handle
    } finally {
      setSubmitting(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    const text = `Check this on OnlySA: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 size={24} className="text-text-muted animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-6xl mb-4">🌵</p>
          <p className="text-text-secondary font-mono text-sm mb-4">Post not found.</p>
          <Link href="/" className="text-accent-red text-sm font-mono hover:underline">
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="text-base font-display tracking-wider">
            Only<span className="text-accent-red">SA</span>
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-32 sm:pb-12">
        {/* Post */}
        <article className="bg-bg-card border border-border rounded-2xl p-5 mb-4 animate-fade-up">
          {/* Top line */}
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-accent-red/30 to-transparent pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CategoryBadge category={post.category} />
            <AreaTag area={post.area} />
            <span className="ml-auto text-[11px] font-mono text-text-muted">
              {timeAgo(post.createdAt)}
            </span>
          </div>

          <p className="text-text-primary text-base leading-relaxed mb-4">
            {post.content}
          </p>

          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-red/60" />
            <span className="text-[12px] font-mono text-text-muted uppercase tracking-wider">
              {post.identity}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-border/60">
            <button
              onClick={handleUpvote}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                upvoted
                  ? "text-accent-red bg-accent-red/10 border border-accent-red/30"
                  : "text-text-muted bg-bg-elevated hover:text-text-primary border border-border"
              )}
            >
              <ArrowUp size={15} />
              <span className="font-mono">{upvotes}</span>
            </button>

            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-text-muted bg-bg-elevated border border-border">
              <MessageCircle size={15} />
              <span className="font-mono">{comments.length}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-text-muted bg-bg-elevated border border-border hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all ml-auto"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
          </div>
        </article>

        {/* Comments section */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-mono text-text-muted uppercase tracking-wider px-1">
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </h2>

          {/* Comment input */}
          <form onSubmit={handleComment} className="bg-bg-card border border-border rounded-xl p-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 300))}
              placeholder="Add your take..."
              rows={3}
              className="w-full bg-transparent text-text-primary placeholder:text-text-muted/50 text-sm leading-relaxed resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <span className="text-[11px] font-mono text-text-muted">
                Anonymous · {300 - comment.length} chars
              </span>
              <button
                type="submit"
                disabled={!comment.trim() || submitting}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  comment.trim()
                    ? "bg-accent-red text-white hover:bg-accent-red/90"
                    : "bg-bg-elevated text-text-muted cursor-not-allowed"
                )}
              >
                {submitting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                Comment Anonymously
              </button>
            </div>
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[12px] font-mono text-text-muted">
                No comments yet. Be the first.
              </p>
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-bg-card border border-border rounded-xl px-4 py-3 animate-slide-in"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1 h-1 rounded-full bg-text-muted/40" />
                  <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
                    {c.identity}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted/40 ml-auto">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{c.content}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
