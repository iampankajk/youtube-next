"use client";

import type React from "react";
import Link from "next/link";
import {
  Compass,
  Film,
  Flame,
  History,
  Home,
  Library,
  Music,
  PlaySquare,
  ThumbsUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  expanded: boolean;
};

/**
 *
 * @param root0
 * @param root0.icon
 * @param root0.label
 * @param root0.href
 * @param root0.active
 * @param root0.expanded
 */
function SidebarItem({
  icon,
  label,
  href,
  active,
  expanded,
}: SidebarItemProps) {
  return (
    <Link href={href} className="block">
      <Button
        variant="ghost"
        className={cn(
          "w-full flex items-center gap-3 rounded-lg",
          expanded ? "justify-start px-4" : "justify-center",
          active && "bg-accent font-medium",
        )}
      >
        <div className={cn("h-5 w-5", !expanded && "text-center")}>{icon}</div>
        {expanded && <span className="whitespace-nowrap">{label}</span>}
      </Button>
    </Link>
  );
}

/**
 *
 * @param root0
 * @param root0.expanded
 */
export default function Sidebar({ expanded }: { expanded: boolean }) {
  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-2 transition-all",
        expanded ? "w-56" : "w-16",
      )}
    >
      <div className="space-y-1">
        <SidebarItem
          icon={<Home className="size-5" />}
          label="Home"
          href="/"
          active
          expanded={expanded}
        />
        <SidebarItem
          icon={<Compass className="size-5" />}
          label="Explore"
          href="/explore"
          expanded={expanded}
        />
        <SidebarItem
          icon={<PlaySquare className="size-5" />}
          label="Shorts"
          href="/shorts"
          expanded={expanded}
        />
        <SidebarItem
          icon={<Film className="size-5" />}
          label="Subscriptions"
          href="/subscriptions"
          expanded={expanded}
        />
      </div>

      <div className="mt-4 space-y-1 border-t pt-4">
        <SidebarItem
          icon={<Library className="size-5" />}
          label="Library"
          href="/library"
          expanded={expanded}
        />
        <SidebarItem
          icon={<History className="size-5" />}
          label="History"
          href="/history"
          expanded={expanded}
        />
        <SidebarItem
          icon={<PlaySquare className="size-5" />}
          label="Your Videos"
          href="/your-videos"
          expanded={expanded}
        />
        <SidebarItem
          icon={<ThumbsUp className="size-5" />}
          label="Liked Videos"
          href="/liked-videos"
          expanded={expanded}
        />
      </div>

      <div className="mt-4 space-y-1 border-t pt-4">
        {expanded && (
          <h3 className="mb-2 px-4 text-sm font-medium">Subscriptions</h3>
        )}
        <SidebarItem
          icon={<Music className="size-5" />}
          label="Music"
          href="/music"
          expanded={expanded}
        />
        <SidebarItem
          icon={<Flame className="size-5" />}
          label="Trending"
          href="/trending"
          expanded={expanded}
        />
        <SidebarItem
          icon={<Film className="size-5" />}
          label="Movies"
          href="/movies"
          expanded={expanded}
        />
      </div>
    </aside>
  );
}
