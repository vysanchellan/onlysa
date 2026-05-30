"use client";
import { getCategoryColor } from "@/lib/utils";

interface BadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category }: BadgeProps) {
  const { bg, color, border } = getCategoryColor(category);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontFamily: "var(--font-mono, monospace)",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      backgroundColor: bg,
      color: color,
      border: `1px solid ${border}`,
    }}>
      {category}
    </span>
  );
}

interface AreaTagProps {
  area: string;
  className?: string;
}

export function AreaTag({ area }: AreaTagProps) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: "11px",
      fontFamily: "var(--font-mono, monospace)",
      color: "#5A5652",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    }}>
      📍 {area}
    </span>
  );
}
