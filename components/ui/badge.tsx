"use client";
import { cn, getCategoryClass } from "@/lib/utils";

interface BadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase tracking-wider",
        getCategoryClass(category),
        className
      )}
    >
      {category}
    </span>
  );
}

interface AreaTagProps {
  area: string;
  className?: string;
}

export function AreaTag({ area, className }: AreaTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-mono text-text-muted uppercase tracking-wider",
        className
      )}
    >
      📍 {area}
    </span>
  );
}
