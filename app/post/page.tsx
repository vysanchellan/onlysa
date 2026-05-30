"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PenLine, Loader2, CheckCircle, XCircle } from "lucide-react";
import { AREAS, CATEGORIES, getSessionToken, cn } from "@/lib/utils";

type PostState = "idle" | "reviewing" | "success" | "error";

export default function PostPage() {
  const router = useRouter();
  const [area, setArea]         = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent]   = useState("");
  const [state, setState]       = useState<PostState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const maxChars  = 500;
  const remaining = maxChars - content.length;
  const isValid   = area && category && content.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || state === "reviewing") return;
    setState("reviewing");
    setErrorMsg("");
    const sessionToken = getSessionToken();
    try {
      const moderateRes = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, category, content }),
      });
      if (moderateRes.ok) {
        const mod = await moderateRes.json();
        if (!mod.approved) { setState("error"); setErrorMsg(mod.reason || "Post flagged."); return; }
        if (mod.category_suggestion) setCategory(mod.category_suggestion);
      }
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, category, content, sessionToken }),
      });
      if (postRes.ok) { setState("success"); setTimeout(() => router.push("/"), 2500); }
      else { setState("error"); setErrorMsg("Something went wrong. Try again."); }
    } catch {
      setState("error");
      setErrorMsg("Network error. Check your connection.");
    }
  }

  if (state === "success") return <SuccessScreen />;
  if (state === "error")   return <ErrorScreen message={errorMsg} onRetry={() => setState("idle")} />;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080808" }}>

      {/* Navbar */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: "blur(16px) saturate(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(1.2)",
        backgroundColor: "rgba(10,10,10,0.85)",
        borderBottom: "1px solid rgba(35,35,35,0.6)",
      }}>
        <div style={{ maxWidth: "672px", margin: "0 auto", padding: "0 16px", height: "56px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" style={{
            padding: "6px", borderRadius: "8px",
            color: "#5A5652", textDecoration: "none", display: "flex", alignItems: "center",
          }}>
            <ArrowLeft size={18} />
          </Link>
          <span style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", fontSize: "18px", letterSpacing: "0.08em", color: "#F0EDE8" }}>
            Only<span style={{ color: "#E63946" }}>SA</span>
          </span>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "14px", color: "#5A5652" }}>/ Post</span>
        </div>
      </header>

      <main style={{ maxWidth: "672px", margin: "0 auto", padding: "96px 16px 96px" }}>

        {/* Heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(48px, 10vw, 72px)",
            letterSpacing: "0.04em",
            color: "#F0EDE8",
            lineHeight: 1,
            marginBottom: "8px",
          }}>
            Say Something
          </h1>
          <p style={{ fontSize: "14px", color: "#9A9590", lineHeight: 1.6 }}>
            No name. No email. No account. Just your unfiltered truth.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Area */}
          <FormSection label="Your Area" required>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {AREAS.filter(a => a !== "All SA").map(a => (
                <ChipButton key={a} label={a} active={area === a} onClick={() => setArea(a)} />
              ))}
            </div>
          </FormSection>

          {/* Category */}
          <FormSection label="Category" required>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {CATEGORIES.map(cat => (
                <ChipButton key={cat} label={cat} active={category === cat} onClick={() => setCategory(cat)} />
              ))}
            </div>
          </FormSection>

          {/* Textarea */}
          <FormSection label="Your Post" required>
            <div style={{ position: "relative" }}>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value.slice(0, maxChars))}
                placeholder="What's on your mind? This is your space. Be real."
                rows={6}
                style={{
                  width: "100%",
                  backgroundColor: "#141414",
                  border: `1px solid ${remaining < 20 ? "#E63946" : remaining < 50 ? "#F4531C" : "#232323"}`,
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#F0EDE8",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
              <span style={{
                position: "absolute", bottom: "12px", right: "12px",
                fontSize: "11px", fontFamily: "var(--font-mono, monospace)",
                color: remaining < 20 ? "#E63946" : remaining < 50 ? "#F4531C" : "#5A5652",
              }}>
                {remaining}
              </span>
            </div>
          </FormSection>

          {/* Privacy note */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "10px",
            padding: "14px 16px",
            backgroundColor: "#1C1C1C",
            border: "1px solid rgba(35,35,35,0.6)",
            borderRadius: "12px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#059669", marginTop: "6px", flexShrink: 0 }} />
            <p style={{ fontSize: "12px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652", lineHeight: "1.6" }}>
              Your identity is never stored. A random label like &ldquo;Durban Local&rdquo; is assigned automatically. All posts are reviewed before publishing.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || state === "reviewing"}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "14px",
              backgroundColor: isValid ? "#E63946" : "#1C1C1C",
              color: isValid ? "#fff" : "#5A5652",
              border: isValid ? "none" : "1px solid #232323",
              borderRadius: "12px",
              fontSize: "14px", fontWeight: 600,
              cursor: isValid ? "pointer" : "not-allowed",
              boxShadow: isValid ? "0 8px 24px rgba(230,57,70,0.25)" : "none",
              transition: "all 0.2s",
            }}
          >
            {state === "reviewing" ? (
              <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Checking your post...</>
            ) : (
              <><PenLine size={16} /> Post Anonymously</>
            )}
          </button>
        </form>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea:focus { border-color: rgba(230,57,70,0.5) !important; }
        textarea::placeholder { color: rgba(90,86,82,0.5); }
      `}</style>
    </div>
  );
}

/* ── Reusable form bits ── */
function FormSection({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label style={{
        fontSize: "11px", fontFamily: "var(--font-mono, monospace)",
        color: "#5A5652", textTransform: "uppercase", letterSpacing: "0.12em",
        display: "block",
      }}>
        {label} {required && <span style={{ color: "#E63946" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function ChipButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "var(--font-mono, monospace)",
        border: `1px solid ${active ? "#E63946" : "#232323"}`,
        backgroundColor: active ? "rgba(230,57,70,0.1)" : "#1C1C1C",
        color: active ? "#E63946" : "#5A5652",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

/* ── Success / Error screens ── */
function SuccessScreen() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ textAlign: "center", maxWidth: "360px" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          backgroundColor: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <CheckCircle size={32} style={{ color: "#059669" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", fontSize: "48px", color: "#F0EDE8", letterSpacing: "0.04em", marginBottom: "12px" }}>
          It&apos;s Live
        </h2>
        <p style={{ fontSize: "14px", color: "#9A9590", lineHeight: 1.6 }}>Your post is live. No name. No face. Just truth.</p>
        <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "12px", color: "#5A5652", marginTop: "16px" }}>Redirecting to feed...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ textAlign: "center", maxWidth: "360px" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          backgroundColor: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <XCircle size={32} style={{ color: "#E63946" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)", fontSize: "48px", color: "#F0EDE8", letterSpacing: "0.04em", marginBottom: "12px" }}>
          Post Flagged
        </h2>
        <p style={{ fontSize: "14px", color: "#9A9590", lineHeight: 1.6, marginBottom: "24px" }}>
          {message || "Your post was flagged. Please review our community guidelines."}
        </p>
        <button
          onClick={onRetry}
          style={{
            padding: "10px 24px",
            backgroundColor: "#1C1C1C", border: "1px solid #232323",
            color: "#F0EDE8", fontSize: "14px",
            fontFamily: "var(--font-mono, monospace)",
            borderRadius: "12px", cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
