"use client";

import { cn } from "@/lib/utils";

type Tab = "recent" | "trending" | "top-rated";

interface FeedTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "recent", label: "Recent", icon: "🕐" },
    { id: "trending", label: "Trending", icon: "🔥" },
    { id: "top-rated", label: "Top Reviews", icon: "⭐" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-bg-secondary rounded-xl border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-bg-card text-text-primary shadow-sm border border-border"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          <span className="text-base leading-none">{tab.icon}</span>
          <span className="font-mono text-[12px] sm:text-[13px]">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
